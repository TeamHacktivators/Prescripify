import styles from "./PatientDashboard.module.css";
import { Route, Routes } from "react-router-dom";
import AboutPat from "../aboutPat/AboutPat";

function PatientDashboard() {
    return (
    <Routes>
      <Route
        path="/"
        element={
            <>
              <section id={styles.dashboardContainer}>
                <AboutPat />
              </section>
            </>
        }
      />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
    )
}

export default PatientDashboard;
