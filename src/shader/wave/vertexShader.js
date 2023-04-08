const vertexShader = `
varying vec2 vUv;
      uniform float iTime;
      uniform float iVelo;
      void main() {
        vec3 pos = position;
        pos.x += sin(pos.y*10.0*iVelo+iTime)/100.0 * iVelo;
        pos.y += sin(pos.x*10.0*iVelo+iTime)/100.0 * iVelo;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
      }
`;

export default vertexShader;
