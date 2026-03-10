import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "@/shared/lib/motionCompat";
import { fetchWithRetry } from "@/shared/lib/http";
import { logWarn } from "@/shared/lib/logger";

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
const WOOD_CRACKS = [
  { x1: 0.08, y1: 0.28, x2: 0.21, y2: 0.36 },
  { x1: 0.18, y1: 0.53, x2: 0.31, y2: 0.44 },
  { x1: 0.33, y1: 0.31, x2: 0.43, y2: 0.46 },
  { x1: 0.52, y1: 0.37, x2: 0.67, y2: 0.29 },
  { x1: 0.61, y1: 0.66, x2: 0.77, y2: 0.61 },
  { x1: 0.73, y1: 0.24, x2: 0.92, y2: 0.35 },
  { x1: 0.75, y1: 0.73, x2: 0.91, y2: 0.62 },
];
const GRAVITY = 0.14;
const ORDER_TIME_LIMIT = 20;
const FRUITS_PER_WAVE = 18;
const CUT_MARK_LIFETIME = 850;
const JUICE_DROP_LIFETIME = 520;
const EXPLOSION_SPARK_LIFETIME = 420;
const ARENA_FLASH_LIFETIME = 260;
const MIN_ORDER_TIME_LIMIT = 9;
const PERFORMANCE_FRAME_MS = 40;
const NORMAL_FRAME_MS = 20;
const RANKING_STORAGE_KEY = "kasucos-fabrica-ranking";
const BEST_SCORE_STORAGE_KEY = "kasucos-fabrica-best-score";
const PLAYER_NAME_STORAGE_KEY = "kasucos-fabrica-player-name";
const SETTINGS_STORAGE_KEY = "kasucos-fabrica-settings";
const MISSION_PROGRESS_STORAGE_KEY = "kasucos-fabrica-mission-progress";
const ACHIEVEMENTS_STORAGE_KEY = "kasucos-fabrica-achievements";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const RANKING_TABLE = import.meta.env.VITE_SUPABASE_RANKING_TABLE || "game_scores";
const SWIPE_VARIANT_COUNT = 7;
const CLEAN_SLICE_VARIANT_COUNT = 3;
const GAME_MODES = {
  arcade: {
    label: "Arcade",
    description: "Cronômetro correndo, bombas tiram tempo e frutas perdidas tiram 2s.",
    usesTimer: true,
    allowBombs: true,
    penalizeMisses: true,
  },
  classic: {
    label: "Clássico",
    description: "Sem cronômetro, mas perdeu fruta ou acertou bomba = perde vida.",
    usesTimer: false,
    allowBombs: true,
    penalizeMisses: true,
  },
  zen: {
    label: "Zen",
    description: "90s sem bombas e sem penalidade por fruta perdida. Foque em combos.",
    usesTimer: true,
    roundTime: 90,
    allowBombs: false,
    penalizeMisses: false,
  },
};
const ACHIEVEMENT_DEFINITIONS = [
  { id: "first-run", label: "Primeira produção", check: ({ totalRuns }) => totalRuns >= 1 },
  { id: "score-800", label: "Mestre da mistura (800+ pts)", check: ({ score }) => score >= 800 },
  { id: "wave-6", label: "Supervisor da esteira (onda 6)", check: ({ wave }) => wave >= 6 },
  { id: "combo-10", label: "Combo lendário x10", check: ({ maxCombo }) => maxCombo >= 10 },
  { id: "bomb-free", label: "Rodada limpa (25 frutas, sem bomba)", check: ({ fruitsSliced, bombsSliced }) => fruitsSliced >= 25 && bombsSliced === 0 },
  { id: "mission-master", label: "Missão diária concluída", check: ({ missionCompletedInRun }) => missionCompletedInRun },
  { id: "zen-pro", label: "Zen Pro (500+ no modo Zen)", check: ({ mode, score }) => mode === "zen" && score >= 500 },
];
const DAILY_MISSIONS = [
  { id: "score-450", label: "Marque 450 pontos na partida", rewardText: "+200 pontos bônus", check: ({ score }) => score >= 450 },
  { id: "combo-8", label: "Alcance combo x8", rewardText: "+1 vida (Clássico) / +6s (Arcade)", check: ({ maxCombo }) => maxCombo >= 8 },
  { id: "wave-4", label: "Chegue até a onda 4", rewardText: "+220 pontos bônus", check: ({ wave }) => wave >= 4 },
  { id: "clean-run", label: "Corte 20 frutas sem acertar bomba", rewardText: "+250 pontos bônus", check: ({ fruitsSliced, bombsSliced }) => fruitsSliced >= 20 && bombsSliced === 0 },
];

const random = (min, max) => Math.random() * (max - min) + min;
const pick = (list) => list[Math.floor(Math.random() * list.length)];

const FRUIT_JUMP_PROFILES = [
  { weight: 0.34, minHeightRatio: 0.02, maxHeightRatio: 0.2 },
  { weight: 0.43, minHeightRatio: 0.34, maxHeightRatio: 0.58 },
  { weight: 0.23, minHeightRatio: 0.62, maxHeightRatio: 0.84 },
];

function pickJumpProfile() {
  const totalWeight = FRUIT_JUMP_PROFILES.reduce((sum, profile) => sum + profile.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const profile of FRUIT_JUMP_PROFILES) {
    roll -= profile.weight;
    if (roll <= 0) return profile;
  }

  return FRUIT_JUMP_PROFILES[0];
}

function calculateLaunchVelocity({ arenaHeight, spawnY, speed }) {
  const profile = pickJumpProfile();
  const apexY = random(arenaHeight * profile.minHeightRatio, arenaHeight * profile.maxHeightRatio);
  const riseDistance = Math.max(120, spawnY - apexY);
  const waveSpeedFactor = 1 + Math.max(0, speed - 1) * 0.5;
  const baseVelocity = Math.sqrt(2 * GRAVITY * riseDistance);
  const adjustedVelocity = baseVelocity * waveSpeedFactor * random(0.94, 1.08);

  return -Math.min(21, Math.max(6.6, adjustedVelocity));
}

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

function createCutMark(pointA, pointB, color) {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  const length = Math.max(54, Math.hypot(dx, dy) * random(0.7, 1.2));
  const angle = Math.atan2(dy, dx) * (180 / Math.PI) + random(-8, 8);
  const midX = (pointA.x + pointB.x) / 2 + random(-12, 12);
  const midY = (pointA.y + pointB.y) / 2 + random(-12, 12);

  return {
    id: `${Date.now()}-cut-${Math.random()}`,
    x: midX,
    y: midY,
    length,
    angle,
    color,
    createdAt: Date.now(),
  };
}

function createJuiceDrops(pointA, pointB, color) {
  const center = {
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2,
  };

  return Array.from({ length: 8 }, (_, index) => ({
    id: `${Date.now()}-drop-${index}-${Math.random()}`,
    x: center.x + random(-22, 22),
    y: center.y + random(-22, 22),
    vx: random(-2.3, 2.3),
    vy: random(-3.8, -1.2),
    size: random(4, 9),
    color,
    createdAt: Date.now(),
  }));
}

function limitEffects(list, max) {
  if (!Array.isArray(list)) return [];
  if (list.length <= max) return list;
  return list.slice(0, max);
}


function createExplosionSparks(item) {
  const centerX = item.x + item.size / 2;
  const centerY = item.y + item.size / 2;

  return Array.from({ length: 16 }, (_, index) => ({
    id: `${item.uid}-explosion-${index}-${Math.random()}`,
    x: centerX + random(-8, 8),
    y: centerY + random(-8, 8),
    vx: random(-5.8, 5.8),
    vy: random(-6.4, -1.8),
    size: random(5, 14),
    createdAt: Date.now(),
  }));
}

function normalizePlayerName(name) {
  return name.replace(/\s+/g, " ").trim().slice(0, 24);
}

function normalizePlayerNameKey(name) {
  return normalizePlayerName(String(name || "")).toLocaleLowerCase();
}

function normalizeGameMode(mode) {
  return mode === "classic" || mode === "zen" ? mode : "arcade";
}

function sortRanking(entries = [], limit = 10) {
  return [...entries]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
    })
    .slice(0, limit);
}

function mergeRankingByPlayer(entries = []) {
  const merged = new Map();

  entries.forEach((entry) => {
    const normalizedMode = normalizeGameMode(entry.mode);
    const normalizedName = normalizePlayerName(entry.player_name || "Anônimo") || "Anônimo";
    const key = `${normalizedMode}:${normalizePlayerNameKey(normalizedName)}`;
    const score = Number(entry.score) || 0;
    const candidate = {
      ...entry,
      player_name: normalizedName,
      score,
      mode: normalizedMode,
    };

    const previous = merged.get(key);
    if (!previous) {
      merged.set(key, candidate);
      return;
    }

    if (score > (Number(previous.score) || 0)) {
      merged.set(key, candidate);
      return;
    }

    if (score === (Number(previous.score) || 0)) {
      const previousDate = new Date(previous.date || 0).getTime();
      const candidateDate = new Date(candidate.date || 0).getTime();
      if (candidateDate < previousDate) {
        merged.set(key, candidate);
      }
    }
  });

  return Array.from(merged.values());
}

function loadLocalRanking() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RANKING_STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return sortRanking(mergeRankingByPlayer(parsed.map((entry) => ({
      ...entry,
      mode: normalizeGameMode(entry.mode),
    }))), Number.POSITIVE_INFINITY);
  } catch {
    return [];
  }
}

function saveLocalRanking(entries) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(sortRanking(mergeRankingByPlayer(entries), Number.POSITIVE_INFINITY)));
}

function loadBestScore() {
  if (typeof window === "undefined") return 0;
  const parsed = Number(window.localStorage.getItem(BEST_SCORE_STORAGE_KEY));
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
}

function saveBestScore(score) {
  if (typeof window === "undefined") return;
  const normalized = Number(score);
  if (!Number.isFinite(normalized) || normalized < 0) return;
  window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(Math.floor(normalized)));
}

function loadSavedPlayerName() {
  if (typeof window === "undefined") return "";
  return normalizePlayerName(window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY) || "");
}

function savePlayerName(name) {
  if (typeof window === "undefined") return;
  const normalizedName = normalizePlayerName(name);
  if (!normalizedName) {
    window.localStorage.removeItem(PLAYER_NAME_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(PLAYER_NAME_STORAGE_KEY, normalizedName);
}

async function fetchSupabaseRanking() {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${RANKING_TABLE}`);
  url.searchParams.set("select", "player_name,score,date,mode");
  url.searchParams.set("order", "score.desc,date.asc");
  url.searchParams.set("limit", "200");

  const response = await fetchWithRetry(url.toString(), {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  }, { retries: 1, timeoutMs: 4500, retryDelayMs: 250 });

  if (!response.ok) {
    throw new Error(`Erro ao buscar ranking: ${response.status}`);
  }

  const data = await response.json();
  return sortRanking(mergeRankingByPlayer(data.map((item) => ({
    player_name: item.player_name,
    score: Number(item.score) || 0,
    date: item.date,
    mode: normalizeGameMode(item.mode),
  }))), Number.POSITIVE_INFINITY);
}

async function insertSupabaseScore(name, score, mode) {
  const response = await fetchWithRetry(`${SUPABASE_URL}/rest/v1/${RANKING_TABLE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify([{ player_name: name, score, mode }]),
  }, { retries: 1, timeoutMs: 4500, retryDelayMs: 250 });

  if (!response.ok) {
    throw new Error(`Erro ao salvar pontuação: ${response.status}`);
  }
}


function loadSettings() {
  if (typeof window === "undefined") return { mode: "arcade", reducedEffects: false, muteAudio: false, highContrast: false, showTutorial: false };

  const isMobileDevice = window.matchMedia?.("(pointer: coarse)")?.matches || window.innerWidth <= 820;

  try {
    const parsed = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) || "{}");
    return {
      mode: parsed.mode === "classic" || parsed.mode === "zen" ? parsed.mode : "arcade",
      reducedEffects: Boolean(parsed.reducedEffects),
      muteAudio: isMobileDevice ? true : Boolean(parsed.muteAudio),
      highContrast: Boolean(parsed.highContrast),
      showTutorial: Boolean(parsed.showTutorial),
    };
  } catch {
    return { mode: "arcade", reducedEffects: false, muteAudio: isMobileDevice, highContrast: false, showTutorial: false };
  }
}

function saveSettings(settings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}



function loadAchievementsProgress() {
  if (typeof window === "undefined") return { totalRuns: 0, unlockedIds: [] };

  try {
    const parsed = JSON.parse(window.localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY) || "{}");
    return {
      totalRuns: Number.isFinite(parsed.totalRuns) ? Math.max(0, Math.floor(parsed.totalRuns)) : 0,
      unlockedIds: Array.isArray(parsed.unlockedIds) ? parsed.unlockedIds.filter((id) => typeof id === "string") : [],
    };
  } catch {
    return { totalRuns: 0, unlockedIds: [] };
  }
}

function saveAchievementsProgress(progress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(progress));
}

function getDailyMission() {
  const dayNumber = Math.floor(Date.now() / 86400000);
  return DAILY_MISSIONS[dayNumber % DAILY_MISSIONS.length];
}

function loadMissionProgress() {
  if (typeof window === "undefined") return { completedCount: 0, lastCompletedMissionId: "" };

  try {
    const parsed = JSON.parse(window.localStorage.getItem(MISSION_PROGRESS_STORAGE_KEY) || "{}");
    return {
      completedCount: Number.isFinite(parsed.completedCount) ? Math.max(0, Math.floor(parsed.completedCount)) : 0,
      lastCompletedMissionId: typeof parsed.lastCompletedMissionId === "string" ? parsed.lastCompletedMissionId : "",
    };
  } catch {
    return { completedCount: 0, lastCompletedMissionId: "" };
  }
}

function saveMissionProgress(progress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MISSION_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

function createItem(width, height, speed = 1, forcedKind) {
  const roll = Math.random();
  const isBomb = forcedKind ? forcedKind === "bomb" : roll < 0.12;
  const isDoubleFruit = forcedKind ? forcedKind === "doubleFruit" : roll >= 0.12 && roll < 0.22;
  const isStarFruit = forcedKind ? forcedKind === "starFruit" : roll >= 0.22 && roll < 0.31;
  const baseFruit = pick(FRUITS);
  const size = isBomb ? random(72, 88) : random(86, 112);
  const spawnY = height + random(30, 120);

  return {
    uid: `${Date.now()}-${Math.random()}`,
    kind: isBomb ? "bomb" : isDoubleFruit ? "doubleFruit" : isStarFruit ? "starFruit" : "fruit",
    fruitId: isBomb ? BOMB.id : baseFruit.id,
    emoji: isBomb ? BOMB.emoji : isStarFruit ? STAR_FRUIT.emoji : baseFruit.emoji,
    color: isBomb ? "#fff" : isStarFruit ? STAR_FRUIT.color : baseFruit.color || "#fff",
    x: random(40, Math.max(45, width - 90)),
    y: spawnY,
    vx: random(-1.8, 1.8),
    vy: calculateLaunchVelocity({ arenaHeight: height, spawnY, speed }),
    size,
    rot: random(-25, 25),
    rotVel: random(-7, 7),
    cut: false,
  };
}

function getWaveSettings(wave) {
  const normalizedWave = Math.max(1, wave);
  const spawnInterval = Math.max(450, 1250 - normalizedWave * 70);
  const speed = 0.86 + normalizedWave * 0.075;
  const maxItems = Math.min(8, 2 + Math.floor(normalizedWave / 2));
  const bombChance = Math.min(0.28, 0.1 + normalizedWave * 0.015);
  const doubleFruitChance = Math.max(0.08, 0.13 - normalizedWave * 0.006);
  const starFruitChance = Math.max(0.05, 0.12 - normalizedWave * 0.004);
  const orderTimeLimit = Math.max(MIN_ORDER_TIME_LIMIT, ORDER_TIME_LIMIT - Math.floor((normalizedWave - 1) / 2));

  return {
    spawnInterval,
    speed,
    maxItems,
    bombChance,
    doubleFruitChance,
    starFruitChance,
    orderTimeLimit,
  };
}

function createWaveItem(width, height, wave, options = {}) {
  const config = getWaveSettings(wave);
  const allowBombs = options.allowBombs !== false;

  if (!allowBombs) {
    const specialRoll = Math.random();
    const isDoubleFruit = specialRoll < config.doubleFruitChance;
    const isStarFruit = !isDoubleFruit && specialRoll < config.doubleFruitChance + config.starFruitChance;

    return createItem(
      width,
      height,
      config.speed,
      isDoubleFruit ? "doubleFruit" : isStarFruit ? "starFruit" : "fruit",
    );
  }

  const roll = Math.random();
  const isBomb = roll < config.bombChance;
  const isDoubleFruit = !isBomb && roll < config.bombChance + config.doubleFruitChance;
  const isStarFruit = !isBomb && !isDoubleFruit && roll < config.bombChance + config.doubleFruitChance + config.starFruitChance;

  return createItem(
    width,
    height,
    config.speed,
    isBomb ? "bomb" : isDoubleFruit ? "doubleFruit" : isStarFruit ? "starFruit" : "fruit",
  );
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


const FACTORY_I18N = {
  pt: {
    title: "Fábrica de sucos",
    gameTitleIdle: "Fruit Ninja da Fábrica",
    gameOver: "Fim da partida",
    gameDescIdle: "Corte o máximo de frutas possível, ganhe mais pontos por sequência e desvie das bombas.",
    nameLabel: "Nome para registro",
    gameMode: "Modo de jogo",
    muteAudio: "Sem áudio",
    reduceEffects: "Reduzir efeitos visuais",
    highContrast: "Alto contraste",
    start: "Começar",
    playAgain: "Jogar novamente",
    tutorial: "Tutorial rápido",
    tutorialCut: "Deslize para cortar frutas e manter combos.",
    noBombsZen: "Sem bombas no modo Zen.",
    bombPenaltyClassic: "1 vida",
    bombPenaltyArcade: "2 segundos",
    missPenaltyClassic: "1 vida",
    missPenaltyArcade: "2 segundos",
    bonusText: "🟡 vale x2 pontos e ⭐ vale x3 pontos.",
    top10: "🏆 Top 3 pontuadores",
    loading: "Carregando ranking...",
    noScores: "Ainda sem pontuações registradas.",
    profileMissions: "Missões concluídas no perfil",
    achievements: "Conquistas desbloqueadas",
    newOnes: "🏅 Nova(s)",
    points: "pts",
    missionDone: "Concluída nesta rodada ✅",
  },
  en: {
    title: "Juice Factory",
    gameTitleIdle: "Factory Fruit Ninja",
    gameOver: "Game over",
    gameDescIdle: "Slice as many fruits as you can, earn more points with streaks and dodge bombs.",
    nameLabel: "Name for ranking",
    gameMode: "Game mode",
    muteAudio: "Mute audio",
    reduceEffects: "Reduce visual effects",
    highContrast: "High contrast",
    start: "Start",
    playAgain: "Play again",
    tutorial: "Quick tutorial",
    tutorialCut: "Swipe to slice fruits and keep combos.",
    noBombsZen: "No bombs in Zen mode.",
    bombPenaltyClassic: "1 life",
    bombPenaltyArcade: "2 seconds",
    missPenaltyClassic: "1 life",
    missPenaltyArcade: "2 seconds",
    bonusText: "🟡 is worth x2 points and ⭐ is worth x3 points.",
    top10: "🏆 Top 3 players",
    loading: "Loading ranking...",
    noScores: "No scores yet.",
    profileMissions: "Missions completed on profile",
    achievements: "Unlocked achievements",
    newOnes: "🏅 New",
    points: "pts",
    missionDone: "Completed in this run ✅",
  },
  es: {
    title: "Fábrica de jugos",
    gameTitleIdle: "Fruit Ninja de la Fábrica",
    gameOver: "Fin de la partida",
    gameDescIdle: "Corta la mayor cantidad de frutas posible, gana más puntos por rachas y evita las bombas.",
    nameLabel: "Nombre para ranking",
    gameMode: "Modo de juego",
    muteAudio: "Sin audio",
    reduceEffects: "Reducir efectos visuales",
    highContrast: "Alto contraste",
    start: "Comenzar",
    playAgain: "Jugar de nuevo",
    tutorial: "Tutorial rápido",
    tutorialCut: "Desliza para cortar frutas y mantener combos.",
    noBombsZen: "Sin bombas en el modo Zen.",
    bombPenaltyClassic: "1 vida",
    bombPenaltyArcade: "2 segundos",
    missPenaltyClassic: "1 vida",
    missPenaltyArcade: "2 segundos",
    bonusText: "🟡 vale x2 puntos y ⭐ vale x3 puntos.",
    top10: "🏆 Top 3 puntuadores",
    loading: "Cargando ranking...",
    noScores: "Aún no hay puntuaciones registradas.",
    profileMissions: "Misiones completadas en el perfil",
    achievements: "Logros desbloqueados",
    newOnes: "🏅 Nuevo(s)",
    points: "pts",
    missionDone: "Completada en esta ronda ✅",
  },
  fr: {
    title: "Usine à jus",
    gameTitleIdle: "Fruit Ninja de l'Usine",
    gameOver: "Fin de partie",
    gameDescIdle: "Coupez un maximum de fruits, gagnez plus de points en série et évitez les bombes.",
    nameLabel: "Nom pour le classement",
    gameMode: "Mode de jeu",
    muteAudio: "Sans audio",
    reduceEffects: "Réduire les effets visuels",
    highContrast: "Contraste élevé",
    start: "Commencer",
    playAgain: "Rejouer",
    tutorial: "Tutoriel rapide",
    tutorialCut: "Glissez pour couper les fruits et maintenir les combos.",
    noBombsZen: "Pas de bombes en mode Zen.",
    bombPenaltyClassic: "1 vie",
    bombPenaltyArcade: "2 secondes",
    missPenaltyClassic: "1 vie",
    missPenaltyArcade: "2 secondes",
    bonusText: "🟡 vaut x2 points et ⭐ vaut x3 points.",
    top10: "🏆 Top 3 des scores",
    loading: "Chargement du classement...",
    noScores: "Pas encore de scores enregistrés.",
    profileMissions: "Missions complétées sur le profil",
    achievements: "Succès débloqués",
    newOnes: "🏅 Nouveau(x)",
    points: "pts",
    missionDone: "Terminée pendant cette partie ✅",
  },
};

function JuiceFactoryNinja({ language = "pt" }) {
  const arenaRef = useRef(null);
  const rafRef = useRef(null);
  const slashRef = useRef([]);
  const lastSpawnAtRef = useRef(0);
  const audioCtxRef = useRef(null);
  const lastPlayedAudioIndexRef = useRef({ swipe: -1, cleanSlice: -1 });
  const lastSliceSoundAtRef = useRef(0);
  const phaseRef = useRef("idle");
  const waveRef = useRef(1);
  const sizeRef = useRef({ width: 980, height: 700 });
  const itemsRef = useRef([]);
  const lastActiveItemsAtRef = useRef(Date.now());
  const frameTimeRef = useRef(0);
  const pointerMoveRafRef = useRef(null);
  const pendingPointerEventRef = useRef(null);

  const [size, setSize] = useState({ width: 980, height: 700 });
  const [phase, setPhase] = useState("idle");
  const [items, setItems] = useState([]);
  const [slashTrail, setSlashTrail] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScoreLocal, setBestScoreLocal] = useState(loadBestScore);
  const [playerName, setPlayerName] = useState(loadSavedPlayerName);
  const [hasStoredPlayerName, setHasStoredPlayerName] = useState(() => Boolean(loadSavedPlayerName()));
  const [nameError, setNameError] = useState("");
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [waveProgress, setWaveProgress] = useState(0);
  const [orderTimeLeft, setOrderTimeLeft] = useState(ORDER_TIME_LIMIT);
  const [toast, setToast] = useState("");
  const [ranking, setRanking] = useState([]);
  const [rankingStatus, setRankingStatus] = useState("idle");
  const [slicedPieces, setSlicedPieces] = useState([]);
  const [sliceBursts, setSliceBursts] = useState([]);
  const [cutMarks, setCutMarks] = useState([]);
  const [juiceDrops, setJuiceDrops] = useState([]);
  const [explosionSparks, setExplosionSparks] = useState([]);
  const [arenaFlash, setArenaFlash] = useState([]);
  const [isArenaExpanded, setIsArenaExpanded] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [missedStreak, setMissedStreak] = useState(0);
  const [settings, setSettings] = useState(loadSettings);
  const [runStats, setRunStats] = useState({ fruitsSliced: 0, bombsSliced: 0, maxCombo: 0 });
  const [missionProgress, setMissionProgress] = useState(loadMissionProgress);
  const [missionCompletedInRun, setMissionCompletedInRun] = useState(false);
  const [achievementsProgress, setAchievementsProgress] = useState(loadAchievementsProgress);
  const [newAchievementsUnlocked, setNewAchievementsUnlocked] = useState([]);
  const hasSubmittedScoreRef = useRef(false);
  const ui = FACTORY_I18N[language] ?? FACTORY_I18N.en;

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
    itemsRef.current = items;
    if (items.length > 0) {
      lastActiveItemsAtRef.current = Date.now();
    }
  }, [items.length]);

  const isMobileArena = size.width <= 820;
  const isMobileDevice = typeof window !== "undefined" && (window.matchMedia?.("(pointer: coarse)")?.matches || window.innerWidth <= 820);
  const isPerformanceMode = settings.reducedEffects || isMobileDevice;
  const modeConfig = GAME_MODES[settings.mode] || GAME_MODES.arcade;
  const isClassicMode = settings.mode === "classic";
  const isZenMode = settings.mode === "zen";
  const usesTimer = modeConfig.usesTimer ?? true;
  const isSmallMobileArena = size.width <= 520;
  const isCompactArena = size.width <= 680;
  const isFullscreenActive = isArenaExpanded || isNativeFullscreen;
  const dailyMission = useMemo(() => getDailyMission(), []);
  const bestScore = useMemo(() => {
    const rankingBest = ranking.reduce((max, entry) => Math.max(max, Number(entry.score) || 0), 0);
    return Math.max(score, rankingBest, bestScoreLocal);
  }, [ranking, score, bestScoreLocal]);
  const rankingByMode = useMemo(() => {
    const grouped = {
      arcade: [],
      classic: [],
      zen: [],
    };

    ranking.forEach((entry) => {
      const mode = normalizeGameMode(entry.mode);
      grouped[mode].push(entry);
    });

    return {
      arcade: sortRanking(grouped.arcade).slice(0, 3),
      classic: sortRanking(grouped.classic).slice(0, 3),
      zen: sortRanking(grouped.zen).slice(0, 3),
    };
  }, [ranking]);

  useEffect(() => {
    setBestScoreLocal((oldBest) => {
      if (score <= oldBest) return oldBest;
      saveBestScore(score);
      return score;
    });
  }, [score]);

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
    const syncFullscreenState = () => {
      const nativeFullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
      setIsNativeFullscreen(nativeFullscreenElement === arenaRef.current);
    };

    document.addEventListener("fullscreenchange", syncFullscreenState);
    document.addEventListener("webkitfullscreenchange", syncFullscreenState);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
      document.removeEventListener("webkitfullscreenchange", syncFullscreenState);
    };
  }, []);

  useEffect(() => {
    if (!isMobileDevice || settings.muteAudio) return;
    setSettings((old) => ({ ...old, muteAudio: true }));
  }, [isMobileDevice, settings.muteAudio]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveMissionProgress(missionProgress);
  }, [missionProgress]);

  useEffect(() => {
    saveAchievementsProgress(achievementsProgress);
  }, [achievementsProgress]);

  useEffect(() => {
    if (!isFullscreenActive) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreenActive]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    document.body.classList.toggle("game-fullscreen-active", isFullscreenActive);

    return () => {
      document.body.classList.remove("game-fullscreen-active");
    };
  }, [isFullscreenActive]);


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
        return;
      }

      try {
        const entries = await fetchSupabaseRanking();
        setRanking(entries);
        setRankingStatus("ready");
      } catch (error) {
        logWarn("Falha ao carregar ranking do Supabase", { error: String(error) });
        setRanking(loadLocalRanking());
        setRankingStatus("ready");
      }
    }

    loadRanking();
  }, []);

  function resetGame() {
    cancelAnimationFrame(rafRef.current);
    lastSpawnAtRef.current = performance.now() - 1400;
    setItems([]);
    itemsRef.current = [];
    setSlashTrail([]);
    setScore(0);
    setCombo(0);
    setLives(3);
    setWave(1);
    setWaveProgress(0);
    waveRef.current = 1;
    setOrderTimeLeft(modeConfig.roundTime || ORDER_TIME_LIMIT);
    setToast("");
    setSlicedPieces([]);
    setSliceBursts([]);
    setCutMarks([]);
    setJuiceDrops([]);
    setExplosionSparks([]);
    setArenaFlash([]);
    setIsPaused(false);
    setMissedStreak(0);
    setRunStats({ fruitsSliced: 0, bombsSliced: 0, maxCombo: 0 });
    setMissionCompletedInRun(false);
    setNewAchievementsUnlocked([]);
    lastActiveItemsAtRef.current = Date.now();
    hasSubmittedScoreRef.current = false;
  }

  function startGame() {
    const normalizedName = normalizePlayerName(playerName);
    if (!normalizedName) {
      setNameError("Informe seu nome para iniciar a partida.");
      return;
    }

    savePlayerName(normalizedName);
    setHasStoredPlayerName(true);

    if (normalizedName !== playerName) {
      setPlayerName(normalizedName);
    }

    setNameError("");
    setSettings((old) => ({ ...old, showTutorial: false }));
    resetGame();
    setPhase("play");
  }


  function updateAchievements(runSummary) {
    setAchievementsProgress((old) => {
      const unlockedSet = new Set(old.unlockedIds);
      const nextRuns = old.totalRuns + 1;
      const summary = { ...runSummary, totalRuns: nextRuns };
      const newlyUnlocked = ACHIEVEMENT_DEFINITIONS
        .filter((achievement) => !unlockedSet.has(achievement.id) && achievement.check(summary))
        .map((achievement) => achievement.id);

      newlyUnlocked.forEach((id) => unlockedSet.add(id));
      setNewAchievementsUnlocked(newlyUnlocked);

      return {
        totalRuns: nextRuns,
        unlockedIds: Array.from(unlockedSet),
      };
    });
  }

  async function persistScore(finalScore) {
    if (hasSubmittedScoreRef.current) return;
    hasSubmittedScoreRef.current = true;

    const normalizedName = normalizePlayerName(playerName) || "Anônimo";
    const canUseSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

    if (canUseSupabase) {
      try {
        await insertSupabaseScore(normalizedName, finalScore, settings.mode);
        const freshRanking = await fetchSupabaseRanking();
        const persistedBest = Math.max(finalScore, ...freshRanking.map((entry) => Number(entry.score) || 0), bestScoreLocal);
        saveBestScore(persistedBest);
        setBestScoreLocal((oldBest) => Math.max(oldBest, persistedBest));
        setRanking(freshRanking);
        setRankingStatus("ready");
        setRankingMessage("Pontuação salva no Supabase ✅");
        return;
      } catch (error) {
        logWarn("Falha ao persistir score no Supabase", { error: String(error), mode: settings.mode });
        setRankingMessage("Falha ao salvar no Supabase. Pontuação salva localmente.");
      }
    }

    const localEntries = loadLocalRanking();
    const updated = sortRanking(mergeRankingByPlayer([
      ...localEntries,
      { player_name: normalizedName, score: finalScore, date: new Date().toISOString(), mode: settings.mode },
    ]), Number.POSITIVE_INFINITY);
    saveLocalRanking(updated);
    saveBestScore(Math.max(finalScore, ...updated.map((entry) => Number(entry.score) || 0), bestScoreLocal));
    setBestScoreLocal((oldBest) => Math.max(oldBest, finalScore, ...updated.map((entry) => Number(entry.score) || 0)));
    setRanking(updated);
    setRankingStatus("ready");
  }

  function endGame(message) {
    setToast(message);
    setPhase("over");
    cancelAnimationFrame(rafRef.current);
    updateAchievements({
      mode: settings.mode,
      score,
      wave,
      maxCombo: runStats.maxCombo,
      fruitsSliced: runStats.fruitsSliced,
      bombsSliced: runStats.bombsSliced,
      missionCompletedInRun,
    });
    void persistScore(score);
  }

  function getNextAudioIndex(type, size) {
    if (size <= 1) return 0;
    const lastIndex = lastPlayedAudioIndexRef.current[type];
    let nextIndex = Math.floor(Math.random() * size);

    if (nextIndex === lastIndex) {
      nextIndex = (nextIndex + 1 + Math.floor(Math.random() * (size - 1))) % size;
    }

    lastPlayedAudioIndexRef.current[type] = nextIndex;
    return nextIndex;
  }

  function playSliceSound(type = "slice") {
    if (typeof window === "undefined" || isMobileDevice || settings.muteAudio) return;

    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtxRef.current = new Ctx();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;

    const createNoiseBurst = ({ duration = 0.1, highpass = 800, lowpass = 7000, attack = 0.01, peak = 0.1 }) => {
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.09), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      }

      const source = ctx.createBufferSource();
      const hp = ctx.createBiquadFilter();
      const lp = ctx.createBiquadFilter();
      const g = ctx.createGain();
      source.buffer = buffer;

      hp.type = "highpass";
      hp.frequency.setValueAtTime(highpass, now);
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(lowpass, now);

      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(peak, now + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      source.connect(hp);
      hp.connect(lp);
      lp.connect(g);
      g.connect(ctx.destination);

      source.start(now);
      source.stop(now + duration);
    };

    const createTone = ({ wave = "sawtooth", startHz = 600, endHz = 140, duration = 0.2, peak = 0.12, band = 900 }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = wave;
      osc.frequency.setValueAtTime(startHz, now);
      osc.frequency.exponentialRampToValueAtTime(endHz, now + duration);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(band, now);
      filter.Q.setValueAtTime(0.8, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peak, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(filter);
      filter.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    };

    const swipeVariantIndex = getNextAudioIndex("swipe", SWIPE_VARIANT_COUNT);
    const cleanSliceVariantIndex = getNextAudioIndex("cleanSlice", CLEAN_SLICE_VARIANT_COUNT);

    if (type === "slice") {
      const baseHz = 880 + swipeVariantIndex * 70;
      createTone({ wave: "sawtooth", startHz: baseHz, endHz: 210 + swipeVariantIndex * 8, duration: 0.16, peak: 0.13, band: 1100 + swipeVariantIndex * 45 });
      createNoiseBurst({ duration: 0.09, highpass: 1200 + swipeVariantIndex * 90, lowpass: 5200 + swipeVariantIndex * 120, attack: 0.006, peak: 0.09 });
      return;
    }

    if (type === "slash") {
      const baseHz = 1050 + swipeVariantIndex * 85;
      createTone({ wave: "sawtooth", startHz: baseHz, endHz: 280 + swipeVariantIndex * 20, duration: 0.12, peak: 0.16, band: 1480 + swipeVariantIndex * 52 });
      createNoiseBurst({ duration: 0.065, highpass: 1700 + swipeVariantIndex * 110, lowpass: 7600, attack: 0.004, peak: 0.095 });
      return;
    }

    if (type === "swoosh") {
      createNoiseBurst({ duration: 0.09, highpass: 1300 + swipeVariantIndex * 75, lowpass: 5400 + swipeVariantIndex * 130, attack: 0.005, peak: 0.08 });
      return;
    }

    if (type === "cleanSlice") {
      const baseHz = 1250 + cleanSliceVariantIndex * 120;
      createTone({ wave: "triangle", startHz: baseHz, endHz: 350 + cleanSliceVariantIndex * 25, duration: 0.14, peak: 0.14, band: 1500 + cleanSliceVariantIndex * 60 });
      createNoiseBurst({ duration: 0.06, highpass: 1800 + cleanSliceVariantIndex * 140, lowpass: 7600, attack: 0.004, peak: 0.07 });
      return;
    }

    if (type === "bomb" || type === "explosion") {
      createTone({ wave: "sawtooth", startHz: 180, endHz: 48, duration: 0.42, peak: 0.22, band: 180 });
      createNoiseBurst({ duration: 0.34, highpass: 90, lowpass: 1400, attack: 0.008, peak: 0.35 });
      setTimeout(() => {
        if (ctx.state === "running") {
          createNoiseBurst({ duration: 0.2, highpass: 140, lowpass: 2200, attack: 0.007, peak: 0.26 });
        }
      }, 70);
      return;
    }

    if (type === "wrong") {
      createTone({ wave: "square", startHz: 260, endHz: 140, duration: 0.2, peak: 0.12, band: 350 });
      return;
    }

    if (type === "combo") {
      createTone({ wave: "triangle", startHz: 540, endHz: 920, duration: 0.18, peak: 0.13, band: 880 });
      setTimeout(() => {
        if (ctx.state === "running") {
          createTone({ wave: "triangle", startHz: 760, endHz: 1260, duration: 0.16, peak: 0.12, band: 1240 });
          createTone({ wave: "sine", startHz: 960, endHz: 1480, duration: 0.12, peak: 0.07, band: 1460 });
        }
      }, 60);
      return;
    }

    if (type === "splat") {
      createNoiseBurst({ duration: 0.18, highpass: 160, lowpass: 1200, attack: 0.012, peak: 0.2 });
      createTone({ wave: "triangle", startHz: 200, endHz: 120, duration: 0.17, peak: 0.07, band: 330 });
      return;
    }

    createTone({ wave: "sawtooth", startHz: 980, endHz: 220, duration: 0.16, peak: 0.14, band: 1200 });
    createNoiseBurst({ duration: 0.08, highpass: 1500, lowpass: 7000, attack: 0.007, peak: 0.11 });
  }


function spawnLogic() {
    if (isPaused) return;
    const now = performance.now();
    const currentWave = waveRef.current;
    const config = getWaveSettings(currentWave);

    setItems((prev) => {
      if (now - lastSpawnAtRef.current < config.spawnInterval) return prev;
      if (prev.length >= config.maxItems) return prev;

      lastSpawnAtRef.current = now;
      const next = [...prev];
      next.push(createWaveItem(sizeRef.current.width, sizeRef.current.height, currentWave, { allowBombs: modeConfig.allowBombs }));
      const normalizedItems = next.slice(-config.maxItems);
      itemsRef.current = normalizedItems;
      return normalizedItems;
    });
  }

  function tick() {
    if (phaseRef.current !== "play" || isPaused) return;

    rafRef.current = requestAnimationFrame(tick);

    const now = performance.now();
    const targetFrameMs = isPerformanceMode ? PERFORMANCE_FRAME_MS : NORMAL_FRAME_MS;
    if (now - frameTimeRef.current < targetFrameMs) return;
    frameTimeRef.current = now;
    const currentTime = Date.now();

    setItems((prev) => {
      const movedItems = prev.map((item) => ({
        ...item,
        x: item.x + item.vx,
        y: item.y + item.vy,
        vy: item.vy + GRAVITY,
        rot: item.rot + item.rotVel,
      }));

      const escapedItems = movedItems.filter((item) => item.y >= sizeRef.current.height + 120 && item.kind !== "bomb");
      const nextItems = movedItems.filter((item) => item.y < sizeRef.current.height + 120 && item.x > -140 && item.x < sizeRef.current.width + 140);

      if (escapedItems.length > 0) {
        setCombo(0);
        if (!modeConfig.penalizeMisses) {
          setToast(`🥝 ${escapedItems.length} fruta(s) escaparam (modo Zen sem penalidade).`);
          setMissedStreak((old) => old + escapedItems.length);
        } else if (isClassicMode) {
          setToast(`❌ ${escapedItems.length} fruta(s) escaparam! -${escapedItems.length} vida(s).`);
          setLives((old) => {
            const next = Math.max(0, old - escapedItems.length);
            if (next <= 0) {
              endGame("Fim de jogo: frutas demais escaparam da esteira!");
            }
            return next;
          });
        } else {
          const penalty = escapedItems.length * 2;
          setToast(`⏱️ Frutas escaparam! -${penalty}s.`);
          setOrderTimeLeft((old) => Math.max(0, old - penalty));
          setMissedStreak((old) => old + escapedItems.length);
        }
      }

      itemsRef.current = nextItems;
      return nextItems;
    });

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
        .filter((piece) => piece.y < sizeRef.current.height + 140 && currentTime - piece.createdAt < 850)
    );

    setJuiceDrops((prev) =>
      prev
        .map((drop) => ({
          ...drop,
          x: drop.x + drop.vx,
          y: drop.y + drop.vy,
          vy: drop.vy + GRAVITY * 0.5,
        }))
        .filter((drop) => currentTime - drop.createdAt < JUICE_DROP_LIFETIME)
    );

    setExplosionSparks((prev) =>
      prev
        .map((spark) => ({
          ...spark,
          x: spark.x + spark.vx,
          y: spark.y + spark.vy,
          vy: spark.vy + GRAVITY * 0.45,
        }))
        .filter((spark) => currentTime - spark.createdAt < EXPLOSION_SPARK_LIFETIME)
    );
  }

  useEffect(() => {
    if (phase !== "play") {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    lastSpawnAtRef.current = performance.now() - 1400;
    frameTimeRef.current = 0;
    tick();

    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, isPaused]);

  useEffect(() => {
    if (phase !== "play" || isPaused) return;

    const fallbackSpawner = window.setInterval(() => {
      const arenaIsEmptyForTooLong = Date.now() - lastActiveItemsAtRef.current > 1200;
      if (!arenaIsEmptyForTooLong) return;

      lastActiveItemsAtRef.current = Date.now();
      setItems((prev) => {
        if (prev.length > 0) return prev;
        const nextItems = [...prev, createWaveItem(sizeRef.current.width, sizeRef.current.height, waveRef.current, { allowBombs: modeConfig.allowBombs })];
        itemsRef.current = nextItems;
        return nextItems;
      });
    }, 380);

    return () => window.clearInterval(fallbackSpawner);
  }, [phase]);

  function applySlice(pointA, pointB) {
    if (phase !== "play" || isPaused) return;

    let hits = 0;
    let bombHits = 0;
    let correctHits = 0;
    let earnedPoints = 0;

    const splitEffects = [];
    const burstEffects = [];
    const bombSparkEffects = [];
    const bombFlashEffects = [];

    const remainingItems = [];
    for (const item of itemsRef.current) {
        const hit = intersectsSlash(item, pointA, pointB);
        if (!hit) {
          remainingItems.push(item);
          continue;
        }

        if (item.kind === "bomb") {
          bombHits += 1;
          bombSparkEffects.push(...limitEffects(createExplosionSparks(item), isPerformanceMode ? 8 : 16));
          bombFlashEffects.push({
            id: `${item.uid}-flash-${Math.random()}`,
            x: item.x + item.size / 2,
            y: item.y + item.size / 2,
            createdAt: Date.now(),
          });
          continue;
        }

        hits += 1;
        splitEffects.push(...limitEffects(createFruitSplits(item), isPerformanceMode ? 1 : 2));
        burstEffects.push({
          id: `${item.uid}-burst-${Math.random()}`,
          x: item.x + item.size / 2,
          y: item.y + item.size / 2,
          color: item.color,
          createdAt: Date.now(),
        });
        const basePoints = 10 + combo * 2;
        const pointMultiplier = item.kind === "doubleFruit" ? 2 : item.kind === "starFruit" ? 3 : 1;
        correctHits += 1;
        earnedPoints += basePoints * pointMultiplier;
      }

    itemsRef.current = remainingItems;
    setItems(remainingItems);

    if (splitEffects.length > 0) {
      setSlicedPieces((old) => [...old, ...splitEffects].slice(-(isPerformanceMode ? 12 : 24)));
      setSliceBursts((old) => [...old, ...burstEffects].slice(-(isPerformanceMode ? 8 : 16)));
      const markColor = "rgba(225,29,72,0.62)";
      setCutMarks((old) => [...old, createCutMark(pointA, pointB, markColor)].slice(-(isPerformanceMode ? 8 : 14)));
      const splashColor = "rgba(248,47,79,0.84)";
      const drops = limitEffects(createJuiceDrops(pointA, pointB, splashColor), isPerformanceMode ? 3 : 8);
      setJuiceDrops((old) => [...old, ...drops].slice(-(isPerformanceMode ? 20 : 72)));
    }

    if (bombHits > 0) {
      setRunStats((old) => ({ ...old, bombsSliced: old.bombsSliced + bombHits }));
      playSliceSound("explosion");
      setExplosionSparks((old) => [...old, ...bombSparkEffects].slice(-(isPerformanceMode ? 28 : 80)));
      setArenaFlash((old) => [...old, ...bombFlashEffects].slice(-(isPerformanceMode ? 4 : 8)));
      setCutMarks((old) => [...old, createCutMark(pointA, pointB, "rgba(255,190,112,0.72)")].slice(-(isPerformanceMode ? 8 : 14)));
      setCombo(0);
      if (isClassicMode) {
        setToast(`💣 Bomba cortada! -${bombHits} vida(s).`);
        setLives((old) => {
          const next = Math.max(0, old - bombHits);
          if (next <= 0) endGame("Fim de jogo: você acertou bombas demais.");
          return next;
        });
      } else {
        setOrderTimeLeft((old) => Math.max(0, old - bombHits * 2));
        setToast(`💣 Bomba cortada! -${bombHits * 2}s.`);
      }
    }

    if (correctHits > 0) {
      playSliceSound("cleanSlice");
      if (!isPerformanceMode) {
        playSliceSound("slash");
        playSliceSound("splat");
      }
      if ((hits > 1 || combo + 1 >= 3) && !isPerformanceMode) {
        playSliceSound("combo");
      }
      setCombo((old) => old + 1);
      setRunStats((old) => ({
        ...old,
        fruitsSliced: old.fruitsSliced + correctHits,
        maxCombo: Math.max(old.maxCombo, combo + 1),
      }));
      setScore((old) => old + earnedPoints);
      const hasMultiplier = earnedPoints > correctHits * (10 + combo * 2);
      setToast(hasMultiplier ? `Especial x2/x3! +${earnedPoints} ${ui.points}` : hits > 1 ? `Combo x${combo + 1}!` : `+${earnedPoints} ${ui.points}`);
      setWaveProgress((old) => {
        const next = old + correctHits;
        if (next < FRUITS_PER_WAVE) return next;

        const extraWaves = Math.floor(next / FRUITS_PER_WAVE);
        const updatedWave = waveRef.current + extraWaves;
        waveRef.current = updatedWave;
        setWave(updatedWave);
        setScore((oldScore) => oldScore + extraWaves * (220 + waveRef.current * 18));
        if (!isZenMode) {
          setOrderTimeLeft(getWaveSettings(updatedWave).orderTimeLimit);
        }
        setToast(`Onda ${updatedWave}! Frutas mais rápidas 🍍`);
        return next % FRUITS_PER_WAVE;
      });
    }
  }

  useEffect(() => {
    if (phase !== "play" || isPaused || !usesTimer) return;

    const timer = window.setInterval(() => {
      setOrderTimeLeft((old) => Math.max(0, old - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, isPaused, usesTimer]);

  useEffect(() => {
    if (sliceBursts.length === 0) return undefined;
    const timer = window.setTimeout(() => {
      setSliceBursts((old) => old.filter((burst) => Date.now() - burst.createdAt < 220));
    }, 120);

    return () => window.clearTimeout(timer);
  }, [sliceBursts]);

  useEffect(() => {
    if (cutMarks.length === 0) return undefined;
    const timer = window.setTimeout(() => {
      setCutMarks((old) => old.filter((mark) => Date.now() - mark.createdAt < CUT_MARK_LIFETIME));
    }, 110);

    return () => window.clearTimeout(timer);
  }, [cutMarks]);

  useEffect(() => {
    if (arenaFlash.length === 0) return undefined;
    const timer = window.setTimeout(() => {
      setArenaFlash((old) => old.filter((flash) => Date.now() - flash.createdAt < ARENA_FLASH_LIFETIME));
    }, 90);

    return () => window.clearTimeout(timer);
  }, [arenaFlash]);


  useEffect(() => {
    if (phase !== "play" || isPaused || !usesTimer || orderTimeLeft > 0) return;

    if (isZenMode) {
      endGame("Fim de jogo: o turno Zen acabou! 🧘");
      return;
    }

    setCombo(0);
    setOrderTimeLeft(getWaveSettings(wave).orderTimeLimit);
    setToast("⏳ Tempo esgotado! Você perdeu 1 vida.");

    setLives((old) => {
      const next = old - 1;
      if (next <= 0) {
        endGame("Fim de jogo: o tempo da fábrica acabou para você!");
        return 0;
      }
      return next;
    });
  }, [isZenMode, orderTimeLeft, phase, isPaused, usesTimer, wave]);

  useEffect(() => {
    if (phase !== "play" || missionCompletedInRun) return;

    const achieved = dailyMission.check({
      score,
      wave,
      fruitsSliced: runStats.fruitsSliced,
      bombsSliced: runStats.bombsSliced,
      maxCombo: runStats.maxCombo,
    });

    if (!achieved) return;

    setMissionCompletedInRun(true);
    setMissionProgress((old) => ({
      completedCount: old.completedCount + 1,
      lastCompletedMissionId: dailyMission.id,
    }));

    if (isClassicMode) {
      setLives((old) => Math.min(5, old + 1));
      setScore((old) => old + 140);
      setToast(`🎯 Missão concluída! +1 vida e +140 ${ui.points}.`);
      return;
    }

    setOrderTimeLeft((old) => old + 6);
    setScore((old) => old + 200);
    setToast(`🎯 Missão concluída! +6s e +200 ${ui.points}.`);
  }, [dailyMission, isClassicMode, missionCompletedInRun, phase, runStats, score, wave]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.code === "Space" && phase === "play") {
        event.preventDefault();
        setIsPaused((old) => !old);
      }

      if (event.code === "Enter" && phase !== "play") {
        event.preventDefault();
        startGame();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, playerName, settings.mode]);

  function toLocalPoint(ev) {
    const rect = arenaRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const source = "touches" in ev ? ev.touches[0] : ev;
    return { x: source.clientX - rect.left, y: source.clientY - rect.top, t: Date.now() };
  }

  function onPointerDown(ev) {
    if (phase !== "play" || isPaused) return;
    if ("touches" in ev) ev.preventDefault();

    const point = toLocalPoint(ev);
    slashRef.current = [point];
    setSlashTrail([point]);
  }

  function processPointerMove(ev) {
    if (phase !== "play" || isPaused) return;

    const point = toLocalPoint(ev);
    if (slashRef.current.length === 0) {
      if (!("touches" in ev)) {
        slashRef.current = [point];
        setSlashTrail([point]);
      }
      return;
    }

    const arr = [...slashRef.current, point].slice(-8);
    slashRef.current = arr;
    setSlashTrail(arr);

    const previous = arr[arr.length - 2];
    if (previous) {
      const distance = Math.hypot(point.x - previous.x, point.y - previous.y);
      const now = Date.now();
      if (distance > 14 && now - lastSliceSoundAtRef.current > 90) {
        playSliceSound("swoosh");
        lastSliceSoundAtRef.current = now;
      }

      applySlice(previous, point);
    }
  }

  function onPointerMove(ev) {
    if (phase !== "play" || isPaused) return;
    if ("touches" in ev) ev.preventDefault();

    pendingPointerEventRef.current = ev;
    if (pointerMoveRafRef.current) return;

    pointerMoveRafRef.current = requestAnimationFrame(() => {
      pointerMoveRafRef.current = null;
      const latestEvent = pendingPointerEventRef.current;
      pendingPointerEventRef.current = null;
      if (!latestEvent) return;
      processPointerMove(latestEvent);
    });
  }

  function onPointerUp() {
    if (pointerMoveRafRef.current) {
      cancelAnimationFrame(pointerMoveRafRef.current);
      pointerMoveRafRef.current = null;
    }
    pendingPointerEventRef.current = null;
    slashRef.current = [];
    setTimeout(() => setSlashTrail([]), 160);
  }

  async function expandArena() {
    const node = arenaRef.current;
    if (!node) return;

    const requestFullscreen = node.requestFullscreen || node.webkitRequestFullscreen;
    if (requestFullscreen) {
      try {
        await requestFullscreen.call(node);
        return;
      } catch {
        // fallback para expansão via CSS quando fullscreen nativo não estiver disponível.
      }
    }

    setIsArenaExpanded(true);
  }

  async function minimizeArena() {
    const nativeFullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (nativeFullscreenElement) {
      const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen;
      if (exitFullscreen) {
        try {
          await exitFullscreen.call(document);
        } catch {
          // ignora falha e aplica fallback local.
        }
      }
    }

    setIsArenaExpanded(false);
  }

  return (
    <section
      id="fabrica"
      style={{
        padding: isSmallMobileArena ? "30px 0 12px" : "48px 0 20px",
        background: "linear-gradient(180deg, #2d1206 0%, #130905 100%)",
        scrollMarginTop: isMobileArena ? 112 : 88,
      }}
    >
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: isSmallMobileArena ? "0 10px" : "0 14px" }}>
        <h2 className="section-title fruit-ninja-title section-title--left" style={{ margin: 0, color: "#ffcf43", textShadow: "0 2px 0 #5f3200", fontSize: "clamp(1.7rem, 4vw, 2.8rem)", lineHeight: 1.05 }}>{ui.title}</h2>
        <p style={{ marginTop: isSmallMobileArena ? 6 : 10, color: "#ffd447", fontSize: "clamp(1.05rem, 3.6vw, 1.9rem)", fontWeight: 900, letterSpacing: isSmallMobileArena ? 0.3 : 1.2, textTransform: "uppercase", fontFamily: "'Trebuchet MS', 'Arial Black', sans-serif", textShadow: "0 2px 0 #5f3200" }}>Fruit Ninja KaSucos</p>
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
            marginTop: isFullscreenActive ? 0 : 16,
            position: "relative",
            height: isFullscreenActive ? "100dvh" : isSmallMobileArena ? "62vh" : isCompactArena ? "66vh" : isMobileArena ? "70vh" : "76vh",
            minHeight: isSmallMobileArena ? 330 : isCompactArena ? 400 : isMobileArena ? 480 : 560,
            width: "100%",
            overflow: "hidden",
            borderRadius: isFullscreenActive ? 0 : 28,
            border: settings.highContrast ? "3px solid #fff" : "2px solid rgba(67, 35, 14, 0.9)",
            background:
              "radial-gradient(900px 400px at 70% 0%, rgba(255,104,104,0.2), transparent 60%), radial-gradient(700px 300px at 10% 0%, rgba(255,186,85,0.22), transparent 60%), linear-gradient(180deg, #43230f, #2b170c)",
            boxShadow: settings.highContrast ? "0 0 0 2px #000 inset" : "0 26px 60px rgba(6, 2, 1, 0.7), inset 0 0 40px rgba(0,0,0,0.28)",
            userSelect: "none",
            touchAction: "none",
            ...(isFullscreenActive ? {
              position: "fixed",
              inset: 0,
              width: "100vw",
              height: "100svh",
              minHeight: "100svh",
              zIndex: 1200,
            } : null),
            backgroundImage:
              "radial-gradient(1000px 480px at 52% -10%, rgba(255, 187, 79, 0.16), transparent 58%), linear-gradient(90deg, rgba(92,47,20,0.96) 0%, rgba(127,70,33,0.95) 22%, rgba(97,50,21,0.97) 40%, rgba(138,77,38,0.95) 61%, rgba(83,45,21,0.97) 100%), repeating-linear-gradient(90deg, rgba(58,31,13,0.5) 0px, rgba(58,31,13,0.5) 4px, transparent 4px, transparent 88px), repeating-linear-gradient(0deg, rgba(34,17,8,0.32) 0px, rgba(34,17,8,0.32) 2px, transparent 2px, transparent 138px)",
          }}
        >
          {isMobileArena && (
            <button
              type="button"
              onClick={isFullscreenActive ? minimizeArena : expandArena}
              aria-label={isFullscreenActive ? "Minimizar tela do jogo" : "Expandir tela do jogo"}
              title={isFullscreenActive ? "Minimizar" : "Expandir"}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 44,
                height: 44,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.4)",
                background: "rgba(15, 8, 4, 0.62)",
                color: "#fff",
                fontSize: 22,
                fontWeight: 700,
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                zIndex: 1201,
                boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
              }}
            >
              {isFullscreenActive ? "🗕" : "⛶"}
            </button>
          )}

          <div
            style={{
              position: "absolute",
              top: 14,
              left: phase === "play" ? "50%" : 12,
              transform: phase === "play" ? "translateX(-50%)" : "none",
              display: "flex",
              gap: 8,
              zIndex: 8,
            }}
          >
            {phase === "play" && (
              <button
                type="button"
                onClick={() => setIsPaused((old) => !old)}
                style={{ border: "1px solid rgba(255,255,255,0.35)", borderRadius: 10, background: "rgba(15, 8, 4, 0.62)", color: "#fff", fontWeight: 800, padding: "6px 10px", cursor: "pointer" }}
              >
                {isPaused ? "▶ Retomar" : "⏸ Pausar"}
              </button>
            )}
            {phase !== "play" && (
              <button
                type="button"
                onClick={() => setSettings((old) => ({ ...old, showTutorial: !old.showTutorial }))}
                style={{ border: "1px solid rgba(255,255,255,0.35)", borderRadius: 10, background: "rgba(15, 8, 4, 0.62)", color: "#fff", fontWeight: 800, padding: "6px 10px", cursor: "pointer" }}
              >
                {settings.showTutorial ? "Ocultar tutorial" : "Mostrar tutorial"}
              </button>
            )}
          </div>

          {WOOD_CRACKS.map((crack, index) => (
            <div
              key={`crack-${index}`}
              style={{
                position: "absolute",
                left: `${crack.x1 * 100}%`,
                top: `${crack.y1 * 100}%`,
                width: `${Math.hypot(crack.x2 - crack.x1, crack.y2 - crack.y1) * 100}%`,
                height: 2,
                transform: `rotate(${Math.atan2(crack.y2 - crack.y1, crack.x2 - crack.x1) * (180 / Math.PI)}deg)`,
                transformOrigin: "0 0",
                background: "linear-gradient(90deg, rgba(35,16,8,0.95), rgba(12,7,4,0.95))",
                opacity: 0.55,
                pointerEvents: "none",
              }}
            />
          ))}

          <div style={{ position: "absolute", bottom: isCompactArena ? 10 : 16, left: isMobileArena ? 10 : 18, display: "grid", gap: 2, color: "#ffd335", zIndex: 5, textShadow: "0 2px 0 #5b3900", maxWidth: isSmallMobileArena ? "54vw" : "unset" }}>
            <div style={{ display: "flex", alignItems: "center", gap: isMobileArena ? 6 : 10 }}>
              <span style={{ fontSize: isSmallMobileArena ? 24 : isMobileArena ? 28 : 38, lineHeight: 1 }}>🍉</span>
<strong style={{ fontSize: isSmallMobileArena ? 34 : isMobileArena ? 42 : 58, lineHeight: 0.9, fontFamily: "'Trebuchet MS', 'Arial Black', sans-serif", color: settings.highContrast ? "#fff" : undefined }}>{score}</strong>
            </div>
            <span style={{ color: "#79be46", fontSize: isSmallMobileArena ? 14 : isMobileArena ? 18 : 24, fontWeight: 900, lineHeight: 0.95, textTransform: "uppercase", fontFamily: "'Trebuchet MS', sans-serif", overflowWrap: "anywhere" }}>
              Best:{bestScore}
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              top: 16,
              right: isMobileArena ? 16 : 22,
              display: "flex",
              alignItems: phase === "play" ? (isCompactArena ? "flex-end" : "flex-start") : "center",
              gap: isMobileArena ? 6 : 10,
              zIndex: 4,
              maxWidth: phase === "play" ? (isSmallMobileArena ? "62vw" : "unset") : "40vw",
            }}
          >
            <div style={{ color: "#ffd339", fontSize: phase === "play" ? (isSmallMobileArena ? 30 : isMobileArena ? 42 : 68) : (isSmallMobileArena ? 24 : isMobileArena ? 30 : 40), fontWeight: 900, lineHeight: 0.8, fontFamily: "'Trebuchet MS', 'Arial Black', sans-serif", textShadow: "0 3px 0 #5b3900" }}>{usesTimer ? `${Math.floor(orderTimeLeft / 60)}:${String(orderTimeLeft % 60).padStart(2, "0")}` : "∞"}</div>
            {phase === "play" && (
              <div
                style={{
                  marginTop: 2,
                  display: "flex",
                  gap: isMobileArena ? 4 : 6,
                  alignItems: "center",
                  flexWrap: isCompactArena ? "wrap" : "nowrap",
                  justifyContent: "flex-end",
                  color: "#fff5dd",
                  fontSize: isSmallMobileArena ? 9 : isMobileArena ? 10 : 13,
                  fontWeight: 800,
                  whiteSpace: isCompactArena ? "normal" : "nowrap",
                  textShadow: "0 2px 0 rgba(62,31,2,0.95)",
                  maxWidth: isCompactArena ? 130 : "unset",
                }}
              >
                <span>⚡x{Math.max(1, combo)}</span>
                <span>{isZenMode ? "🫀♾️" : `🫀${"❤️".repeat(lives)}`}</span>
                <span>🚚{wave}</span>
                {!isClassicMode && missedStreak > 0 && <span style={{ opacity: 0.85 }}>⚠️ Erros: {missedStreak}</span>}
                <span style={{ opacity: 0.85 }}>{isZenMode ? "🟡 x2 • ⭐ x3 • sem bombas" : `🟡 x2 • ⭐ x3 • 💣 ${isClassicMode ? "-1 vida" : "-2s"}`}</span>
              </div>
            )}
          </div>

          <div style={{ position: "absolute", inset: 14, pointerEvents: "none" }}>
            <div style={{ display: "grid", gap: 8, width: isSmallMobileArena ? 170 : 260 }}>
              <div style={{ color: "#fff6df", fontWeight: 800, fontSize: isMobileArena ? 11 : 13, textShadow: "0 2px 0 rgba(62,31,2,0.95)" }}>
                Progresso da onda: {waveProgress}/{FRUITS_PER_WAVE}
              </div>
              <div style={{ height: 10, borderRadius: 999, border: "1px solid rgba(255,255,255,0.35)", background: "rgba(12,6,4,0.45)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(waveProgress / FRUITS_PER_WAVE) * 100}%`, background: "linear-gradient(90deg,#ffd544,#ff8c37)" }} />
              </div>
              <div style={{ border: "1px solid rgba(255,255,255,0.25)", background: "rgba(7,5,4,0.45)", borderRadius: 10, padding: "6px 8px", color: "#fff6df", fontSize: isMobileArena ? 10 : 12 }}>
                <div style={{ fontWeight: 800 }}>🎯 Missão do dia</div>
                <div>{dailyMission.label}</div>
                <div style={{ opacity: 0.82 }}>{missionCompletedInRun ? ui.missionDone : dailyMission.rewardText}</div>
              </div>
            </div>

            {toast && (
              <div
                style={{
                  position: "absolute",
                  top: isMobileArena ? 4 : 6,
                  left: isMobileArena ? 8 : 12,
                  right: isMobileArena ? 8 : 12,
                  margin: "0 auto",
                  maxWidth: isMobileArena ? "96%" : "74%",
                  padding: isMobileArena ? "4px 8px" : "5px 10px",
                  borderRadius: 10,
                  background: "rgba(0,0,0,0.2)",
                  color: "rgba(255,255,255,0.78)",
                  fontWeight: 600,
                  fontSize: isMobileArena ? 11 : 12,
                  lineHeight: 1.15,
                  textAlign: "center",
                  backdropFilter: "blur(1px)",
                  pointerEvents: "none",
                }}
              >
                {toast}
              </div>
            )}
          </div>

          {!settings.reducedEffects && <AnimatePresence>
            {arenaFlash.map((flash) => (
              <motion.div
                key={flash.id}
                initial={{ opacity: 0.55, scale: 0.2 }}
                animate={{ opacity: 0, scale: 3.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24 }}
                style={{
                  position: "absolute",
                  left: flash.x,
                  top: flash.y,
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "radial-gradient(circle, rgba(255,244,170,0.7), rgba(255,153,71,0.46) 38%, rgba(255,82,64,0.2) 66%, transparent 100%)",
                  pointerEvents: "none",
                  mixBlendMode: "screen",
                }}
              />
            ))}
          </AnimatePresence>}

          {!settings.reducedEffects && <AnimatePresence>
            {cutMarks.map((mark) => (
              <motion.div
                key={mark.id}
                initial={{ opacity: 0.9, scaleX: 0.7 }}
                animate={{ opacity: 0.3, scaleX: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                style={{
                  position: "absolute",
                  left: mark.x,
                  top: mark.y,
                  width: mark.length,
                  height: 10,
                  transform: `translate(-50%, -50%) rotate(${mark.angle}deg)`,
                  borderRadius: 999,
                  background: `linear-gradient(90deg, transparent 0%, ${mark.color} 20%, rgba(77,8,8,0.9) 50%, ${mark.color} 80%, transparent 100%)`,
                  boxShadow: "0 0 8px rgba(122,8,8,0.62)",
                  pointerEvents: "none",
                  mixBlendMode: "screen",
                }}
              />
            ))}
          </AnimatePresence>}

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

          {!settings.reducedEffects && <AnimatePresence>
            {explosionSparks.map((spark) => (
              <motion.div
                key={spark.id}
                initial={{ opacity: 0.95, scale: 0.35 }}
                animate={{ opacity: 0.05, scale: 1.25 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                style={{
                  position: "absolute",
                  left: spark.x,
                  top: spark.y,
                  width: spark.size,
                  height: spark.size,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,247,186,0.96), rgba(255,156,61,0.92) 58%, rgba(255,86,55,0.15) 100%)",
                  boxShadow: "0 0 14px rgba(255,140,70,0.72)",
                  pointerEvents: "none",
                }}
              />
            ))}
          </AnimatePresence>}

          {!settings.reducedEffects && <AnimatePresence>
            {juiceDrops.map((drop) => (
              <motion.div
                key={drop.id}
                initial={{ opacity: 0.95, scale: 0.4 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  left: drop.x,
                  top: drop.y,
                  width: drop.size,
                  height: drop.size,
                  borderRadius: "50%",
                  background: drop.color,
                  boxShadow: `0 0 8px ${drop.color}`,
                  pointerEvents: "none",
                }}
              />
            ))}
          </AnimatePresence>}

          {!settings.reducedEffects && <AnimatePresence>
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
          </AnimatePresence>}

          {slashTrail.length > 1 && (
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                display: "block",
                pointerEvents: "none",
                filter: "drop-shadow(0 0 10px rgba(228,245,255,0.75))",
              }}
            >
              <polyline
                points={slashTrail.map((point) => `${point.x},${point.y}`).join(" ")}
                fill="none"
                stroke="rgba(129, 200, 255, 0.45)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={slashTrail.map((point) => `${point.x},${point.y}`).join(" ")}
                fill="none"
                stroke="rgba(245,252,255,0.97)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {phase === "play" && isPaused && (
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(4,5,10,0.45)", zIndex: 20 }}>
              <div style={{ padding: "14px 18px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(24,20,44,0.92)", color: "#fff", textAlign: "center" }}>
                <p style={{ margin: "0 0 10px", fontWeight: 800 }}>Pausado</p>
                <button type="button" onClick={() => setIsPaused(false)} style={{ border: "none", borderRadius: 10, padding: "8px 12px", fontWeight: 800, cursor: "pointer", background: "#ff8a48", color: "#fff" }}>Continuar</button>
              </div>
            </div>
          )}

          {phase !== "play" && (
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "start center", background: "rgba(5,6,12,0.5)", padding: isSmallMobileArena ? "58px 8px 10px" : "64px 12px 14px" }}>
              <div style={{ background: "rgba(24,20,44,0.92)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20, padding: isSmallMobileArena ? "14px 12px" : "20px 20px", textAlign: "center", color: "white", width: isSmallMobileArena ? "min(96vw, 370px)" : "min(94vw, 560px)", maxHeight: "100%", overflowY: "auto" }}>
                <h3 style={{ marginTop: 0 }}>{phase === "idle" ? ui.gameTitleIdle : ui.gameOver}</h3>
                <p style={{ marginTop: 0 }}>{phase === "idle" ? ui.gameDescIdle : `Pontuação final: ${score}`}</p>
                {!hasStoredPlayerName && (
                  <label style={{ display: "grid", gap: 6, textAlign: "left", marginBottom: 12 }}>
                    <span style={{ fontWeight: 700 }}>{ui.nameLabel}</span>
                    <input
                      type="text"
                      value={playerName}
                      maxLength={24}
                      onChange={(ev) => setPlayerName(ev.target.value)}
                      placeholder="Digite seu nome"
                      style={{ borderRadius: 10, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.08)", color: "white", padding: "10px 12px", fontWeight: 600, width: "100%" }}
                    />
                  </label>
                )}
                {hasStoredPlayerName && <p style={{ margin: "4px 0 12px", opacity: 0.9 }}>Jogando como <strong>{playerName}</strong>.</p>}
                {nameError && <p style={{ marginTop: -4, marginBottom: 12, color: "#ff9a9a", fontWeight: 700 }}>{nameError}</p>}

                <div style={{ display: "grid", gap: 8, textAlign: "left", marginBottom: 12 }}>
                  <p style={{ margin: 0, fontWeight: 800 }}>{ui.gameMode}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {Object.entries(GAME_MODES).map(([key, mode]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSettings((old) => ({ ...old, mode: key }))}
                        style={{
                          border: "1px solid rgba(255,255,255,0.3)",
                          borderRadius: 10,
                          padding: "8px 10px",
                          background: settings.mode === key ? "rgba(255,180,64,0.25)" : "rgba(255,255,255,0.06)",
                          color: "white",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: 12 }}>{GAME_MODES[settings.mode]?.description}</p>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}><input type="checkbox" checked={settings.muteAudio} onChange={(ev) => setSettings((old) => ({ ...old, muteAudio: ev.target.checked }))} /> {ui.muteAudio}</label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}><input type="checkbox" checked={settings.reducedEffects} onChange={(ev) => setSettings((old) => ({ ...old, reducedEffects: ev.target.checked }))} /> {ui.reduceEffects}</label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}><input type="checkbox" checked={settings.highContrast} onChange={(ev) => setSettings((old) => ({ ...old, highContrast: ev.target.checked }))} /> {ui.highContrast}</label>
                </div>

                <button
                  type="button"
                  onClick={startGame}
                  style={{ border: "none", padding: "12px 20px", borderRadius: 12, background: "linear-gradient(90deg,#ff7a3b,#f4465a)", color: "white", fontWeight: 900, cursor: "pointer" }}
                >
                  {phase === "idle" ? ui.start : ui.playAgain}
                </button>

                <div style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 14, textAlign: "left" }}>
                  <p style={{ margin: "0 0 8px", fontWeight: 800 }}>{ui.top10}</p>
                  {rankingStatus === "loading" && <p style={{ margin: 0, opacity: 0.8 }}>{ui.loading}</p>}
                  {rankingStatus !== "loading" && ranking.length === 0 && <p style={{ margin: 0, opacity: 0.8 }}>{ui.noScores}</p>}
                  {(() => {
                    const selectedModeKey = normalizeGameMode(settings.mode);
                    const modeData = GAME_MODES[selectedModeKey];
                    const modeRanking = rankingByMode[selectedModeKey] || [];
                    if (rankingStatus === "loading" || modeRanking.length === 0) return null;

                    return (
                      <div
                        key={selectedModeKey}
                        style={{
                          marginTop: 12,
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.16)",
                          background: "rgba(255,255,255,0.05)",
                          padding: "8px 10px",
                        }}
                      >
                        <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 900, opacity: 0.95 }}>{modeData.label}</p>
                        {modeRanking.map((entry, index) => {
                          const isLeader = index === 0;

                          return (
                            <div
                              key={`${selectedModeKey}-${entry.player_name}-${entry.date}-${index}`}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 10,
                                fontWeight: isLeader ? 900 : 700,
                                opacity: isLeader ? 1 : 0.92,
                                marginTop: index === 0 ? 0 : 2,
                                padding: "5px 8px",
                                borderRadius: 8,
                                background: isLeader ? "linear-gradient(90deg, rgba(255,203,84,0.3), rgba(255,144,90,0.2))" : "rgba(255,255,255,0.02)",
                                border: isLeader ? "1px solid rgba(255,223,120,0.6)" : "1px solid transparent",
                              }}
                            >
                              <span style={{ overflowWrap: "anywhere" }}>
                                {isLeader ? "👑 " : ""}
                                {index + 1}. {entry.player_name}
                              </span>
                              <span style={{ color: isLeader ? "#ffe79a" : "white" }}>{entry.score} {ui.points}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                  {newAchievementsUnlocked.length > 0 && (
                    <p style={{ margin: "6px 0 0", fontSize: 12, color: "#9ff5aa", fontWeight: 700 }}>
                      {ui.newOnes}: {newAchievementsUnlocked.map((id) => ACHIEVEMENT_DEFINITIONS.find((item) => item.id === id)?.label || id).join(" • ")}
                    </p>
                  )}
                </div>

                <div style={{ marginTop: 12, marginBottom: 12, textAlign: "left" }}>
                  <button
                    type="button"
                    onClick={() => setSettings((old) => ({ ...old, showTutorial: !old.showTutorial }))}
                    style={{ border: "1px solid rgba(255,255,255,0.35)", borderRadius: 10, background: "rgba(15, 8, 4, 0.62)", color: "#fff", fontWeight: 800, padding: "7px 12px", cursor: "pointer" }}
                  >
                    Quick tutorial
                  </button>

                  {settings.showTutorial && (
                    <div style={{ marginTop: 10, textAlign: "left", fontSize: 13, lineHeight: 1.35, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "10px 12px" }}>
                      <p style={{ margin: "0 0 6px", fontWeight: 900 }}>{ui.tutorial}</p>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        <li>{ui.tutorialCut}</li>
                        <li>{isZenMode ? ui.noBombsZen : `💣 ${language === "en" ? "Bomb removes" : language === "fr" ? "La bombe retire" : language === "es" ? "La bomba quita" : "Bomba tira"} ${isClassicMode ? ui.bombPenaltyClassic : ui.bombPenaltyArcade}.`}</li>
                        <li>{isZenMode ? (language === "en" ? "Missing fruit does not penalize in Zen." : language === "es" ? "La fruta perdida no penaliza en Zen." : language === "fr" ? "Un fruit manqué ne pénalise pas en Zen." : "Fruta perdida não penaliza no Zen.") : `${language === "en" ? "Missed fruit removes" : language === "fr" ? "Un fruit manqué retire" : language === "es" ? "Fruta perdida quita" : "Fruta perdida tira"} ${isClassicMode ? ui.missPenaltyClassic : ui.missPenaltyArcade}.`}</li>
                        <li>{ui.bonusText}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function FabricaDeSucosSection({ language }) {
  return <JuiceFactoryNinja language={language} />;
}
