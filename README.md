# Network Device Manager (NDM) - Elecfreaks Retro Arcade Controller

> Open this page at [https://jasonc1025-333.github.io/26-0119-0121-mb-ef_controller_retroarcade-networkdevicemanager/](https://jasonc1025-333.github.io/26-0119-0121-mb-ef_controller_retroarcade-networkdevicemanager/)

## Overview

The **Network Device Manager (NDM)** is a professional-grade remote management system for micro:bit-based robotics. Using an Elecfreaks Retro Arcade Controller, educators can monitor and configure 50+ bots and controllers from a single device.

---

## 🎯 Current Features (Phase 1: Complete)

### **Live Network Monitor**
- **Real-time device detection** - Automatically discovers all micro:bits on the network
- **Device identification** - Distinguishes between Bots (🤖) and Controllers (🎮)
- **Telemetry display** - Shows live sensor data from active bots
- **Channel grouping** - Organizes devices by radio group channel
- **Status indicators** - Visual health check with color-coded icons:
  - ✅ **Green** - Paired and active (controller + bot, telemetry flowing)
  - ⚠️ **Yellow** - Paired but idle (controller + bot, no telemetry)
  - ❌ **Red** - Unpaired (missing controller or bot)

---

## 🚀 Planned Features (Phase 2: Remote Configuration)

### **Remote Configuration System**

#### **What It Does:**
Allows educators to remotely configure bot and controller settings from the NDM, with changes saved to persistent flash storage.

#### **Configurable Settings (10 Total):**

**1. Network Settings:**
- Group Channel (0-99) - Change which controller pairs with which bot

**2. Motor Power - Basic Movement:**
- Forward Power (0-100%)
- Backward Power (0-100%)
- Turn Power (0-100%)

**3. Motor Power - Turbo Mode:**
- Turbo Forward (0-100%)
- Turbo Backward (0-100%)
- Turbo Turn (0-100%)

**4. Servo Arms:**
- Minimum Degrees (0-220°)
- Maximum Degrees (0-220°)
- Increment Degrees (1-45°)

#### **Three-Page UI Structure:**

**Page 1: Channel Status Overview**
```
┌─────────────────────────────────┐
│ CHANNEL STATUS         [1/3]    │
├─────────────────────────────────┤
│ ✅ Ch:001 (2 devices, active)   │
│ ► 🎮 xyz02 (Ctrl)              │  ← Select with ▲▼
│   🤖 abc01 (Bot)               │
│                                 │
│ ⚠️ Ch:002 (2 devices, idle)     │
│   🎮 ghi04 (Ctrl)              │
│   🤖 def03 (Bot)               │
│                                 │
│ ❌ Ch:003 (1 device, unpaired)  │
│   🤖 jkl05 (Bot) [No ctrl]     │
│                                 │
│ [A] Config  [B] Next  [Menu] ⚙️ │
└─────────────────────────────────┘
```
- Quick health check of all channel pairs
- Status icons show pairing health at a glance
- Select device with ▲▼, press A to jump to config

**Page 2: Bot Telemetry Details (Scrollable)**
```
┌─────────────────────────────────┐
│ BOT TELEMETRY          [2/3]    │
├─────────────────────────────────┤
│ 🤖 abc01 (Ch:001) ✅            │
│   Spd:75% Dir:FWD Dist:15cm    │
│   Bat:85% Temp:25°C            │
│                                 │
│ 🤖 def03 (Ch:002) ⚠️            │
│   [No telemetry data]          │
│                                 │
│ ▼ Scroll for more...           │
│                                 │
│ [A] Config [B] Back [Menu] ⚙️   │
└─────────────────────────────────┘
```
- Detailed telemetry for each bot
- Scrollable list (already working!)
- Select bot, press A to configure

**Page 3: Remote Config (Per Selected Device)**
```
┌─────────────────────────────────┐
│ CONFIG: abc01 (Bot)    [3/3]    │
├─────────────────────────────────┤
│ ┌─ Group Channel ─────────────┐ │
│ │ Current: 001  New: [025]    │ │
│ │ ◄ ►  [A] Set                │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─ Motor Power % ─────────────┐ │
│ │ Forward:  [060] ◄ ►         │ │
│ │ Backward: [060] ◄ ►         │ │
│ │ Turn:     [050] ◄ ►         │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─ Turbo Power % ─────────────┐ │
│ │ Forward:  [090] ◄ ►         │ │
│ │ Backward: [090] ◄ ►         │ │
│ │ Turn:     [080] ◄ ►         │ │
│ └─────────────────────────────┘ │
│                                 │
│ [A] Send  [B] Back  [Menu] Save │
└─────────────────────────────────┘
```
- Configure selected device (bot or controller)
- Adjust values with ◄ ► arrows
- Press A to send changes
- Press Menu to save to flash
- Press B to go back

#### **Radio Protocol (≤19 characters):**

**Commands (NDM → Bot/Controller):**
```typescript
"SET_GRP_CHANL:025"     // Set group channel to 25
"SET_MOTOR_FWD:060"     // Set motor forward power to 60%
"SET_MOTOR_BWD:060"     // Set motor backward power to 60%
"SET_MOTOR_TURN:050"    // Set motor turn power to 50%
"SET_TURBO_FWD:090"     // Set turbo forward power to 90%
"SET_TURBO_BWD:090"     // Set turbo backward power to 90%
"SET_TURBO_TURN:080"    // Set turbo turn power to 80%
"SET_SERVO_MIN:000"     // Set servo minimum to 0°
"SET_SERVO_MAX:220"     // Set servo maximum to 220°
"SET_SERVO_INC:015"     // Set servo increment to 15°
"MEM_MY_SAVE"           // Save config to flash
"MEM_MY_LOAD"           // Load config from flash
"MEM_DEFAULT_LOAD"      // Reset to factory defaults
"GET_ALL_CONFIG"        // Request all current settings
```

**Responses (Bot/Controller → NDM):**
```typescript
"RE_GRP_CHANL:025"      // Current group channel
"RE_MOTOR_FWD:060"      // Motor forward power
"RE_MOTOR_BWD:060"      // Motor backward power
"RE_MOTOR_TURN:050"     // Motor turn power
"RE_TURBO_FWD:090"      // Turbo forward power
"RE_TURBO_BWD:090"      // Turbo backward power
"RE_TURBO_TURN:080"     // Turbo turn power
"RE_SERVO_MIN:000"      // Servo minimum degrees
"RE_SERVO_MAX:220"      // Servo maximum degrees
"RE_SERVO_INC:015"      // Servo increment degrees
"RE_MY_SAVE:OK"         // Config saved successfully
"RE_MY_LOAD:OK"         // Config loaded successfully
"RE_DEFAULT_LOAD:OK"    // Reset to defaults complete
"RE_ERROR:COMMAND"      // Invalid command error
```

#### **Flash Storage (Persistent Settings):**

Settings are saved to micro:bit flash memory and survive power cycles.

**Storage Keys (≤15 characters):**
```typescript
settings.writeNumber("groupChanl", 25)      // 10 chars ✅
settings.writeNumber("motorFwd", 60)        //  8 chars ✅
settings.writeNumber("motorBwd", 60)        //  8 chars ✅
settings.writeNumber("motorTurn", 50)       //  9 chars ✅
settings.writeNumber("turboFwd", 90)        //  8 chars ✅
settings.writeNumber("turboBwd", 90)        //  8 chars ✅
settings.writeNumber("turboTurn", 80)       //  9 chars ✅
settings.writeNumber("servoMin", 0)         //  8 chars ✅
settings.writeNumber("servoMax", 220)       //  8 chars ✅
settings.writeNumber("servoInc", 15)        //  8 chars ✅
```

#### **Benefits:**

**For Educators:**
- ✅ **Centralized Management** - Configure all devices from one NDM
- ✅ **Quick Setup** - Change 50 bots in minutes, not hours
- ✅ **Consistent Settings** - All bots use same configuration
- ✅ **No Physical Access** - Configure remotely during class
- ✅ **Persistent Storage** - Settings survive power cycles
- ✅ **Quick Re-pairing** - Change controller-bot pairs in seconds

**For Students:**
- ✅ **Learn Configuration** - Understand remote management
- ✅ **Experiment Safely** - Reset to defaults anytime
- ✅ **See Real-time Changes** - Immediate feedback
- ✅ **Understand Persistence** - Learn about flash storage

#### **Use Cases:**

**1. Change Group Channel (Most Common)**
```
Scenario: Pair Controller xyz02 with Bot abc01

1. Page 1: Select "xyz02 (Ctrl)"
2. Press A → Go to Page 3
3. Change channel: 001 → 025
4. Press A to send, Menu to save
5. Press B → Back to Page 1
6. Select "abc01 (Bot)"
7. Press A → Go to Page 3
8. Change channel: 001 → 025
9. Press A to send, Menu to save
10. Done! Both now on Ch:025 ✅
```

**2. Adjust Bot Motor Power**
```
Scenario: Make bot faster

1. Page 1: Select bot
2. Press A → Go to Page 3
3. Adjust motor forward: 060 → 080
4. Adjust motor turn: 050 → 060
5. Press A to send, Menu to save
6. Bot now has faster motors! ✅
```

**3. Bulk Configuration**
```
Scenario: Configure 50 bots with same settings

1. Configure first bot (save as template)
2. For each remaining bot:
   - Select bot on Page 1
   - Press A → Page 3
   - Apply template settings
   - Press A to send, Menu to save
3. All 50 bots configured! ✅
```

---

## 📊 Technical Specifications

### **Network Performance:**
- Command Size: ~18 characters
- Response Size: ~17 characters
- Transmission Time: <50ms
- Total Round-trip: <100ms
- Supports 50+ devices simultaneously

### **Storage Requirements:**
- Per Device: 10 numbers × 4 bytes = 40 bytes
- Total Available: 4KB (4,096 bytes)
- Usage: <1% of available storage
- Plenty of room for future expansion

### **Compatibility:**
- **NDM Device:** Elecfreaks Retro Arcade Controller
- **Bot/Controller Device:** BBC micro:bit V2
- **Radio Protocol:** micro:bit radio (2.4GHz)
- **Flash Storage:** micro:bit persistent storage API

---

## 🔧 Implementation Status

### **Phase 1: Live Monitor** ✅ **COMPLETE**
- [x] Device detection and identification
- [x] Real-time telemetry display
- [x] Channel grouping
- [x] Status indicators (✅ ⚠️ ❌)

### **Phase 2: Remote Configuration** 📋 **PLANNED**
- [ ] Phase 2A: Bot/Controller Receiver
  - [ ] Command parser
  - [ ] SET/GET handlers
  - [ ] Flash save/load functions
  - [ ] Default reset function
- [ ] Phase 2B: NDM Sender UI
  - [ ] Page 1: Channel status with selection
  - [ ] Page 2: Bot telemetry (verify existing)
  - [ ] Page 3: Remote config interface
  - [ ] Navigation flow
- [ ] Phase 2C: Integration & Testing
  - [ ] End-to-end command testing
  - [ ] Flash persistence testing
  - [ ] Multi-device testing
  - [ ] Error handling
  - [ ] Documentation

---

## 🚀 Getting Started

### **Use as Extension**

This repository can be added as an **extension** in MakeCode.

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/jasonc1025-333/26-0119-0121-mb-ef_controller_retroarcade-networkdevicemanager** and import

### **Edit this project**

To edit this repository in MakeCode.

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/jasonc1025-333/26-0119-0121-mb-ef_controller_retroarcade-networkdevicemanager** and click import

#### Metadata (used for search, rendering)

* for PXT/arcade
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
