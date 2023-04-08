/*
  To use it, simply declare:
  `const post = new PostFX(rendering);`
  
  Then on update, instead of:
  `rendering.render(scene, camera);`
  replace with:
  `post.render(scene, camera);`
*/
import {
  WebGLRenderTarget,
  OrthographicCamera,
  BufferGeometry,
  BufferAttribute,
  Mesh,
  Scene,
  RawShaderMaterial,
  Vector2,
} from "three";

const vertexShader = `precision highp float;
    attribute vec2 position;
    void main() {
      // Look ma! no projection matrix multiplication,
      // because we pass the values directly in clip space coordinates.
      gl_Position = vec4(position, 1.0, 1.0);
    }`;

const fragmentShader = `precision highp float;
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 resolution;
uniform vec2 uMouse;

float sat( float t ) {
	return clamp( t, 0.0, 1.0 );
}

vec2 sat( vec2 t ) {
	return clamp( t, 0.0, 1.0 );
}

float remap  ( float t, float a, float b ) {
	return sat( (t - a) / (b - a) );
}

float linterp( float t ) {
	return sat( 1.0 - abs( 2.0*t - 1.0 ) );
}

vec3 spectrum_offset( float t ) {
  float t0 = 3.0 * t - 1.5;
return clamp( vec3( -t0, 1.0-abs(t0), t0), 0.0, 1.0);

}

float rand( vec2 n ) {
  return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

float srand( vec2 n ) {
	return rand(n) * 2.0 - 1.0;
}

float mytrunc( float x, float num_levels )
{
	return floor(x*num_levels) / num_levels;
}

vec2 mytrunc( vec2 x, float num_levels )
{
	return floor(x*num_levels) / num_levels;
}

void main()  {
  float aspect = resolution.x / resolution.y;
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv.y = 1.0 - uv.y;

  float time = mod(uTime, 32.0);

	float GLITCH = 0.1 + uMouse.x / resolution.x;

  float gnm = sat( GLITCH );
	float rnd0 = rand( mytrunc( vec2(time, time), 6.0 ) );
	float r0 = sat((1.0-gnm)*0.7 + rnd0);
	float rnd1 = rand( vec2(mytrunc( uv.x, 10.0*r0 ), time) );
	float r1 = 0.5 - 0.5 * gnm + rnd1;
	r1 = 1.0 - max( 0.0, ((r1<1.0) ? r1 : 0.9999999) );
	float rnd2 = rand( vec2(mytrunc( uv.y, 40.0*r1 ), time) );
	float r2 = sat( rnd2 );

	float rnd3 = rand( vec2(mytrunc( uv.y, 10.0*r0 ), time) );
	float r3 = (1.0-sat(rnd3+0.8)) - 0.1;

	float pxrnd = rand( uv + time );

	float ofs = 0.05 * r2 * GLITCH * ( rnd0 > 0.5 ? 1.0 : -1.0 );
	ofs += 0.5 * pxrnd * ofs;

	uv.y += 0.1 * r3 * GLITCH;

    const int NUM_SAMPLES = 10;
    const float RCP_NUM_SAMPLES_F = 1.0 / float(NUM_SAMPLES);
    
	vec4 sum = vec4(0.0);
	vec3 wsum = vec3(0.0);
	for( int i=0; i<NUM_SAMPLES; ++i )
	{
		float t = float(i) * RCP_NUM_SAMPLES_F;
		uv.x = sat( uv.x + ofs * t );
		vec4 samplecol = texture2D( uTexture, uv, -10.0 );
		vec3 s = spectrum_offset( t );
		samplecol.rgb = samplecol.rgb * s;
		sum += samplecol;
		wsum += s;
	}
	sum.rgb /= wsum;
	sum.a *= RCP_NUM_SAMPLES_F;

  gl_FragColor.a = sum.a;
	gl_FragColor.rgb = sum.rgb;
}`;

export default class PostFX {
  constructor(renderer) {
    console.log("renderer", renderer);
    this.renderer = renderer;
    this.scene = new Scene();
    // three.js for .render() wants a camera, even if we're not using it :(
    this.dummyCamera = new OrthographicCamera();
    this.geometry = new BufferGeometry();

    // Triangle expressed in clip space coordinates
    const vertices = new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0]);

    this.geometry.setAttribute("position", new BufferAttribute(vertices, 2));

    this.resolution = new Vector2();
    this.renderer.getDrawingBufferSize(this.resolution);

    this.target = new WebGLRenderTarget(this.resolution.x, this.resolution.y, {
      stencilBuffer: false,
      depthBuffer: true,
    });

    this.material = new RawShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        uTexture: { value: this.target.texture },
        resolution: { value: this.resolution },
        uMouse: { value: new Vector2(0, 0) },
        uTime: { value: 0 },
      },
    });

    // TODO: handle the resize -> update uResolution uniform and this.target.setSize()

    this.triangle = new Mesh(this.geometry, this.material);
    // Our triangle will be always on screen, so avoid frustum culling checking
    this.triangle.frustumCulled = false;
    this.scene.add(this.triangle);
  }

  render(scene, camera) {
    this.renderer.setRenderTarget(this.target);
    this.renderer.render(scene, camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.dummyCamera);
  }
}
