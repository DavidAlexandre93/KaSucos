import { useState } from "react";
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
import { useFunEffects } from "../hooks/useFunEffects";
import { temas } from "../data/temasData";
import { useLanguage } from "../hooks/useLanguage";
import { themeNames, translations } from "../i18n/translations";

export default function App() {
  const [temaSelecionado, setTemaSelecionado] = useState("roxo");
  const [pedido, setPedido] = useState({});
  const { language, setLanguage } = useLanguage();
  const t = translations[language] ?? translations.pt;
  const totalItems = Object.values(pedido).reduce((total, quantidade) => total + quantidade, 0);

  const handleAddJuice = (juiceName) => {
    setPedido((prevPedido) => ({
      ...prevPedido,
      [juiceName]: (prevPedido[juiceName] ?? 0) + 1,
    }));
  };

  useFunEffects();

  return (
    <div className="site" style={temas[temaSelecionado].colors}>
      <ScrollArtLayer />
      <Header
        language={language}
        onLanguageChange={setLanguage}
        labels={t.nav}
        basketLabels={t.basket}
        totalItems={totalItems}
      />
      <main>
        <InicioSection hero={t.hero} />
        <TemasSection
          temas={temas}
          temaSelecionado={temaSelecionado}
          onTemaChange={setTemaSelecionado}
          title={t.theme.title}
          description={t.theme.description}
          themeNames={themeNames[language]}
        />
        <SucosSection
          sucos={sucos}
          language={language}
          title={t.juices.title}
          labels={t.juices}
          onAddJuice={handleAddJuice}
          pedido={pedido}
        />
        <CombosSection combos={combos} language={language} labels={t.combos} />
        <BeneficiosSection benefits={t.benefits} />
        <DepoimentosSection testimonials={t.testimonials} />
        <ContatoSection contact={t.contact} pedido={pedido} />
      </main>
      <Footer footer={t.footer} />
    </div>
  );
}
