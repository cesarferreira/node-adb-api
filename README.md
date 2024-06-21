# node-adb-api
> A node API for adb (android debug bridge)

[![Build Status](https://travis-ci.org/cesarferreira/node-adb-api.svg?branch=master)](https://travis-ci.org/cesarferreira/node-adb-api)
[![npm](https://img.shields.io/npm/dt/node-adb-api.svg)](https://www.npmjs.com/package/node-adb-api)
[![npm](https://img.shields.io/npm/v/node-adb-api.svg)](https://www.npmjs.com/package/node-adb-api)

## Used in
[purrge](https://github.com/cesarferreira/purrge) - 🐱 Quickly purrge android apps from your phone

<p align="center">
  <img src="extras/actions.png" width="100%" />
</p>

## Install

```sh
npm install node-adb-api
```

## Usage

```js
const adb = require('node-adb-api');
```

```js
// Open the package on the device serial number
launchApp: (chosenPackage, selectedDevice)

// Get the list of connected device serial numbers
getListOfDevices: ()

// Gets an array of packages by device serial number
getPackagesByDeviceSerialNumber: (deviceSerialNumber)

// Get the apk path by device serial number
getDeviceApkPath: (deviceSerialNumber, chosenPackage)

// Download the chosen package by device serial number
downloadAPK: (deviceSerialNumber, chosenPackage)

// (Promise) Performs a fuzzy match search on the packages
fuzzySearchPackages: (packages, textToFind)

// Uninstalls the app
uninstall: (chosenPackage, selectedDevice)

// Clear the app data
clearData: (chosenPackage, deviceSerialNumber)

// check if there is a connected device
isAnyDeviceConnected: (deviceSerialNumber)
```

## Created by
[Cesar Ferreira](https://cesarferreira.com)

## License
MIT © [Cesar Ferreira](http://cesarferreira.com)
