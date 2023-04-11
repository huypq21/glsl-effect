const defaultEffect = `
vec4 defaultEffect(){
    return texture2D(iChannel0, vUv);
  }
`;

export default defaultEffect;
