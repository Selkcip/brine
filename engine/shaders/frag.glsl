precision mediump float;
	
varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void){
	vec4 color = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));
	//gl_FragColor =vec4(1.0,1.0,1.0,1.0);
	gl_FragColor = color;//vec4(color.r,1.0,1.0,1.0);
}
