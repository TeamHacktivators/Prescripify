import styles from "./Loader.module.css";
function Loader() {
  return (
   <section id={styles.loaderContainer}>
      <span className={styles.loader}></span>
   </section>
  )
}

export default Loader