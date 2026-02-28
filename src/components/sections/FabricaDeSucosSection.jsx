import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "../../lib/motionCompat";

const FRUITS = [
  { id: "morango", emoji: "🍓", color: "#ff4d7d" },
  { id: "abacaxi", emoji: "🍍", color: "#ffbf47" },
  { id: "limao", emoji: "🍋", color: "#b6ff53" },
  { id: "uva", emoji: "🍇", color: "#8a6dff" },
  { id: "manga", emoji: "🥭", color: "#ff9f4a" },
  { id: "maca", emoji: "🍏", color: "#7fdb72" },
  { id: "laranja", emoji: "🍊", color: "#ff9d2e" },
];

const BOMB = { id: "bomb", emoji: "💣" };
const STAR_FRUIT = { id: "star-fruit", emoji: "⭐", color: "#ffd84d" };
const GRAVITY = 0.14;
const ORDER_TIME_LIMIT = 20;
const ORDER_TIME_MIN = 10;
const RANKING_STORAGE_KEY = "kasucos-fabrica-ranking";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const RANKING_TABLE = import.meta.env.VITE_SUPABASE_RANKING_TABLE || "game_scores";
const random = (min, max) => Math.random() * (max - min) + min;
const pick = (list) => list[Math.floor(Math.random() * list.length)];

function createFruitSplits(item) {
  const base = {
    id: `${item.uid}-split-${Math.random()}`,
    emoji: item.emoji,
    x: item.x + item.size / 2,
    y: item.y + item.size / 2,
    size: item.size,
    rot: item.rot,
    createdAt: Date.now(),
  };

  return [
    {
      ...base,
      half: "left",
      peelGlow: item.color,
      offsetX: -item.size * 0.16,
      vx: random(-3.4, -1.2),
      vy: random(-3.8, -1.6),
      rotVel: random(-7, -3),
    },
    {
      ...base,
      half: "right",
      peelGlow: item.color,
      offsetX: item.size * 0.16,
      vx: random(1.2, 3.4),
      vy: random(-3.8, -1.6),
      rotVel: random(3, 7),
    },
  ];
}

function KatanaCursor() {
  return (
    <svg width="94" height="94" viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M60 13C62 11 65 12 66 14C68 17 67 20 65 22L24 63L15 54L60 13Z" fill="#B8DADE" />
      <path d="M23 62L15 54L10 58C8 60 8 63 10 65L13 68C15 70 18 70 20 68L23 65V62Z" fill="#32344D" />
      <path d="M18 56L14 60L24 70L28 66L18 56Z" fill="#282A3D" />
      <path d="M22 51C24 49 28 49 30 51L36 57C38 59 38 63 36 65L32 69C30 71 26 71 24 69L18 63C16 61 16 57 18 55L22 51Z" fill="#F1C240" />
    </svg>
  );
}

function normalizePlayerName(name) {
  return name.replace(/\s+/g, " ").trim().slice(0, 24);
}

function sortRanking(entries = []) {
  return [...entries]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
    })
    .slice(0, 10);
}

function loadLocalRanking() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RANKING_STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return sortRanking(parsed);
  } catch {
    return [];
  }
}

function saveLocalRanking(entries) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(sortRanking(entries)));
}

async function fetchSupabaseRanking() {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${RANKING_TABLE}`);
  url.searchParams.set("select", "player_name,score,date");
  url.searchParams.set("order", "score.desc,date.asc");
  url.searchParams.set("limit", "10");

  const response = await fetch(url.toString(), {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar ranking: ${response.status}`);
  }

  const data = await response.json();
  return sortRanking(data.map((item) => ({
    player_name: item.player_name,
    score: Number(item.score) || 0,
    date: item.date,
  })));
}

async function insertSupabaseScore(name, score) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${RANKING_TABLE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify([{ player_name: name, score }]),
  });

  if (!response.ok) {
    throw new Error(`Erro ao salvar pontuação: ${response.status}`);
  }
}

function orderTimeForWave(wave) {
  return Math.max(ORDER_TIME_MIN, ORDER_TIME_LIMIT - Math.floor((wave - 1) / 2));
}

function createItem(width, height, speed = 1, bombChance = 0.15) {
  const isBomb = Math.random() < bombChance;
  const fruit = isBomb ? BOMB : pick(FRUITS);
  const roll = Math.random();
  const isDoubleFruit = roll >= 0.12 && roll < 0.22;
  const isStarFruit = roll >= 0.22 && roll < 0.31;
  const baseFruit = pick(FRUITS);
  const size = isBomb ? random(72, 88) : random(86, 112);
  return {
    uid: `${Date.now()}-${Math.random()}`,
    kind: isBomb ? "bomb" : isDoubleFruit ? "doubleFruit" : isStarFruit ? "starFruit" : "fruit",
    fruitId: isBomb ? BOMB.id : baseFruit.id,
    emoji: isBomb ? BOMB.emoji : isStarFruit ? STAR_FRUIT.emoji : baseFruit.emoji,
    color: isBomb ? "#fff" : isStarFruit ? STAR_FRUIT.color : baseFruit.color || "#fff",
    x: random(40, Math.max(45, width - 90)),
    y: height + random(30, 120),
    vx: random(-1.8, 1.8),
    vy: random(-11.6, -9.1) * speed,
    size,
    rot: random(-25, 25),
    rotVel: random(-7, 7),
    cut: false,
  };
}

function intersectsSlash(item, a, b) {
  const cx = item.x + item.size / 2;
  const cy = item.y + item.size / 2;
  const radius = item.size * 0.42;

  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const acx = cx - a.x;
  const acy = cy - a.y;
  const ab2 = abx * abx + aby * aby;

  if (ab2 === 0) return false;

  const t = Math.max(0, Math.min(1, (acx * abx + acy * aby) / ab2));
  const px = a.x + abx * t;
  const py = a.y + aby * t;
  return Math.hypot(cx - px, cy - py) <= radius;
}

function buildOrder() {
  const pool = [...FRUITS].sort(() => Math.random() - 0.5);
  return pool.slice(0, 3).map((fruit, index) => ({
    slot: index,
    fruitId: fruit.id,
    emoji: fruit.emoji,
    fill: 0,
  }));
}

function JuiceFactoryNinja() {
  const arenaRef = useRef(null);
  const rafRef = useRef(null);
  const slashRef = useRef([]);
  const lastSpawnAtRef = useRef(0);
  const audioCtxRef = useRef(null);
  const lastSliceSoundAtRef = useRef(0);
  const phaseRef = useRef("idle");
  const waveRef = useRef(1);
  const sizeRef = useRef({ width: 980, height: 700 });
  const lastActiveItemsAtRef = useRef(Date.now());

  const [size, setSize] = useState({ width: 980, height: 700 });
  const [phase, setPhase] = useState("idle");
  const [items, setItems] = useState([]);
  const [slashTrail, setSlashTrail] = useState([]);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [nameError, setNameError] = useState("");
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [orderTimeLeft, setOrderTimeLeft] = useState(orderTimeForWave(1));
  const [bottles, setBottles] = useState(buildOrder);
  const [toast, setToast] = useState("Corte as frutas certas antes do tempo acabar para encher as garrafas 🧃");
  const [katanaPose, setKatanaPose] = useState({ x: 0, y: 0, angle: 0, visible: false, sparkAt: 0 });
  const [ranking, setRanking] = useState([]);
  const [rankingStatus, setRankingStatus] = useState("idle");
  const [rankingMessage, setRankingMessage] = useState("");
  const [slicedPieces, setSlicedPieces] = useState([]);
  const [sliceBursts, setSliceBursts] = useState([]);
  const hasSubmittedScoreRef = useRef(false);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    waveRef.current = wave;
  }, [wave]);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    if (items.length > 0) {
      lastActiveItemsAtRef.current = Date.now();
    }
  }, [items.length]);

  const expectedFruitIds = useMemo(() => bottles.map((x) => x.fruitId), [bottles]);
  const totalFill = useMemo(() => bottles.reduce((acc, bottle) => acc + bottle.fill, 0) / 3, [bottles]);

  useEffect(() => {
    const updateSize = () => {
      const node = arenaRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);


  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    async function loadRanking() {
      setRankingStatus("loading");
      const canUseSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

      if (!canUseSupabase) {
        setRanking(loadLocalRanking());
        setRankingStatus("ready");
        setRankingMessage("Ranking local (configure o Supabase para ranking global).");
        return;
      }

      try {
        const entries = await fetchSupabaseRanking();
        setRanking(entries);
        setRankingStatus("ready");
        setRankingMessage("Top 10 global carregado do Supabase.");
      } catch {
        setRanking(loadLocalRanking());
        setRankingStatus("ready");
        setRankingMessage("Não foi possível acessar o Supabase. Exibindo ranking local.");
      }
    }

    loadRanking();
  }, []);

  function resetGame() {
    cancelAnimationFrame(rafRef.current);
    lastSpawnAtRef.current = performance.now() - 1400;
    setItems([]);
    setSlashTrail([]);
    setScore(0);
    setCombo(0);
    setLives(3);
    setWave(1);
    setOrderTimeLeft(orderTimeForWave(1));
    setBottles(buildOrder());
    setToast("Corte as frutas certas antes do tempo acabar para encher as garrafas 🧃");
    setSlicedPieces([]);
    setSliceBursts([]);
    lastActiveItemsAtRef.current = Date.now();
    hasSubmittedScoreRef.current = false;
  }

  function startGame() {
    const normalizedName = normalizePlayerName(playerName);
    if (!normalizedName) {
      setNameError("Informe seu nome para iniciar a partida.");
      return;
    }

    if (normalizedName !== playerName) {
      setPlayerName(normalizedName);
    }

    setNameError("");
    resetGame();
    setPhase("play");
  }

  async function persistScore(finalScore) {
    if (hasSubmittedScoreRef.current) return;
    hasSubmittedScoreRef.current = true;

    const normalizedName = normalizePlayerName(playerName) || "Anônimo";
    const canUseSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

    if (canUseSupabase) {
      try {
        await insertSupabaseScore(normalizedName, finalScore);
        const freshRanking = await fetchSupabaseRanking();
        setRanking(freshRanking);
        setRankingStatus("ready");
        setRankingMessage("Pontuação salva no Supabase ✅");
        return;
      } catch {
        setRankingMessage("Falha ao salvar no Supabase. Pontuação salva localmente.");
      }
    }

    const localEntries = loadLocalRanking();
    const updated = sortRanking([
      ...localEntries,
      { player_name: normalizedName, score: finalScore, date: new Date().toISOString() },
    ]);
    saveLocalRanking(updated);
    setRanking(updated);
    setRankingStatus("ready");
  }

  function endGame(message) {
    setToast(message);
    setPhase("over");
    cancelAnimationFrame(rafRef.current);
    void persistScore(score);
  }

  function playSliceSound(type = "slice") {
    if (typeof window === "undefined") return;

    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtxRef.current = new Ctx();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(820, now);
    filter.Q.setValueAtTime(0.8, now);

    osc.connect(gain);
    gain.connect(filter);
    filter.connect(ctx.destination);

    if (type === "bomb") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.24);
    } else if (type === "wrong") {
      osc.type = "square";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.18);
    } else {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(230, now + 0.13);

      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.09), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      }

      const noise = ctx.createBufferSource();
      const noiseFilter = ctx.createBiquadFilter();
      const noiseGain = ctx.createGain();

      noise.buffer = buffer;
      noiseFilter.type = "highpass";
      noiseFilter.frequency.setValueAtTime(1200, now);
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.11, now + 0.012);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.09);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.13, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.start(now);
    osc.stop(now + 0.24);
  }

  function spawnLogic() {
    const now = performance.now();
    const currentWave = waveRef.current;
    const spawnInterval = Math.max(460, 1180 - currentWave * 65);

    setItems((prev) => {
      if (now - lastSpawnAtRef.current < spawnInterval) return prev;

      const speed = 0.9 + currentWave * 0.07;
      const max = Math.min(7, 2 + Math.floor(currentWave / 1.7));
      const bombChance = Math.min(0.34, 0.13 + currentWave * 0.017);
      if (prev.length >= max) return prev;

      lastSpawnAtRef.current = now;
      const next = [...prev];
      next.push(createItem(sizeRef.current.width, sizeRef.current.height, speed, bombChance));
      return next.slice(-max);
    });
  }

  function tick() {
    if (phaseRef.current !== "play") return;

    rafRef.current = requestAnimationFrame(tick);

    setItems((prev) =>
      prev
        .map((item) => ({
          ...item,
          x: item.x + item.vx,
          y: item.y + item.vy,
          vy: item.vy + GRAVITY,
          rot: item.rot + item.rotVel,
        }))
        .filter((item) => item.y < sizeRef.current.height + 120 && item.x > -140 && item.x < sizeRef.current.width + 140)
    );

    spawnLogic();

    setSlicedPieces((prev) =>
      prev
        .map((piece) => ({
          ...piece,
          x: piece.x + piece.vx,
          y: piece.y + piece.vy,
          vy: piece.vy + GRAVITY * 0.9,
          rot: piece.rot + piece.rotVel,
        }))
        .filter((piece) => piece.y < sizeRef.current.height + 140 && Date.now() - piece.createdAt < 850)
    );
  }

  useEffect(() => {
    if (phase !== "play") {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    lastSpawnAtRef.current = performance.now() - 1400;
    tick();

    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return;

    const fallbackSpawner = window.setInterval(() => {
      const arenaIsEmptyForTooLong = Date.now() - lastActiveItemsAtRef.current > 1200;
      if (!arenaIsEmptyForTooLong) return;

      lastActiveItemsAtRef.current = Date.now();
      setItems((prev) => {
        if (prev.length > 0) return prev;
        const currentWave = waveRef.current;
        const bombChance = Math.min(0.34, 0.13 + currentWave * 0.017);
        return [...prev, createItem(sizeRef.current.width, sizeRef.current.height, 0.95 + currentWave * 0.06, bombChance)];
      });
    }, 380);

    return () => window.clearInterval(fallbackSpawner);
  }, [phase]);

  function applySlice(pointA, pointB) {
    if (phase !== "play") return;

    let hits = 0;
    let wrong = 0;
    let bombHits = 0;
    let earnedPoints = 0;

    const splitEffects = [];
    const burstEffects = [];

    setItems((prev) =>
      prev.filter((item) => {
        const hit = intersectsSlash(item, pointA, pointB);
        if (!hit) return true;

        if (item.kind === "bomb") {
          bombHits += 1;
          return false;
        }

        hits += 1;
        splitEffects.push(...createFruitSplits(item));
        burstEffects.push({
          id: `${item.uid}-burst-${Math.random()}`,
          x: item.x + item.size / 2,
          y: item.y + item.size / 2,
          color: item.color,
          createdAt: Date.now(),
        });
        if (!expectedFruitIds.includes(item.fruitId)) {
          wrong += 1;
          return false;
        }

        const basePoints = 12 + combo * 2;
        const pointMultiplier = item.kind === "doubleFruit" ? 2 : 1;
        const starBonus = item.kind === "starFruit" ? 40 : 0;
        earnedPoints += basePoints * pointMultiplier + starBonus;

        setBottles((old) => {
          let consumed = false;
          return old.map((bottle) => {
            if (consumed || bottle.fruitId !== item.fruitId || bottle.fill >= 1) return bottle;
            consumed = true;
            const fillAmount = item.kind === "doubleFruit" ? 0.5 : item.kind === "starFruit" ? 0.4 : 0.34;
            return { ...bottle, fill: Math.min(1, bottle.fill + fillAmount) };
          });
        });

        return false;
      })
    );

    if (splitEffects.length > 0) {
      setSlicedPieces((old) => [...old, ...splitEffects].slice(-24));
      setSliceBursts((old) => [...old, ...burstEffects].slice(-16));
    }

    if (bombHits > 0) {
      playSliceSound("bomb");
      setCombo(0);
      setOrderTimeLeft((old) => Math.max(0, old - bombHits * 2));
      setToast(`💣 Bomba cortada! -${bombHits * 2}s no pedido.`);
    }

    if (wrong > 0) {
      playSliceSound("wrong");
      setLives((old) => {
        const next = old - 1;
        if (next <= 0) {
          endGame("Fim de jogo: só corte as frutas do pedido!");
          return 0;
        }
        return next;
      });
      setCombo(0);
      setToast("Fruta errada! Foque no pedido da fábrica.");
    }

    if (hits > 0 && wrong === 0) {
      playSliceSound("slice");
      setCombo((old) => old + 1);
      setScore((old) => old + earnedPoints);
      setToast(earnedPoints > hits * (12 + combo * 2) ? `Especial! +${earnedPoints} pts` : hits > 1 ? `Combo x${combo + 1}!` : "Corte perfeito!");
    }
  }

  useEffect(() => {
    if (phase !== "play") return;

    if (totalFill >= 1) {
      const nextWave = wave + 1;
      setScore((old) => old + 250 + wave * 20);
      setWave(nextWave);
      setOrderTimeLeft(orderTimeForWave(nextWave));
      setBottles(buildOrder());
      setToast(`Pedido pronto! Onda ${nextWave} iniciada: mais velocidade e pressão ⏫`);
    }
  }, [totalFill, phase, wave]);

  useEffect(() => {
    if (phase !== "play") return;

    const timer = window.setInterval(() => {
      setOrderTimeLeft((old) => Math.max(0, old - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (sliceBursts.length === 0) return undefined;
    const timer = window.setTimeout(() => {
      setSliceBursts((old) => old.filter((burst) => Date.now() - burst.createdAt < 220));
    }, 120);

    return () => window.clearTimeout(timer);
  }, [sliceBursts]);

  useEffect(() => {
    if (phase !== "play" || orderTimeLeft > 0) return;

    setCombo(0);
    setBottles(buildOrder());
    setOrderTimeLeft(orderTimeForWave(waveRef.current));
    setToast("⏳ Tempo esgotado! Você perdeu 1 vida e o pedido foi reiniciado.");

    setLives((old) => {
      const next = old - 1;
      if (next <= 0) {
        endGame("Fim de jogo: o tempo da fábrica acabou para você!");
        return 0;
      }
      return next;
    });
  }, [orderTimeLeft, phase]);

  function toLocalPoint(ev) {
    const rect = arenaRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const source = "touches" in ev ? ev.touches[0] : ev;
    return { x: source.clientX - rect.left, y: source.clientY - rect.top, t: Date.now() };
  }

  function onPointerDown(ev) {
    if (phase !== "play") return;
    const point = toLocalPoint(ev);
    slashRef.current = [point];
    setSlashTrail([point]);
    setKatanaPose((old) => ({ ...old, x: point.x, y: point.y, visible: true }));
  }

  function onPointerMove(ev) {
    if (phase !== "play") return;
    if (slashRef.current.length === 0) return;

    const point = toLocalPoint(ev);
    const arr = [...slashRef.current, point].slice(-8);
    slashRef.current = arr;
    setSlashTrail(arr);

    const previous = arr[arr.length - 2];
    if (previous) {
      const angle = Math.atan2(point.y - previous.y, point.x - previous.x) * (180 / Math.PI);
      setKatanaPose({ x: point.x, y: point.y, angle, visible: true, sparkAt: Date.now() });

      const distance = Math.hypot(point.x - previous.x, point.y - previous.y);
      const now = Date.now();
      if (distance > 14 && now - lastSliceSoundAtRef.current > 90) {
        playSliceSound("slice");
        lastSliceSoundAtRef.current = now;
      }

      applySlice(previous, point);
    }
  }

  function onPointerUp() {
    slashRef.current = [];
    setKatanaPose((old) => ({ ...old, visible: false }));
    setTimeout(() => setSlashTrail([]), 40);
  }

  return (
    <section id="fabrica" style={{ padding: "48px 0 20px", background: "#f4f2fb" }}>
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 14px" }}>
        <h2 className="section-title fruit-ninja-title section-title--left" style={{ margin: 0 }}>Fábrica de sucos</h2>
        <p style={{ marginTop: 10, color: "#473a75", fontSize: 30, fontWeight: 800 }}>Fruit Ninja KaSucos</p>
        <div
          ref={arenaRef}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
          style={{
            marginTop: 16,
            position: "relative",
            height: "76vh",
            minHeight: 560,
            overflow: "hidden",
            borderRadius: 28,
            border: "2px solid rgba(255,255,255,0.22)",
            background:
              "radial-gradient(900px 400px at 70% 0%, rgba(255,104,104,0.3), transparent 60%), radial-gradient(700px 300px at 10% 0%, rgba(255,186,85,0.3), transparent 60%), linear-gradient(180deg, #34161d, #16183a)",
            boxShadow: "0 20px 55px rgba(30,18,46,0.4)",
            userSelect: "none",
            touchAction: "none",
          }}
        >
          <div style={{ position: "absolute", inset: 14, pointerEvents: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {bottles.map((bottle) => (
                  <div key={bottle.slot} style={{ width: 120, borderRadius: 16, border: "1px solid rgba(255,255,255,0.24)", padding: 10, background: "rgba(255,255,255,0.08)" }}>
                    <div style={{ fontWeight: 900, color: "white", marginBottom: 8 }}>{bottle.emoji} Garrafa</div>
                    <div style={{ display: "grid", justifyItems: "center" }}>
                      <div
                        style={{
                          position: "relative",
                          width: 34,
                          height: 56,
                          borderRadius: "11px 11px 12px 12px",
                          border: "2px solid rgba(255,255,255,0.68)",
                          background: "rgba(255,255,255,0.08)",
                          overflow: "hidden",
                          boxShadow: "inset 0 0 10px rgba(0,0,0,0.3)",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: -7,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 14,
                            height: 9,
                            borderRadius: "7px 7px 2px 2px",
                            border: "2px solid rgba(255,255,255,0.68)",
                            borderBottom: "none",
                            background: "rgba(255,255,255,0.08)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: `${Math.max(0, Math.min(1, bottle.fill)) * 100}%`,
                            background: "linear-gradient(180deg,#8effcd,#34c28a)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gap: 8, justifyItems: "end", color: "white", fontWeight: 900 }}>
                <div>🥷 Score: {score}</div>
                <div>⚡ Combo: x{Math.max(1, combo)}</div>
                <div>🫀 Vidas: {"❤️".repeat(lives)}</div>
                <div>🚚 Onda: {wave}</div>
                <div>🔥 Dificuldade: {Math.min(10, wave)}</div>
                <div style={{ color: orderTimeLeft <= 6 ? "#ff9a9a" : "#ffffff" }}>⏳ Tempo: {orderTimeLeft}s</div>
                <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85 }}>🟡 2x pontos • ⭐ bônus • 💣 -2s</div>
              </div>
            </div>

            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 12, background: "rgba(0,0,0,0.28)", color: "#fff", fontWeight: 700 }}>{toast}</div>
          </div>

          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.uid}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.16 }}
                style={{
                  position: "absolute",
                  left: item.x,
                  top: item.y,
                  width: item.size,
                  height: item.size,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  fontSize: item.size * 0.62,
                  background: item.kind === "bomb" ? "rgba(14,13,17,0.88)" : "rgba(255,255,255,0.08)",
                  border: `1px solid ${item.kind === "bomb"
                    ? "rgba(255,70,70,0.8)"
                    : item.kind === "doubleFruit"
                      ? "rgba(255,226,121,0.95)"
                      : item.kind === "starFruit"
                        ? "rgba(255,244,156,0.95)"
                        : "rgba(255,255,255,0.2)"}`,
                  transform: `rotate(${item.rot}deg)`,
                  boxShadow: item.kind === "bomb"
                    ? "0 0 16px rgba(255,60,60,0.45)"
                    : item.kind === "doubleFruit"
                      ? "0 0 22px rgba(255,218,90,0.48)"
                      : item.kind === "starFruit"
                        ? "0 0 22px rgba(255,245,164,0.5)"
                        : "0 0 20px rgba(255,255,255,0.16)",
                }}
              >
                {item.emoji}
                {item.kind === "doubleFruit" && (
                  <span style={{ position: "absolute", top: 4, right: 6, fontSize: 16, fontWeight: 900, color: "#fff3c3", textShadow: "0 0 10px rgba(255,214,109,0.95)" }}>2x</span>
                )}
                {item.kind === "starFruit" && (
                  <span style={{ position: "absolute", top: 5, right: 8, fontSize: 16, fontWeight: 900, color: "#fff9d4", textShadow: "0 0 10px rgba(255,236,132,0.95)" }}>+</span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {slicedPieces.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0.25, scale: 0.9 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                style={{
                  position: "absolute",
                  left: piece.x,
                  top: piece.y,
                  width: piece.size,
                  height: piece.size,
                  transform: `translate(-50%, -50%) translateX(${piece.offsetX}px) rotate(${piece.rot}deg)`,
                  fontSize: piece.size * 0.62,
                  display: "grid",
                  placeItems: "center",
                  clipPath: piece.half === "left" ? "polygon(0 0, 50% 0, 50% 100%, 0 100%)" : "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
                  filter: `drop-shadow(0 0 12px ${piece.peelGlow || "rgba(255,255,255,0.25)"})`,
                  pointerEvents: "none",
                }}
              >
                <span style={{ transform: `translateX(${piece.half === "left" ? piece.size * 0.1 : -piece.size * 0.1}px)` }}>{piece.emoji}</span>
                <span
                  style={{
                    position: "absolute",
                    inset: "8% 47%",
                    background: "rgba(255,255,255,0.55)",
                    opacity: 0.85,
                    boxShadow: "0 0 8px rgba(255,255,255,0.8)",
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {sliceBursts.map((burst) => (
              <motion.div
                key={burst.id}
                initial={{ opacity: 0.9, scale: 0.3 }}
                animate={{ opacity: 0, scale: 1.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  left: burst.x,
                  top: burst.y,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)",
                  background: `radial-gradient(circle, rgba(255,255,255,0.95), ${burst.color} 70%, transparent 100%)`,
                  filter: `drop-shadow(0 0 12px ${burst.color})`,
                  pointerEvents: "none",
                }}
              />
            ))}
          </AnimatePresence>

          {slashTrail.length > 1 && (
            <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <polyline
                points={slashTrail.map((point) => `${point.x},${point.y}`).join(" ")}
                fill="none"
                stroke="rgba(170,255,255,0.95)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {katanaPose.visible && (
            <div
              style={{
                position: "absolute",
                left: katanaPose.x,
                top: katanaPose.y,
                transform: `translate(-50%, -50%) rotate(${katanaPose.angle}deg)`,
                pointerEvents: "none",
                filter: "drop-shadow(0 0 14px rgba(173,249,255,0.95))",
              }}
            >
              <KatanaCursor />
            </div>
          )}

          {Date.now() - katanaPose.sparkAt < 80 && (
            <div
              style={{
                position: "absolute",
                left: katanaPose.x,
                top: katanaPose.y,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                color: "#c9fbff",
                fontWeight: 900,
                textShadow: "0 0 14px rgba(108,233,255,0.95)",
              }}
            >
              ✦
            </div>
          )}

          {phase !== "play" && (
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(5,6,12,0.5)" }}>
              <div style={{ background: "rgba(24,20,44,0.92)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20, padding: "22px 24px", textAlign: "center", color: "white" }}>
                <h3 style={{ marginTop: 0 }}>{phase === "idle" ? "Fruit Ninja da Fábrica" : "Fim da partida"}</h3>
                <p style={{ marginTop: 0 }}>{phase === "idle" ? "Corte frutas do pedido, encha as garrafas a tempo e evite bombas." : `Pontuação final: ${score}`}</p>
                <label style={{ display: "grid", gap: 6, textAlign: "left", marginBottom: 12 }}>
                  <span style={{ fontWeight: 700 }}>Nome para registro</span>
                  <input
                    type="text"
                    value={playerName}
                    maxLength={24}
                    onChange={(ev) => setPlayerName(ev.target.value)}
                    placeholder="Digite seu nome"
                    style={{ borderRadius: 10, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.08)", color: "white", padding: "10px 12px", fontWeight: 600 }}
                  />
                </label>
                {nameError && <p style={{ marginTop: -4, marginBottom: 12, color: "#ff9a9a", fontWeight: 700 }}>{nameError}</p>}
                <button
                  type="button"
                  onClick={startGame}
                  style={{ border: "none", padding: "12px 20px", borderRadius: 12, background: "linear-gradient(90deg,#ff7a3b,#f4465a)", color: "white", fontWeight: 900, cursor: "pointer" }}
                >
                  {phase === "idle" ? "Começar" : "Jogar novamente"}
                </button>

                <div style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 14, textAlign: "left" }}>
                  <p style={{ margin: "0 0 8px", fontWeight: 800 }}>🏆 Top 10 pontuadores</p>
                  {rankingStatus === "loading" && <p style={{ margin: 0, opacity: 0.8 }}>Carregando ranking...</p>}
                  {rankingStatus !== "loading" && ranking.length === 0 && <p style={{ margin: 0, opacity: 0.8 }}>Ainda sem pontuações registradas.</p>}
                  {ranking.map((entry, index) => (
                    <div key={`${entry.player_name}-${entry.date}-${index}`} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontWeight: 700, opacity: 0.95 }}>
                      <span>{index + 1}. {entry.player_name}</span>
                      <span>{entry.score} pts</span>
                    </div>
                  ))}
                  {rankingMessage && <p style={{ margin: "8px 0 0", fontSize: 12, opacity: 0.8 }}>{rankingMessage}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function FabricaDeSucosSection() {
  return <JuiceFactoryNinja />;
}
