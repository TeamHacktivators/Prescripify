import styles from "./Home.module.css";
import docPic from "../../assets/prescripify doc.png";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };
  return (
    <section>
      <Navbar />
      <div className={styles.homeContainer}>
        <div id={styles.aboutPrescripify}>
          <h1 id={styles.title}>Prescripify.</h1>
          <p id={styles.description}>
            Prescripify is a web app that allows doctors to record or upload
            audio notes and transcribe them into a prescription.
          </p>
          <p id={styles.ctaText}>
            {" "}
            "We use the latest in speech-to-text technology to make the process
            of writing prescriptions easier and faster. Our app is designed to
            be user-friendly and intuitive, so you can focus on what matters
            most: your patients."
          </p>
          {/* <p id={styles.ctaText}>Click the button below to get started.</p> */}
          <button id={styles.ctaButton} onClick={handleGetStarted}>
            Get started
          </button>
        </div>
        <div id={styles.docImg}>
          <img src={docPic} alt="" />
        </div>
      </div>
    </section>
  );
}

export default Home;
