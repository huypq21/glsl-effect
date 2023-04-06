import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { TextureLoader, Vector2 } from "three";
import "./App.css";
import fragmentShader from "./shader/ripple/fragmentShader";
import vertexShader from "./shader/ripple/vertexShader";
import { useVideoTexture } from "@react-three/drei";

const MovingPlane = () => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  // const [imageTexture1, imageTexture2] = useLoader(TextureLoader, [
  //   `/assets/1.jpg`,
  //   `/assets/3.png`,
  // ]);
  const imageTexture1 = useVideoTexture(`/assets/6.mp4`);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: imageTexture1 },
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

function App() {
  return (
    <div className="App">
      <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
        <ambientLight intensity={0.1} />
        <MovingPlane />
      </Canvas>
    </div>
  );
}

export default App;
