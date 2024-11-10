import styles from './Navbar.module.css'
function Navbar() {
  return (
    <nav id={styles.navbar}>
    <div id={styles.logo}>Prescripify.</div>
    <div id={styles.navLinks}>
      <span className={styles.navItem}>Working</span>
      <span className={styles.navItem}>Team</span>
      <span className={styles.navItem}>Tech Stack</span>
    </div>
  </nav>
  )
}

export default Navbar