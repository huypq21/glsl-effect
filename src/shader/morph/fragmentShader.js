const fragmentShader = `
uniform sampler2D uTexture;
      uniform sampler2D uTexture2;
      uniform vec2 resolution;
      varying vec2 vUv;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uVelo;
      float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
        uv -= disc_center;
        uv*=resolution;
        float dist = sqrt(dot(uv, uv));
        return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
      }
      void main()  {
          vec2 newUV = vUv;
          float c = circle(vUv, uMouse, 0.1 + (1.0 - uVelo), 0.05);
          float r = texture2D(uTexture2, newUV.xy  -= c * (0.1 * .15 * uVelo)).x;
          float g = texture2D(uTexture2, newUV.xy).y;
          float b = texture2D(uTexture2, newUV.xy  += c * (0.1 * .35 * uVelo)).z;
          vec4 color = vec4(r, g * (1.0 - uVelo), b, 1.);

          float finalMask = smoothstep(0.4, 0.5, c);

        	vec4 hover = texture2D(uTexture, vUv);

          float m = step(distance(hover, color), uVelo);
          gl_FragColor = mix(mix(hover, color, m), color, pow(uVelo, 5.0));
      }
`;

export default fragmentShader;
