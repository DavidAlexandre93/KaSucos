import { useRef, useState } from "react";

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
                aria-label={`${blog.likeButtonLabel}: ${likesByPost[post.id] ?? 0}`}
                title={`${blog.likeButtonLabel}: ${likesByPost[post.id] ?? 0}`}
              >
                <span aria-hidden="true">👍</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
