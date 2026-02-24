import { useEffect, useMemo, useRef, useState } from "react";
import { BeneficiosSection } from "../components/sections/BeneficiosSection";
import { SucosSection } from "../components/sections/SucosSection";
import { sucos } from "../data/sucosData";
import { CombosSection } from "../components/sections/CombosSection";
import { combos } from "../data/combosData";
import { ContatoSection } from "../components/sections/ContatoSection";
import { InicioSection } from "../components/sections/InicioSection";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { ScrollArtLayer } from "../components/layout/ScrollArtLayer";
import { DepoimentosSection } from "../components/sections/DepoimentosSection";
import { DicasInformacoesSection } from "../components/sections/DicasInformacoesSection";
import { MonteSeuSucoSection } from "../components/sections/MonteSeuSucoSection";
import { useLanguage } from "../hooks/useLanguage";
import { translations } from "../i18n/translations";
import { CartSection } from "../components/sections/CartSection";
import { CheckoutSection } from "../components/sections/CheckoutSection";
import { dicasBlogData } from "../data/dicasBlogData";
import { MotionSection } from "../components/ui/MotionPrimitives";
import { SplashScreen } from "../components/layout/SplashScreen";
import { useGSAP } from "../lib/useGSAP";
import gsap from "../lib/gsap";

const parsePrice = (priceText) => Number(priceText.replace("R$", "").replace(".", "").replace(",", ".").trim());
const formatBRL = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));

const DEFAULT_THEME_COLORS = {
  "--purple-900": "#3b1575",
  "--purple-700": "#5f27b2",
  "--purple-100": "#f2ebff",
  "--green-500": "#75cb2f",
  "--yellow-400": "#ffcc21",
  "--orange-500": "#ff8e1e",
  "--text": "#2d184f",
  "--muted": "#5f4b88",
  "--bg-base": "#f7f2ff",
};

export default function App() {
  const siteRef = useRef(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { language, setLanguage } = useLanguage();
  const t = translations[language] ?? translations.pt;

  useEffect(() => {
    document.body.classList.toggle("splash-lock", showSplash);
    return () => document.body.classList.remove("splash-lock");
  }, [showSplash]);

  useGSAP(
    ({ selector }) => {
      const floatingTargets = selector(".card img, .combo, .tip-post-image, .map-box iframe, .hero-showcase-jar");
      const tiltCards = selector(".card, .combo, .tip-post, .fruit-chip, .reviews blockquote");

      const onPointerMove = (event) => {
        const x = Math.round((event.clientX / window.innerWidth) * 100);
        const y = Math.round((event.clientY / window.innerHeight) * 100);
        gsap.to(document.documentElement, {
          "--cursor-x": `${x}%`,
          "--cursor-y": `${y}%`,
          duration: 0.3,
        });

        tiltCards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const rotateY = ((event.clientX - centerX) / Math.max(220, rect.width)) * 10;
          const rotateX = ((centerY - event.clientY) / Math.max(220, rect.height)) * 10;

          gsap.to(card, {
            "--tilt-x": `${rotateX.toFixed(2)}deg`,
            "--tilt-y": `${rotateY.toFixed(2)}deg`,
            duration: 0.35,
          });
        });
      };

      const onPointerLeave = () => {
        tiltCards.forEach((card) => {
          gsap.to(card, { "--tilt-x": "0deg", "--tilt-y": "0deg", duration: 0.45 });
        });
      };

      const onScroll = () => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = window.scrollY / maxScroll;
        gsap.to(document.documentElement, {
          "--scroll-glow": progress,
          "--scroll-party": Math.max(0, (progress - 0.25) * 1.4),
          duration: 0.28,
        });
      };

      const pulseInterval = window.setInterval(() => {
        floatingTargets.forEach((target, index) => {
          const shift = (index % 2 === 0 ? -1 : 1) * (8 + (index % 3) * 2);
          gsap.to(target, {
            yPercent: shift,
            rotate: (index % 2 === 0 ? -1 : 1) * 1.4,
            scale: 1.012,
            duration: 1.2 + (index % 4) * 0.12,
          });
        });
      }, 1500);

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("scroll", onScroll);
        window.clearInterval(pulseInterval);
      };
    },
    { scope: siteRef, dependencies: [] },
  );


  const addItem = (product, typeLabel) => {
    setCartItems((current) => {
      const id = product.title || product.name;
      const existing = current.find((item) => item.id === id);

      if (existing) {
        return current.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
      }

      return [
        ...current,
        {
          id,
          name: id,
          price: parsePrice(product.price),
          priceLabel: product.price,
          quantity: 1,
          typeLabel,
        },
      ];
    });
  };

  const totalItems = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);
  const totalAmount = useMemo(() => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0), [cartItems]);
  const totalLabel = formatBRL(totalAmount);

  const openCart = () => {
    setShowCart(true);
    setShowCheckout(true);
    setTimeout(() => {
      document.getElementById("cesta")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const finalizePurchase = () => {
    setShowCheckout(true);
    setTimeout(() => {
      document.getElementById("finalizar")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return (
    <div className="site" style={DEFAULT_THEME_COLORS} ref={siteRef}>
      {showSplash ? <SplashScreen onComplete={() => setShowSplash(false)} /> : null}
      <ScrollArtLayer />
      <Header
        language={language}
        onLanguageChange={setLanguage}
        labels={t.nav}
        onBasketClick={openCart}
      />
      <main>
        <MotionSection>
          <InicioSection hero={t.hero} />
        </MotionSection>
        <MotionSection delay={0.06}>
          <SucosSection
            sucos={sucos}
            language={language}
            title={t.juices.title}
            labels={t.juices}
            onAddJuice={(juice) => addItem(juice, t.cart.unit)}
          />
        </MotionSection>
        <MotionSection delay={0.08}>
          <MonteSeuSucoSection
            content={t.customJuice}
            onAddCustomJuice={(customJuice) => addItem(customJuice, t.cart.custom)}
          />
        </MotionSection>
        <MotionSection delay={0.1}>
          <CombosSection combos={combos} language={language} labels={t.combos} onAddCombo={(combo) => addItem(combo, t.cart.combo)} />
        </MotionSection>
        {showCart ? (
          <MotionSection>
            <CartSection labels={t.cart} items={cartItems} total={totalLabel} onFinalize={finalizePurchase} />
          </MotionSection>
        ) : null}
        {showCheckout ? (
          <MotionSection>
            <CheckoutSection checkout={t.checkout} total={totalLabel} />
          </MotionSection>
        ) : null}
        <MotionSection>
          <BeneficiosSection benefits={t.benefits} />
        </MotionSection>
        <MotionSection>
          <DicasInformacoesSection blog={dicasBlogData[language] ?? dicasBlogData.pt} />
        </MotionSection>
        <MotionSection>
          <DepoimentosSection testimonials={t.testimonials} />
        </MotionSection>
        <MotionSection>
          <ContatoSection contact={t.contact} />
        </MotionSection>
      </main>
      <Footer footer={t.footer} />
    </div>
  );
}
