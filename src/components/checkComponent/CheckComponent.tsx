import styles from "./CheckComponent.module.css";
import { useNavigate } from "react-router-dom";

function CheckComponent() {
  const navigate = useNavigate();

  const goToUpload = () => {
    navigate("/doctor/upload");
  };

  return (
    <section id={styles.checkComponentContainer}>
      <h1>OOPS!</h1>
      <h3>You can't access this page</h3>
      <p>
        It seems like you haven't submitted data or it hasn't yet reached our
        servers.
      </p>
      <p>
        Try to <span onClick={goToUpload}>upload</span> it again.
      </p>
    </section>
  );
}

export default CheckComponent;
