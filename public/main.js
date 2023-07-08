const { app, BrowserWindow } = require('electron');

// icon
// const nativeImage = require('electron').nativeImage;
// var image = nativeImage.createFromPath(__dirname + 'icon.png');
// image.setTemplateImage(true);

require('@electron/remote/main').initialize();

const path = require('path');
const isDev = require('electron-is-dev');
// const __dirname = path.resolve();
function createwindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
    },
    minWidth: 800,
    minHeight: 600,
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be',
    },
    // icon: Image,
    // resizable: false,
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
}

app.on('ready', createwindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createwindow();
});
