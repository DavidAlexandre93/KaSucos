export function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} KaSucos. {t.footerRights}
        </p>
        <span>{t.footerDeliveryNote}</span>
      </div>
    </footer>
  );
}
