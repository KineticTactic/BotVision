"use strict";
var packager = require("electron-packager");
var options = {
    arch: "ia32",
    platform: "win32",
    dir: "./",
    "app-copyright": "KineticTactic",
    "app-version": "2.1.6",
    asar: true,
    // icon: "./app.ico",
    name: "BotVision",
    out: "./releases",
    overwrite: true,
    prune: true,
    version: "1.3.4",
    "version-string": {
        CompanyName: "KineticTactic",
        FileDescription: "BotVision",
        OriginalFilename: "BotVision",
        ProductName: "BotVision",
        InternalName: "BotVision",
    },
};
packager(options, function done_callback(err, appPaths) {
    console.log("Error: ", err);
    console.log("appPaths: ", appPaths);
});
