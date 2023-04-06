const fragmentShader = `
uniform sampler2D uTexture;
uniform float uTime;
uniform float uVelo;
uniform vec2 resolution;
void main()  {
  vec2 uv = gl_FragCoord.xy/resolution.xy;
  vec2 center = vec2(0.0);
  vec2 coord = uv;
  vec2 centered_coord = 2.0*uv-1.0;

  float shutter = 0.9;
  float texelDistance = distance(center, centered_coord);
  float dist = 1.41*1.41*shutter - texelDistance;

  float ripples = 1.0- sin(texelDistance*32.0 - 2.0*uTime);
  coord -= normalize(centered_coord-center)*clamp(ripples,0.0,1.0)*0.050;
  
  gl_FragColor = texture2D(uTexture, coord);
}
`;

export default fragmentShader;
