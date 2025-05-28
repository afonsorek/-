import React, { useRef, useEffect } from "react";

const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;

    // Simplex 2D noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                           -0.577350269189626,  // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= (1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h ));
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    float FBM(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 0.0;
        for (int i = 0; i < 6; i++) {
            value += amplitude * snoise(p);
            p *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }

    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y; // Aspect ratio correction

        vec2 q = st;
        q.x *= 1.0;
        q.y *= 1.0;

        float time = u_time * 0.1;

        // Animate noise with time
        float noise = FBM(q + vec2(time * 0.5, time * 0.2));
        noise = (noise + FBM(q * 2.0 + vec2(-time * 0.3, time * 0.4))) * 0.5;

        // Create wave-like distortions based on noise
        vec2 r = vec2(
            FBM(q + noise + vec2(1.7, 9.2) + 0.15 * time),
            FBM(q + noise + vec2(8.3, 2.8) + 0.126 * time)
        );

        float finalNoise = FBM(q + r);

        // Map noise to colors - mix with gradient
        float t = smoothstep(0.4, 0.6, finalNoise); // Highlights
        float t2 = smoothstep(0.3, 0.5, finalNoise); // Base

        // Gradient colors (Purple to Violet)
        vec3 color1 = vec3(192.0/255.0, 132.0/255.0, 252.0/255.0); // purple-400
        vec3 color2 = vec3(124.0/255.0, 58.0/255.0, 237.0/255.0); // violet-700
        vec3 gradient = mix(color1, color2, st.y);

        // Mix gradient with wave highlights (make highlights whiter/brighter)
        vec3 waterColor = mix(gradient, vec3(1.0), t * 0.3); // Mix white for highlights
        waterColor = mix(waterColor, gradient * 0.8, (1.0 - t2) * 0.2); // Darker areas

        gl_FragColor = vec4(waterColor, 1.0);
    }
`;

const RealisticWaveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported!");
      return;
    }

    const createShader = (
      gl: WebGLRenderingContext,
      type: number,
      source: string
    ): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
          "An error occurred compiling the shaders: " +
            gl.getShaderInfoLog(shader)
        );
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const createProgram = (
      gl: WebGLRenderingContext,
      vertexShader: WebGLShader,
      fragmentShader: WebGLShader
    ): WebGLProgram | null => {
      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(
          "Unable to initialize the shader program: " +
            gl.getProgramInfoLog(program)
        );
        return null;
      }
      return program;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );
    const resolutionUniformLocation = gl.getUniformLocation(
      program,
      "u_resolution"
    );
    const timeUniformLocation = gl.getUniformLocation(program, "u_time");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    let animationFrameId: number;
    let startTime = Date.now();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = () => {
      resizeCanvas(); // Check size on each frame (can be optimized)

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(
        positionAttributeLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );

      gl.uniform2f(
        resolutionUniformLocation,
        gl.canvas.width,
        gl.canvas.height
      );
      gl.uniform1f(timeUniformLocation, (Date.now() - startTime) * 0.001);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resizeCanvas, false);
    resizeCanvas(); // Set initial size
    render(); // Start animation

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return <canvas ref={canvasRef} id="wave-canvas" />;
};

export default RealisticWaveBackground;
