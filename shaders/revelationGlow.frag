#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution; // This is passed in as a uniform from the sketch.js file

uniform float u_scale;

uniform float u_time;

vec2 resolution = vec2(640,480);

vec4 pink = vec4(1.0, 0, .35, 1.0);

vec4 white = vec4(1.0, 1.0, 1.0, 1.0);

vec4 yellow = vec4(140./255., 120./255., 5./255., 1.0);

vec4 red = vec4(100./255., 0./255., 20./255., 1.0);

vec4 orange = vec4(130./255., 60./255., 4./255., 1.0);

vec4 blue = vec4(0./255., 80./255., 130./255., 1.0);

vec4 purple = vec4(91./255., 22./255., 201./255., 1.0);

vec4 green = vec4(0./255., 210./255., 35./255., 1.0);

vec4 dark = vec4(12./255., 15./255., 68./255., 1.0);


vec4 darkPurple = vec4(30./255., 5./255., 80./255., 1.0);


uniform float u_glowPosition;

uniform float u_glowAmount;

uniform int u_songId;

vec4 baseColor = pink;

float m_r = 1.0; float m_g = 1.0; float m_b = 1.0;


float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}



float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed)
{
	vec2 sourceToCoord = coord - raySource;
	float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);

	return clamp(
		(0.45 + 0.15 * sin(cosAngle * seedA + u_time * speed)) +
		(0.3 + 0.2 * cos(-cosAngle * seedB + u_time * speed)),
		0.0, 1.0) *
		clamp((resolution.x - length(sourceToCoord)) / resolution.x, 0.5, 1.0);
}

float distanceFromCenter(vec2 uv){
  float a = pow(uv.x - .5,2.0);
  float b = pow(uv.y - (1.0-u_glowPosition),2.0);
  float distance = sqrt(a +b);
 return distance;

}

void setColor(vec2 uv){

  // Eggshells
  if (u_songId == 0){
    baseColor = yellow;
  }
  //Fawning
  if (u_songId == 1){
    baseColor = red;
  }
  //Breadcrumbs
  if (u_songId == 2){
    baseColor = blue;
  }
  //Lone ranger
  if (u_songId == 3){
    baseColor = orange;
  }
  //Void
  if (u_songId == 4){
    baseColor = darkPurple;
  }
}


float round(float value){
  return floor(value + 0.5);
}

void main() {



  vec2 uv = gl_FragCoord.xy / resolution;
	uv.y = 1.0 - uv.y;
	vec2 coord = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y);

  float pixelationAmount = u_resolution.x/resolution.x *2.0;

  vec2  coord_pixelated = vec2(round(coord.x/pixelationAmount) *pixelationAmount, round(coord.y/pixelationAmount) * pixelationAmount);

	// Set the parameters of the sun rays
	vec2 rayPos1 = vec2(resolution.x * 0.5, 0.5+resolution.y *(1.0-u_glowPosition));
	vec2 rayRefDir1 = normalize(vec2(0, 1));
	float raySeedA1 = 36.2214;
	float raySeedB1 = 21.11349;
	float raySpeed1 = 6.0;

	vec2 rayPos2 = vec2(resolution.x * 0.5, 0.5+resolution.y *(1.0-u_glowPosition));
	vec2 rayRefDir2 = normalize(vec2(1.0, 0));
	const float raySeedA2 = 22.39910;
	const float raySeedB2 = 18.0234;
	const float raySpeed2 = 4.0;

	// Calculate the colour of the sun rays on the current fragment
	vec4 rays1 =
		vec4(1.0, 1.0, 1.0, 1.0) *
		rayStrength(rayPos1, rayRefDir1, coord_pixelated, raySeedA1, raySeedB1, raySpeed1);

	vec4 rays2 =
		vec4(1.0, 1.0, 1.0, 1.0) *
		rayStrength(rayPos2, rayRefDir2, coord_pixelated, raySeedA2, raySeedB2, raySpeed2);


    float transitionBrightness = -0.4;
    float radialBrightness = 0.0;



   setColor(uv);



   radialBrightness = (1.0-distanceFromCenter(uv))*u_glowAmount;








  float r = m_r*baseColor.x + rays1.x*.2 + rays2.x*.3 + radialBrightness + transitionBrightness;
  float g = m_g*baseColor.y + rays1.y*.2 + rays2.y*.3 + radialBrightness + transitionBrightness;
  float b = m_b*baseColor.z + rays1.z*.2 + rays2.z*.3 + radialBrightness + transitionBrightness;

  float a = 1.0;


  gl_FragColor.x = r;
  gl_FragColor.y = g;
  gl_FragColor.z = b;
  gl_FragColor.w = a;

}
