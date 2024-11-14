import styles from './PreviewLoader.module.css'

function PreviewLoader() {
  return (
    <section id={styles.previewLoaderContainer}>
        <div>
        <div className={styles.loader}></div>
        <br/>
        <br/>
        <p>Analysing the uploaded audio....</p>
        </div>
    </section>
  )
}

export default PreviewLoader