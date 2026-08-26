/**
 * Reflect — the live background.
 *
 * A single-pass WebGL caustic field: eight iterations of a folded sine field,
 * each contributing a reciprocal distance, tinted and raised to a contrast
 * power. Component by Originkit; both shaders below are unmodified.
 *
 * It is deliberately additive. The element is created here rather than sitting
 * in the markup, so a visitor without JavaScript, without WebGL, or with
 * reduced motion turned on never receives a canvas at all — they keep the
 * static wash painted by `body::before`, which is the design's real floor.
 *
 * One entry point, matching the shape of `initAnimations()`.
 */

/**
 * Everything tunable, in one place.
 *
 * These are the component's own defaults except `speed` and `opacity`. Full
 * strength at full speed competes with body copy, and this sits behind four
 * pages of it — so both come down. Raise them here and nowhere else.
 */
const CONFIG = {
  tint: '#ffffff',
  background: '#000000',
  speed: 70,
  scale: 1,
  contrast: 20,
  iterations: 5,
  opacity: 70,
  blur: 4,
  pointerStrength: 40,
};

const VERTEX_SRC = `
attribute vec4 a_position;
void main() { gl_Position = a_position; }
`;

const FRAGMENT_SRC = `
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform float u_speed;
uniform vec3 u_tint;
uniform float u_scale;
uniform float u_contrast;
uniform float u_iterations;
uniform vec2 u_pointer;
uniform float u_pointerStrength;

#define TAU 6.28318530718
#define MAX_ITER 8

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float time = iTime * u_speed + 23.0;
    vec2 uv = fragCoord.xy / iResolution.xy;

    vec2 p = mod(uv * TAU * u_scale, TAU) - 250.0;

    vec2 pointerDelta = uv - u_pointer;
    pointerDelta.x *= iResolution.x / max(iResolution.y, 1.0);
    float pointerDist = length(pointerDelta);
    p += normalize(pointerDelta + 1e-4) * u_pointerStrength * exp(-pointerDist * 4.0) * TAU;

    vec2 i = vec2(p);
    float c = 1.0;
    float inten = 0.005;
    float used = 0.0;

    for (int n = 0; n < MAX_ITER; n++) {
        if (float(n) >= u_iterations) break;
        float t = time * (1.0 - (3.5 / float(n + 1)));
        i = p + vec2(
            cos(t - i.x) + sin(t + i.y),
            sin(t - i.y) + cos(t + i.x)
        );
        // Keep denominators off zero so p/(sin/inten) can't blow past a
        // low-precision float's max (NaN -> black on GPUs that ignore highp).
        float sx = sin(i.x + t) / inten;
        float sy = cos(i.y + t) / inten;
        sx = (sx >= 0.0 ? 1.0 : -1.0) * max(abs(sx), 0.05);
        sy = (sy >= 0.0 ? 1.0 : -1.0) * max(abs(sy), 0.05);
        c += 1.0 / length(vec2(p.x / sx, p.y / sy));
        used += 1.0;
    }

    c /= max(used, 1.0);
    c = 1.17 - pow(c, 1.4);

    float lum = pow(abs(c), u_contrast);
    vec3 colour = clamp(u_tint * lum * 2.0, 0.0, 1.0);

    fragColor = vec4(colour, 1.0);
}

void main() { mainImage(gl_FragColor, gl_FragCoord.xy); }
`;

/** Accepts `#rgb`, `#rrggbb`, `#rrggbbaa`, or `rgb()` / `rgba()`. */
function parseColor(input: string): [number, number, number] {
  const fallback: [number, number, number] = [0, 0.35, 0.5];
  if (!input) return fallback;

  const str = input.trim();

  if (str[0] === '#') {
    let hex = str.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [r / 255, g / 255, b / 255];
    }
    return fallback;
  }

  const m = str.match(/[\d.]+/g);
  if (m && m.length >= 3) {
    return [
      Math.min(255, parseFloat(m[0])) / 255,
      Math.min(255, parseFloat(m[1])) / 255,
      Math.min(255, parseFloat(m[2])) / 255,
    ];
  }
  return fallback;
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Reflect shader:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function initReflect(): void {
  // Off entirely, not merely paused. A frozen caustic field is still a busy
  // image behind body copy, and the static wash is the better answer.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'reflect';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.opacity = String(CONFIG.opacity / 100);

  /*
   * The component layers a `backdrop-filter` div over its canvas. Here the
   * canvas is the only thing in that backdrop, so filtering it directly is
   * the same picture for one element instead of two — and it avoids relying
   * on backdrop-filter resolving correctly against a negative z-index layer.
   */
  if (CONFIG.blur > 0) canvas.style.filter = `blur(${CONFIG.blur}px)`;

  const gl = (canvas.getContext('webgl') ||
    canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
  if (!gl) return;

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  if (!program) return;

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Reflect link:', gl.getProgramInfoLog(program));
    return;
  }

  // Nothing can fail past this point, so the canvas is safe to show.
  document.body.prepend(canvas);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const posLoc = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uResolution = gl.getUniformLocation(program, 'iResolution');
  const uTime = gl.getUniformLocation(program, 'iTime');
  const uSpeed = gl.getUniformLocation(program, 'u_speed');
  const uTint = gl.getUniformLocation(program, 'u_tint');
  const uScale = gl.getUniformLocation(program, 'u_scale');
  const uContrast = gl.getUniformLocation(program, 'u_contrast');
  const uIterations = gl.getUniformLocation(program, 'u_iterations');
  const uPointer = gl.getUniformLocation(program, 'u_pointer');
  const uPointerStrength = gl.getUniformLocation(program, 'u_pointerStrength');

  const tint = parseColor(CONFIG.tint);
  const speed = (CONFIG.speed / 100) * 0.5;
  const strength = CONFIG.pointerStrength / 100;

  // Blurring throws the extra samples away, so paying for them twice over is
  // waste. Without blur the cap is the component's own 2.
  const dprCap = CONFIG.blur > 0 ? 1.5 : 2;

  const start = performance.now();
  let rafId = 0;
  let running = false;

  const pointer = { x: 0.5, y: 0.5 };
  let pointerActive = 0;
  let pointerActiveTarget = 0;

  function draw(): void {
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const bw = Math.max(1, Math.round(window.innerWidth * dpr));
    const bh = Math.max(1, Math.round(window.innerHeight * dpr));

    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
      gl.viewport(0, 0, bw, bh);
    }

    gl.uniform2f(uResolution, bw, bh);
    gl.uniform1f(uTime, (performance.now() - start) / 1000);
    gl.uniform1f(uSpeed, speed);
    gl.uniform3f(uTint, tint[0], tint[1], tint[2]);
    gl.uniform1f(uScale, CONFIG.scale);
    gl.uniform1f(uContrast, CONFIG.contrast);
    gl.uniform1f(uIterations, CONFIG.iterations);

    pointerActive += (pointerActiveTarget - pointerActive) * 0.08;
    gl.uniform2f(uPointer, pointer.x, pointer.y);
    gl.uniform1f(uPointerStrength, strength * pointerActive);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function loop(): void {
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function play(): void {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(loop);
  }

  function pause(): void {
    running = false;
    cancelAnimationFrame(rafId);
  }

  window.addEventListener(
    'pointermove',
    (event) => {
      pointer.x = event.clientX / window.innerWidth;
      pointer.y = 1 - event.clientY / window.innerHeight;
      pointerActiveTarget = 1;
    },
    { passive: true },
  );

  window.addEventListener('pointerleave', () => {
    pointerActiveTarget = 0;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
    else play();
  });

  play();
}
