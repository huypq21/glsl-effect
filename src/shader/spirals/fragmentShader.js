const fragmentShader = `
uniform vec3      iResolution; 
uniform float     iTime;                 // shader playback time (in seconds)
uniform float     iTimeDelta;            // render time (in seconds)
uniform float     iFrameRate;            // shader frame rate
uniform int       iFrame;                // shader playback frame
uniform float     iChannelTime[4];       // channel playback time (in seconds)
uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
uniform sampler2D iChannel0;          // input channel. XX = 2D/Cube
uniform vec4      iDate;  
uniform int showEffect;
varying vec2 vUv;

void main()  {
    vec2 newPoint;
    vec2 uv = vUv;

    float theta = 0.0 * 1.5;

    float centerCoordx = (uv.x * 2.0 - 1.0);
    float centerCoordy = (uv.y * 2.0 - 1.0);

    float len = sqrt(pow(centerCoordx, 2.0) + pow(centerCoordy, 2.0));

    vec2 vecA = vec2(centerCoordx, centerCoordy);
    vec2 vecB = vec2(len, 0);

    float initialValue = dot(vecA, vecB) / (len * 1.0);
    float degree = degrees(acos(initialValue));

    float thetamod = degree / 18.0 * sin(len * 100.0 / 2.0);
    
	vec2 effectParams = iMouse.xy / iResolution.xy;
    
	// Input xy controls speed and intensity
    float intensity = effectParams.x * 20.0 + 10.0;
    float speed = iTime * effectParams.y * 10.0 + 4.0;
    float time = mod(speed, intensity);
    
    if (time < intensity / 2.0){
	    theta += thetamod * (time / 100.0) ;
    }
    else{
        theta += thetamod * ((intensity - time) / 100.0) ;
    }

    newPoint = vec2((cos(theta) * (uv.x * 2.0 - 1.0) + sin(theta) * (uv.y * 2.0 - 1.0) + 1.0)/2.0,
                      (-sin(theta) * (uv.x * 2.0 - 1.0) + cos(theta) * (uv.y * 2.0 - 1.0) + 1.0)/2.0);


	gl_FragColor = texture(iChannel0, newPoint);
}
`;

export default fragmentShader;
