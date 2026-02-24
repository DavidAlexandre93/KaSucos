import { useMemo, useRef, useState } from "react";
import gsap from "../../lib/gsap";
import { ScrollTrigger } from "../../lib/ScrollTrigger";
import { useGSAP } from "../../lib/useGSAP";
import { motion } from "../../lib/motion";

gsap.registerPlugin(ScrollTrigger);

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

      gsap.set([header, ...cards], { opacity: 0, y: 18 });
      gsap.set(cards, { y: 22, scale: 0.98 });

      let hasPlayed = false;
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: ({ progress }) => {
          if (hasPlayed || progress < 0.15) return;
          hasPlayed = true;
          gsap
            .timeline()
            .to(header, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" })
            .to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out", stagger: 0.09 });
        },
      });

      return undefined;
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
            <motion.article key={post.id} className="tip-post" whileHover={{ y: -5, scale: 1.01 }} transition={{ duration: 0.25 }}>
              {post.image ? <motion.img src={post.image} alt={post.imageAlt} className="tip-post-image" whileHover={{ scale: 1.03 }} /> : null}
              <span className="tip-category">{post.category}</span>
              <h3>{post.title}</h3>
              <p className="tip-summary">{post.summary}</p>
              <ul>
                {post.content.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <motion.button
                type="button"
                className="tip-like-button"
                onClick={() => handleLike(post.id)}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                aria-label={`${blog.likeButtonLabel}: ${likesByPost[post.id] ?? 0}`}
                title={`${blog.likeButtonLabel}: ${likesByPost[post.id] ?? 0}`}
              >
                <span aria-hidden="true">👍</span>
              </motion.button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
