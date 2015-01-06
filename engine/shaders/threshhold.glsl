precision mediump float;
			
varying vec2 vTextureCoord;

uniform sampler2D colorMap;
uniform float threshhold;

void main(void){
	float thresh = threshhold-0.5;
	//vec4 color = floor(texture2D(colorMap, vTextureCoord)-thresh+0.5);
	vec4 color = texture2D(colorMap, vTextureCoord);
	float level = floor(((color.r+color.g+color.b)/3.0)-thresh+0.5);
	//color.r = floor(color.r+0.5);
	//color.g = floor(color.g+0.5);
	//color.b = floor(color.b+0.5);
	
	gl_FragColor = color*level;
	gl_FragColor.a = 1.0;
}