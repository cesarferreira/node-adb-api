# node-adb-api
> A Node.js API wrapper for ADB (Android Debug Bridge)

[![npm](https://img.shields.io/npm/dt/node-adb-api.svg)](https://www.npmjs.com/package/node-adb-api)
[![npm](https://img.shields.io/npm/v/node-adb-api.svg)](https://www.npmjs.com/package/node-adb-api)

## Features
- 🔍 List connected devices
- 📱 Manage Android apps (launch, kill, clear data)
- 📦 Download APKs from devices
- 🔎 Fuzzy search packages
- ⚡ Fast and reliable

## Installation

```bash
npm install node-adb-api
```

## Usage

```javascript
const adb = require('node-adb-api');
```

### Device Management
```javascript
// Get list of connected device serial numbers
const devices = adb.getListOfDevices();

// Check if a device is connected
const isConnected = adb.isAnyDeviceConnected('device_serial');
```

### Package Management
```javascript
// Get list of installed packages on a device
const packages = adb.getPackagesByDeviceSerialNumber('device_serial');

// Fuzzy search packages
const results = await adb.fuzzySearchPackages(null, 'chrome');

// Get APK path on device
const path = adb.getDeviceApkPath('device_serial', 'com.example.app');

// Download APK from device
const apkFile = adb.downloadAPK('device_serial', 'com.example.app');
```

### App Control
```javascript
// Launch an app
adb.launchApp('com.example.app', 'device_serial');

// Force kill an app
adb.forceKill('com.example.app', 'device_serial');

// Clear app data
adb.clearData('com.example.app', 'device_serial');

// Uninstall an app
adb.uninstall('com.example.app', 'device_serial');
```

## API Reference

### `getListOfDevices()`
Returns an array of connected device serial numbers.

### `isAnyDeviceConnected(deviceSerialNumber)`
Checks if the specified device is connected.
- `deviceSerialNumber`: Device serial number to check

### `getPackagesByDeviceSerialNumber(deviceSerialNumber)`
Returns an array of package names installed on the device.
- `deviceSerialNumber`: Target device serial number

### `fuzzySearchPackages(packages, textToFind)`
Performs a fuzzy search on installed packages.
- `packages`: Optional array of packages to search in
- `textToFind`: Search query string

### `getDeviceApkPath(deviceSerialNumber, chosenPackage)`
Gets the path of an APK file on the device.
- `deviceSerialNumber`: Target device serial number
- `chosenPackage`: Package name to locate

### `downloadAPK(deviceSerialNumber, chosenPackage)`
Downloads an APK file from the device.
- `deviceSerialNumber`: Target device serial number
- `chosenPackage`: Package name to download
- Returns: The downloaded APK filename

### `launchApp(chosenPackage, selectedDevice)`
Launches an app on the device.
- `chosenPackage`: Package name to launch
- `selectedDevice`: Target device serial number

### `forceKill(chosenPackage, deviceSerialNumber)`
Force stops an app on the device.
- `chosenPackage`: Package name to force stop
- `deviceSerialNumber`: Target device serial number

### `clearData(chosenPackage, deviceSerialNumber)`
Clears app data on the device.
- `chosenPackage`: Package name to clear data
- `deviceSerialNumber`: Target device serial number

### `uninstall(chosenPackage, selectedDevice)`
Uninstalls an app from the device.
- `chosenPackage`: Package name to uninstall
- `selectedDevice`: Target device serial number

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint
```

## Used in
[purrge](https://github.com/cesarferreira/purrge) - 🐱 Quickly purrge android apps from your phone

## License
MIT © [Cesar Ferreira](http://cesarferreira.com)
