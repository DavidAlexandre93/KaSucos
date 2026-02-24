export function Header() {
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <a href="#inicio" className="brand">
          <img src="/img/logotipo.jpeg" alt="KaSucos" />
          <span>KaSucos</span>
        </a>
        <nav>
          <a href="#catalogo">Sucos</a>
          <a href="#combos">Combos</a>
          <a href="#beneficios">Benefícios</a>
          <a href="#contato">Contato</a>
        </nav>
      </div>
    </header>
  );
}
