import { useState } from "react";
import { BenefitsSection } from "../features/benefits/components/BenefitsSection";
import { CatalogSection } from "../features/catalog/components/CatalogSection";
import { juices } from "../features/catalog/data/catalogData";
import { CombosSection } from "../features/combos/components/CombosSection";
import { combos } from "../features/combos/data/combosData";
import { ContactSection } from "../features/contact/components/ContactSection";
import { HeroSection } from "../features/hero/components/HeroSection";
import { Footer } from "../features/layout/components/Footer";
import { Header } from "../features/layout/components/Header";
import { ScrollArtLayer } from "../features/layout/components/ScrollArtLayer";
import { TestimonialsSection } from "../features/testimonials/components/TestimonialsSection";
import { ThemeSection } from "../features/theme/components/ThemeSection";
import { colorThemes } from "../features/theme/data/colorThemes";

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState("roxo");

  return (
    <div className="site" style={colorThemes[selectedTheme].colors}>
      <ScrollArtLayer />
      <Header />
      <main>
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
      </main>
      <Footer />
    </div>
  );
}
