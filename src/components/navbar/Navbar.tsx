import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav id={styles.navbar}>
      <Link id={styles.link} to="/">
        <div id={styles.logo}>Prescripify.</div>
      </Link>
      <div
        id={styles.hamburger}
        onClick={toggleMenu}
        className={isMenuOpen ? styles.open : ""}
      >
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
      </div>
      <div
        id={styles.navLinks}
        className={isMenuOpen ? styles.navLinksOpen : ""}
      >
        <Link
          id={styles.link}
          to="/working"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className={styles.navItem}>Working</span>
        </Link>
        <Link id={styles.link} to="/team" onClick={() => setIsMenuOpen(false)}>
          <span className={styles.navItem}>Team</span>
        </Link>
        <Link
          id={styles.link}
          to="/techstack"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className={styles.navItem}>Tech Stack</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
