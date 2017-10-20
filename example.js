#!/usr/bin/env node
'use strict';

const log = console.log;
const adb = require('./api.js');

// Use the `adb` as you please
log(adb.getListOfDevices())
adb.downloadAPK('ab993982', 'com.amazon.mShop.android.shopping')
