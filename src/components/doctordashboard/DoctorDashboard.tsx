import styles from "./DoctorDashboard.module.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectDoctorID,
  setDoctorID,
  setEmail,
} from "../../redux/reducers/doctorReducer";
import { RootState } from "../../redux/store";
import Loader from "../loader/Loader";
import AudioUpload from "../audioupload/AudioUpload";
import Preview from "../previewComponent/Preview";
import DoctorDetails from "../doctordetails/DoctorDetails";
import PDFViewer from "../pdfviewer/PDFViewer";
import { listDoctorByEmail } from "../../models/doctor";
import AboutDoc from "../aboutDoc/AboutDoc";

function DoctorDashboard() {
  const { user } = useAuthenticator();
  const [isLoading, setIsLoading] = useState(true);
  const doctorID = useSelector((state: RootState) => selectDoctorID(state));
  const email = user.signInDetails?.loginId;
  const dispatch = useDispatch();

  const fetchDoctor = async () => {
    if (doctorID == "") {
      try {
        dispatch(setEmail(email));
        const doctor = await listDoctorByEmail(email ?? "");
        if (doctor.data.length > 0) {
          dispatch(setDoctorID(doctor.data[0].id));
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, []); //[] is important do not remove

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route
        path="/*"
        element={
          doctorID === "" ? (
            <DoctorDetails />
          ) : (
            <>
              <section id={styles.dashboardContainer}>
                <AboutDoc docID={doctorID} />
              </section>
            </>
          )
        }
      />
      <Route path="upload" element={<AudioUpload />} />
      <Route path="/audioTextPreview" element={<Preview />} />
      <Route path="/generatedPDF" element={<PDFViewer />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default DoctorDashboard;
