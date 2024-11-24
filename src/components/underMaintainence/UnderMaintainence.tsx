import styles from "./UnderMaintainence.module.css";
import { useNavigate } from "react-router-dom";
function UnderMaintainence() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageBox}>
        <h1 className={styles.title}>🚧 Page Under Development 🚧</h1>
        <p className={styles.subtitle}>
          This feature will be out soon. Stay tuned!
        </p>
        <button className={styles.homeButton} onClick={goToHome}>
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default UnderMaintainence;
