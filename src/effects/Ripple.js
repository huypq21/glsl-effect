import { Effect } from "postprocessing";
import React, { forwardRef, useMemo } from "react";
import { Uniform, Vector2 } from "three";
import fragmentShader from "../shader/ripple/fragmentShader";

// Effect implementation
class RippleEffectImpl extends Effect {
  constructor() {
    super("RippleEffect", fragmentShader, {
      uniforms: new Map([
        ["iChannel0", new Uniform(null)],
        ["iChannel1", new Uniform(null)],
        [
          "iResolution",
          new Uniform(
            new Vector2(
              window.innerHeight / window.innerWidth,
              window.innerHeight / window.innerWidth
            )
          ),
        ],
        ["iTime", new Uniform(0.0)],
        ["iMouse", new Uniform(new Vector2(0, 0))],
      ]),
    });
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get("iTime").value += deltaTime;
  }
}

// Effect component
export const RippleEffect = forwardRef(({ time }, ref) => {
  const effect = useMemo(() => new RippleEffectImpl(time), [time]);
  return <primitive ref={ref} object={effect} dispose={null} />;
});
