precision mediump float;
			
varying vec2 vTextureCoord;

uniform sampler2D colorMap;
uniform bool dir;
uniform float stepSize;

void main(void){
	float step = stepSize;
	vec4 color = vec4(0,0,0,0);
	for(float i=0.0; i<5.0; i++){
		float offset = (-2.0*step)+step*i;
		if(!dir){
			color += texture2D(colorMap, vec2(vTextureCoord.x+offset, vTextureCoord.y));
		}else{
			color += texture2D(colorMap, vec2(vTextureCoord.x, vTextureCoord.y+offset));
		}
	}
	color /= 5.0;
	gl_FragColor = color;
	gl_FragColor.a = 1.0;
}