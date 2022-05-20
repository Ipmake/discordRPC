// Modules to control app life and create native browser window
const {app, BrowserWindow, Menu, Tray, Notification} = require('electron')
const path = require('path')

let isQuiting;
let tray;

const NOTIFICATION_TITLE = 'Discord RPC'
const NOTIFICATION_BODY = 'RPC closed to tray'

function showNotification () {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './icon.png',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      frame: false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  Menu.setApplicationMenu(null)
  tray = new Tray(path.join(__dirname, 'icon.png'));

  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Open', click: function () {
        mainWindow.show();
      }
    },
    {
      label: 'Quit', click: function () {
        isQuiting = true;
        app.quit();
      }
    }
  ]));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  
  mainWindow.on('close', function (event) {
    if (!isQuiting) {
      event.preventDefault();
      mainWindow.hide();
      event.returnValue = false;
      showNotification();
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser mainWindows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for apps and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
