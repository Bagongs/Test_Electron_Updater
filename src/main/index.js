import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { autoUpdater } from 'electron-updater'

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173') // Development mode
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html')) // Production mode
  }
}

app.whenReady().then(() => {
  createWindow()

  // Konfigurasi autoUpdater
  autoUpdater.checkForUpdatesAndNotify()

  autoUpdater.on('checking-for-update', () => {
    console.log('Memeriksa pembaruan...')
    if (mainWindow) {
      mainWindow.webContents.send('update-status', 'Memeriksa pembaruan...')
    }
  })

  autoUpdater.on('update-available', () => {
    console.log('Pembaruan tersedia.')
    if (mainWindow) {
      mainWindow.webContents.send('update-status', 'Pembaruan tersedia. Mengunduh...')
    }
  })

  autoUpdater.on('update-not-available', () => {
    console.log('Tidak ada pembaruan tersedia.')
    if (mainWindow) {
      mainWindow.webContents.send('update-status', 'Tidak ada pembaruan tersedia.')
    }
  })

  autoUpdater.on('download-progress', (progress) => {
    console.log(`Progres unduhan: ${progress.percent}%`)
    if (mainWindow) {
      mainWindow.webContents.send('update-progress', progress.percent)
    }
  })

  autoUpdater.on('update-downloaded', () => {
    console.log('Pembaruan telah diunduh.')
    if (mainWindow) {
      mainWindow.webContents.send(
        'update-status',
        'Pembaruan telah diunduh. Mulai ulang aplikasi untuk menerapkan.'
      )
    }
  })

  autoUpdater.on('error', (error) => {
    console.error('Kesalahan selama pembaruan:', error)
    if (mainWindow) {
      mainWindow.webContents.send('update-error', error.message)
    }
  })
})

ipcMain.on('check-for-updates', () => {
  console.log('Pesan "check-for-updates" diterima di proses utama.');
  autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.on('restart-app', () => {
  autoUpdater.quitAndInstall()
})

if (process.platform === 'darwin') {
  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
  app.commandLine.appendSwitch('ignore-certificate-errors');
}

if (process.platform === 'win32') {
  app.commandLine.appendSwitch('ignore-certificate-errors');
}