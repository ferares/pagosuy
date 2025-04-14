export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        &copy;
        PagosUY {(new Date()).getFullYear()}
      </div>
    </footer>
  )
}