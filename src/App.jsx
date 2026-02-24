import { useState } from "react";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { ScrollArtLayer } from "./components/layout/ScrollArtLayer";
import { BenefitsSection } from "./components/sections/BenefitsSection";
import { CatalogSection } from "./components/sections/CatalogSection";
import { CombosSection } from "./components/sections/CombosSection";
import { ContactSection } from "./components/sections/ContactSection";
import { HeroSection } from "./components/sections/HeroSection";
import { TestimonialsSection } from "./components/sections/TestimonialsSection";
import { ThemeSection } from "./components/sections/ThemeSection";
import { combos, juices } from "./data/catalog";
import { colorThemes } from "./data/themes";
import "./styles/app.css";

function App() {
  const [selectedTheme, setSelectedTheme] = useState("roxo");

  return (
    <div className="site" style={colorThemes[selectedTheme].colors}>
      <ScrollArtLayer />
      <Header />
      <HeroSection />
      <ThemeSection
        colorThemes={colorThemes}
        selectedTheme={selectedTheme}
        onThemeChange={setSelectedTheme}
      />
      <CatalogSection juices={juices} />
      <CombosSection combos={combos} />
      <BenefitsSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;
