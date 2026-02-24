import { useEffect, useState } from "react";
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
import {
  detectInitialLocale,
  getLocalizedCatalog,
  getLocalizedCombos,
  getTranslations,
} from "../i18n/translations";

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState("roxo");
  const [locale, setLocale] = useState("pt-BR");

  useEffect(() => {
    detectInitialLocale().then(setLocale);
  }, []);

  const t = getTranslations(locale);
  const localizedJuices = getLocalizedCatalog(locale, juices);
  const localizedCombos = getLocalizedCombos(locale, combos);

  return (
    <div className="site" style={colorThemes[selectedTheme].colors}>
      <ScrollArtLayer />
      <Header locale={locale} onLocaleChange={setLocale} t={t} />
      <main>
        <HeroSection t={t} />
        <ThemeSection
          colorThemes={colorThemes}
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
          t={t}
        />
        <CatalogSection juices={localizedJuices} t={t} />
        <CombosSection combos={localizedCombos} t={t} />
        <BenefitsSection t={t} />
        <TestimonialsSection t={t} />
        <ContactSection t={t} />
      </main>
      <Footer t={t} />
    </div>
  );
}
