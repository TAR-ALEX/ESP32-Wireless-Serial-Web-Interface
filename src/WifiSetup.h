#include <Arduino.h>
#include <ArduinoJson-v6.21.5.h>
#include <WiFi.h>
#include <WiFiAP.h>
#include <WiFiClient.h>

#include "Config.h"

extern DynamicJsonDocument doc;

bool WiFi_MODE = 1;

IPAddress local_IP(10, 10, 0, 1);
IPAddress gateway(10, 10, 0, 1);
IPAddress subnet(255, 255, 255, 0);

// Initialize WiFi function
void WiFi_Setup() {
  cfg.load();
  local_IP.fromString(cfg.IP_AP.data);
  gateway.fromString(cfg.IP_AP.data);
  unsigned long startTime = millis();
  const unsigned long timeout = 7000;  // 7 seconds in milliseconds

  if (strcmp(cfg.ssid_Router.data, "") != 0) {
    WiFi.mode(WIFI_STA);
    if (strlen(cfg.password_Router.data) > 8) {
      WiFi.begin(cfg.ssid_Router.data, cfg.password_Router.data);
    } else {
      WiFi.begin(cfg.ssid_Router.data, nullptr);
    }
    WiFi.setSleep(false);
    WiFi.setAutoConnect(true);
    WiFi.setAutoReconnect(true);

    while (WiFi.status() != WL_CONNECTED) {
      if (millis() - startTime > timeout) {
        break;
      }
      delay(100);
    }
  }

  if (WiFi.status() == WL_CONNECTED) {
    IPAddress local_ip = WiFi.localIP();
  } else {
    WiFi.disconnect(true);
    WiFi.mode(WIFI_AP);
    WiFi.softAPConfig(local_IP, gateway, subnet);
    if (strlen(cfg.password_AP.data) > 8) {
      WiFi.softAP(cfg.ssid_AP.data, cfg.password_AP.data);
    } else {
      WiFi.softAP(cfg.ssid_AP.data, nullptr);
    }
  }
}

void wifiSetupCallback(AsyncWebServerRequest* request, uint8_t* data,
                       size_t len, size_t index, size_t total) {
  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, (char*)data);

  if (error) {
    AsyncWebServerResponse* response =
        request->beginResponse(400, "text/plain", "Invalid JSON");
    response->addHeader("Access-Control-Allow-Origin", "*");
    request->send(response);
    return;
  }

  const char* ssid_AP = doc["ssid_AP"];
  const char* password_AP = doc["password_AP"];
  const char* ssid_Router = doc["ssid_Router"];
  const char* password_Router = doc["password_Router"];
  const char* ipAddr = doc["ipAddr"];

  if (ssid_AP && password_AP && ssid_Router && password_Router && ipAddr) {
    cfg.password_AP = password_AP;
    cfg.password_Router = password_Router;
    cfg.ssid_AP = ssid_AP;
    cfg.ssid_Router = ssid_Router;
    cfg.IP_AP = ipAddr;
    cfg.save();

    // Commit the changes to ensure they are saved
    if (!EEPROM.commit()) {
      AsyncWebServerResponse* response = request->beginResponse(
          400, "text/plain", "Failed to commit EEPROM changes");
      response->addHeader("Access-Control-Allow-Origin", "*");
      request->send(response);
      Serial.println("Failed to commit EEPROM changes");
    } else {
      AsyncWebServerResponse* response = request->beginResponse(
          200, "application/json", "{\"status\":\"Network updated\"}");
      response->addHeader("Access-Control-Allow-Origin", "*");
      request->send(response);
    }
  } else {
    AsyncWebServerResponse* response =
        request->beginResponse(400, "text/plain", "Invalid parameters");
    response->addHeader("Access-Control-Allow-Origin", "*");
    request->send(response);
  }
}

void wifiGetConfigCallback(AsyncWebServerRequest* request) {
  cfg.load();
  // Create a JSON document
  StaticJsonDocument<512> doc;

  // Add data from the cfg struct to the JSON document
  doc["ssid_AP"] = cfg.ssid_AP.data;
  doc["password_AP"] = cfg.password_AP.data;
  doc["ssid_Router"] = cfg.ssid_Router.data;
  doc["password_Router"] = cfg.password_Router.data;
  doc["ipAddr"] = cfg.IP_AP.data;

  // Serialize JSON document to a string
  String responseString;
  serializeJson(doc, responseString);

  // Send the JSON response
  AsyncWebServerResponse* response =
      request->beginResponse(200, "application/json", responseString);
  response->addHeader("Access-Control-Allow-Origin", "*");
  request->send(response);
}