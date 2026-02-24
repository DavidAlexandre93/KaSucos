export function Footer({ footer }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} KaSucos. {footer.rights}
        </p>
        <span>{footer.delivery}</span>
      </div>
    </footer>
  );
}
