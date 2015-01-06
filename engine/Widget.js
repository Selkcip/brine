/**
 * Creates a new instance of Widget.
 * 
 * @class Widgets allow you to add HTML elements on top of the game canvas without blocking input to the game. Each widget is a free-floating div element that can have any HTML content added to it.
 * @param {string} html Initial HTML content for the widget.
 * @param {number} x Initial x position of the widget.
 * @param {number} y Initial y position of the widget.
 * @param {number} width Initial width of the widget.
 * @param {number} height Initial height of the widget.
 * @property {number} x Sets/gets the widget's x position.
 * @property {number} y Sets/gets the widget's y position.
 * @property {number} top Sets/gets the widget's position so that its top edge is at the given position.
 * @property {number} bottom Sets/gets the widget's position so that its bottom edge is at the given position.
 * @property {number} left Sets/gets the widget's position so that its left edge is at the given position.
 * @property {number} right Sets/gets the widget's position so that its right edge is at the given position.
 * @property {number} width Sets/gets the widget's width.
 * @property {number} height Sets/gets the widget's height.
 * @property {string} html Sets/gets the HTML code for the widget's content div.
 * @property {div} content The content div of the widget. This has all of the properties any HTML div would have.
 * @property {div style} style The style object of the content div of the widget. This has all of the properties any HTML style object would have.
 */
function Widget(html, x, y, width, height){
	var div = document.createElement('div');
	this.div = div;
	
	var content = document.createElement('div');
	div.appendChild(content);
	this.content = content;
	this.style = content.style;
	
	this.html = html;
	
	div.style.position = "absolute";
	//div.style.overflow = "auto";
	//div.style.margin = "auto";
	//div.style.border = "solid thin white";
	//div.style.display = "inline-block";
	//div.style.float = "left";
	
	content.style.overflow = "auto";
	content.style.color = "#000000";
	
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.state = null;
	
	var widget = this;
	window.addEventListener("mouseup", function(){widget.dragging = false;}, false);
	
	/*this.div.draggable = true;
	var curWidget = this;
	this.div.ondragstart = function(e){curWidget.startDrag(e);};
	this.div.ondrag = function(e){curWidget.drag(e);};
	this.div.ondragend = function(e){curWidget.stopDrag(e);};//function(d){println("hello");}*/
}

Widget.prototype.x = 0;
Widget.prototype.y = 0;
Widget.prototype.top = 0;
Widget.prototype.bottom = 0;
Widget.prototype.left = 0;
Widget.prototype.right = 0;
Widget.prototype.width = 0;
Widget.prototype.height = 0;
Widget.prototype.html = "";
Widget.prototype.content = document.createElement('div');
Widget.prototype.style = Widget.prototype.content.style;

Widget.prototype = {
	get top(){
		var strVal = this.div.style.top;
		return strVal.substr(0,strVal.length-2);
	},
	set top(val){
		this.div.style.top = val;
		this.div.style.bottom = "";
	},
	
	get bottom(){
		var strVal = this.div.style.bottom;
		return strVal.substr(0,strVal.length-2);
	},
	set bottom(val){
		this.div.style.bottom = val;
		this.div.style.top = "";
	},
	
	get left(){
		var strVal = this.div.style.left;
		return strVal.substr(0,strVal.length-2);
	},
	set left(val){
		this.div.style.left = val;
		this.div.style.right = "";
	},
	
	get right(){
		var strVal = this.div.style.right;
		return strVal.substr(0,strVal.length-2);
	},
	set right(val){
		this.div.style.right = val;
		this.div.style.left = "";
	},
	
	get x(){
		return this.div.offsetLeft;
	},
	set x(val){
		if(this.limitXY && exists(this.div.parentNode)){
			val = Math.max(val, this.minX);
			val = Math.min(val, this.div.parentNode.offsetWidth-this.maxX);
		}
		this.left = val;
	},
	
	get y(){
		return this.div.offsetTop;
	},
	set y(val){
		if(this.limitXY && exists(this.div.parentNode)){
			val = Math.max(val, this.minY);
			val = Math.min(val, this.div.parentNode.offsetHeight-this.maxY);
		}
		this.top = val;
	},
	
	get width(){
		//println(this.content.offsetWidth);
		var strVal = this.style.width;
		return this.div.offsetWidth;//strVal.substr(0,strVal.length-2);
	},
	set width(val){
		this.style.width = val;
	},
	
	get height(){
		var strVal = this.style.height;
		return this.div.offsetHeight;//strVal.substr(0,strVal.length-2);
	},
	set height(val){
		this.style.height = val;
	},
	
	get html(){
		return this.content.innerHTML;
	},
	set html(val){
		this.content.innerHTML = val;
	},
	
	get hidden(){
		return this.div.style.visibility != "hidden" && this.height == 0;
	},
	set hidden(val){
		if(!val){
			this.div.style.visibility = "hidden";
			this.hiddenHeight = this.height;
			this.height = 0;
		}else{
			this.div.style.visibility = "visible";
			if(this.height == 0){
				this.height = this.hiddenHeight;
			}
		}
	},
	
	get visible(){
		return this.div.style.visibility != "hidden";
	},
	set visible(val){
		if(!val){
			this.div.style.visibility = "hidden";
		}else{
			this.div.style.visibility = "visible";
		}
	},
}

Widget.prototype.div = document.createElement('div');
Widget.prototype.content = document.createElement('div');
Widget.prototype.style = Widget.prototype.div.style;
Widget.prototype.dragger = null;
Widget.prototype.dragging = false;
Widget.prototype.dragX = 0;
Widget.prototype.dragY = 0;
Widget.prototype.limitXY = true;
Widget.prototype.minX = 0;
Widget.prototype.maxX = 0;
Widget.prototype.minY = 0;
Widget.prototype.maxY = 0;
Widget.prototype.hiddenWidth = 0;
Widget.prototype.hiddenHeight = 0;

/**
 * Appends the widget to the given div.
 * 
 * @param {Object} div The div to append to.
 */
Widget.prototype.addTo = function(div){
	return div.appendChild(this.div);
}

/**
 * Removes the widget from the given div.
 * 
 * @param {Object} div The div to remove from.
 */
Widget.prototype.removeFrom = function(div){
	div = div ? div : this.div.parentNode;
	if(div != null){
		return div.removeChild(this.div);
	}
	
	if(this.state != null){
		this.state.widgets.remove(this);
	}
}

/**
 * Appends an HTML element to the content div.
 * 
 * @param {Object} child The element to be append.
 */
Widget.prototype.appendChild = function(child){
	return this.content && child ? this.content.appendChild(child) : undefined;
}

/**
 * Removes an HTML element from the content div.
 * 
 * @param {Object} child The element to be removed.
 */
Widget.prototype.removeChild = function(child){
	return this.content && child ? this.content.removeChild(child) : undefined;
}

/**
 * Creates a new HTML element, appends it to the content div (or parent if specified), and returns a reference to it.
 * 
 * @param {Object} type The type of element to create.
 * @param {Object} parent Optional: An alternative parent element to append the new element to.
 * @return {Object} The new element.
 */
Widget.prototype.add = function(type, parent){
	var element = document.createElement(type);
	if(parent != undefined){
		return parent.appendChild(element);
	}
	return this.appendChild(element);
}

/**
 * Sets then given element as this widget's dragger. When the given element is dragged the widget will drag with it.
 * 
 * @param {Object} obj The element that will initiate drags on the widget.
 */
Widget.prototype.setDragger = function(obj){
	if(this.dragger != null){
		this.dragger.style.cursor = "auto";
		this.dragger.onmousedown = null;
		this.dragger.onmouseup = null;
	}
	if(obj != null){
		var curWidget = this;
		obj.style.cursor = "move";
		obj.onmousedown = function(){
			curWidget.startDrag()
		}
		obj.onmouseup = function(){
			curWidget.stopDrag();
		}
	}
	this.dragger = obj;
}

Widget.prototype.startDrag = function(e){
	this.dragging = true;
	this.dragX = this.x-gInput.mouse.x;
	this.dragY = this.y-gInput.mouse.y;
}

Widget.prototype.drag = function(e){
	//gInput.mouseMove(e);
	this.x = gInput.mouse.x+this.dragX;
	this.y = gInput.mouse.y+this.dragY;
}

Widget.prototype.whileDragging = function(e){
}

Widget.prototype.stopDrag = function(e){
	if(this.dragging){
		this.x = gInput.mouse.x+this.dragX;
		this.y = gInput.mouse.y+this.dragY;
	}
	this.dragging = false;
}

Widget.prototype.update = function(d){
	//println(gInput.lBtn)
	if(this.dragging){
		this.x = gInput.mouse.x+this.dragX;
		this.y = gInput.mouse.y+this.dragY;
		this.whileDragging();
	}
}