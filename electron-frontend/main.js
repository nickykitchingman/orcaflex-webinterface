const { app, BrowserWindow } = require('electron')
const env = require('dotenv').config()

app.whenReady().then(() => {
	
	const mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		icon: 'icon.ico',
		webPreferences: {
			nodeIntegration: true
		}
	});
	
	mainWindow.on('page-title-updated', e => {
		e.preventDefault();
	});
	
	// set window title
	mainWindow.setTitle('OrcaFlex Electron Interface');
	
	// remove menu bar
	mainWindow.setMenu(null);
	
	// load web interface
	mainWindow.loadURL(process.env.REACT_APP_URL);
	
});