import { useEffect, useMemo, useState } from "react";
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
import { TemasSection } from "../components/sections/TemasSection";
import { DicasInformacoesSection } from "../components/sections/DicasInformacoesSection";
import { MonteSeuSucoSection } from "../components/sections/MonteSeuSucoSection";
import { temas } from "../data/temasData";
import { useLanguage } from "../hooks/useLanguage";
import { themeNames, translations } from "../i18n/translations";
import { CartSection } from "../components/sections/CartSection";
import { CheckoutSection } from "../components/sections/CheckoutSection";
import { dicasBlogData } from "../data/dicasBlogData";
import { MotionSection } from "../components/ui/MotionPrimitives";
import { SplashScreen } from "../components/layout/SplashScreen";

const parsePrice = (priceText) => Number(priceText.replace("R$", "").replace(".", "").replace(",", ".").trim());
const formatBRL = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));

export default function App() {
  const [temaSelecionado, setTemaSelecionado] = useState("roxo");
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
    <div className="site" style={temas[temaSelecionado].colors}>
      {showSplash ? <SplashScreen onComplete={() => setShowSplash(false)} /> : null}
      <ScrollArtLayer />
      <Header
        language={language}
        onLanguageChange={setLanguage}
        labels={t.nav}
        basketCount={totalItems}
        onBasketClick={openCart}
      />
      <main>
        <MotionSection>
          <InicioSection hero={t.hero} />
        </MotionSection>
        <MotionSection delay={0.04}>
          <TemasSection
            temas={temas}
            temaSelecionado={temaSelecionado}
            onTemaChange={setTemaSelecionado}
            title={t.theme.title}
            description={t.theme.description}
            themeNames={themeNames[language]}
          />
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
          <MonteSeuSucoSection content={t.customJuice} />
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
