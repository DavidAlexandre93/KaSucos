import { useEffect, useRef, useState } from "react";
import { BeneficiosSection } from "../features/beneficios/components/BeneficiosSection";
import { SucosSection } from "../features/catalogo/components/SucosSection";
import { sucos } from "../features/catalogo/data/sucosData";
import { CombosSection } from "../features/combos/components/CombosSection";
import { combos } from "../features/combos/data/combosData";
import { ContatoSection } from "../features/contato/components/ContatoSection";
import { InicioSection } from "../features/inicio/components/InicioSection";
import { Footer } from "../layout/components/Footer";
import { Header } from "../layout/components/Header";
import { ScrollArtLayer } from "../layout/components/ScrollArtLayer";
import { DepoimentosSection } from "../features/depoimentos/components/DepoimentosSection";
import { DicasInformacoesSection } from "../features/blog/components/DicasInformacoesSection";
import { MonteSeuSucoSection } from "../features/customizacao/components/MonteSeuSucoSection";
import { useLanguage } from "../features/idioma/hooks/useLanguage";
import { useCart } from "../features/carrinho/hooks/useCart";
import { translations } from "../features/idioma/i18n/translations";
import { CartSection } from "../features/carrinho/components/CartSection";
import { CheckoutSection } from "../features/carrinho/components/CheckoutSection";
import { FabricaDeSucosSection } from "../features/fabrica/components/FabricaDeSucosSection";
import { dicasBlogData } from "../features/blog/data/dicasBlogData";
import { MotionSection } from "@/shared/components/MotionPrimitives";
import { SplashScreen } from "../layout/components/SplashScreen";
import { useGSAP } from "@/shared/lib/useGSAP";
import gsap from "@/shared/lib/gsap";

const parsePrice = (priceText) => Number(priceText.replace("R$", "").replace(".", "").replace(",", ".").trim());
const formatBRL = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));
const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || "5511967645721";

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
  const availableJuices = sucos;
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { language, setLanguage } = useLanguage();
  const t = translations[language] ?? translations.pt;

  const getLocalizedProductName = (product, currentLanguage = language) => {
    const rawName = product.title ?? product.name;
    if (typeof rawName === "string") return rawName;
    return rawName?.[currentLanguage] ?? rawName?.en ?? rawName?.pt ?? "";
  };

  const {
    items: cartItems,
    addItem,
    removeItem,
    getItemQuantity,
    totalItems,
    totalAmount,
  } = useCart({
    language,
    getLocalizedProductName,
    parsePrice,
  });
  const totalLabel = formatBRL(totalAmount);

  useEffect(() => {
    document.body.classList.toggle("splash-lock", showSplash);
    return () => document.body.classList.remove("splash-lock");
  }, [showSplash]);

  useGSAP(
    ({ selector }) => {
      if (typeof window !== "undefined") {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const lowPowerMobile = window.matchMedia("(max-width: 1024px), (pointer: coarse)").matches;

        if (prefersReduced || lowPowerMobile) {
          return undefined;
        }
      }

      const floatingTargets = selector(".card img, .combo, .map-box iframe, .hero-showcase-jar");
      const tiltCards = selector(".card, .combo, .fruit-chip, .reviews blockquote");

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


  const openCart = () => {
    setShowCart(true);
    const hasItems = totalItems > 0;
    setShowCheckout(hasItems);

    const targetSectionId = hasItems ? "finalizar" : "cesta";
    setTimeout(() => {
      document.getElementById(targetSectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const finalizePurchase = () => {
    setShowCheckout(true);
    setTimeout(() => {
      document.getElementById("finalizar")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const viewCombos = () => {
    const combosSection = document.getElementById("combos");
    if (!combosSection) return;

    combosSection.scrollIntoView({ behavior: "smooth", block: "start" });

    window.history.replaceState(null, "", "#combos");

    const heading = combosSection.querySelector(".section-title");
    if (heading instanceof HTMLElement) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  };

  const openJuicesCatalog = (event) => {
    event?.preventDefault();

    const juicesSection = document.getElementById("sucos-disponiveis-para-venda") || document.getElementById("catalogo");
    if (!juicesSection) return;

    juicesSection.scrollIntoView({ behavior: "smooth", block: "start" });

    if (typeof window !== "undefined" && window.location.hash !== "#catalogo") {
      window.history.replaceState(null, "", "#catalogo");
    }

    const heading = juicesSection.querySelector(".section-title");
    if (heading instanceof HTMLElement) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  };

  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => {
          setShowSplash(false);
        }}
      />
    );
  }

  return (
    <div className="site" style={DEFAULT_THEME_COLORS} ref={siteRef}>
      <ScrollArtLayer />
      <Header
        language={language}
        onLanguageChange={setLanguage}
        labels={t.nav}
        onBasketClick={openCart}
        onJuicesClick={openJuicesCatalog}
        basketCount={totalItems}
      />
      <main>
        <MotionSection>
          <InicioSection hero={t.hero} onViewCombos={viewCombos} onBuyNow={openJuicesCatalog} />
        </MotionSection>
        <MotionSection delay={0.06}>
          <SucosSection
            sucos={availableJuices}
            language={language}
            title={t.juices.title}
            labels={t.juices}
            onAddJuice={(juice) => addItem(juice, t.cart.unit)}
            getJuiceQuantity={getItemQuantity}
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
            <CartSection
              labels={t.cart}
              items={cartItems}
              total={totalLabel}
              onRemoveItem={removeItem}
              onFinalize={finalizePurchase}
            />
          </MotionSection>
        ) : null}
        {showCheckout ? (
          <MotionSection>
            <CheckoutSection checkout={t.checkout} total={totalLabel} items={cartItems} whatsappPhone={WHATSAPP_PHONE} contact={t.contact} />
          </MotionSection>
        ) : null}
        <FabricaDeSucosSection language={language} />
        <MotionSection>
          <BeneficiosSection benefits={t.benefits} />
        </MotionSection>
        <MotionSection>
          <DicasInformacoesSection blog={dicasBlogData[language] ?? dicasBlogData.en ?? dicasBlogData.pt} />
        </MotionSection>
        <MotionSection>
          <DepoimentosSection testimonials={t.testimonials} />
        </MotionSection>
        <ContatoSection contact={t.contact} />
      </main>
      <Footer footer={t.footer} />
    </div>
  );
}
