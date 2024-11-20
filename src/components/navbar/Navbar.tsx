import styles from './Navbar.module.css'
import {Link} from 'react-router-dom';
function Navbar() {
  return (
    <nav id={styles.navbar}>
    <Link id={styles.link} to="/"><div id={styles.logo}>Prescripify.</div></Link>
    <div id={styles.navLinks}>
      <Link id={styles.link} to="/working"><span className={styles.navItem}>Working</span></Link>
      <Link id={styles.link} to="/team"><span className={styles.navItem}>Team</span></Link>
      <Link id={styles.link} to="/techstack"><span className={styles.navItem}>Tech Stack</span></Link>
    </div>
  </nav>
  )
}

export default Navbar