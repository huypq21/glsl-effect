const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uVelo;
void main() {
  vec3 pos = position;
  pos.x += sin(pos.y*10.0*uVelo+uTime)/100.0 * uVelo;
  pos.y += sin(pos.x*10.0*uVelo+uTime)/100.0 * uVelo;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
}
`;

export default vertexShader;
