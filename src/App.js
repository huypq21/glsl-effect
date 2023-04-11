/* eslint-disable no-unused-expressions */
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { TextureLoader, Vector2, Vector3, WebGLRenderTarget } from "three";
import "./App.css";
import Post from "./components/Post";
import PostFX from "./components/PostFX";
import defaultEffect from "./shader/morph/default.effect";
import mainFragment from "./shader/morph/main.fragment";
import morphEffect from "./shader/morph/morph.effect";
import oldEffect from "./shader/morph/old.effect";
import variableFragment from "./shader/morph/variable.fragment";
import vertexShader from "./shader/morph/vertexShader";
import waveEffect from "./shader/morph/wave.effect";

const BlockComponent = forwardRef(({ setBlockState }, ref) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  const [imageTexture1, imageTexture2] = useLoader(TextureLoader, [
    `/assets/1.jpg`,
    `/assets/3.png`,
  ]);

  const uniforms = useMemo(
    () => ({
      iResolution: {
        value: new Vector3(window.innerWidth, window.innerHeight, 1),
      },
      iChannel0: { value: imageTexture2 },
      iChannel1: { value: imageTexture2 },
      iMouse: { value: new Vector2(0, 0) },
      iVelo: { value: 0.0 },
      iTime: { value: 0 },
      showEffect: { value: 0.0 },
    }),
    [imageTexture2]
  );

  useFrame((state, delta) => {
    mesh.current.material.uniforms.iTime.value += delta;
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      mesh.current.material.uniforms.showEffect.value = 1.0;
    }, 3000);

    () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <mesh
      ref={mesh}
      position={[0, 0, 0]}
      // rotation={[-Math.PI / 2, 0, 0]}
      // scale={1.5}
    >
      <planeGeometry args={[5, 5, 1, 1]} />
      <shaderMaterial
        fragmentShader={[
          variableFragment,
          waveEffect,
          oldEffect,
          defaultEffect,
          morphEffect,
          mainFragment,
        ].join(" ")}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
});

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
      {/* <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      /> */}
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

const Target = () => {
  const timeRef = useRef(0);
  const [blockState, setBlockState] = useState();
  const rtTexture = new WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight
  );

  useFrame((state, delta) => {});

  return (
    <>
      {/* <Effect2 />
<Effect /> */}
      <BlockComponent setBlockState={setBlockState} />
      {/* <EffectComposer>
        <Glitch />
        <RippleEffect />
        <BadTVEffect
          distortion={10.0}
          distortion2={30.0}
          speed={0.05}
          rollSpeed={0}
        />
      </EffectComposer> */}
      {/* <ambientLight intensity={0.5} />
<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
<pointLight position={[-10, -10, -10]} />
<Box position={[-1.2, 0, 0]} />
<Box position={[1.2, 0, 0]} /> */}
    </>
  );
};

function App() {
  return (
    <div className="App">
      <Canvas>
        <Target />
      </Canvas>
    </div>
  );
}

export default App;
