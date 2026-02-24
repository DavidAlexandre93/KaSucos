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
import { temas } from "../data/temasData";

export default function App() {
  const [temaSelecionado, setTemaSelecionado] = useState("roxo");

  return (
    <div className="site" style={temas[temaSelecionado].colors}>
      <ScrollArtLayer />
      <Header />
      <main>
        <InicioSection />
        <TemasSection
          temas={temas}
          temaSelecionado={temaSelecionado}
          onTemaChange={setTemaSelecionado}
        />
        <SucosSection sucos={sucos} />
        <CombosSection combos={combos} />
        <BeneficiosSection />
        <DepoimentosSection />
        <ContatoSection />
      </main>
      <Footer />
    </div>
  );
}
