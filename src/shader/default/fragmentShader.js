const fragmentShader = `
uniform sampler2D iChannel0;
      varying vec2 vUv;

      bool iswhite(in vec3 color) {
        return color.r > 0.9 && color.g > 0.9 && color.b > 0.9;
    }

      void main()  {
        vec3 image = texture2D(iChannel0, vUv);
        if (!iswhite(image)) {
          image = vec3(0.,0.,0.);
      }
        gl_FragColor = image;
      }
`;

export default fragmentShader;
