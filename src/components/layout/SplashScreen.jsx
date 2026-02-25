import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "../../lib/motion";

const bgField = "/img/tela-splash/campo-gramado.png";
const wolf = "/img/tela-splash/lobo-mal.png";

export function SplashScreen({ subtitle = "Carregando...", onDone, onComplete }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [parallaxPos, setParallaxPos] = useState({ x: 0, y: 0 });

  const parallax = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const particles = useRef([]);
  const rafProgressRef = useRef(null);
  const rafParallaxRef = useRef(null);
  const rafParticlesRef = useRef(null);

  const durationMs = 3200;
  const clamped = (v, a, b) => Math.max(a, Math.min(b, v));
  const onSplashDone = onDone ?? onComplete;

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);

    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setProgress(100);
      setDone(true);
      onSplashDone?.();
      return;
    }

    const start = performance.now();
    let mounted = true;

    const tick = (t) => {
      if (!mounted) return;

      const elapsed = t - start;
      const k = clamped(elapsed / durationMs, 0, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      const wobble = Math.sin(t / 150) * 0.5;

      setProgress(clamped(eased * 100 + wobble, 0, 100));

      if (k >= 1) {
        setProgress(100);
        setDone(true);
        onSplashDone?.();
        return;
      }
      rafProgressRef.current = requestAnimationFrame(tick);
    };

    rafProgressRef.current = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      if (rafProgressRef.current) cancelAnimationFrame(rafProgressRef.current);
    };
  }, [onSplashDone, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const el = rootRef.current;
    if (!el) return undefined;

    const onMove = (clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const nx = clamped((clientX - cx) / (rect.width / 2), -1, 1);
      const ny = clamped((clientY - cy) / (rect.height / 2), -1, 1);

      parallax.current.tx = nx;
      parallax.current.ty = ny;
    };

    const handleMouse = (event) => onMove(event.clientX, event.clientY);
    const handleTouch = (event) => {
      const touch = event.touches?.[0];
      if (touch) onMove(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("touchmove", handleTouch, { passive: true });

    const smooth = () => {
      const p = parallax.current;
      p.x += (p.tx - p.x) * 0.06;
      p.y += (p.ty - p.y) * 0.06;
      setParallaxPos({ x: p.x, y: p.y });
      rafParallaxRef.current = requestAnimationFrame(smooth);
    };

    rafParallaxRef.current = requestAnimationFrame(smooth);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleTouch);
      if (rafParallaxRef.current) cancelAnimationFrame(rafParallaxRef.current);
    };
  }, [reduceMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = root.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const spawn = (count = 42) => {
      particles.current = Array.from({ length: count }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 2,
        a: 0.1 + Math.random() * 0.28,
        vx: -0.05 + Math.random() * 0.1,
        vy: -0.22 - Math.random() * 0.35,
        tw: 0.6 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    spawn();

    let last = performance.now();

    const loop = (time) => {
      const dt = Math.min(32, time - last);
      last = time;

      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createRadialGradient(w * 0.2, h * 0.12, 20, w * 0.2, h * 0.12, Math.max(w, h) * 0.65);
      grad.addColorStop(0, "rgba(255, 230, 140, 0.14)");
      grad.addColorStop(1, "rgba(255, 230, 140, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const p = parallax.current;

      for (const s of particles.current) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        if (s.y < -20 || s.x < -40 || s.x > w + 40) {
          s.x = Math.random() * w;
          s.y = h + 20 + Math.random() * 60;
        }

        const twinkle = (Math.sin(time / 350 + s.phase) + 1) / 2;
        const px = p.x * 8;
        const py = p.y * 6;

        ctx.beginPath();
        ctx.arc(s.x + px, s.y + py, s.r + twinkle * s.tw, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a * (0.5 + twinkle * 0.8)})`;
        ctx.fill();
      }

      rafParticlesRef.current = requestAnimationFrame(loop);
    };

    rafParticlesRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafParticlesRef.current) cancelAnimationFrame(rafParticlesRef.current);
    };
  }, []);

  const fieldOffset = useMemo(() => ({ x: -parallaxPos.x * 8, y: -parallaxPos.y * 6 }), [parallaxPos.x, parallaxPos.y]);
  const wolfOffset = useMemo(() => ({ x: -parallaxPos.x * 10, y: -parallaxPos.y * 8 }), [parallaxPos.x, parallaxPos.y]);

  return (
    <div ref={rootRef} className="splash-v2-root">
      <canvas ref={canvasRef} className="splash-v2-canvas" />

      <motion.img
        src={bgField}
        alt="Campo"
        className="splash-v2-field"
        style={{
          transform: reduceMotion ? undefined : `translate3d(${fieldOffset.x}px, ${fieldOffset.y}px, 0) scale(1.03)`,
        }}
        initial={{ scale: 1.06, opacity: 0 }}
        animate={{ scale: 1.03, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      <div className="splash-v2-vignette">
        <div className="splash-v2-vignette-gradient" />
        <div className="splash-v2-vignette-shadow" />
      </div>

      <div className="splash-v2-content-wrap">
        <div className="splash-v2-content-grid">
          <motion.div
            className="splash-v2-left"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="splash-v2-pill">
              <span className="splash-v2-pill-dot" />
              <span className="splash-v2-pill-text">Carregando…</span>
            </div>

            <p className="splash-v2-subtitle">{subtitle}</p>

            <div className="splash-v2-progress-wrap">
              <div className="splash-v2-progress-header">
                <span>Inicializando</span>
                <span>{Math.round(progress)}%</span>
              </div>

              <div className="splash-v2-progress-line-wrap">
                <motion.div
                  className="splash-v2-progress-line"
                  style={{ width: `${progress}%` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 110, damping: 18 }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="splash-v2-right"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          >
            <motion.div
              className="splash-v2-wolf-glow"
              animate={reduceMotion ? undefined : { opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.img
              src={wolf}
              alt="Lobo"
              className="splash-v2-wolf"
              style={{
                transform: reduceMotion ? undefined : `translate3d(${wolfOffset.x}px, ${wolfOffset.y}px, 0)`,
              }}
              initial={{ scale: 0.92, rotate: -2, y: 20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 90, damping: 16 }}
            />
          </motion.div>
        </div>
      </div>

      {done && !reduceMotion ? (
        <motion.div
          className="splash-v2-exit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />
      ) : null}
    </div>
  );
}
