const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path');
const fs = require('fs');

// const proxy = require('express-http-proxy');
// const express = require('express');
// const server = express();
// const bodyParser = require('body-parser');
//
const src_dir = path.resolve(__dirname, 'src');
// const static_dir = path.resolve(__dirname, 'src');
// console.log(static_dir);
// server.use(express.static(static_dir));
// server.use(bodyParser.json()); // for parsing application/json
//
//
// server.use('/lc/*', proxy('http://192.168.1.116:7077', {
// // server.use('/lc/*', proxy('http://localhost:23715', {
// // server.use('/pi/*', proxy('http://127.0.0.1:9001', {
//   proxyReqPathResolver: function(req) {
//     // console.log('req.url', req.url);
//     // return require('url').parse(req.url).path;
//     return req.baseUrl;
//   }
// }))
//
// server.post('/diagnose', function (req, res) {
//   console.log('req.body', req.body);
//   // mainWindow.loadURL(`http://${hostname}:${PORT}/diagnose.local.html`)
// })
//
// const PORT = 9000;
// const hostname = 'localhost';
// server.listen(PORT, hostname, function () {
//   console.log(`server listening at http://${hostname}:${PORT}`);
// })



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 800,
    webPreferences: {
      // nodeIntegration: false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${src_dir}/index.html`)
  // mainWindow.loadURL(`http://${hostname}:${PORT}/index.html`)
  // mainWindow.loadURL(`http://localhost:5000/index.html`)


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  let contents = mainWindow.webContents
  contents.openDevTools()
  // console.log(contents)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
