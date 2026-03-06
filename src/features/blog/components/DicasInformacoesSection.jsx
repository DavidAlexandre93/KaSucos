import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWithRetry } from "@/shared/lib/http";
import { logWarn } from "@/shared/lib/logger";

const STORAGE_KEY = "kasucos-blog-likes";
const USER_LIKES_STORAGE_KEY = "kasucos-blog-user-likes";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_LIKES_TABLE = import.meta.env.VITE_SUPABASE_LIKES_TABLE || "blog_likes";

function hasSupabaseConfig() {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
}

async function requestSupabase(path, options = {}) {
  const response = await fetchWithRetry(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      ...(options.headers || {}),
    },
  }, { retries: 1, timeoutMs: 4500, retryDelayMs: 250 });

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

async function fetchLikesFromSupabase(postIds) {
  if (!hasSupabaseConfig() || !postIds.length) return {};

  const quotedIds = postIds.map((id) => `"${id}"`).join(",");
  const query = new URLSearchParams({
    select: "post_id,likes",
    post_id: `in.(${quotedIds})`,
  });

  const response = await requestSupabase(`${SUPABASE_LIKES_TABLE}?${query.toString()}`);
  const rows = await response.json();

  return (Array.isArray(rows) ? rows : []).reduce((accumulator, row) => {
    accumulator[row.post_id] = Number(row.likes) || 0;
    return accumulator;
  }, {});
}

async function saveLikeToSupabase(postId, likes) {
  if (!hasSupabaseConfig()) return;

  await requestSupabase(SUPABASE_LIKES_TABLE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({ post_id: postId, likes }),
  });
}

function getDefaultLikes(posts) {
  return Object.fromEntries(posts.map((post) => [post.id, 0]));
}

function getInitialLikes(posts) {
  const defaultLikes = getDefaultLikes(posts);

  if (typeof window === "undefined") {
    return defaultLikes;
  }

  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    return { ...defaultLikes, ...saved };
  } catch {
    return defaultLikes;
  }
}

function getInitialUserLikes(posts) {
  const defaultUserLikes = Object.fromEntries(posts.map((post) => [post.id, false]));

  if (typeof window === "undefined") {
    return defaultUserLikes;
  }

  try {
    const saved = JSON.parse(window.localStorage.getItem(USER_LIKES_STORAGE_KEY) ?? "{}");
    return { ...defaultUserLikes, ...saved };
  } catch {
    return defaultUserLikes;
  }
}

export function DicasInformacoesSection({ blog }) {
  const posts = blog?.posts ?? [];
  const [likesByPost, setLikesByPost] = useState(() => getInitialLikes(posts));
  const [userLikesByPost, setUserLikesByPost] = useState(() => getInitialUserLikes(posts));
  const [isSyncingLikes, setIsSyncingLikes] = useState(false);
  const sectionRef = useRef(null);

  const syncLikes = useCallback(async () => {
    if (!posts.length) return;

    setIsSyncingLikes(true);
    try {
      const defaults = getDefaultLikes(posts);
      const remoteLikes = await fetchLikesFromSupabase(posts.map((post) => post.id));
      const merged = { ...defaults, ...remoteLikes };

      setLikesByPost(merged);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (error) {
      logWarn("Falha ao sincronizar likes com Supabase", { error: String(error) });
    } finally {
      setIsSyncingLikes(false);
    }
  }, [posts]);

  useEffect(() => {
    if (!posts.length) return;

    setLikesByPost(getInitialLikes(posts));
    setUserLikesByPost(getInitialUserLikes(posts));
    syncLikes();
  }, [posts, syncLikes]);

  if (!posts.length) {
    return null;
  }

  const handleLike = (postId) => {
    setUserLikesByPost((previousUserLikes) => {
      const userAlreadyLiked = Boolean(previousUserLikes[postId]);
      if (userAlreadyLiked) {
        return previousUserLikes;
      }

      const nextUserLikes = {
        ...previousUserLikes,
        [postId]: true,
      };

      window.localStorage.setItem(USER_LIKES_STORAGE_KEY, JSON.stringify(nextUserLikes));

      setLikesByPost((previousLikes) => {
        const currentLikes = previousLikes[postId] ?? 0;
        const nextLikeCount = currentLikes + 1;
        const nextLikes = {
          ...previousLikes,
          [postId]: nextLikeCount,
        };

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLikes));
        saveLikeToSupabase(postId, nextLikeCount)
          .then(() => syncLikes())
          .catch((error) => {
            logWarn("Falha ao salvar like no Supabase", { error: String(error), postId });
          });

        return nextLikes;
      });

      return nextUserLikes;
    });
  };

  return (
    <section id="dicas" className="section tips-info-section" ref={sectionRef}>
      <div className="container">
        <header className="tips-header">
          <h2 className="section-title fruit-ninja-title">{blog.sectionTitle}</h2>
          <p className="theme-text">{blog.sectionDescription}</p>
        </header>

        <div className="tips-blog-list">
          {posts.map((post) => (
            <article key={post.id} className="tip-post">
              {post.image ? <img src={post.image} alt={post.imageAlt} className="tip-post-image" /> : null}
              <span className="tip-category">{post.category}</span>
              <h3>{post.title}</h3>
              <p className="tip-summary">{post.summary}</p>
              <ul>
                {post.content.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button
                type="button"
                className="tip-like-button"
                onClick={() => handleLike(post.id)}
                aria-pressed={Boolean(userLikesByPost[post.id])}
                aria-label={`${blog.likeButtonLabel}: ${likesByPost[post.id] ?? 0}${isSyncingLikes ? " (sincronizando)" : ""}`}
                title={`${blog.likeButtonLabel}: ${likesByPost[post.id] ?? 0}`}
              >
                <svg aria-hidden="true" className="tip-like-icon" viewBox="0 0 64 64" role="img">
                  <circle cx="32" cy="32" r="30" fill="#1e88e5" />
                  <path
                    d="M24 28c0-1.66-1.34-3-3-3h-7c-1.66 0-3 1.34-3 3v18c0 1.66 1.34 3 3 3h7c1.66 0 3-1.34 3-3V28zm6.2 21h15.66c1.8 0 3.34-1.25 3.71-3.01l2.13-9.9c.06-.27.1-.56.1-.84v-2.76c0-1.93-1.57-3.5-3.5-3.5H37.27l1.67-8.03.05-.53c0-.72-.3-1.37-.78-1.85L36.36 17 24.9 28.46C24.33 29.03 24 29.81 24 30.64V45.5c0 1.93 1.57 3.5 3.5 3.5h2.7z"
                    fill="#ffffff"
                  />
                </svg>
                <span className="tip-like-count">{likesByPost[post.id] ?? 0}</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
