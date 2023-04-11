const mainFragment = `
vec4 effectResult(vec4 fragColor,vec4 effect, bool isShow) {
    if (isShow == true) {
        return fragColor*effect;
    } else {
        return fragColor;
    }
}

void main()
{
  vec4 wave = waveEffect();
  vec4 morph = morphEffect();
  vec4 original = defaultEffect();
  vec4 old = oldEffect();
  vec4 result;
  // gl_FragColor = 0.5 * (morph + wave);
  // if (showEffect==0) result = original; 
  // else result = 1.0*morph + 0.0*wave;
  result = (0.33) * (wave + old + morph);
  // gl_FragColor = wave;
  gl_FragColor = wave*vec4(1.,1.,1.,0.);
}`;

export default mainFragment;
