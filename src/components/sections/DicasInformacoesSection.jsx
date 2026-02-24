import { useMemo, useRef, useState } from "react";
import { useGSAP } from "../../lib/useGSAP";

const STORAGE_KEY = "kasucos-blog-likes";

function getInitialLikes(posts) {
  const defaultLikes = Object.fromEntries(posts.map((post) => [post.id, 0]));

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

export function DicasInformacoesSection({ blog }) {
  const posts = blog?.posts ?? [];
  const [likesByPost, setLikesByPost] = useState(() => getInitialLikes(posts));
  const sectionRef = useRef(null);

  useGSAP(
    ({ selector }) => {
      if (!sectionRef.current || !posts.length) return undefined;

      const header = selector(".tips-header")[0];
      const cards = selector(".tip-post");

      const observer = new IntersectionObserver(
        ([entry], obs) => {
          if (!entry.isIntersecting) return;

          header?.animate([{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }], {
            duration: 450,
            easing: "ease-out",
            fill: "forwards",
          });

          cards.forEach((card, index) => {
            card.animate([{ opacity: 0, transform: "translateY(22px) scale(0.98)" }, { opacity: 1, transform: "translateY(0) scale(1)" }], {
              duration: 500,
              delay: 90 * index,
              easing: "cubic-bezier(.2,.8,.2,1)",
              fill: "forwards",
            });
          });

          obs.disconnect();
        },
        { threshold: 0.22 },
      );

      observer.observe(sectionRef.current);
      return () => observer.disconnect();
    },
    { scope: sectionRef, dependencies: [posts.length] },
  );

  const totalLikes = useMemo(
    () => Object.values(likesByPost).reduce((acc, value) => acc + value, 0),
    [likesByPost],
  );

  if (!posts.length) {
    return null;
  }

  const handleLike = (postId) => {
    setLikesByPost((previous) => {
      const next = {
        ...previous,
        [postId]: (previous[postId] ?? 0) + 1,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <section id="dicas" className="section tips-info-section" ref={sectionRef}>
      <div className="container">
        <header className="tips-header">
          <h2 className="section-title">{blog.sectionTitle}</h2>
          <p className="theme-text">{blog.sectionDescription}</p>
          <p className="tips-total-likes">👍 {blog.totalLikesLabel}: {totalLikes}</p>
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
              <button type="button" className="tip-like-button" onClick={() => handleLike(post.id)}>
                👍 {blog.likeButtonLabel}: {likesByPost[post.id] ?? 0}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
