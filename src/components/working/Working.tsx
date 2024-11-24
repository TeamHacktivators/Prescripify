import styles from "./Working.module.css";
import Navbar from '../navbar/Navbar';
import Video from "../../assets/Prescripify_Demo.mp4";
import DocFlowchart from "../../assets/docflowchart.jpg";
import PatFlowchart from "../../assets/patflowchart.jpg";


export default function Working() {
  return (
    <section>
      <Navbar />
    <div className={styles.working} id={styles.working}>
      <div className={styles.workingtop}>
        <div className={styles.workingleft}>
          <h1 className={styles.title}>Why Prescipify ?</h1>
          <p id={styles.desc}>
          Prescipify streamlines prescription management, saving doctors time, reducing errors from handwritten notes, and enabling easy sharing and remote access. It lessens administrative burdens, enhances patient care, and helps patients find affordable medication options, addressing key challenges in healthcare.
          </p>
        </div>
        <div className={styles.workingright}>
          <div className={styles.video}>
            <video className={styles.video} controls loop src={Video} autoPlay muted></video>
          </div>
        </div>
      </div>
      <div className={styles.workingbottom}>
        <h1 className={styles.title} id={styles.flowTitle}>See Prescipify in Action</h1>
        <div className={styles.imagegrid}>
        <div className={styles.gridelement}>
          <p className={styles.subtitle}><i className="bi bi-caret-right-fill"></i> Doctor's Flow</p>
          <img className={styles.flowdiagram} src={PatFlowchart} alt="" />
          </div>
          <div className={styles.gridelement}>
          <p className={styles.subtitle}><i className="bi bi-caret-right-fill"></i> Patient's Flow</p>
          <img className={styles.flowdiagram} src={DocFlowchart} alt="" />
          </div>
        </div>
      </div>
    </div>
    </section>
  )
}
