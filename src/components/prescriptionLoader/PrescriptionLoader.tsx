import styles from './PrescriptionLoader.module.css'

function PrescriptionLoader() {
  return (
    <section id={styles.prescriptionLoaderContainer}>
    <div>
    <div className={styles.loader}></div>
    <br/>
    <br/>
    <p>Generating PDF ...</p>
    </div>
</section>
  )
}

export default PrescriptionLoader