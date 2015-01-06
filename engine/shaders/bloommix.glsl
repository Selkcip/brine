precision mediump float;
			
varying vec2 vTextureCoord;

uniform sampler2D colorMap;
uniform sampler2D blur;

void main(void){
	vec4 color = texture2D(colorMap, vTextureCoord);
	vec4 glow = texture2D(blur, vTextureCoord);
	
	gl_FragColor = color+glow;
	gl_FragColor.a = 1.0;
}