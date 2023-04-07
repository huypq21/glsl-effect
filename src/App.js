import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { forwardRef, useMemo, useRef, useState } from "react";
import { TextureLoader, Vector2, WebGLRenderTarget } from "three";
import "./App.css";
import fragmentShader from "./shader/morph/fragmentShader";
import vertexShader from "./shader/morph/vertexShader";
import fragmentShader2 from "./shader/shampain/fragmentShader";
import vertexShader2 from "./shader/shampain/vertexShader";
import { useTexture, useVideoTexture } from "@react-three/drei";
import PostFX from "./components/PostFX";
import Post from "./components/Post";
import { EffectComposer, Glitch, Sepia } from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import { RippleEffect } from "./effects/Ripple";
import { BadTVEffect } from "./effects/BadTV";
import { useControls } from "leva";

const BlockComponent = () => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  const [imageTexture1, imageTexture2] = useLoader(TextureLoader, [
    `/assets/1.jpg`,
    `/assets/3.png`,
  ]);
  // const imageTexture1 = useVideoTexture(`/assets/6.mp4`);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: imageTexture1 },
      resolution: {
        value: new Vector2(window.innerWidth, window.innerHeight),
      },
      uMouse: { value: new Vector2(0, 0) },
      uVelo: { value: 0.0 },
      uTime: { value: 0 },
    }),
    []
  );

  return (
    <mesh
      ref={mesh}
      position={[0, 0, 0]}
      // rotation={[-Math.PI / 2, 0, 0]}
      // scale={1.5}
    >
      <planeGeometry args={[5, 5, 32, 32]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
      {/* <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      /> */}
      {/* <EffectComposer>
        <Glitch
          delay={[0.0, 0.0]} // infinte glitch
          duration={[0.6, 1.0]}
          strength={[0.05, 0.05]}
          mode={GlitchMode.SPORADIC}
          active
          ratio={0.25}
        />
      </EffectComposer> */}
      {/* <planeGeometry args={[1, 1, 16, 16]} /> */}
      {/* <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        wireframe={true}
      /> */}
    </mesh>
  );
};

function Effect() {
  const { gl, scene, camera, size } = useThree();
  const renderer = new PostFX(gl);
  return useFrame((state) => {
    renderer.render(scene, camera);
  }, 1);
}

function Effect2() {
  const { gl, scene, camera, size } = useThree();
  const renderer = new Post(gl);
  return useFrame((state) => {
    renderer.render(scene, camera);
  }, 1);
}

function Box(props) {
  // This reference will give us direct access to the mesh
  const ref = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    ref.current.rotation.x = ref.current.rotation.y += 0.01;
  });
  return (
    <mesh
      {...props}
      ref={ref}
      scale={active ? 1.5 : 1}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

const MovingPlane = () => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  const [imageTexture1, imageTexture2] = useLoader(TextureLoader, [
    `/assets/1.jpg`,
    `/assets/3.png`,
  ]);

  const target = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    stencilBuffer: false,
    depthBuffer: true,
  });

  console.log(imageTexture1);

  console.log(target.texture);
  // const imageTexture1 = useVideoTexture(`/assets/6.mp4`);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: target.texture },
      resolution: {
        value: new Vector2(window.innerWidth, window.innerHeight),
      },
      uMouse: { value: new Vector2(0, 0) },
      uVelo: { value: 0.0 },
      smoothness: { value: 0.01 },
      scale: { value: 4.0 },
      seed: { value: 12.9898 },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state, delta) => {
    mesh.current.material.uniforms.uTime.value += delta;
  });

  return (
    <mesh
      ref={mesh}
      position={[0, 0, 0]}
      // rotation={[-Math.PI / 2, 0, 0]}
      // scale={1.5}
    >
      <planeGeometry args={[window.innerWidth, window.innerHeight, 10, 10]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
      <Box position={[-1.2, 0, 0]} />
      {/* <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      /> */}
      {/* <EffectComposer>
        <Glitch
          delay={[0.0, 0.0]} // infinte glitch
          duration={[0.6, 1.0]}
          strength={[0.05, 0.05]}
          mode={GlitchMode.SPORADIC}
          active
          ratio={0.25}
        />
      </EffectComposer> */}
      {/* <planeGeometry args={[1, 1, 16, 16]} /> */}
      {/* <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        wireframe={true}
      /> */}
    </mesh>
  );
};

const CustomEffect = () => {};

function App() {
  const timeRef = useRef(0);

  return (
    <div className="App">
      <Canvas>
        {/* <Effect2 />
        <Effect /> */}
        <BlockComponent />
        <EffectComposer>
          {/* <Sepia
            delay={[0.5, 1.5]}
            duration={[0.6, 1.0]}
            strength={[0.1, 0.2]}
            mode={GlitchMode.SPORADIC} // try CONSTANT_MILD
            active // toggle on/off
            ratio={0.1}
          /> */}
          <RippleEffect />
          {/* <BadTVEffect
            distortion={10.0}
            distortion2={30.0}
            speed={0.05}
            rollSpeed={0}
          /> */}
        </EffectComposer>
        {/* <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} /> */}
      </Canvas>
    </div>
  );
}

export default App;
