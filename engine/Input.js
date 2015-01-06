var gInput = new Input();

/**
 * Creates a new instance of Input.
 * 
 * @class The Input class wraps keyboard and mouse input into one object making it easier to listen for key and mouse actions.
 * @property {Vector} mouse The screenspace mouse coordinates relative to the top left corner of the game canvas.
 * @property {bool} shift Is the shift key pressed.
 * @property {bool} lBtn Is the left mouse button pressed.
 * @property {bool} mBtn Is the middle mouse button pressed.
 * @property {bool} rBtn Is the right mouse button pressed.
 */
function Input(){
	this.printKey = false;
	this.keys = new Array();
	this.bools = new Array();
	this.funcs = new Array();
	this.repeats = new Array();
	this.mouse = new Vector(0,0,0);
	this.shift = false;
	this.lBtn = false;
	this.mBtn = false;
	this.rBtn = false;
	this.lBtnFuncs = new Array();
	this.mBtnFuncs = new Array();
	this.rBtnFuncs = new Array();
	this.wheelFuncs = new Array();
	this.mdListens = new Array();
	this.muListens = new Array();
	this.mmListens = new Array();
	this.mwListens = new Array();
	this.keyListens = new Array();
}

/**
 * Sets all bools to false.
 */
Input.prototype.blur = function(){
	//for(bool in this.bools){
	for(var i=0; i < this.bools.length; i++){
		this.bools[i] = false;
	}
}

/**
 * Adds a key-bool set. When the given key is pressed the bool is set to true and set to false when it is released.
 * 
 * @param {number} keyCode The keyCode of the key to be pressed. (If you don't know the keycode open the console with `/~ and then press insert to start tracing key presses)
 * @param {string} boolName The name of the new bool. Bools can be accessed like object properties (eg input.thisIsABool)
 */
Input.prototype.addBool = function(keyCode, boolName){
	keyCode = isNaN(keyCode) ? keyCode.charCodeAt(0) : keyCode;
	//console.log(keyCode)
	this.keys[keyCode] = boolName;
	this.bools[boolName] = false;
	/*this.__defineGetter__(boolName, function(){
		return this.bools[boolName];
	});*/
	Object.defineProperty(this, boolName, {
		configurable: true,
		get: function(){
			return this.bools[boolName];
		}
	});
}

/**
 * Removes a defined bool.
 * 
 * @param {string} boolName The name of the new bool to be removed.
 */
Input.prototype.removeBool = function(boolName){
	delete this[boolName];
	for(var key in this.keys){
		if(this.keys[key] == boolName){
			this.keys[key] = null;
			break;
		}
	}
}

/**
 * Adds a function to be called when the given key is pressed. Repeats until released if repeat is true.
 * 
 * @param {number} keyCode The keyCode of the key to be pressed. (If you don't know the keycode open the console with `/~ and then press insert to start tracing key presses)
 * @param {function} func The function to be called when the given key is pressed.
 * @param {bool} repeat Should the function be called repeatedly until the key is released.
 */
Input.prototype.addFunc = function(keyCode, func, repeat){
	this.funcs[keyCode] = func;
	this.repeats[keyCode] = repeat;
}

/**
 * Removes a function set to be called on a keypress.
 * 
 * @param {function} func The function to be removed.
 */
Input.prototype.removeFunc = function(func){
	for(var f in this.funcs){
		if(this.funcs[f] == func){
			this.funcs[f] = null;
			this.repeats[f] = false;
			break;
		}
	}
}

/**
 * Adds a function to be called when the left mouse button is pressed.
 * 
 * @param {function} func A function to be called.
 */
Input.prototype.addLBtnFunc = function(func){
	this.lBtnFuncs.push(func);
}

/**
 * Removes a function to be called when the left mouse button is pressed.
 * 
 * @param {function} func The function to be removed.
 */
Input.prototype.removeLBtnFunc = function(func){
	for(var f in this.lBtnFuncs){
		if(this.lBtnFuncs[f] == func){
			this.lBtnFuncs[f] = null;
			break;
		}
	}
}


/**
 * Adds a function to be called when the middle mouse button is pressed.
 * 
 * @param {function} func A function to be called.
 */
Input.prototype.addMBtnFunc = function(func){
	this.mBtnFuncs.push(func);
}

/**
 * Removes a function to be called when the middle mouse button is pressed.
 * 
 * @param {function} func The function to be removed.
 */
Input.prototype.removeMBtnFunc = function(func){
	for(var f in this.mBtnFuncs){
		if(this.mBtnFuncs[f] == func){
			this.mBtnFuncs[f] = null;
			break;
		}
	}
}

/**
 * Adds a function to be called when the right mouse button is pressed.
 * 
 * @param {function} func A function to be called.
 */
Input.prototype.addRBtnFunc = function(func){
	this.rBtnFuncs.push(func);
}

/**
 * Removes a function to be called when the right mouse button is pressed.
 * 
 * @param {function} func The function to be removed.
 */
Input.prototype.removeRBtnFunc = function(func){
	for(var f in this.rBtnFuncs){
		if(this.rBtnFuncs[f] == func){
			this.rBtnFuncs[f] = null;
			break;
		}
	}
}

/**
 * Adds a function to be called when the mouse wheel is scrolled.
 * 
 * @param {function} func A function to be called.
 */
Input.prototype.addWheelFunc = function(func){
	this.wheelFuncs.push(func);
}

/**
 * Removes a function to be called when the mouse wheel is scrolled.
 * 
 * @param {function} func The function to be removed.
 */
Input.prototype.removeWheelFunc = function(func){
	for(var f in this.wheelFuncs){
		if(this.wheelFuncs[f] == func){
			this.wheelFuncs[f] = null;
			break;
		}
	}
}

/**
 * Adds an object to be notified when a mouse button is pressed. The object must have the function onMouseDown(buttonNumber).
 * 
 * @param {Object} obj An object with an onMouseDown function.
 */
Input.prototype.addMouseDownListener = function(obj){
	this.mdListens.push(obj);
}

/**
 * Removes an object from the list of objects to be notified when a mouse button is pressed.
 * 
 * @param {Object} obj The object to be removed.
 */
Input.prototype.removeMouseDownListener = function(obj){
	for(var o in this.mdListens){
		if(this.mdListens[o] == obj){
			this.mdListens[o] = null;
			break;
		}
	}
}

/**
 * Adds an object to be notified when a mouse button is released. The object must have the function onMouseUp(buttonNumber).
 * 
 * @param {Object} obj An object with an onMouseUp function.
 */
Input.prototype.addMouseUpListener = function(obj){
	this.muListens.push(obj);
}

/**
 * Removes an object from the list of objects to be notified when a mouse button is released.
 * 
 * @param {Object} obj The object to be removed.
 */
Input.prototype.removeMouseUpListener = function(obj){
	for(var o in this.muListens){
		if(this.muListens[o] == obj){
			this.muListens[o] = null;
			break;
		}
	}
}

/**
 * Adds an object to be notified when the mouse is moved. The object must have the function onMouseMove().
 * 
 * @param {Object} obj An object with an onMouseMove function.
 */
Input.prototype.addMouseMoveListener = function(obj){
	this.mmListens.push(obj);
}

/**
 * Removes an object from the list of objects to be notified when the mouse is moved.
 * 
 * @param {Object} obj The object to be removed.
 */
Input.prototype.removeMouseMoveListener = function(obj){
	for(var o in this.mmListens){
		if(this.mmListens[o] == obj){
			this.mmListens[o] = null;
			break;
		}
	}
}

/**
 * Adds an object to be notified when the mouse is scrolled. The object must have the function onMouseWheel().
 * 
 * @param {Object} obj An object with an onMouseMove function.
 */
Input.prototype.addMouseWheelListener = function(obj){
	this.mwListens.push(obj);
}

/**
 * Removes an object from the list of objects to be notified when the mouse is scrolled.
 * 
 * @param {Object} obj The object to be removed.
 */
Input.prototype.removeMouseWheelListener = function(obj){
	for(var o in this.mwListens){
		if(this.mwListens[o] == obj){
			this.mwListens[o] = null;
			break;
		}
	}
}


/**
 * Adds an object to be notified when a key is pressed. The object must have the function onKeyDown(key).
 * 
 * @param {Object} obj An object with an onKeyDown function.
 */
Input.prototype.addKeyboardListener = function(obj){
	this.keyListens.push(obj);
}

/**
 * Removes an object from the list of objects to be notified when a key is pressed.
 * 
 * @param {Object} obj The object to be removed.
 */
Input.prototype.removeMouseMoveListener = function(obj){
	for(var o in this.keyListens){
		if(this.keyListens[o] == obj){
			this.keyListens[o] = null;
			break;
		}
	}
}

Input.prototype.setMouse = function(x, y){
	this.mouse.x = x-canvas.offsetLeft;
	this.mouse.y = y-canvas.offsetTop;
	
	if(display != undefined && display.style.position == "relative"){
		this.mouse.x -= display.offsetLeft;
		this.mouse.y -= display.offsetTop;
	}
	
	this.mouse.x /= canvas.scaleX;
	this.mouse.y /= canvas.scaleY;
}

Input.prototype.mouseMove = function(e){
	if(!e) e = window.event;
	//println(e.pageY);
	this.setMouse(e.pageX, e.pageY);
	/*this.mouse.x = e.pageX-canvas.offsetLeft;
	this.mouse.y = e.pageY-canvas.offsetTop;
	
	if(display != undefined && display.style.position == "relative"){
		this.mouse.x -= display.offsetLeft;
		this.mouse.y -= display.offsetTop;
	}
	
	this.mouse.x /= canvas.scaleX;
	this.mouse.y /= canvas.scaleY;*/
	
	//for(var obj in this.mmListens){
	for(var obj = 0; obj < this.mmListens.length; obj++){
		this.mmListens[obj].onMouseMove();
	}
	return false;
}

Input.prototype.mouseDown = function(e){
	if(!e) e = window.event;
	switch(e.button){
		case 0:
			this.lBtn = true;
			break;
		case 1:
			this.mBtn = true;
			break;
		case 2:
			this.rBtn = true;
			break;
		default:
			break;
	}
	this.setMouse(e.pageX, e.pageY);
	/*this.mouse.x = e.pageX-canvas.offsetLeft;
	this.mouse.y = e.pageY-canvas.offsetTop;
	
	if(display != undefined && display.style.position == "relative"){
		this.mouse.x -= display.offsetLeft;
		this.mouse.y -= display.offsetTop;
	}
	
	this.mouse.x /= canvas.scaleX;
	this.mouse.y /= canvas.scaleY;*/
	
	//for(var obj in this.mdListens){
	for(var obj = 0; obj < this.mdListens.length; obj++){
		if(this.mdListens[obj] != null){
			this.mdListens[obj].onMouseDown(e.button);
		}
	}
	return false;
}

Input.prototype.mouseUp = function(e){
	if(!e) e = window.event;
	//println(e.button);
	switch(e.button){
		case 0:
			this.lBtn = false;
			//for(var func in this.lBtnFuncs){
			for(var func = 0; func < this.lBtnFuncs.length; func++){
				if(this.lBtnFuncs[func] != null){
					this.lBtnFuncs[func]();
				}
			}
			break;
		case 1:
			this.mBtn = false;
			//for(var func in this.mBtnFuncs){
			for(var func = 0; func < this.mBtnFuncs.length; func++){
				if(this.mBtnFuncs[func] != null){
					this.mBtnFuncs[func]();
				}
			}
			break;
		case 2:
			this.rBtn = false;
			//for(var func in this.rBtnFuncs){
			for(var func = 0; func < this.rBtnFuncs.length; func++){
				if(this.rBtnFuncs[func] != null){
					this.rBtnFuncs[func]();
				}
			}
			break;
		default:
			break;
	}
	this.setMouse(e.pageX, e.pageY);
	/*this.mouse.x = e.pageX-canvas.offsetLeft;
	this.mouse.y = e.pageY-canvas.offsetTop;
	
	if(display != undefined && display.style.position == "relative"){
		this.mouse.x -= display.offsetLeft;
		this.mouse.y -= display.offsetTop;
	}
	
	this.mouse.x /= canvas.scaleX;
	this.mouse.y /= canvas.scaleY;*/
	
	//for(var obj in this.muListens){
	for(var obj = 0; obj < this.muListens.length; obj++){
		if(this.muListens[obj] != null){
			this.muListens[obj].onMouseUp(e.button);
		}
	}
	return false;
}

Input.prototype.mouseWheel = function(e){
	if(!e) e = window.event;
	var x = e.wheelDeltaX ? e.wheelDeltaX/40 : 0;
	var y = e.wheelDeltaY ? e.wheelDeltaY/40 : -e.detail;
	
	this.setMouse(e.pageX, e.pageY);
	
	for(var func = 0; func < this.wheelFuncs.length; func++){
		if(this.wheelFuncs[func] != null){
			this.wheelFuncs[func](x, y);
		}
	}
	
	for(var obj = 0; obj < this.mwListens.length; obj++){
		if(this.mwListens[obj] != null){
			this.mwListens[obj].onMouseWheel(x, y);
		}
	}
	e.preventDefault();
	return false;
}

Input.prototype.handleKeyDown = function(e){
	var key = e.keyCode;
	if(this.printKey){
		console.log("down: "+key);//+": "+e.keyIdentifier);
	}
	if(key == 16){
		this.shift = true;
	}
	if(this.keys[key] != undefined && this.keys[key] != null){
		this.bools[this.keys[key]] = true;
	}
	if(this.funcs[key] != undefined && this.funcs[key] != null){
		if(this.repeats[key]){
			this.funcs[key]();
		}
	}
	//for(var obj in this.keyListens){
	for(var obj=0; obj < this.keyListens.length; obj++){
		if(this.keyListens[obj] != null){
			this.keyListens[obj].onKeyDown(key);
		}
	}
	//Event.stop(e);
	if(e.keyCode == 32){
		e.preventDefault();
		e.space = true;
		this.handleKeyPress(e);
	}
	if(e.keyCode == 8 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40){
		e.preventDefault();
	}
	//this.handleKeyPress(e);
	//e.returnValue = (e.keyCode != 8);
	//e.returnValue = !(e.keyCode == 8 || e.keyCode == 32);
	//this.handleKeyPress(e);
	//e.keyCode = 0;
	//println(window.event);
	//return e.keyCode != 8;
}
Input.prototype.handleKeyUp = function(e){
	var key = e.keyCode;
	if(this.printKey){
		console.log("up: "+key);
	}
	if(key == 16){
		this.shift = false;
	}
	if(this.keys[key] != undefined && this.keys[key] != null){
		this.bools[this.keys[key]] = false;
	}
	if(this.funcs[key] != undefined && this.funcs[key] != null){
		if(!this.repeats[key]){
			this.funcs[key]();
		}
	}
}
Input.prototype.handleKeyPress = function(e){
	var key = e.which;
	if(key == 32 && !e.space){
		return true;
	}
	if(this.printKey){
		console.log("press: "+key);
	}
	//for(var obj in this.keyListens){
	for(var obj = 0; obj < this.keyListens.length; obj++){
		if(this.keyListens[obj] != null){
			this.keyListens[obj].onKeyPress(key);
		}
	}
	if(e.keyCode == 8 || e.keyCode == 32){
		//e.preventDefault();
	}
}