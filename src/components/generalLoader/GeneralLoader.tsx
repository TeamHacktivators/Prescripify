import styles from "./GeneralLoader.module.css";
function GeneralLoader() {
  return (
    <section id={styles.customLoaderContainer}>
      <span className={styles.loader}></span>
    </section>
  )
}

export default GeneralLoader