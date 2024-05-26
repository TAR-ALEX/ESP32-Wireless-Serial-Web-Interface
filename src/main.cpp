#include <Arduino.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebSrv.h>
#include <WiFi.h>

#include "WifiSetup.h"
#include "index.h"

#define LED 2
#define ActiveSerial Serial2

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

void onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client,
               AwsEventType type, void *arg, uint8_t *data, size_t len) {
  if (type == WS_EVT_CONNECT) {
    // WebSocket client connected
  } else if (type == WS_EVT_DISCONNECT) {
    // WebSocket client disconnected
  } else if (type == WS_EVT_DATA) {
    // Data received
    data[len] = 0;  // Null-terminate data (make sure len < buffer size)
    String dataStr = (const char *)data;
    ActiveSerial.print(dataStr);  // Send data to Serial
  }
}

void setup() {
  EEPROM.begin(700);
  pinMode(LED, OUTPUT);
  WiFi_Setup();
  ActiveSerial.begin(115200);

  // Setup WebSocket
  ws.onEvent(onWsEvent);
  server.addHandler(&ws);
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    AsyncWebServerResponse *response = request->beginResponse_P(
        200, "text/html", toESP32_index_html_gz, sizeof(toESP32_index_html_gz));
    response->addHeader("Access-Control-Allow-Origin", "*");
    response->addHeader("Content-Encoding", "gzip");
    request->send(response);
  });
  server.on(
      "/wifisetup", HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL,
      wifiSetupCallback);
  server.on("/wifisetup", HTTP_GET, wifiGetConfigCallback);

  // Start server
  server.begin();
  ActiveSerial.println(WiFi.localIP());
  digitalWrite(LED, HIGH);
}

void loop() {
  // Read from Serial and send to WebSocket clients
  while (ActiveSerial.available()) {
    String data = ActiveSerial.readStringUntil('\n');
    if(!data.isEmpty())
      ws.textAll(data+"\n");
  }
}
