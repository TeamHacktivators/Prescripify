import styles from "./PatientDashboard.module.css";
import { Route, Routes } from "react-router-dom";
import { selectPatientID } from "../../redux/reducers/patientReducer";
import { RootState } from "../../redux/store";
import Loader from "../loader/Loader";
import PatientDetails from "../patientdetails/PatientDetails";
import PrescriptionDetail from "../prescriptiondetail/PrescriptionDetail";
import AboutPat from "../aboutPat/AboutPat";

function PatientDashboard() {
    return (
    <Routes>
      <Route
        path="/*"
        element={
            <>
              <section id={styles.dashboardContainer}>
                <AboutPat />
              </section>
            </>
        }
      />
      <Route path="/prescriptiondetail" element={<PrescriptionDetail />} />
      {/* <Route path="/audioTextPreview" element={<Preview />} />
      <Route path="/generatedPDF" element={<PDFViewer />} /> */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
    )
}

export default PatientDashboard;
