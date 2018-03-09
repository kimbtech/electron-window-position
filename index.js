/*
 * NPM Module "electron-window-position" by KIMB-technologies
 * https://github.com/kimbtech/electron-window-position
 * MIT License
 */

// load electron
const electron = require('electron');
// link to electron app
const app = electron.app;

// fires a custom exception, defined here 
function NotReadyException( m ){
	this.message = m;
	this.name = "NotReadyException";
}

// export class for NodeJS
/**
 * A class which allows easy and intuitive window positioning for electron browser windows.
 */
module.exports = class WindowPosition {

	/**
	 * Initiates calculation, waits for electron app become ready before calculation.
	 * @param {function(JSON)} gets calculated top left position as JSON {x: ?, y: ?}
	 */
	constructor ( callback ){
		// position
		this.activeScreenTopLeftData = {x : 0, y : 0};
		// nothing cacled until now
		this.activeScreenTopLeftCalced = false;
		// refers to choosen display for positioning
		this.display = null;

		// is electron app module ready?
		if( app.isReady() ){
			// calc the position
			this.calcActiveScreenTopLeft();

			// give the position back
			if( typeof callback == "function" ){
				callback( this.getActiveScreenTopLeft() );
			}
		}
		else{
			// wait for electron app module to become ready
			app.on('ready', () => {
				// calc the position
				this.calcActiveScreenTopLeft();

				// give the position back
				if( typeof callback == "function" ){
					callback( this.getActiveScreenTopLeft() );
				}
			});
		}
	}

	/**
	 * Getter for browser window position so that the window opens at the top left corner,
	 * of the screen where the mouse is.
	 * @return {JSON} calculated top left position as JSON {x: ?, y: ?}
	 * @throws {NotReadyException} fired if electron app module is not ready
	 */
	getActiveScreenTopLeft(){
		// already calced position?
		if( this.activeScreenTopLeftCalced ){
			// return it
			return this.activeScreenTopLeftData;
		}
		else{
			// no position calced and not possible now
			throw new NotReadyException( 'This query is impossible now, because electron is not ready yet. [electron.app.isReady()]' );
		}
	}

	/**
	 * Getter for browser window position so that the window opens centered
	 * on the screen where the mouse is.
	 * @param {number} width Width of the window which should be centered
	 * @param {number} height Height of the window which should be centered
	 * @return {JSON} calculated centered position as JSON {x: ?, y: ?}
	 * @throws {NotReadyException} fired if electron app module is not ready
	 */
	getActiveScreenCenter( width, height ){
		// top left position
		var topleft = this.getActiveScreenTopLeft();
		topleft.x = topleft.x - 20;
		topleft.y = topleft.y - 20;

		// calculate center
		var center = {
			x : topleft.x + Math.floor( this.display.bounds.width / 2 ),
			y : topleft.y + Math.floor( this.display.bounds.height / 2)
		};

		// substract half window size => top left corner for centered window
		center.x = center.x - Math.floor( width / 2 );
		center.y = center.y - Math.floor( height / 2 );

		return center;
	}

	/**
	 * Calculates top left position and saves it to class variables.
	 * @private 
	 */
	calcActiveScreenTopLeft(){
		// electron app module ist ready, so we can access screen module
		const screen = electron.screen;

		// get the mouse's position, coordinates range over all displays
		var mouse = screen.getCursorScreenPoint();

		// loop over all displays
		screen.getAllDisplays().some( display => {
			//check if mouse keeps in this display
			if(
					( display.bounds.x - mouse.x ) < 0 && 
					( display.bounds.x + display.bounds.width - mouse.x ) > 0
				&&
					( display.bounds.y - mouse.y ) < 0 && 
					( display.bounds.y + display.bounds.height - mouse.y ) > 0
			){
				// get top left corner (each +20, looks better)
				this.activeScreenTopLeftData.x = display.bounds.x + 20;
				this.activeScreenTopLeftData.y = display.bounds.y + 20;

				// remeber this display
				this.display = display;

				//no we have calculated data
				this.activeScreenTopLeftCalced = true;

				//leave
				return;
			}
		});
	}
}
