# ESP32 Web Serial Interface

## Overview

Transform your projects into wireless solutions effortlessly with the ESP32 web serial interface. By leveraging a web-based UI, the ESP32 connects seamlessly to an existing project's serial interface, functioning just like the familiar Arduino serial monitor to facilitate two-way communication over the serial console.

The ESP32 serves a sleek web page that displays an intuitive UI, using WebSockets to send and receive messages. These messages are forwarded to a serial interface, configurable directly in the code.

## Features

- **Wireless Communication**: Make your projects wireless with ease, connecting to serial interfaces over Wi-Fi.
- **User-Friendly Web UI**: Interact with your projects through a web interface that mimics the Arduino serial monitor.
- **WebSocket Connectivity**: Utilize WebSockets for efficient, real-time communication between the web interface and the ESP32.
- **Wi-Fi Configuration**: A built-in form allows you to set Wi-Fi SSID, AP SSID, passwords, and IP addresses for AP mode, offering convenience and flexibility.
- **Custom WebSocket URLs**: Connect to external WebSocket services by entering a custom URL.

![Web Serial Interface Screenshot](screenshots/serial.png)
*Web Serial Interface*

## Technical Details

- **Web Interface**: The web page is served by the ESP32 and built using Vite, with all scripts and CSS embedded, ensuring a streamlined user experience.

## Benefits

- **Convenience**: Easily configure and manage Wi-Fi settings directly from the web interface.
- **Versatility**: The interface can connect to various WebSocket services, expanding its use beyond just the ESP32.
- **Simplicity**: With Vite, the static HTML page is straightforward and easy to use, eliminating the need for complex setup.

![Wi-Fi Form Screenshot](screenshots/wifi_cfg.png)
*Wi-Fi Configuration Form*

---

Elevate your projects with the ESP32 web serial interface, blending simplicity, flexibility, and powerful wireless communication in a single solution.