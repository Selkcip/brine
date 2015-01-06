/**
 * Creates a new canvas based GUI. These are more limited than HTML GUIs but may be desireable in some cases (eg you want post processes to affect some text).
 * Registers some listeners with the given input object.
 * 
 * @constructor
 * @param {Input} The input object that this GUI should use for input listeners.
 */
function GUI(input){
	//this.init();
	Sprite.call(this);
	this.input = input;
	input.addMouseDownListener(this);
	input.addMouseUpListener(this);
	input.addMouseMoveListener(this);
	input.addKeyboardListener(this);
}

GUI.prototype = new Sprite();
GUI.prototype.focus = null;

/**
 * Internal engine function.
 * Called while the left mouse button is pressed. 
 */
GUI.prototype.onMouseDown = function(button){
	if(this.visible){
		if(button == 0){
			if(this.focus != null){
				this.focus.focused = false;
				this.focus.blur();
				this.focus = null;
			}
			this.children.foreach(this.childMouseDown, {gui:this, mouse:this.input.mouse.sub(this.pos)});
		}
	}
}

/**
 * Internal engine function.
 * Called by onMouseDown.
 */
GUI.prototype.childMouseDown = function(child, params){
	if(child.onMouseDown != undefined){
		if(child.bbox.checkPoint(params.mouse)){
			params.gui.focus = child;
			child.focused = true;
			child.focus();
			child.onMouseDown();
		}
	}
}

/**
 * Internal engine function.
 * Called when the left mouse button is released. 
 */
GUI.prototype.onMouseUp = function(button){
	//println(this.children);
	if(this.visible){
		if(button == 0){
			/*if(this.focus != null){
				this.focus.focused = false;
				this.focus.blur();
				this.focus = null;
			}*/
			this.children.foreach(this.childMouseUp, {gui:this, mouse:this.input.mouse.sub(this.pos)});
		}
	}
}

/**
 * Internal engine function.
 * Called by onMouseUp.
 */
GUI.prototype.childMouseUp = function(child, params){
	if(child.onMouseUp != undefined){
		if(child.bbox.checkPoint(params.mouse)){
			//params.gui.focus = child;
			child.onMouseUp();
			//child.focused = true;
			//child.focus();
		}else{
			child.blur();
		}
	}
}

/**
 * Internal engine function.
 * Called when the mouse is moved. 
 */
GUI.prototype.onMouseMove = function(){
	if(this.visible){
		this.children.foreach(this.childMouseMove, {mouse:this.input.mouse.sub(this.pos)});
	}
}

/**
 * Internal engine function.
 * Called by onMouseMove.
 */
GUI.prototype.childMouseMove = function(child, params){
	if(child.onMouseIn != undefined && child.onMouseOut != undefined){
		if(child.bbox.checkPoint(params.mouse)){
			child.onMouseIn();
		}else{
			child.onMouseOut();
		}
	}
}

/**
 * Internal engine function.
 * Called when a key is held down. 
 */
GUI.prototype.onKeyDown = function(key){
	if(this.visible){
		//this.children.foreach(this.childKeyDown, {mouse:this.input.mouse.sub(this.pos)});
		//println(this.focus);
		if(this.focus != null  && this.focus.onKeyDown){
			this.focus.onKeyDown(key);
		}
	}
}

/**
 * Internal engine function.
 * Called when a key is pressed. 
 */
GUI.prototype.onKeyPress = function(key){
	if(this.visible){
		//this.children.foreach(this.childKeyDown, {mouse:this.input.mouse.sub(this.pos)});
		//println(this.focus);
		if(this.focus != null && this.focus.onKeyPress){
			this.focus.onKeyPress(key);
		}
	}
}

/**
 * Creates a generic GUI element.
 * 
 * @class This is the base class for other GUI elements.
 * @extends Sprite
 * @property {string} color Hex value of the element's color.
 * @property {bool} dropShadow Should this element have a shadow.
 * @property {bool} center Should this element be centered.
 * @property {bool} focused Does this element have focus.
 * @property {bool} mouseOver Is the mouse currently over this element.
 */
function GUIElement(){
	Sprite.call(this);
}

GUIElement.prototype = new Sprite();
GUIElement.prototype.color = "#000000";
GUIElement.prototype.drawColor = "#000000";
GUIElement.prototype.dropShadow = false;
GUIElement.prototype.center = false;
GUIElement.prototype.focused = false;
GUIElement.prototype.mouseOver = false;

/**
 * Internal engine function.
 * Sets the element as focused.
 */
GUIElement.prototype.focus = function(){
	this.focused = true;
}

/**
 * Internal engine function.
 * Sets the element as blurred.
 */
GUIElement.prototype.blur = function(){
	this.focused = false;
}

/**
 * Creates a new text box.
 * 
 * @class Text boxes can be used to display text or to input text. For lots of input you should use the HTML GUI.
 * @extends GUIElement
 * @param {string} text The default text to display.
 * 
 * @property {string} text The current text.
 * @property {number} minWidth The minimum width this box can have. If the text property is empty the box will still maintain this width.
 * @property {number} fontSize The font size of the displayed text.
 * @property {string} font The name of font to use for the displayed text.
 * @property {bool} drawBG Should the background be filled.
 * @property {string} bgColor The background color of the text box in its initial state.
 * @property {string} bgFocusColor The background color of the text box when it has focus.
 * @property {string} borderColor The border color of the text box in its initial state.
 * @property {string} borderFocusColor The border color of the text box when it has focus.
 * @property {number} border Border width.
 * @property {number} padTop The amount of internal padding at the top of the text box.
 * @property {number} padLeft The amount of internal padding at the left of the text box.
 * @property {number} padRight The amount of internal padding at the right of the text box.
 * @property {number} padBottom The amount of internal padding at the bottom of the text box.
 * @property {bool} editable Can users edit the contents of the text box.
 * @property {bool} clearOnFocus Is the contents cleared when the text box is given focus.
 */
function TextBox(text){
	//this.init();
	GUIElement.call(this);
	if(text != undefined){
		this.text = text;
	}
	
	this.bufferColor = this.color;
	
	this.bbox = new BRect(0, 0, 1, 1);
	
	//Create second canvas to draw to improve text performance
	this.buffer = document.createElement("canvas");
	this.bctx = this.buffer.getContext("2d");
}

TextBox.prototype = new GUIElement();
TextBox.prototype.text = "";
TextBox.prototype.textBuffer = "";
TextBox.prototype.minWidth = 75;
TextBox.prototype.fontSize = 16;
TextBox.prototype.font = "Arial";
//TextBox.prototype.color = "#000000";
TextBox.prototype.bgColor = "#ffffff";
TextBox.prototype.bgDrawColor = "#ffffff";
TextBox.prototype.bgFocusColor = "#ccffcc";
TextBox.prototype.borderColor = "#000000";
TextBox.prototype.borderDrawColor = "#000000";
TextBox.prototype.borderFocusColor = "#ff0000";
TextBox.prototype.drawBG = false;
TextBox.prototype.border = 0;
//TextBox.prototype.dropShadow = false;
//TextBox.prototype.center = false;
TextBox.prototype.padTop = 2;
TextBox.prototype.padLeft = 2;
TextBox.prototype.padRight = 2;
TextBox.prototype.padBottom = 2;
TextBox.prototype.editable = false;
TextBox.prototype.clearOnFocus = false;
TextBox.prototype.oldText = "";

/**
 * Calculates the dimensions of the textbox based on its minWidth and padding properties and its current text content.
 * 
 * @return {Vector} A vector containing the text box's dimensions. 
 */
TextBox.prototype.getDims = function(){
	this.bctx.font = this.fontSize+"px "+this.font;
	this.bctx.textBaseline = "middle";
	var textWidth = this.maxLineWidth();//this.bctx.measureText(this.text).width;
	var textHeight = this.numLines()*this.fontSize;
	//return new Vector(textWidth+this.padLeft+this.padRight, this.padTop+this.padBottom+this.fontSize, 0);
	//return new Vector(Math.max(this.minWidth, textWidth+this.padLeft+this.padRight), this.padTop+this.padBottom+this.fontSize, 0);
	return new Vector(Math.max(this.minWidth, textWidth+this.padLeft+this.padRight), this.padTop+this.padBottom+textHeight, 0);
}

TextBox.prototype.maxLineWidth = function(){
	this.bctx.font = this.fontSize+"px "+this.font;
	this.bctx.textBaseline = "middle";
	var lines = (""+this.text).split("\n");
	var maxWidth = 0;
	for(var line in lines){
		line = lines[line];
		maxWidth = Math.max(maxWidth, this.bctx.measureText(line).width);
	}
	return maxWidth;
}

TextBox.prototype.numLines = function(){
	var lines = (""+this.text).split("\n");
	return lines.length;
}

TextBox.prototype.onMouseDown = function(){
	//this.drawColor = this.downColor;
	//println("textbox down");
}

TextBox.prototype.onMouseUp = function(){
	//println("textbox up");
}

TextBox.prototype.onMouseIn = function(){
	//this.mouseOver = true;
	//this.drawColor = this.upColor;
}

TextBox.prototype.onMouseOut = function(){
	//this.mouseOver = false;
	//this.drawColor = this.color;
}

TextBox.prototype.onKeyDown = function(key){
	if(key == 8){
		this.text = this.text.substr(0, this.text.length-1);
	}
}

TextBox.prototype.onKeyPress = function(key){
	var char = String.fromCharCode(key);
	//println(char);
	if(key != 8){
		this.text += char;
	}else{
		//this.text = this.text.substr(0, this.text.length-1);
	}
}

TextBox.prototype.focus = function(){
	this.focused = true;
	if(this.clearOnFocus){
		this.minWidth = this.getDims().x;
		this.oldText = this.text;
		this.text = "";
	}
}

TextBox.prototype.blur = function(){
	this.focused = false;
	if(this.clearOnFocus && this.text == ""){
		this.text = this.oldText;
	}
}

/*
TextBox.prototype.redraw = function(dims){
	//var dims = this.getDims();
	this.buffer.width = dims.x;
	this.buffer.height = dims.y;
	var bctx = this.bctx;//this.buffer.getContext("2d");
	
	bctx.font = this.fontSize+"px "+this.font;
	//bctx.font = "16px 'Bangers'";
	bctx.textBaseline = "middle";
	var textWidth = bctx.measureText(this.text).width;
	
	this.width = dims.x;
	this.height = dims.y;
	
	var textXOff = 0;
	var xoff = 0;
	var yoff = 0;
	if(this.center){
		textXOff = -(textWidth+this.padLeft+this.padRight)/2;
		xoff = -dims.x/2;
		yoff = -dims.y/2;
	}
	
	if(this.editable && this.focused){
		this.bgDrawColor = this.bgFocusColor;
		this.borderDrawColor = this.borderFocusColor;
	}else{
		this.bgDrawColor = this.bgColor;
		this.borderDrawColor = this.borderColor;
	}
	
	if(this.drawBG){
		bctx.fillStyle = this.bgDrawColor;
		bctx.fillRect(0, 0, dims.x, dims.y);
	}
	if(this.border > 0){
		bctx.lineWidth = this.border;
		bctx.strokeStyle = this.borderDrawColor;
		bctx.strokeRect(0, 0, dims.x, dims.y);
		bctx.lineWidth = 1;
	}
	if(this.dropShadow){
		bctx.shadowBlur = 3;
		bctx.shadowColor = "#000000";
	}
	bctx.fillStyle = this.color;
	//bctx.fillText(this.text, this.padLeft, this.padTop-this.fontSize*(0.094-(this.fontSize/(this.fontSize*this.fontSize))));
	//bctx.fillText(this.text, this.padLeft, this.padTop+this.fontSize/2);
	var lines = this.text.split("\n");
	var textXOff = this.padLeft;
	var textYoff = this.padTop+this.fontSize*0.5;
	for(var i = 0; i < lines.length; i++){
		var line = lines[i];
		if(this.center){
			textXOff = (dims.x-bctx.measureText(line).width)/2;
		}
		bctx.fillText(line, textXOff, textYoff+this.fontSize*i);
	}
	bctx.shadowBlur = 0;
	
	this.image = this.buffer;
	Textures.createTexture(this.image);
}*/

TextBox.prototype.redraw = function(dims){
	//var dims = this.getDims();
	this.buffer.width = dims.x;
	this.buffer.height = dims.y;
	var bctx = this.bctx;//this.buffer.getContext("2d");
	
	bctx.font = this.fontSize+"px "+this.font;
	//bctx.font = "16px 'Bangers'";
	bctx.textBaseline = "middle";
	var textWidth = bctx.measureText(this.text).width;
	
	this.width = dims.x;
	this.height = dims.y;
	
	var textXOff = 0;
	var xoff = 0;
	var yoff = 0;
	if(this.center){
		textXOff = -(textWidth+this.padLeft+this.padRight)/2;
		xoff = -dims.x/2;
		yoff = -dims.y/2;
		
		this.xoffset = -dims.x/2;
		this.yoffset = -dims.y/2;
	}
	
	if(this.editable && this.focused){
		this.bgDrawColor = this.bgFocusColor;
		this.borderDrawColor = this.borderFocusColor;
	}else{
		this.bgDrawColor = this.bgColor;
		this.borderDrawColor = this.borderColor;
	}
	
	if(this.drawBG){
		bctx.fillStyle = this.bgDrawColor;
		bctx.fillRect(0, 0, dims.x, dims.y);
	}
	if(this.border > 0){
		bctx.lineWidth = this.border;
		bctx.strokeStyle = this.borderDrawColor;
		bctx.strokeRect(0, 0, dims.x, dims.y);
		bctx.lineWidth = 1;
	}
	if(this.dropShadow){
		bctx.shadowBlur = 3;
		bctx.shadowColor = "#000000";
	}
	bctx.fillStyle = this.color;
	//bctx.fillText(this.text, this.padLeft, this.padTop-this.fontSize*(0.094-(this.fontSize/(this.fontSize*this.fontSize))));
	//bctx.fillText(this.text, this.padLeft, this.padTop+this.fontSize/2);
	var lines = (""+this.text).split("\n");
	var textXOff = this.padLeft;
	var textYoff = this.padTop+this.fontSize*0.5;
	for(var i = 0; i < lines.length; i++){
		var line = lines[i];
		if(this.center){
			textXOff = (dims.x-bctx.measureText(line).width)/2;
		}
		bctx.fillText(line, textXOff, textYoff+this.fontSize*i);
	}
	bctx.shadowBlur = 0;
	
	this.image = this.buffer;
	Textures.createTexture(this.image);
}

TextBox.prototype.draw = function(context){
	var dims = this.getDims();
	
	var xoff = 0;
	var yoff = 0;
	if(this.center){
		xoff = -dims.x/2;
		yoff = -dims.y/2;
	}
	
	this.bbox.pos.x = this.x+xoff;
	this.bbox.pos.y = this.y+yoff;
	this.bbox.dims.x = dims.x;
	this.bbox.dims.y = dims.y;
	
	//this.offsetX = xoff;
	//this.offsetY = yoff;
	
	if(this.text != this.textBuffer || dims.x != this.bufferDimX || this.color != this.bufferColor){
		//println("redrawing text");
		this.redraw(dims);
		this.textBuffer = this.text;
		this.bufferDimX = dims.x;
		this.bufferColor = this.color;
	}
	//this.image = this.buffer;
	//context.drawImage(this.buffer, xoff, yoff);
	//context.drawSprite(this);
	Sprite.prototype.draw.call(this, context);
}

TextBox.prototype.transform = function(ctx){
	if(this.center){
		var dims = this.getDims();
		this.offsetX = -dims.x/2;
		this.offsetY = -dims.y/2;
	}
	Sprite.prototype.transform.call(this, ctx);
}

/**
 * Creates a new Button.
 * 
 * @class A blank button. Since GUIElement extends Sprite buttons can use a texture that might have text or a symbol.
 * However, clicks are checked against a bounding box and not the texture's pixels. There is also no support for
 * switching textures when the button is moused over or pressed.
 * @extends GUIElement
 * @param {function} func The function to be called when the button is pressed.
 * 
 * @property {function} func The function to be called when the button is pressed.
 * @property {BBox} bbox The bounding box used for click/mouseover detection.
 * @property {bool} drawBG Should the background be filled.
 * @property {string} color The background color of the button in its initial state.
 * @property {string} upColor The background color of the button when the mouse is hovering over it.
 * @property {string} downColor The background color of the button when it is pressed.
 */
function Button(func){
	//this.init();
	GUIElement.call(this);
	this.func = func;
	this.bbox = new BRect(0, 0, 1, 1);
	this.color = "#ffffff";
	this.upColor = "#ccffcc";
	this.downColor = "#ccccff";
	this.drawColor = this.color;
	this.drawBG = true;
}

Button.prototype = new GUIElement();

Button.prototype.onMouseDown = function(){
	this.drawColor = this.downColor;
}

Button.prototype.onMouseUp = function(){
	this.drawColor = this.upColor;
	if(this.focused && this.func != undefined){
		this.func();
	}
	this.blur();
}

Button.prototype.onMouseIn = function(){
	this.mouseOver = true;
	if(!this.focused){
		this.drawColor = this.upColor;
	}
}

Button.prototype.onMouseOut = function(){
	this.mouseOver = false;
	this.drawColor = this.color;
}

Button.prototype.update = function(delta){
	/*this.bbox.x = this.x;
	this.bbox.y = this.y;
	this.bbox.width = this.width;
	this.bbox.height = this.height;*/
}

Button.prototype.draw = function(context){
	var xoff = 0;
	var yoff = 0;
	if(this.center){
		xoff = -this.width/2;
		yoff = -this.height/2;
		//this.label.x = xoff;
		//this.label.y = yoff;
		//this.label.center = true;
	}
	
	this.bbox.pos.x = this.x+xoff;
	this.bbox.pos.y = this.y+yoff;
	this.bbox.dims.x = this.width;
	this.bbox.dims.y = this.height;
	
	if(this.dropShadow){
		context.shadowBlur = 3;
		context.shadowColor = "#000000";
	}
	context.fillStyle = this.drawColor;
	if(this.drawBG && use2D && (this.image.loaded == undefined || !this.image.loaded)){
		context.fillRect(xoff, yoff, this.width, this.height);
	}
	context.shadowBlur = 0;
	Sprite.prototype.draw.call(this,ctx);
}

/**
 * Creates a new TextButton.
 * 
 * @class A button with a label.
 * @extends Button
 * @param {string} label The label to be displayed on the button.
 * @param {function} func The function to be called when the button is pressed.
 * 
 * @property {TextBox} label A TextBox used as the button's label.
 * @property {string} lableColor The text color of the label in its initial state.
 * @property {string} labelUpColor The text color of the label when the mouse is hovering over it.
 * @property {string} labelDownColor The text color of the label when the button is pressed.
 */
function TextButton(label, func){
	//this.init();
	GUIElement.call(this);
	this.label = new TextBox(label);
	this.label.minWidth = 0;
	this.addChild(this.label);
	this.width = this.label.getDims().x;
	this.height = this.label.getDims().y;
	this.bbox = new BRect(0, 0, this.width, this.height);
	this.func = func;
	
	this.labelColor = "#000000";
	this.labelUpColor = "#000000";
	this.labelDownColor = "#000000";
	this.labelDrawColor = this.label.color;
}

TextButton.prototype = new Button();

/**
 * Sets the label colors for the different button states.
 * 
 * @param {Object} normal Neutral button color.
 * @param {Object} down Press button color.
 * @param {Object} up Hovered button color.
 */
TextButton.prototype.setLabelColors = function(normal, down, up){
	this.labelColor = normal;
	this.labelUpColor = down;
	this.labelDownColor = up;
	this.labelDrawColor = normal;
	
	this.label.color = normal;
}

TextButton.prototype.onMouseDown = function(){
	this.label.color = this.labelDownColor;
	Button.prototype.onMouseDown.call(this);
}

TextButton.prototype.onMouseUp = function(){
	this.label.color = this.labelUpColor;
	Button.prototype.onMouseUp.call(this);
}

TextButton.prototype.onMouseIn = function(){
	if(!this.focused){
		this.label.color = this.labelUpColor;
	}
	Button.prototype.onMouseIn.call(this);
}

TextButton.prototype.onMouseOut = function(){
	this.label.color = this.labelColor;
	Button.prototype.onMouseOut.call(this);
}

TextButton.prototype.draw = function(context){
	if(this.center){
		this.label.center = true;
	}
	
	this.width = this.label.getDims().x;
	this.height = this.label.getDims().y;

	Button.prototype.draw.call(this, context);
}