const { ipcRenderer } = require("electron");

let servers, channels;

const connectBtn = document.getElementById("connect");
const messageInputElt = document.getElementById("message");
const serverSelect = document.getElementById("servers");
const channelsSelect = document.getElementById("channels");

connectBtn.addEventListener("click", () => {
    ipcRenderer.send("connect");
});

const sendBtn = document.getElementById("send");
sendBtn.addEventListener("click", () => {
    ipcRenderer.send("send", {
        message: messageInputElt.value,
        server: servers.find((e) => e.name === serverSelect.value).id,
        channel: channels.find((e) => e.name === channelsSelect.value).id,
    });
});

ipcRenderer.on("servers", (event, args) => {
    servers = args;
    servers.forEach((e) => {
        const option = document.createElement("option");
        option.text = e.name;
        serverSelect.add(option);
    });
});
serverSelect.addEventListener("change", (e) => {
    ipcRenderer.send("getChannels", servers.find((e) => e.name === serverSelect.value).id);
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

//
function removeOptionsFromSelect(selectElement) {
    let L = selectElement.options.length - 1;
    for (let i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}
