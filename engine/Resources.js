/**
 * Creates a new instance of ResourceMonitor or returns the singleton instance.
 * 
 * @class Singleton that keeps track of loading resources. By default there is a global reference called Resources.
 * @property {ResourceMonitor} instance The singlton instance.
 * @property {number} totalItems The total number of items that have been requested for loading.
 * @property {number} leftToLoad The number of items that are still loading.
 */
function ResourceMonitor(){
	if(ResourceMonitor.prototype.instance){
		return ResourceMonitor.prototype.instance;
	}
	ResourceMonitor.prototype.instance = this;
	this.loadList = new List();
	this.totalItems = 0;
	this.leftToLoad = 0;
}

ResourceMonitor.prototype.instance = null;
ResourceMonitor.prototype.loadList = new List();
ResourceMonitor.prototype.totalItems = 0;
ResourceMonitor.prototype.leftToLoad = 0;

ResourceMonitor.prototype.addToLoad = function(){
	this.totalItems++;
	this.leftToLoad++;
}

/**
 * Returns the number of items that are still loading.
 * 
 * @return {number} The number of items left to load.
 */
ResourceMonitor.prototype.getLeftToLoad = function(){
	for(var font in Fonts.fonts){
	//for(var font = 0; font < Fonts.fonts.length; font++){
		if(!Fonts.fonts[font].loaded){
			Fonts.fonts[font].checkIfLoaded();
		}
	}
	return this.leftToLoad;
}

/**
 * Returns the percentage of loaded items.
 * 
 * @return {number} The percentage.
 */
ResourceMonitor.prototype.percentLoaded = function(){
	for(var font in Fonts.fonts){
	//for(var font = 0; font < Fonts.fonts.length; font++){
		if(!Fonts.fonts[font].loaded){
			Fonts.fonts[font].checkIfLoaded();
		}
	}
	return this.leftToLoad/this.totalItems;
}

var Resources = new ResourceMonitor();

/**
 * Creates a new instance of TextureManager or returns the singleton instance.
 * 
 * @class Singleton that manages image loading, texture creation, and texture reuse. By default there is a global reference called Textures.
 * @property {TextureManager} instance The singlton instance.
 * @property {Array<Images>} imgs Array of loaded images indexed by their src.
 */
function TextureManager(){
	if(TextureManager.prototype.instance){
		return TextureManager.prototype.instance;
	}
	TextureManager.prototype.instance = this;
	this.imgs = new Array();
	this.waitingList = new List();
}

TextureManager.prototype.instance = null;
TextureManager.prototype.imgs = new Array();
TextureManager.prototype.waitingList = new List();

/**
 * Returns an image if it is already loaded, otherwise it starts loading the image source and returns a new image.
 * 
 * @param {string} src The image source to be loaded.
 * @param {bool} crossDomain Optional: If the image is not in the same domain as the calling script this must be true.
 * @param {bool} logOnLoad Optional: If true a debug statement is printed when it finishes loading.
 * @return {Image} The image object that the requested source will be loaded into.
 */
TextureManager.prototype.load = function(src, crossDomain, logOnLoad){
	if(this.imgs[src] == undefined){
		Resources.addToLoad();
		this.imgs[src] = new Image();
		this.imgs[src].loaded = false;
		if(crossDomain){
			this.imgs[src].crossOrigin = "anonymous";
		}
		this.imgs[src].src = src;
		this.imgs[src].oSrc = src;
		this.imgs[src].onload = function(){
			//if(logOnLoad == undefined || logOnLoad){
			if(logOnLoad){
				println(this.src+" loaded");
			}
			Resources.leftToLoad--;
			if(!Textures.createTexture(this)){
				Textures.waitingList.push(this);
			}
			this.loaded = true;
		}
		this.imgs[src].onabort = function(){
			alert("there was an error");
		}
	}
	return this.imgs[src];
}

TextureManager.prototype.create = function(){
	this.waitingList.foreach(this.createTexture);
}

/**
 * Creates a WebGL texture from the given image. Can also create a texure out of a canvas object allowing the use of 2D canvas drawings or text as textures.
 * image.texture is set to this new texture
 * 
 * @param {Image} image The image to use as the texture data.
 * @return {bool} Returns true if the texture was created successfully.
 */
TextureManager.prototype.createTexture = function(image){
	if(ctx != undefined){
		if(ctx.createTexture){
			var texture = image.texture;
			if(texture == undefined){
				texture = ctx.createTexture();
			}
			texture.image = image;
			ctx.bindTexture(ctx.TEXTURE_2D, texture);
			ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
			ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
			ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, texture.image);
			//ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
			//ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
			
			ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
			ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
			ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
			ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
			//ctx.generateMipmap(ctx.TEXTURE_2D);
			
			ctx.bindTexture(ctx.TEXTURE_2D, null);
			image.texture = texture;
			
			image.setFilters = function(min, mag){
				mag = mag ? mag : min;
				ctx.bindTexture(ctx.TEXTURE_2D, this.texture);
				ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, mag);
				ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, min);
			}
			
			return true;
		}
	}
	return false;
}

var Textures = new TextureManager();

/**
 * Creates a new instance of SoundManager or returns the singleton instance.
 * 
 * @class Singleton that manages sound loading and playing. By default there is a global reference called Sounds.
 * @property {SoundManager} instance The singlton instance.
 * @property {Array<Audio>} snds Array of loaded sounds indexed by their src.
 * @property {bool} muted The muted state of all sounds. Use toggleMuted() to change state.
 */
function SoundManager(){
	if(SoundManager.prototype.instance){
		return SoundManager.prototype.instance;
	}
	SoundManager.prototype.instance = this;
	this.snds = new Array();
	this.muted = false;
}

SoundManager.prototype.instance = null;
SoundManager.prototype.snds = new Array();
SoundManager.prototype.muted = false;

//Returns a sound if it is already loaded and there is a sound object that is not playing (creates a pool of sound objects), otherwise it starts loading the sound source and returns a new sound
SoundManager.prototype.load = function(src){
	if(this.snds[src] == undefined){
		Resources.addToLoad();
		this.snds[src] = new List();
		return Sounds.makeNewAudio(src, true);
	}
	for(var node = this.snds[src].head; node != null; node = node.link){
		var snd = node.item;
		//if(!snd.isPlaying){
		if(!snd.isPlaying || snd.currentTime == snd.duration){
			snd.src = src;
			//snd.currentTime = 0;
			return snd;
		}
	}
	return Sounds.makeNewAudio(src, false);
}

SoundManager.prototype.makeNewAudio = function(src, loading){
	var newAudio = new Audio();
	newAudio.loaded = false;
	newAudio.isPlaying = false;
	newAudio.muted = Sounds.muted;
	
	newAudio.addEventListener("canplaythrough", function(){ 
	//newAudio.oncanplaythrough = function(e){
		if(loading && !this.loaded){
			println(this.src+" loaded");
			Resources.leftToLoad--;
			this.loaded = true;
		}
	}
	, false);
	
	var audioProto = newAudio.constructor.prototype;
	newAudio.play = function(){
		this.isPlaying = true;
		audioProto.play.call(this);
	}
	newAudio.pause = function(){
		this.isPlaying = false;
		audioProto.pause.call(this);
	}
	newAudio.ended = function(){
		this.isPlaying = false;
		//println("ended");
		//Audio.pause.call(this);
	}
	newAudio.src = src;
	Sounds.snds[src].push(newAudio);
	return newAudio;
}

//Creates a new audio object
SoundManager.prototype.play = function(src){
	var audio = this.load(src);
	audio.play();
	//println(Sounds.snds[src].length);
	return audio;
}

SoundManager.prototype.loop = function(src){
	var audio = this.load(src);
	//audio.loop = true;
	audio.addEventListener('ended', function(){
		//audio.currentTime = 0;
		this.src = this.src;
		this.play();
	});
	audio.play();
	return audio;
}

SoundManager.prototype.toggleMuted = function(){
	this.muted = !this.muted;
	for(src in Sounds.snds){
	//for(var i=0; i < Sounds.snds.length; i++){
		Sounds.snds[src].foreach(toggleSounds,{});
	}
}

function toggleSounds(sound, params){
	sound.muted = Sounds.muted;
}

var Sounds = new SoundManager();

/**
 * Creates a new instance of FontManager or returns the singleton instance.
 * 
 * @class Singleton that manages font loading. By default there is a global reference called Fonts.
 * @property {FontManager} instance The singlton instance.
 * @property {Array<Div>} fonts Array of divs where the div's font is set to each loaded font indexed by font name.
 */
function FontManager(){
	if(FontManager.prototype.instance){
		return FontManager.prototype.instance;
	}
	FontManager.prototype.instance = this;
	this.fonts = new Array();
}

FontManager.prototype.instance = null;
FontManager.prototype.fonts = new Array();

/**
 * Makes sure the given font is loaded.
 * 
 * @param {string} fontName The font to be loaded.
 * @return {bool} True if the font is loaded.
 */ 
FontManager.prototype.load = function(fontName){
	if(Fonts.fonts[fontName] == undefined){
		Resources.addToLoad();
		var fontDiv = document.createElement("p");
		fontDiv.loaded = false;
		fontDiv.font = fontName;
		fontDiv.innerHTML = "AAAAAAAAAA";
		fontDiv.style.position = "absolute";
		fontDiv.style.visibility = "hidden";
		fontDiv.style.top = 0;
		fontDiv.style.display = "inline-block";
		fontDiv.style.font = "20px "+fontName+",cursive";
		fontDiv.checkIfLoaded = function(){
			document.body.appendChild(this);
			this.style.font = "20px Arial,cursive";
			println(this.offsetWidth);
			var preWidth = this.offsetWidth;
			this.style.font = "20px "+this.font+",cursive";
			println(this.offsetWidth);
			if(this.offsetWidth != preWidth){
				this.loaded = true;
				Resources.leftToLoad--;
				return true;
			}
			document.body.removeChild(this);
			return false;
		}
		Fonts.fonts[fontName] = fontDiv;
	}
	//return Fonts.fonts[fontName].checkIfLoaded();
}

var Fonts = new FontManager();

/**
 * Creates a new instance of FileManager or returns the singleton instance.
 * 
 * @class Singleton that manages file loading. By default there is a global reference called Files.
 * @property {FileManager} instance The singlton instance.
 * @property {Array<Object{text,xml}>} files Array of objects. Each object has a plain text (.text) version of the file as well as an XML (.xml) version.
 */
function FileManager(){
	if(FileManager.prototype.instance){
		return FileManager.prototype.instance;
	}
	FileManager.prototype.instance = this;
	this.files = new Array();
}

FileManager.prototype.instance = null;
FileManager.prototype.files = new Array();

/**
 * Returns an object with the file accessible through the text and xml properties if the file is loaded. Otherwise starts loading the files and returns the files object.
 * 
 * @param {Object} fileName
 * @param {Object} onLoadFunc
 */
FileManager.prototype.load = function(fileName, onLoadFunc){
	if(this.files[fileName] == undefined){
		this.files[fileName] = new Object();
		Resources.addToLoad();
		var xml = xmlRequest();
		xml.onreadystatechange = function(){
			if(xml.readyState == 4){
				Files.files[fileName].text = String(xml.responseText);
				Files.files[fileName].xml = xml.responseXML;
				//Files.files[fileName].onLoadComplete();
				if(onLoadFunc != null){
					onLoadFunc(Files.files[fileName]);
				}
				Resources.leftToLoad--;
			}
		}
		try{
			xml.open("GET",fileName,true);
			xml.send(null);
		}catch(e){
		}
	}
	return this.files[fileName];
}

var Files = new FileManager();

//http://www.w3schools.com/ajax/ajax_browsers.asp
function xmlRequest(){
	var xmlHttp;
	try{
		// Firefox, Opera 8.0+, Safari
		xmlHttp=new XMLHttpRequest();
	}
	catch (e){
		// Internet Explorer
		try{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e){
			try{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e){
				alert("Your browser does not support AJAX!");
				return false;
			}
		}
	}
	return xmlHttp;
}