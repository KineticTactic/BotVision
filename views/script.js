const { ipcRenderer } = require("electron");

let servers, channels;

const connectBtn = document.getElementById("connect");
const sendBtn = document.getElementById("send");
const messageInputElt = document.getElementById("message");
const serverSelect = document.getElementById("servers");
const channelsSelect = document.getElementById("channels");

connectBtn.addEventListener("click", () => {
    ipcRenderer.send("connect");
});

messageInputElt.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
        messageInputElt.value = "";
    }
});

sendBtn.addEventListener("click", sendMessage);

ipcRenderer.on("servers", (event, args) => {
    servers = args;
    servers.forEach((e) => {
        const option = document.createElement("option");
        option.text = e.name;
        serverSelect.add(option);
    });
    updateChannels(serverSelect.value);
});
serverSelect.addEventListener("change", (e) => {
    console.log(e);
    console.log(serverSelect.value);
    updateChannels(serverSelect.value);
});

ipcRenderer.on("channels", (event, args) => {
    channels = args;
    removeOptionsFromSelect(channelsSelect);
    channels.forEach((channel) => {
        const option = document.createElement("option");
        option.text = channel.name;
        channelsSelect.add(option);
    });
});

function sendMessage() {
    ipcRenderer.send("send", {
        message: messageInputElt.value,
        server: servers.find((e) => e.name === serverSelect.value).id,
        channel: channels.find((e) => e.name === channelsSelect.value).id,
    });
}

function updateChannels(serverName) {
    ipcRenderer.send("getChannels", servers.find((e) => e.name === serverName).id);
}

//
function removeOptionsFromSelect(selectElement) {
    let L = selectElement.options.length - 1;
    for (let i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}
