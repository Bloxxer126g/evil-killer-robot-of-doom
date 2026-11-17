// Tristan's evil killer robot of doom v.20
// ble.js
// detect key presses and transmit them to the robot

const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab'; // theese need to be the same as on tjhe esp32 or it wont connect
const CHAR_UUID    = '12345678-1234-1234-1234-1234567890ac'; // this too

let IsConnected = false
let char = null

document.getElementById('scan').onclick = async () => {
    const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE_UUID] }]
    });
    const server  = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    char = await service.getCharacteristic(CHAR_UUID); // do all of the ble connection (this is copy-pasted from MDN docs)
    IsConnected = true

    document.getElementById('status').textContent = 'connected to robot';
}

keyDown = ""

document.onkeydown = function (e) {
    if (e.keyCode == 87) { // it looks like event.keycode is depricated but i dont know another method lol
        keyDown = "W"
    }
    if (e.keyCode == 65) {
        keyDown = "A"
    }
    if (e.keyCode == 83) {
        keyDown = "S"
    }
    if (e.keyCode == 68) {
        keyDown = "D"
    }
};

document.onkeyup = function (e) {
    if (e.keyCode == 87 && keyDown == "W") {
        keyDown = ""
    }
    if (e.keyCode == 65 && keyDown == "A") {
        keyDown = ""
    }
    if (e.keyCode == 83 && keyDown == "S") {
        keyDown = ""
    }
    if (e.keyCode == 68 && keyDown == "D") {
        keyDown = ""
    }
};

setInterval(ev => {
    document.getElementById("key").innerHTML = keyDown || " "
    if (IsConnected == true) { // cant send the message if it is not connected
        char.writeValueWithoutResponse(new TextEncoder().encode(keyDown || " ")) // send the message
            .catch(err => console.warn(err)); // incase something goes wrong
    }
}, 20)