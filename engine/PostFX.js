/**
 * Creates a new instance of PostFXChain.
 * 
 * @class A list of screen post processing effects to be applied in sequence.
 * @property {List} effects The list of effects.
 */
function PostFXChain(){
	this.effects = new List();
}

PostFXChain.prototype.effects = new List();

/**
 * Pushes effect onto the list. 
 * 
 * @param {Object} effect The effect to be added.
 */
PostFXChain.prototype.push = function(effect){
	this.effects.push(effect);
}

/**
 * Removes an effect from the list.
 *  
 * @param {Object} effect
 */
PostFXChain.prototype.remove = function(effect){
	this.effects.remove(effect);
}

/**
 * Runs through the list of effects applying each one to the input buffer.
 */
PostFXChain.prototype.apply = function(ctx, input){
	var effect;
	for(var node = this.effects.head; node != null; node = node.link){
		effect = node.item;
		if(effect != undefined && effect != null){
			effect.apply(ctx, input);
		}
	}
}

/**
 * Creates a new instance of PostFX.
 * 
 * @class The base class for post processing effects.
 */
function PostFX(){
}

/**
 * Applies the effect. 
 * @param {CanvasContext} ctx The drawing context.
 */
PostFX.prototype.apply = function(ctx){
}