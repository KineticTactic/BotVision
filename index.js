const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const Discord = require("discord.js");

const config = require("./config/config.json");

const client = new Discord.Client();

let win = null;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    win.loadFile("views/index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Events
ipcMain.on("connect", () => {
    console.log("Connecting...");
    client.login(config.botToken);
});

ipcMain.on("getChannels", (event, id) => {
    console.log(`Fetching channel ${id}`);
    const channels = [];
    client.guilds.cache.get(id).channels.cache.forEach((channel) => {
        channels.push({ name: channel.name, id: channel.id });
    });
    event.reply("channels", channels);
});

ipcMain.on("send", (event, arg) => {
    console.log(`Sending Message: ${arg.message}`);
    client.guilds.cache.get(arg.server).channels.cache.get(arg.channel).send(arg.message);
});

// Discord
client.once("ready", () => {
    console.log("Ready!");

    const servers = [];
    client.guilds.cache.forEach((guild) => {
        servers.push({ name: guild.name, id: guild.id });
    });

    console.log("Sending Server list");
    win.webContents.send("servers", servers);
});
