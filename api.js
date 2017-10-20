#!/usr/bin/env node
'use strict';

const Chalk = require('chalk');
const log = require('node-time-log').SimpleLog;
const shell = require('shelljs');
const fuzzy = require('fuzzy');

let mPackages;
let mDevices;

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// Main code //
const self = module.exports = {

	launchApp: (chosenPackage, selectedDevice) => {
		shell.exec(`adb -s ${selectedDevice} shell monkey -p ${chosenPackage} -c android.intent.category.LAUNCHER 1`);
	},

	getListOfDevices: () => {
		const command = shell.exec('adb devices -l', { silent: true	})
		const devices = command.stdout.split(`\n`)
			.filter(Boolean)
			.filter(item => item.indexOf('daemon not running') === -1)
			.filter(item => item.indexOf('daemon started') === -1)
			.filter(item => item.indexOf('List of devices attached') === -1)
			.map(item => item.replace(`device`, ``))
			.map(item => item.replace(/^\s+|\s+$/g, ""));

		mDevices = devices;
		return devices;
	},

	getPackagesByDeviceSerialNumber: (deviceSerialNumber) => {
		const command = shell.exec(`adb -s ${deviceSerialNumber} shell pm list packages`, {
			silent: true
		})
		const packages = command.stdout.split(`\n`)
		.filter(Boolean)
		.map(item => item.replace(`package:`, ``))
		.map(item => item.replace(/^\s+|\s+$/g, ``));

		mPackages = packages;
		return packages;
	},

	getDeviceApkPath: (deviceSerialNumber, chosenPackage) => {
		const command = shell.exec(`adb -s ${deviceSerialNumber} shell pm list packages -f`, {
			silent: true
		})

    const packages = command.stdout.split(`\n`)
		.filter(Boolean)
		.map(item => item.replace(`package:`, ``))
		.filter(item => item.trim().endsWith(chosenPackage.trim()))
		.map(item => item.split(`=`)[0])

		return packages[0];
	},

	downloadAPK: (deviceSerialNumber, chosenPackage) => {
		const path = self.getDeviceApkPath(deviceSerialNumber, chosenPackage);
		const fileName = `${chosenPackage}.apk`

		shell.exec(`adb -s ${deviceSerialNumber} pull ${path} ${fileName}`, {
			silent: true
		});
		return fileName;
	},

	fuzzySearchPackages: (packages, textToFind) => {
		textToFind = textToFind || '';

		return new Promise(function(resolve) {
			var fuzzyResult = fuzzy.filter(textToFind, mPackages);
			resolve(fuzzyResult.map(el => el.original));
		});
	},

	uninstall: (chosenPackage, selectedDevice) => {
		shell.exec(`adb -s ${selectedDevice} uninstall ${chosenPackage}`);
	},

	clearData: (chosenPackage, deviceSerialNumber) => {
		shell.exec(`adb -s ${deviceSerialNumber} shell pm clear ${chosenPackage}`);
	},

	isAnyDeviceConnected: (deviceSerialNumber) => {
		return self.getPackagesByDeviceSerialNumber(deviceSerialNumber).length > 0;
	}

};
