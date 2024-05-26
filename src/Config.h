#pragma once

#include <EEPROM.h>

#include <cstring>

template <size_t size>
struct StaticString {
  char data[size];

  // Constructor to initialize the array with the given string
  StaticString(const char* str) {
    std::strncpy(data, str, size - 1);  // Ensure no overflow
    data[size - 1] = '\0';              // Null-terminate
  }
};

#define CONFIG_FIELDS(FIELD)                                    \
  FIELD(StaticString<100>, ssid_Router, "defaultSSID");         \
  FIELD(StaticString<100>, password_Router, ""); \
  FIELD(StaticString<100>, ssid_AP, "defaultSSID");             \
  FIELD(StaticString<100>, password_AP, "defaultPASSWORD");     \
  FIELD(StaticString<100>, IP_AP, "192.168.0.1");

inline void writeByteIntoEEPROM(int address, uint8_t number) {
  if (EEPROM.read(address) != number) {
    EEPROM.write(address, number);
  }
}

inline uint8_t readByteFromEEPROM(int address) { return EEPROM.read(address); }

// Macro to declare each field in the struct and to print the field
#define DECLARE_STRUCT_FIELD(type, name, val) type name = val;
#define PRINT_STRUCT_FIELD(type, name, val)                        \
  s.print(#name);                                                  \
  s.print(" = ");                                                  \
  if (strcmp(#type, "double") == 0 || strcmp(#type, "float") == 0) \
    s.println(this->name, 5);                                      \
  else                                                             \
    s.println(this->name);

struct Config {
  static const uint8_t requiredPreamble = 0xFC;
  uint8_t preamble;
  CONFIG_FIELDS(DECLARE_STRUCT_FIELD)

  template <class SerialType>
  void dumpToSerial(SerialType& s) {
    CONFIG_FIELDS(PRINT_STRUCT_FIELD)
  }

  void save() {
    preamble = requiredPreamble;
    const int classSize = sizeof(Config);
    uint8_t* data = (uint8_t*)this;

    for (int i = 0; i < classSize; i++) writeByteIntoEEPROM(i, data[i]);

    Serial.println("saved data");
  }

  bool load() {
    const int classSize = sizeof(Config);
    uint8_t* data = (uint8_t*)this;

    for (int i = 0; i < classSize; i++) data[i] = readByteFromEEPROM(i);

    if (preamble != requiredPreamble) {
      Serial.println("preamble failed");
      Config defaultSettings;
      *this = defaultSettings;
      return false;
    }

    Serial.println("data loaded");
    return true;
  }
};

extern Config cfg;

#undef DECLARE_STRUCT_FIELD
#undef PRINT_STRUCT_FIELD