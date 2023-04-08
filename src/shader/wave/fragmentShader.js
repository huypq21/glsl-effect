const fragmentShader = `
uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
uniform float     iTimeDelta;            // render time (in seconds)
uniform float     iFrameRate;            // shader frame rate
uniform int       iFrame;                // shader playback frame
uniform float     iChannelTime[4];       // channel playback time (in seconds)
uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
uniform sampler2D iChannel0;          // input channel. XX = 2D/Cube
uniform vec4      iDate;  

void main()
{
    float time = iTime;
    
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 center = vec2(0.0);
  vec2 coord = uv;
  vec2 centered_coord = 2.0*uv-1.0;

  float shutter = 0.9;
  float texelDistance = distance(center, centered_coord);
  float dist = 1.41*1.41*shutter - texelDistance;

  float ripples = 1.0- sin(texelDistance*32.0 - 2.0*time);
  coord -= normalize(centered_coord-center)*clamp(ripples,0.0,1.0)*0.050;
    
  vec4 color = texture(iChannel0, coord);
  gl_FragColor = vec4(color.rgba*dist);
}
`;

export default fragmentShader;
