/*
 * NPM Module "electron-window-position" by KIMB-technologies
 * https://github.com/kimbtech/electron-window-position
 * MIT License
 */

/**
 * This test opens two windows, one on the top left corner and one centered.
 * 	Also is opens error dialoges if something goes wrong.
 */

// Electron API
const electron = require('electron');
// WindowPosition Class
const WindowPosition = require( __dirname + '/' );

// noch gibt es Fehler
var error = [true, true];

// Calculate Data
var pos = new WindowPosition( function ( topleft ){
	// test callback
	openWindowOne( topleft );

	// test direct callback
	var pos2 = new WindowPosition( pos2 => {
		if( pos2.x != topleft.x || pos2.y != topleft.y ){
			electron.dialog.showErrorBox( 'Error', 'Incorrect data at direct callback.' );
		}
		error[0] = false;
	});

	// test direct calls
	openWindowTwo( pos.getActiveScreenCenter(300,300) );
});


// test exception
try {
	pos.getActiveScreenCenter(300,300)
} catch (e) {
	error[1] = false;
}

// global refs for main Windows
let mainWindowOne = null;
let mainWindowRwo = null;

// main window top left
function openWindowOne( pos ){
	mainWindowOne = new electron.BrowserWindow({
		x: pos.x, 
		y: pos.y,
		width: 300,
		height: 300,
		show: true,
		resizable: false
	});

	mainWindowOne.on('closed', () => {
		mainWindowOne = null;
	});

	//no menue
	electron.Menu.setApplicationMenu(null);
}

// main window centered
function openWindowTwo( pos ){
	mainWindowTwo = new electron.BrowserWindow({
		x: pos.x, 
		y: pos.y,
		width: 300,
		height: 300,
		show: true,
		resizable: false
	});

	mainWindowTwo.on('closed', () => {
		mainWindowTwo = null;
	});
}

// quit program if all windows closed
electron.app.on('window-all-closed', () => {
	if( error[0] ) {
		electron.dialog.showErrorBox('Error', 'No direct callback!');
	}
	if( error[1] ) {
		electron.dialog.showErrorBox('Error', 'No Exception!');
	}
	electron.app.quit();
});