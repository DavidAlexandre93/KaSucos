import { useRef } from "react";
import gsap from "@/shared/lib/gsap";
import { motion } from "@/shared/lib/motion";
import { useGSAP } from "@/shared/lib/useGSAP";

export function Footer({ footer }) {
  const footerRef = useRef(null);

  useGSAP(
    ({ selector }) => {
      const content = selector(".footer-inner")[0];
      gsap.set(content, { opacity: 0, y: 14 });
      gsap.to(content, { opacity: 1, y: 0, duration: 0.5 });
    },
    { scope: footerRef, dependencies: [footer.rights] },
  );

  return (
    <footer className="footer" ref={footerRef}>
      <motion.div className="container footer-inner" whileHover={{ y: -1 }} transition={{ duration: 0.2 }}>
        <motion.p whileHover={{ x: 2 }}>
          © {new Date().getFullYear()} KaSucos. {footer.rights}
        </motion.p>
        <motion.span whileHover={{ x: -2 }}>{footer.delivery}</motion.span>
      </motion.div>
    </footer>
  );
}
