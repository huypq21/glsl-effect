const waveEffect = `
vec4 waveEffect(){
    float time = iTime;
      
    vec2 uv = vUv;
    vec2 center = vec2(0.0);
    vec2 coord = uv;
    vec2 centered_coord = 2.0*uv-1.0;
  
    float shutter = 0.9;
    float texelDistance = distance(center, centered_coord);
    float dist = 1.41*1.41*shutter - texelDistance;
  
    float ripples = 1.0- sin(texelDistance*32.0 - 2.0*time);
    coord -= normalize(centered_coord-center)*clamp(ripples,0.0,1.0)*0.050;
      
    vec4 color = texture2D(iChannel0, coord);
    return vec4(color.rgba*dist);
  
    // return texture2D(iChannel0, vUv);
  }
  `;

export default waveEffect;
