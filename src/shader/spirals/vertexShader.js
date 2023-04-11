const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 pos = position;
  gl_Position = mix(projectionMatrix * modelViewMatrix * vec4(position,1.), projectionMatrix * modelViewMatrix * vec4(pos,1.), 0.5);
}
`;

export default vertexShader;
