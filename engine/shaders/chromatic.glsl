precision mediump float;
			
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
//uniform float offset;

void main(void){
	float offset = 0.0075;
	float offsetX = (vTextureCoord.x-0.5)*offset;
	float offsetY = (vTextureCoord.y-0.5)*offset;
	//vec4 color = texture2D(uSampler, vec2(floor(vTextureCoord.x*scale)/scale, floor(vTextureCoord.y*scale)/scale));
	vec4 red = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));
	vec4 green = texture2D(uSampler, vec2(vTextureCoord.x+offsetX, vTextureCoord.y+offsetY));
	vec4 blue = texture2D(uSampler, vec2(vTextureCoord.x-offsetX, vTextureCoord.y-offsetY));
	gl_FragColor.r = red.r;
	gl_FragColor.g = green.g;
	gl_FragColor.b = blue.b;
	//gl_FragColor = red;
	gl_FragColor.a = (red.a+green.a+blue.a)/3.0;
}