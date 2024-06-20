#!/usr/bin/env node
"use strict";

const log = console.log;
const adb = require("./api.js");

// Use the `adb` as you please
const list = adb.getListOfDevices();

log(list);
log(list[0]);
// adb.downloadAPK("ab993982", "com.amazon.mShop.android.shopping");
