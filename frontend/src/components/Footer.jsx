export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <p>Chaque petit pas compte. Construis tes habitudes, un jour après l’autre.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()}</span>
        <span>Fait avec soin pour t’aider à garder le rythme.</span>
      </div>
    </footer>
  );
}
