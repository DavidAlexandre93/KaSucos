import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "../../lib/motionCompat";

const Icon = ({ children, size = 16 }) => (
  <span style={{ fontSize: size, lineHeight: 1 }} aria-hidden>
    {children}
  </span>
);

const Droplets = ({ size }) => <Icon size={size}>💧</Icon>;
const Trophy = ({ size }) => <Icon size={size}>🏆</Icon>;
const RotateCcw = ({ size }) => <Icon size={size}>↺</Icon>;
const Volume2 = ({ size }) => <Icon size={size}>🔊</Icon>;
const VolumeX = ({ size }) => <Icon size={size}>🔇</Icon>;
const InfinityIcon = ({ size }) => <Icon size={size}>♾️</Icon>;
const Crown = ({ size }) => <Icon size={size}>👑</Icon>;
const Trash2 = ({ size }) => <Icon size={size}>🗑️</Icon>;

class Howl {
  constructor({ src = [], volume = 1 }) {
    this.audio = new Audio(src[0]);
    this.audio.volume = volume;
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  play() {
    this.audio.currentTime = 0;
    this.audio.play().catch(() => {});
  }

  unload() {
    this.audio.pause();
    this.audio.src = "";
  }
}

const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const now = () => performance.now();

function formatTime(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

const FRUITS = [
  { id: "acerola", label: "Acerola", color: "#E53950", emoji: "🍒" },
  { id: "orange", label: "Laranja", color: "#FFA500" },
  { id: "strawberry", label: "Morango", color: "#FF3E6C", emoji: "🍓" },
  { id: "pineapple", label: "Abacaxi", color: "#FFD54D" },
  { id: "grape", label: "Uva", color: "#7B61FF" },
  { id: "guava", label: "Goiaba", color: "#FF6A8C", emoji: "🍑" },
  { id: "lemon", label: "Limão", color: "#B7FF5A" },
  { id: "passionfruit", label: "Maracujá", color: "#F4BE34" },
  { id: "mango", label: "Manga", color: "#FFB14A" },
  { id: "greenapple", label: "Maçã Verde", color: "#73C86A" },
];

const FRUIT_EMOJIS_BY_ID = {
  acerola: "🍒",
  orange: "🍊",
  strawberry: "🍓",
  pineapple: "🍍",
  grape: "🍇",
  guava: "🍑",
  lemon: "🍋",
  passionfruit: "🥭",
  mango: "🥭",
  greenapple: "🍏",
};

const RECIPES = [
  { name: "Tropical", need: ["mango", "pineapple", "orange"] },
  { name: "Cítrico", need: ["lemon", "orange", "orange"] },
  { name: "Berry Blast", need: ["strawberry", "grape", "strawberry"] },
  { name: "Uva Power", need: ["grape", "grape", "lemon"] },
  { name: "Clássico KaSucos", need: ["acerola", "orange", "strawberry"] },
  { name: "Horta Verde", need: ["greenapple", "lemon", "pineapple"] },
  { name: "Sol do Verão", need: ["passionfruit", "mango", "orange"] },
  { name: "Vermelho Forte", need: ["acerola", "strawberry", "grape"] },
];

function pickRecipe() {
  const r = RECIPES[Math.floor(Math.random() * RECIPES.length)];
  return { ...r, id: `${r.name}-${Date.now()}`, progress: [] };
}

function fruitById(id) {
  return FRUITS.find((f) => f.id === id) || FRUITS[0];
}

const GAME_THEME = {
  id: "kasucos",
  bg: "radial-gradient(1100px 600px at 20% 10%, rgba(164,92,255,0.28), transparent 60%), radial-gradient(900px 500px at 90% 15%, rgba(116,222,110,0.16), transparent 55%), linear-gradient(180deg, #251044, #11203f)",
  card: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.14)",
  glow: "0 14px 44px rgba(0,0,0,0.42)",
  accent: "linear-gradient(90deg, rgba(162,111,255,0.94), rgba(109,215,95,0.9))",
  textSub: "rgba(255,255,255,0.78)",
};

const LS_KEY = "juice_splash_ranking_v1";
const PLAYER_NAME_KEY = "juice_splash_player_name_v1";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_TABLE = import.meta.env.VITE_SUPABASE_RANKING_TABLE || "game_scores";

function hasSupabaseConfig() {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
}

async function requestSupabase(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let details = "";
    try {
      const json = await response.json();
      details = json?.message || json?.error || "";
    } catch {
      details = await response.text();
    }
    throw new Error(`Supabase ${response.status}${details ? `: ${details}` : ""}`);
  }

  return response;
}

async function fetchRankingFromSupabase() {
  if (!hasSupabaseConfig()) return [];
  const query = new URLSearchParams({
    select: "id,player_name,score,skin,date,mode",
    order: "score.desc,date.asc",
    limit: "10",
  });

  const response = await requestSupabase(`${SUPABASE_TABLE}?${query.toString()}`);
  const rows = await response.json();
  return Array.isArray(rows) ? rows : [];
}

async function saveScoreToSupabase(entry) {
  if (!hasSupabaseConfig()) return;

  await requestSupabase(SUPABASE_TABLE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(entry),
  });
}

async function deletePlayerScoresFromSupabase(playerName) {
  if (!hasSupabaseConfig()) return;
  const query = new URLSearchParams({ player_name: `eq.${playerName}` });
  await requestSupabase(`${SUPABASE_TABLE}?${query.toString()}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=minimal",
    },
  });
}

function loadRanking() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
function saveRanking(list) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {
    // noop
  }
}

function loadPlayerName() {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY) || "";
  } catch {
    return "";
  }
}

function savePlayerName(name) {
  const normalized = (name || "").trim().slice(0, 24);
  try {
    if (!normalized) {
      localStorage.removeItem(PLAYER_NAME_KEY);
      return;
    }
    localStorage.setItem(PLAYER_NAME_KEY, normalized);
  } catch {
    // noop
  }
}

function normalizePlayerName(name) {
  return (name || "").trim().slice(0, 24);
}
function pushScore(list, entry) {
  const next = [...list, entry].sort((a, b) => b.score - a.score).slice(0, 10);
  return next;
}

const SFX_SRC = {
  catch:
    "data:audio/wav;base64,UklGRmQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YVAAAAAAAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8A",
  combo:
    "data:audio/wav;base64,UklGRmQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YVAAAAAAAP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A",
  serve:
    "data:audio/wav;base64,UklGRmQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YVAAAAAAAP8A/wD/AP8AAP8AAP8A/wD/AP8AAP8A/wD/AP8AAP8A/wD/AP8AAP8A/wD/AP8AAP8A",
  gameover:
    "data:audio/wav;base64,UklGRmQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YVAAAAAAAP8AAP8AAP8AAP8AAP8AAP8AAP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A",
  boss:
    "data:audio/wav;base64,UklGRmQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YVAAAAAAAP8A/wD/AP8A/wD/AP8AAP8AAP8A/wD/AP8A/wD/AP8AAP8AAP8A/wD/AP8AAP8A",
};

function useSfx() {
  const [muted, setMuted] = useState(false);
  const soundsRef = useRef(null);

  useEffect(() => {
    soundsRef.current = {
      catch: new Howl({ src: [SFX_SRC.catch], volume: 0.35 }),
      combo: new Howl({ src: [SFX_SRC.combo], volume: 0.35 }),
      serve: new Howl({ src: [SFX_SRC.serve], volume: 0.45 }),
      gameover: new Howl({ src: [SFX_SRC.gameover], volume: 0.55 }),
      boss: new Howl({ src: [SFX_SRC.boss], volume: 0.45 }),
    };
    return () => {
      Object.values(soundsRef.current || {}).forEach((s) => s.unload?.());
    };
  }, []);

  const play = (key) => {
    if (muted) return;
    const s = soundsRef.current?.[key];
    if (!s) return;
    s.stop();
    s.play();
  };

  return { muted, setMuted, play };
}

function makeFruit({ width, level = 1 }) {
  const f = FRUITS[Math.floor(Math.random() * FRUITS.length)];
  const speedBoost = 1 + Math.min(1.6, level * 0.05);
  return {
    uid: `${Date.now()}-${Math.floor(Math.random() * 1e9)}`,
    kind: "fruit",
    fruitId: f.id,
    x: rand(10, Math.max(10, width - 62)),
    y: rand(-260, -40),
    vy: rand(120, 230) * speedBoost,
    r: rand(18, 28),
    spin: rand(-120, 120),
  };
}

function makePower({ width, level = 1 }) {
  const types = ["slow", "double", "magnet"];
  const powerType = types[Math.floor(Math.random() * types.length)];
  const speedBoost = 1 + Math.min(1.3, level * 0.04);
  return {
    uid: `${Date.now()}-P-${Math.floor(Math.random() * 1e9)}`,
    kind: "power",
    powerType,
    fruitId: "lemon",
    x: rand(10, Math.max(10, width - 62)),
    y: rand(-320, -60),
    vy: rand(90, 150) * speedBoost,
    r: rand(18, 26),
    spin: rand(-160, 160),
  };
}

function makeBoss({ width, level = 1 }) {
  const speedBoost = 1 + Math.min(1.8, level * 0.05);
  return {
    uid: `${Date.now()}-B-${Math.floor(Math.random() * 1e9)}`,
    kind: "boss",
    fruitId: "boss",
    x: rand(10, Math.max(10, width - 84)),
    y: rand(-380, -120),
    vy: rand(90, 140) * speedBoost,
    r: rand(32, 40),
    spin: rand(-60, 60),
    hp: Math.max(2, 2 + Math.floor(level / 3)),
  };
}

function JuiceSplashGameFull() {
  const wrapRef = useRef(null);
  const arenaRef = useRef(null);
  const rafRef = useRef(null);
  const lastRef = useRef(now());
  const { muted, setMuted, play } = useSfx();
  const theme = GAME_THEME;
  const [size, setSize] = useState({ width: 360, height: 680 });
  const [phase, setPhase] = useState("idle");
  const [mode] = useState("endless");
  const [recipe, setRecipe] = useState(() => pickRecipe());
  const [entities, setEntities] = useState([]);
  const entitiesRef = useRef([]);
  const [pops, setPops] = useState([]);
  const [toast, setToast] = useState(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [streakTimer, setStreakTimer] = useState(0);
  const [cup, setCup] = useState(0);
  const [level, setLevel] = useState(1);
  const [danger, setDanger] = useState(0);
  const [bossTimer, setBossTimer] = useState(0);
  const [power, setPower] = useState({ slow: 0, double: 0, magnet: 0 });
  const [ranking, setRanking] = useState(() => (typeof window !== "undefined" ? loadRanking() : []));
  const [playerName, setPlayerName] = useState(() => (typeof window !== "undefined" ? loadPlayerName() : ""));
  const [nameValidationError, setNameValidationError] = useState(false);
  const [rankingScope, setRankingScope] = useState(() => (hasSupabaseConfig() ? "global" : "local"));
  const [rankingMessage, setRankingMessage] = useState(() =>
    hasSupabaseConfig() ? "Ranking global (Supabase)" : "Sem Supabase configurado. Usando ranking local."
  );
  const [blenderXPercent, setBlenderXPercent] = useState(50);
  const bestScore = ranking?.[0]?.score ?? 0;
  const phaseRef = useRef(phase);
  const levelRef = useRef(level);
  const scoreRef = useRef(score);
  const powerRef = useRef(power);
  const recipeRef = useRef(recipe);
  const sizeRef = useRef(size);

  const dragRef = useRef({ draggingUid: null, start: null, offset: { x: 0, y: 0 }, moved: false, pointerKind: "mouse" });
  const blenderDragRef = useRef({ active: false });
  const isMobile = size.width < 720;
  const isTablet = size.width >= 720 && size.width < 1024;

  const moveBlender = (nextPercent) => {
    setBlenderXPercent(clamp(nextPercent, 12, 88));
  };

  const blenderZone = useMemo(() => {
    const w = isMobile ? 120 : 130;
    const h = isMobile ? 172 : 182;
    const x = clamp(Math.round((size.width * blenderXPercent) / 100 - w / 2), 12, size.width - w - 12);
    const y = size.height - (isMobile ? 290 : 318);
    return { x, y, w, h };
  }, [blenderXPercent, isMobile, size.height, size.width]);

  const blenderZoneRef = useRef(blenderZone);

  const cupZone = useMemo(() => {
    const w = Math.min(320, Math.max(240, size.width - 28));
    const x = Math.floor((size.width - w) / 2);
    const y = size.height - (isMobile ? 188 : 210);
    return { x, y, w, h: 170 };
  }, [size.width, size.height, isMobile]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setSize({
        width: Math.max(320, Math.floor(rect.width)),
        height: Math.max(520, Math.min(760, Math.floor(rect.height || 680))),
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    entitiesRef.current = entities;
  }, [entities]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    powerRef.current = power;
  }, [power]);

  useEffect(() => {
    recipeRef.current = recipe;
  }, [recipe]);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    blenderZoneRef.current = blenderZone;
  }, [blenderZone]);

  useEffect(() => {
    const handleKeyMove = (event) => {
      const target = event.target;
      const isTypingField =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT");

      if (isTypingField) return;

      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        setBlenderXPercent((current) => clamp(current - 6, 12, 88));
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        setBlenderXPercent((current) => clamp(current + 6, 12, 88));
      }
    };

    window.addEventListener("keydown", handleKeyMove);
    return () => window.removeEventListener("keydown", handleKeyMove);
  }, []);

  useEffect(() => {
    savePlayerName(playerName);
  }, [playerName]);

  useEffect(() => {
    let active = true;
    async function loadGlobalRanking() {
      if (!hasSupabaseConfig()) return;
      try {
        const rows = await fetchRankingFromSupabase();
        if (!active) return;
        if (rows.length > 0) {
          setRanking(rows);
          setRankingScope("global");
          setRankingMessage("Ranking global (Supabase)");
        } else {
          setRanking([]);
          setRankingScope("global");
          setRankingMessage("Ranking global vazio. Seja o primeiro a pontuar!");
        }
      } catch {
        if (!active) return;
        setRankingScope("local");
        setRankingMessage("Não foi possível carregar o Supabase. Exibindo ranking local.");
      }
    }

    loadGlobalRanking();
    return () => {
      active = false;
    };
  }, []);

  function showToast(kind, text, ms = 1400) {
    setToast({ kind, text });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), ms);
  }

  function resetAll() {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    phaseRef.current = "idle";
    setPhase("idle");
    setScore(0);
    setCombo(1);
    setStreakTimer(0);
    setCup(0);
    setDanger(0);
    setLevel(1);
    setBossTimer(9000);
    setPower({ slow: 0, double: 0, magnet: 0 });
    const nextRecipe = pickRecipe();
    recipeRef.current = nextRecipe;
    setRecipe(nextRecipe);
    setEntities([]);
    setPops([]);
    setToast(null);
    dragRef.current = { draggingUid: null, start: null, offset: { x: 0, y: 0 }, moved: false, pointerKind: "mouse" };
    blenderDragRef.current = { active: false };
  }

  function startGame() {
    const safeName = normalizePlayerName(playerName);
    if (!safeName) {
      setNameValidationError(true);
      showToast("danger", "Digite um nome obrigatório para jogar.", 1700);
      return;
    }

    setNameValidationError(false);
    if (safeName !== playerName) setPlayerName(safeName);
    resetAll();
    phaseRef.current = "play";
    setPhase("play");
    showToast("info", "Arraste e SOLTE as frutas no liquidificador! 🧃", 2000);
    setEntities(() => {
      const arr = [];
      for (let i = 0; i < 10; i += 1) arr.push(makeFruit({ width: size.width, level: 1 }));
      return arr;
    });
    lastRef.current = now();
    loop();
  }

  async function endGame(reason = "Fim de jogo!") {
    play("gameover");
    showToast("danger", reason, 2200);
    phaseRef.current = "over";
    setPhase("over");
    cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    const entry = {
      player_name: normalizePlayerName(playerName),
      score: scoreRef.current,
      skin: theme.id,
      date: new Date().toISOString(),
      mode,
    };

    const next = pushScore(loadRanking(), entry);
    saveRanking(next);

    if (hasSupabaseConfig()) {
      try {
        await saveScoreToSupabase(entry);
        const globalRows = await fetchRankingFromSupabase();
        setRanking(globalRows);
        setRankingScope("global");
        setRankingMessage(globalRows.length > 0 ? "Ranking global (Supabase)" : "Ranking global vazio. Seja o primeiro a pontuar!");
      } catch {
        setRanking(next);
        setRankingScope("local");
        setRankingMessage("Falha ao salvar no Supabase. Ranking local atualizado.");
      }
      return;
    }

    setRanking(next);
    setRankingScope("local");
    setRankingMessage("Sem Supabase configurado. Usando ranking local.");
  }

  function inZone(px, py, zone) {
    return px >= zone.x && px <= zone.x + zone.w && py >= zone.y && py <= zone.y + zone.h;
  }

  function needNextFruit(r) {
    return r.need[r.progress.length];
  }

  function loop() {
    rafRef.current = requestAnimationFrame(loop);
    const t = now();
    const dt = Math.min(50, t - lastRef.current);
    lastRef.current = t;
    if (phaseRef.current !== "play") return;

    setPower((p) => ({
      slow: Math.max(0, p.slow - dt),
      double: Math.max(0, p.double - dt),
      magnet: Math.max(0, p.magnet - dt),
    }));

    setStreakTimer((s) => {
      const ns = Math.max(0, s - dt);
      if (ns === 0) setCombo((c) => Math.max(1, c - 1));
      return ns;
    });

    setDanger((d) => {
      const inc = 0.015 + levelRef.current * 0.002;
      const nd = d + inc * (dt / 16.67);
      if (nd >= 100) {
        endGame("A cozinha explodiu de tanta bagunça 💥");
        return 100;
      }
      return nd;
    });

    setLevel(() => clamp(1 + Math.floor(scoreRef.current / 600), 1, 50));

    setBossTimer((ms) => {
      let n = ms - dt;
      if (n <= 0) {
        play("boss");
        showToast("info", "BOSS FRUIT! Derrube a fruta chefe! 👑", 1700);
        setEntities((arr) => [...arr, makeBoss({ width: sizeRef.current.width, level: levelRef.current })]);
        n = Math.max(6000, 15000 - levelRef.current * 350);
      }
      return n;
    });

    const slowFactor = powerRef.current.slow > 0 ? 0.55 : 1;
    const magnetOn = powerRef.current.magnet > 0;

    setEntities((prev) => {
      const autoBlended = [];
      let arr = prev.flatMap((e) => {
        if (dragRef.current.draggingUid === e.uid) return e;
        let nx = e.x;
        const ny = e.y + (e.vy * slowFactor * dt) / 1000;

        if (magnetOn && e.kind === "fruit") {
          const cx = blenderZoneRef.current.x + blenderZoneRef.current.w / 2;
          const dx = cx - (e.x + 26);
          nx = e.x + dx * 0.004;
        }

        if (ny > sizeRef.current.height + 80) {
          if (e.kind === "power") return [makePower({ width: sizeRef.current.width, level: levelRef.current })];
          if (e.kind === "boss") return [makeBoss({ width: sizeRef.current.width, level: levelRef.current })];
          return [makeFruit({ width: sizeRef.current.width, level: levelRef.current })];
        }

        if (e.kind === "fruit") {
          const centerX = nx + 26;
          const centerY = ny + 26;
          if (inZone(centerX, centerY, blenderZoneRef.current)) {
            autoBlended.push({ ...e, x: nx, y: ny });
            return [];
          }
        }

        return [{ ...e, x: nx, y: ny }];
      });

      const maxEntities = 14 + Math.min(8, Math.floor(levelRef.current / 2));
      if (Math.random() < 0.012 + levelRef.current * 0.0004) {
        arr = [...arr, makeFruit({ width: sizeRef.current.width, level: levelRef.current })];
      }
      if (Math.random() < 0.0035 && arr.filter((x) => x.kind === "power").length < 2) {
        arr = [...arr, makePower({ width: sizeRef.current.width, level: levelRef.current })];
      }

      if (arr.length > maxEntities) arr = arr.slice(arr.length - maxEntities);

      if (autoBlended.length > 0) {
        queueMicrotask(() => {
          autoBlended.forEach((ent) => handleDropIntoBlender(ent, { skipRemoval: true }));
        });
      }

      return arr;
    });
  }

  function getLocalPoint(ev) {
    const rect = arenaRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const clientX = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
    const clientY = "touches" in ev ? ev.touches[0].clientY : ev.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function startDrag(uid, ev) {
    if (phaseRef.current !== "play") return;
    ev.preventDefault();
    const pt = getLocalPoint(ev);
    const ent = entitiesRef.current.find((x) => x.uid === uid);
    if (!ent) return;
    dragRef.current.draggingUid = uid;
    dragRef.current.start = pt;
    dragRef.current.offset = { x: pt.x - ent.x, y: pt.y - ent.y };
    dragRef.current.moved = false;
    dragRef.current.pointerKind = "touches" in ev ? "touch" : "mouse";
    setEntities((arr) => {
      const e = arr.find((x) => x.uid === uid);
      if (!e) return arr;
      return [...arr.filter((x) => x.uid !== uid), e];
    });
  }

  function startBlenderDrag(ev) {
    if (phaseRef.current !== "play") return;
    ev.preventDefault();
    blenderDragRef.current.active = true;
    moveBlenderByPointer(ev);
  }

  function moveDrag(ev) {
    if (phaseRef.current !== "play") return;
    const uid = dragRef.current.draggingUid;
    if (!uid) return;
    ev.preventDefault();
    const pt = getLocalPoint(ev);
    const off = dragRef.current.offset;
    if (dragRef.current.start) {
      const dx = pt.x - dragRef.current.start.x;
      const dy = pt.y - dragRef.current.start.y;
      if (Math.hypot(dx, dy) > 8) dragRef.current.moved = true;
    }
    setEntities((arr) => arr.map((e) => (e.uid === uid ? { ...e, x: pt.x - off.x, y: pt.y - off.y } : e)));
  }

  function moveBlenderByPointer(ev) {
    if (phaseRef.current !== "play") return;
    if (dragRef.current.draggingUid || !blenderDragRef.current.active) return;
    const pt = getLocalPoint(ev);
    moveBlender((pt.x / Math.max(1, size.width)) * 100);
  }

  function endDrag(ev) {
    if (phaseRef.current !== "play") return;
    const uid = dragRef.current.draggingUid;
    if (!uid) {
      blenderDragRef.current.active = false;
      return;
    }
    ev.preventDefault();
    const ent = entitiesRef.current.find((x) => x.uid === uid);
    dragRef.current.draggingUid = null;
    dragRef.current.start = null;
    if (!ent) return;

    const dropX = ent.x + 26;
    const dropY = ent.y + 26;

    if (inZone(dropX, dropY, blenderZone)) {
      handleDropIntoBlender(ent);
    } else {
      setEntities((arr) => arr.map((e) => (e.uid === uid ? { ...e, vy: Math.max(e.vy, 180 + levelRef.current * 8) } : e)));
    }

    blenderDragRef.current.active = false;
  }

  function removeEntity(uid) {
    setEntities((arr) => arr.filter((x) => x.uid !== uid));
  }

  function addPop(ent) {
    setPops((p) => [
      ...p,
      {
        id: `pop-${ent.uid}`,
        fruitId: ent.fruitId,
        from: { x: ent.x, y: ent.y },
        to: { x: blenderZone.x + blenderZone.w / 2 - 18, y: blenderZone.y + 54 },
        kind: ent.kind,
      },
    ]);
  }

  function removePop(id) {
    setPops((p) => p.filter((x) => x.id !== id));
  }

  function handleDropIntoBlender(ent, options = {}) {
    const skipRemoval = options?.skipRemoval ?? false;
    addPop(ent);
    if (!skipRemoval) removeEntity(ent.uid);

    if (ent.kind === "power") {
      if (ent.powerType === "slow") {
        setPower((p) => ({ ...p, slow: 7000 }));
        showToast("good", "POWER: Slow Motion! 🐢", 1400);
      }
      if (ent.powerType === "double") {
        setPower((p) => ({ ...p, double: 8000 }));
        showToast("good", "POWER: Pontos x2! ✨", 1400);
      }
      if (ent.powerType === "magnet") {
        setPower((p) => ({ ...p, magnet: 8000 }));
        showToast("good", "POWER: Ímã do Blender! 🧲", 1400);
      }
      play("combo");
      return;
    }

    if (ent.kind === "boss") {
      setScore((s) => s + 80 + Math.floor(levelRef.current * 4));
      play("combo");
      setCup((v) => clamp(v + 0.18, 0, 1));
      setCombo((c) => clamp(c + 1, 1, 9));
      setStreakTimer(1800);

      if (ent.hp > 1) {
        setEntities((arr) => [...arr, { ...makeBoss({ width: sizeRef.current.width, level: levelRef.current }), hp: ent.hp - 1 }]);
      } else {
        showToast("good", "BOSS DERROTADO! +BÔNUS 👑", 1500);
        setScore((s) => s + 250);
        setDanger((d) => Math.max(0, d - 18));
      }
      return;
    }

    const expected = needNextFruit(recipeRef.current);
    const ok = ent.fruitId === expected;
    setStreakTimer(1600);

    if (ok) {
      play("catch");
      showToast("good", "Sucesso! Fruta correta no liquidificador ✅", 900);
      setCombo((c) => clamp(c + 1, 1, 9));
      setDanger((d) => Math.max(0, d - 2.2));

      setScore((s) => {
        const mult = power.double > 0 ? 2 : 1;
        return s + Math.floor(14 * combo * mult);
      });

      setCup((v) => clamp(v + 0.11, 0, 1));

      setRecipe((r) => {
        const next = { ...r, progress: [...r.progress, ent.fruitId] };
        if (next.progress.length >= next.need.length) {
          const upcomingRecipe = pickRecipe();
          recipeRef.current = upcomingRecipe;
          play("combo");
          showToast("good", `SUCO ${next.name.toUpperCase()} PRONTO! 🧃`, 1500);
          setScore((s) => s + 160);
          setCombo((c) => clamp(c + 2, 1, 9));
          setDanger((d) => Math.max(0, d - 10));
          return upcomingRecipe;
        }
        recipeRef.current = next;
        return next;
      });
    } else {
      play("gameover");
      setCombo(1);
      setDanger((d) => clamp(d + 6.5, 0, 100));
      showToast("danger", "Errado! Essa fruta não é a próxima do pedido ❌", 1200);
      setCup((v) => clamp(v - 0.06, 0, 1));
    }
  }

  function serve() {
    if (phaseRef.current !== "play") return;
    if (cup < 1) {
      showToast("info", "Encha o copo antes de servir 😉", 1100);
      return;
    }
    play("serve");
    showToast("good", "SERVIDO! Bônus de pontos 🥤", 1300);
    setScore((s) => s + 120 + Math.floor(levelRef.current * 3));
    setCombo((c) => clamp(c + 1, 1, 9));
    setCup(0);
    setDanger((d) => Math.max(0, d - 12));
  }

  async function clearRanking() {
    if (rankingScope === "global") {
      const safeName = normalizePlayerName(playerName);
      if (!safeName) {
        showToast("info", "Defina um nome para resetar seus dados.", 1300);
        return;
      }

      try {
        await deletePlayerScoresFromSupabase(safeName);
        const globalRows = await fetchRankingFromSupabase();
        setRanking(globalRows);
        showToast("info", "Seu nome e scores foram removidos da base.", 1500);
      } catch {
        showToast("danger", "Não foi possível deletar seus dados no Supabase.", 1600);
      }
      return;
    }

    saveRanking([]);
    setRanking([]);
    showToast("info", "Ranking limpo.", 900);
  }

  function resetPlayerIdentity() {
    const existingName = normalizePlayerName(playerName);
    setNameValidationError(false);
    setPlayerName("");
    savePlayerName("");
    if (!existingName) {
      showToast("info", "Nome resetado.", 900);
      return;
    }
    clearRanking();
  }

  const nextNeed = needNextFruit(recipe);
  const nextNeedInfo = fruitById(nextNeed);
  const draggingUid = dragRef.current.draggingUid;
  const dangerPct = clamp(danger, 0, 100);
  const showMobileHandGuide = (isMobile || isTablet) && phase !== "over";
  const hasStoredPlayerName = Boolean(normalizePlayerName(playerName));
  const handGuideStartX = clamp(blenderZone.x - (isMobile ? 72 : 88), 18, size.width - 170);
  const handGuideStartY = clamp(blenderZone.y - (isMobile ? 42 : 50), 56, size.height - 300);
  const handGuideEndX = blenderZone.x + blenderZone.w / 2 - 26;
  const handGuideEndY = blenderZone.y + blenderZone.h / 2 - 18;

  return (
    <section id="fabrica-de-sucos" className="section section-alt" ref={wrapRef} style={{ width: "100%" }}>
      <div className="container">
        <header className="section-head">
          <h2>Fábrica de sucos</h2>
          <p>Modo arcade com drag and drop, combos, boss fruit e ranking global com Supabase.</p>
        </header>

        <div
          style={{
            width: "100%",
            height: size.height,
            borderRadius: 22,
            overflow: "hidden",
            position: "relative",
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.glow,
            userSelect: phase === "play" ? "none" : "auto",
            touchAction: phase === "play" ? "none" : "auto",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "14px 14px auto 14px",
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: isMobile ? "100%" : 0,
                padding: isMobile ? "10px 10px" : "12px 12px",
                borderRadius: 16,
                background: theme.card,
                border: `1px solid ${theme.border}`,
                display: "flex",
                gap: 10,
                alignItems: "center",
                color: "white",
              }}
            >
              <Droplets size={18} />
              <div style={{ fontWeight: 950, letterSpacing: 0.2 }}>Juice Splash</div>
              {!isMobile && <div style={{ color: theme.textSub, fontWeight: 700, marginLeft: 4, fontSize: 13 }}>Drag & drop • combos • power-ups • boss</div>}
            </div>

            <div
              style={{
                padding: isMobile ? "10px" : "12px 12px",
                borderRadius: 16,
                background: theme.card,
                border: `1px solid ${theme.border}`,
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: 10,
                minWidth: isMobile ? 136 : 165,
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Trophy size={16} />
                <span style={{ fontWeight: 950 }}>{score}</span>
                <span style={{ opacity: 0.7, fontWeight: 900 }}>x{combo}</span>
              </div>
              <div style={{ opacity: 0.8, fontWeight: 900 }}>Lv {level}</div>
            </div>

            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              style={{
                border: `1px solid ${theme.border}`,
                background: theme.card,
                color: "white",
                padding: isMobile ? "10px" : "12px 12px",
                borderRadius: 16,
                fontWeight: 900,
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
              }}
              title={muted ? "Ativar som" : "Mutar"}
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <button
              type="button"
              onClick={phase === "play" ? resetAll : startGame}
              style={{
                border: `1px solid ${theme.border}`,
                background: phase === "play" ? theme.card : "rgba(255,255,255,0.10)",
                color: "white",
                padding: isMobile ? "10px" : "12px 12px",
                borderRadius: 16,
                fontWeight: 950,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <RotateCcw size={18} />
              {phase === "play" ? "Reset" : isMobile ? "Play" : "Jogar"}
            </button>
          </div>

          <div
            style={{
              position: "absolute",
              top: isMobile ? 114 : 68,
              left: 14,
              right: 14,
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1, padding: 12, borderRadius: 16, background: theme.card, border: `1px solid ${theme.border}`, color: "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 900 }}>PEDIDO ATUAL</div>
                  <div style={{ fontSize: 18, fontWeight: 950 }}>{recipe.name}</div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", opacity: 0.9 }}>
                    <InfinityIcon size={18} />
                    <span style={{ fontWeight: 900, fontSize: 13 }}>Endless</span>
                  </div>

                </div>
              </div>

              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 10 }}>
                {recipe.need.map((id, i) => {
                  const done = recipe.progress[i];
                  const f = fruitById(id);
                  return (
                    <div
                      key={`${recipe.id}-${i}`}
                      style={{
                        borderRadius: 14,
                        padding: "8px 10px",
                        border: `1px solid ${theme.border}`,
                        background: done ? "rgba(60,255,170,0.16)" : "rgba(255,255,255,0.06)",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        color: "white",
                        minWidth: 120,
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          background: f.color,
                          boxShadow: "0 0 0 3px rgba(255,255,255,0.10)",
                        }}
                      />
                      <div style={{ fontWeight: 950, fontSize: 12, opacity: done ? 1 : 0.88 }}>{done ? "OK" : f.label}</div>
                    </div>
                  );
                })}
                <div
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    border: `1px dashed ${theme.border}`,
                    padding: "8px 10px",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  Arraste as frutas na ordem exata do pedido: {recipe.need.map((id) => fruitById(id).label).join(" → ")}
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ fontSize: 12, opacity: 0.78, fontWeight: 900 }}>
                    Próxima:{" "}
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, opacity: 1 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 999, background: nextNeedInfo.color }} />
                      {nextNeedInfo.label}
                    </span>
                  </div>
                </div>
              </div>

              {(isMobile || isTablet) && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "8px 10px",
                    borderRadius: 12,
                    border: `1px solid ${theme.border}`,
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.88)",
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  Dica mobile/tablet: toque e arraste a fruta. Ao pegar, ela para de cair e você joga no liquidificador.
                </div>
              )}
            </div>
          </div>

          <div
            ref={arenaRef}
            onMouseMove={(event) => {
              moveDrag(event);
              moveBlenderByPointer(event);
            }}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onTouchMove={(event) => {
              moveDrag(event);
              moveBlenderByPointer(event);
            }}
            onTouchEnd={endDrag}
            style={{
              position: "absolute",
              top: isMobile ? 242 : 196,
              left: 14,
              right: 14,
              bottom: 14,
              borderRadius: 22,
              background: "rgba(0,0,0,0.18)",
              border: `1px solid ${theme.border}`,
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", left: 14, right: 14, top: 12, zIndex: 5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "white", fontWeight: 950, fontSize: 12, opacity: 0.85 }}>
                <span>CAOS NA COZINHA</span>
                <span>{Math.round(dangerPct)}%</span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  height: 12,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.10)",
                  border: `1px solid ${theme.border}`,
                  overflow: "hidden",
                }}
              >
                <motion.div
                  animate={{ width: `${dangerPct}%` }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  style={{
                    height: "100%",
                    borderRadius: 999,
                    background: dangerPct > 80 ? "rgba(255,80,80,0.85)" : "rgba(255,220,90,0.82)",
                  }}
                />
              </div>
            </div>

            <AnimatePresence>
              {showMobileHandGuide && (
                <motion.div
                  key="mobile-hand-guide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase === "idle" ? 0.95 : 0.55 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 7,
                    pointerEvents: "none",
                  }}
                >
                  <motion.div
                    animate={{
                      x: [handGuideStartX, handGuideEndX, handGuideEndX, handGuideStartX],
                      y: [handGuideStartY, handGuideEndY, handGuideEndY + 10, handGuideStartY],
                    }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: isMobile ? 24 : 28,
                      filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.28))",
                    }}
                  >
                    <span aria-hidden style={{ fontSize: isMobile ? 18 : 20 }}>🟠</span>
                    <motion.span
                      aria-hidden
                      animate={{ opacity: [1, 0, 0, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      🫴
                    </motion.span>
                    <motion.span
                      aria-hidden
                      animate={{ opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ✊
                    </motion.span>
                  </motion.div>

                  <motion.div
                    animate={{
                      opacity: [0, 0.85, 0.85, 0],
                      scale: [0.9, 1, 1, 0.9],
                      x: [handGuideStartX - 6, handGuideStartX - 6, handGuideEndX - 14, handGuideEndX - 14],
                      y: [handGuideStartY + 30, handGuideStartY + 30, handGuideEndY + 30, handGuideEndY + 30],
                    }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: "rgba(0,0,0,0.36)",
                      color: "white",
                      fontWeight: 900,
                      fontSize: 11,
                      letterSpacing: 0.2,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    Pegue e solte no blender
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              animate={{
                scale: power.double > 0 ? [1, 1.01, 1] : 1,
                rotate: power.double > 0 ? [0, 0.7, -0.7, 0] : 0,
              }}
              transition={{ duration: 0.35, repeat: power.double > 0 ? Infinity : 0 }}
              onMouseDown={startBlenderDrag}
              onTouchStart={startBlenderDrag}
              style={{
                position: "absolute",
                left: blenderZone.x,
                top: blenderZone.y,
                width: blenderZone.w,
                height: blenderZone.h,
                borderRadius: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                zIndex: 2,
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "relative",
                  width: isMobile ? 58 : 64,
                  height: isMobile ? 72 : 80,
                  borderRadius: "14px 14px 22px 22px",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(185,224,255,0.26))",
                  border: "1px solid rgba(255,255,255,0.82)",
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05), inset 0 -14px 20px rgba(93,188,165,0.2)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: -8,
                    width: isMobile ? 24 : 26,
                    height: 8,
                    borderRadius: "8px 8px 4px 4px",
                    background: "linear-gradient(180deg, #fbfdff, #dce5ef)",
                    border: "1px solid rgba(255,255,255,0.8)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: isMobile ? -8 : -10,
                    top: 16,
                    width: isMobile ? 12 : 13,
                    height: isMobile ? 22 : 24,
                    borderRadius: "0 12px 12px 0",
                    border: "2px solid rgba(255,255,255,0.75)",
                    borderLeft: "none",
                    opacity: 0.8,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 8,
                    right: 8,
                    bottom: 9,
                    height: 20,
                    borderRadius: 10,
                    background: "linear-gradient(180deg, rgba(95,227,171,0.75), rgba(48,170,125,0.75))",
                    boxShadow: "inset 0 2px 6px rgba(255,255,255,0.25)",
                  }}
                />
              </div>

              <div
                aria-hidden
                style={{
                  width: isMobile ? 52 : 58,
                  height: isMobile ? 26 : 28,
                  borderRadius: 12,
                  background: "linear-gradient(180deg, #dce5ef, #9ea9b8)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75), 0 5px 8px rgba(0,0,0,0.25)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #7ae8b8, #2da16f)",
                    border: "1px solid rgba(255,255,255,0.8)",
                  }}
                />
              </div>

              <span
                style={{
                  color: "white",
                  fontWeight: 950,
                  letterSpacing: 0.6,
                  fontSize: isMobile ? 11 : 12,
                  textShadow: "0 3px 6px rgba(0,0,0,0.35)",
                  zIndex: 1,
                }}
              >
                SOLTE AQUI
              </span>
            </motion.div>

            <div
              style={{
                position: "absolute",
                left: cupZone.x,
                top: cupZone.y,
                width: cupZone.w,
                height: cupZone.h,
                borderRadius: 22,
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${theme.border}`,
                overflow: "hidden",
                zIndex: 2,
              }}
            >
              <div style={{ padding: 12, color: "white", fontWeight: 950, opacity: 0.92, display: "flex", justifyContent: "space-between" }}>
                <span>COPO</span>
                <button
                  type="button"
                  onClick={serve}
                  style={{
                    borderRadius: 12,
                    padding: "6px 10px",
                    border: `1px solid ${theme.border}`,
                    background: cup >= 1 ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.22)",
                    color: "white",
                    fontWeight: 950,
                    cursor: "pointer",
                  }}
                >
                  Servir
                </button>
              </div>

              <motion.div
                animate={{ height: `${Math.round(cup * 100)}%` }}
                transition={{ type: "spring", stiffness: 230, damping: 22 }}
                style={{
                  position: "absolute",
                  left: 10,
                  right: 10,
                  bottom: 10,
                  borderRadius: 18,
                  background: theme.accent,
                }}
              />
            </div>

            <AnimatePresence>
              {entities.map((e) => {
                const isBoss = e.kind === "boss";
                const isPower = e.kind === "power";
                const color = isBoss ? "#FF4D4D" : fruitById(e.fruitId).color;
                const fruitEmoji = FRUIT_EMOJIS_BY_ID[e.fruitId] ?? "🍎";

                const powerLabel =
                  e.powerType === "slow" ? "SLOW" : e.powerType === "double" ? "x2" : e.powerType === "magnet" ? "MAG" : "";

                return (
                  <motion.div
                    key={e.uid}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: draggingUid === e.uid ? 1.06 : 1, rotate: e.spin }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    onMouseDown={(ev) => startDrag(e.uid, ev)}
                    onTouchStart={(ev) => startDrag(e.uid, ev)}
                    style={{
                      position: "absolute",
                      left: e.x,
                      top: e.y,
                      width: isBoss ? (isMobile || isTablet ? 88 : 78) : isMobile || isTablet ? 68 : 54,
                      height: isBoss ? (isMobile || isTablet ? 88 : 78) : isMobile || isTablet ? 68 : 54,
                      borderRadius: 999,
                      background: isPower || isBoss ? color : "transparent",
                      boxShadow: isBoss
                        ? "0 14px 34px rgba(0,0,0,0.36), 0 0 0 4px rgba(255,255,255,0.16)"
                        : isPower
                          ? "0 12px 28px rgba(0,0,0,0.30), 0 0 0 3px rgba(255,255,255,0.12)"
                          : "none",
                      display: "grid",
                      placeItems: "center",
                      cursor: "grab",
                      touchAction: "none",
                      zIndex: draggingUid === e.uid ? 10 : 3,
                    }}
                  >
                    {!isPower && !isBoss && (
                      <div style={{ display: "grid", justifyItems: "center", gap: 4 }}>
                        <span
                          role="img"
                          aria-label={fruitById(e.fruitId).label}
                          style={{
                            fontSize: isMobile || isTablet ? 44 : 36,
                            filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.26))",
                            lineHeight: 1,
                          }}
                        >
                          {fruitEmoji}
                        </span>
                        <span
                          style={{
                            fontSize: isMobile || isTablet ? 10 : 9,
                            fontWeight: 900,
                            color: "rgba(255,255,255,0.95)",
                            textShadow: "0 2px 6px rgba(0,0,0,0.45)",
                            letterSpacing: 0.2,
                          }}
                        >
                          {fruitById(e.fruitId).label}
                        </span>
                      </div>
                    )}

                    {(isPower || isBoss) && (
                      <div
                        style={{
                          width: isBoss ? 22 : 18,
                          height: isBoss ? 22 : 18,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.35)",
                          position: "absolute",
                          left: isBoss ? 14 : 10,
                          top: isBoss ? 14 : 10,
                        }}
                      />
                    )}

                    {isPower && (
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 1000,
                          color: "rgba(20,10,18,0.9)",
                          padding: "4px 8px",
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.80)",
                        }}
                      >
                        {powerLabel}
                      </div>
                    )}

                    {isBoss && (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Crown size={18} color="rgba(20,10,18,0.9)" />
                          <span style={{ fontWeight: 1000, color: "rgba(20,10,18,0.9)" }}>BOSS</span>
                        </div>
                        <div
                          style={{
                            fontWeight: 1000,
                            fontSize: 12,
                            color: "rgba(20,10,18,0.88)",
                            background: "rgba(255,255,255,0.76)",
                            padding: "3px 8px",
                            borderRadius: 999,
                          }}
                        >
                          HP {e.hp}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <AnimatePresence>
              {pops.map((p) => {
                const isBoss = p.kind === "boss";
                const isPower = p.kind === "power";
                const color = isBoss ? "#FF4D4D" : fruitById(p.fruitId).color;
                const fruitEmoji = FRUIT_EMOJIS_BY_ID[p.fruitId] ?? "🍎";
                return (
                  <motion.div
                    key={p.id}
                    initial={{ x: p.from.x, y: p.from.y, scale: 1, opacity: 1 }}
                    animate={{ x: p.to.x, y: p.to.y, scale: 0.4, opacity: 0.15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    onAnimationComplete={() => removePop(p.id)}
                    style={{
                      position: "absolute",
                      width: isBoss ? 64 : 44,
                      height: isBoss ? 64 : 44,
                      borderRadius: 999,
                      background: isPower || isBoss ? (isPower ? "rgba(255,255,255,0.7)" : color) : "transparent",
                      boxShadow: isPower || isBoss ? "0 0 0 3px rgba(255,255,255,0.10)" : "none",
                      pointerEvents: "none",
                      zIndex: 8,
                    }}
                  >
                    {!isPower && !isBoss && (
                      <span style={{ fontSize: 30, lineHeight: 1, filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.2))" }}>{fruitEmoji}</span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <AnimatePresence>
              {phase !== "play" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                    padding: 16,
                    zIndex: 20,
                    background: "rgba(0,0,0,0.24)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      maxWidth: isMobile ? 460 : 520,
                      borderRadius: 22,
                      padding: isMobile ? 12 : 16,
                      background: "rgba(0,0,0,0.50)",
                      border: `1px solid ${theme.border}`,
                      color: "white",
                    }}
                  >
                    <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 1000 }}>{phase === "idle" ? "Hora do Suco!" : "Game Over!"}</div>
                    <div style={{ marginTop: 8, opacity: 0.86, fontWeight: 750, lineHeight: 1.35 }}>
                      {phase === "idle" ? (
                        <>
                          <b>Como jogar:</b> arraste as frutas e <b>solte no LIQUIDIFICADOR</b> na ordem do pedido.
                          Complete pedidos para ganhar bônus. Se errar, o <b>Caos</b> aumenta.
                          <br />
                          <span style={{ opacity: 0.9 }}>Boss aparece a cada alguns segundos — derrube ele pra reduzir o Caos!</span>
                        </>
                      ) : (
                        <>
                          Seu score: <b>{score}</b> • Melhor: <b>{bestScore}</b>
                          <br />
                          Dica: mantenha o combo alto e use o <b>Servir</b> quando o copo encher.
                        </>
                      )}
                    </div>

                    <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontWeight: 950, opacity: 0.9, fontSize: isMobile ? 16 : 18 }}>
                          {rankingScope === "global" ? "Ranking global (Top 10)" : "Ranking local (Top 10)"}
                        </div>
                        <div style={{ marginTop: 4, fontSize: 12, opacity: 0.75, fontWeight: 700 }}>{rankingMessage}</div>
                      </div>

                      {hasStoredPlayerName ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 12, opacity: 0.95 }}>
                          <span>Jogador:</span>
                          <span
                            style={{
                              borderRadius: 10,
                              padding: "7px 9px",
                              border: `1px solid ${theme.border}`,
                              background: "rgba(255,255,255,0.08)",
                              color: "white",
                              fontWeight: 900,
                              letterSpacing: 0.2,
                            }}
                          >
                            {normalizePlayerName(playerName)}
                          </span>
                        </div>
                      ) : (
                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 12, opacity: 0.95 }}>
                          Nome:
                          <input
                            value={playerName}
                            onChange={(ev) => {
                              const nextName = ev.target.value.slice(0, 24);
                              setPlayerName(nextName);
                              if (normalizePlayerName(nextName)) setNameValidationError(false);
                            }}
                            placeholder="Seu nome (obrigatório)"
                            required
                            style={{
                              borderRadius: 10,
                              padding: "7px 9px",
                              border: nameValidationError ? "1px solid #ff4d4d" : `1px solid ${theme.border}`,
                              background: "rgba(255,255,255,0.08)",
                              color: "white",
                              minWidth: 110,
                              maxWidth: 160,
                              fontWeight: 700,
                              boxShadow: nameValidationError ? "0 0 0 2px rgba(255, 77, 77, 0.18)" : "none",
                            }}
                          />
                        </label>
                      )}

                      <button
                        type="button"
                        onClick={clearRanking}
                        style={{
                          borderRadius: 12,
                          padding: "8px 10px",
                          border: `1px solid ${theme.border}`,
                          background: "rgba(255,255,255,0.06)",
                          color: "white",
                          fontWeight: 950,
                          cursor: "pointer",
                          opacity: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                        title={rankingScope === "global" ? "Remover seu nome/scores do ranking global" : "Limpar ranking"}
                      >
                        <Trash2 size={16} />
                        {rankingScope === "global" ? "Resetar jogador" : "Limpar"}
                      </button>
                    </div>

                    <div
                      style={{
                        marginTop: 10,
                        borderRadius: 16,
                        border: `1px solid ${theme.border}`,
                        background: "rgba(255,255,255,0.06)",
                        overflow: "hidden",
                      }}
                    >
                      {ranking.length === 0 ? (
                        <div style={{ padding: 12, opacity: 0.85, fontWeight: 800 }}>
                          Sem scores ainda. Clique em <b>Jogar</b>!
                        </div>
                      ) : (
                        ranking.map((r, idx) => (
                          <div
                            key={`${r.date}-${idx}`}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "10px 12px",
                              borderTop: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.10)",
                              fontWeight: 900,
                            }}
                          >
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                              <span style={{ opacity: 0.8 }}>{String(idx + 1).padStart(2, "0")}</span>
                              <span>{r.score}</span>
                              <span style={{ opacity: 0.9, fontWeight: 900 }}>{r.player_name || "Anônimo"}</span>
                              <span style={{ opacity: 0.65, fontWeight: 800, fontSize: 12 }}>{r.skin?.toUpperCase?.() || "KASUCOS"}</span>
                            </div>
                            <div style={{ opacity: 0.65, fontWeight: 800, fontSize: 12 }}>{new Date(r.date).toLocaleDateString()}</div>
                          </div>
                        ))
                      )}
                    </div>

                    <div style={{ marginTop: 12, display: "flex", gap: 10, flexDirection: isMobile ? "column" : "row" }}>
                      <button
                        type="button"
                        onClick={startGame}
                        style={{
                          flex: 1,
                          borderRadius: 16,
                          padding: "12px 12px",
                          border: `1px solid ${theme.border}`,
                          background: "rgba(255,255,255,0.10)",
                          color: "white",
                          fontWeight: 1000,
                          cursor: "pointer",
                          opacity: 1,
                        }}
                        title={!normalizePlayerName(playerName) ? "Digite um nome para jogar" : "Jogar agora"}
                      >
                        Jogar agora
                      </button>
                      <button
                        type="button"
                        onClick={resetPlayerIdentity}
                        style={{
                          borderRadius: 16,
                          padding: "12px 12px",
                          border: `1px solid ${theme.border}`,
                          background: "rgba(0,0,0,0.30)",
                          color: "white",
                          fontWeight: 1000,
                          cursor: "pointer",
                        }}
                      >
                        Resetar nome
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 58,
                    zIndex: 30,
                    padding: "12px 14px",
                    borderRadius: 16,
                    color: "white",
                    fontWeight: 950,
                    background:
                      toast.kind === "good"
                        ? "rgba(60,255,170,0.18)"
                        : toast.kind === "danger"
                          ? "rgba(255,90,90,0.18)"
                          : "rgba(255,255,255,0.10)",
                    border: `1px solid ${theme.border}`,
                    boxShadow: "0 16px 35px rgba(0,0,0,0.35)",
                    maxWidth: 300,
                  }}
                >
                  {toast.text}
                </motion.div>
              )}
            </AnimatePresence>

            <div
              style={{
                position: "absolute",
                left: isMobile ? 8 : 12,
                right: isMobile ? 8 : "auto",
                bottom: isMobile ? 8 : 12,
                zIndex: 6,
                padding: isMobile ? "8px 10px" : "10px 12px",
                borderRadius: 16,
                background: "rgba(0,0,0,0.30)",
                border: `1px solid ${theme.border}`,
                color: "white",
                fontWeight: 900,
                fontSize: 12,
                opacity: 0.9,
                display: "flex",
                flexWrap: isMobile ? "wrap" : "nowrap",
                gap: 10,
                alignItems: "center",
              }}
            >
              <InfinityIcon size={16} />
              <span>Boss em: {formatTime(bossTimer)}</span>
              <span style={{ opacity: 0.6 }}>•</span>
              <span>{isMobile ? "Toque, arraste e solte no Blender" : "Clique e arraste → solte no Blender"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FabricaDeSucosSection() {
  return <JuiceSplashGameFull />;
}
