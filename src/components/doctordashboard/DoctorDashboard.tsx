import { useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Route, Routes } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectDoctorID, setDoctorID } from "../../redux/reducers/doctorReducer";
import { RootState } from "../../redux/store";
import Loader from "../loader/Loader";
import AudioUpload from "../audioupload/AudioUpload";
import Preview from "../previewComponent/Preview";
import DoctorForm from "../doctorform/DoctorForm";

function DoctorDashboard() {
  const { user, signOut } = useAuthenticator();
  const [isLoading, setIsLoading] = useState(true);
  const doctorID = useSelector((state: RootState) => selectDoctorID(state));
  const client = generateClient<Schema>();
  const email = user.signInDetails?.loginId;
  const dispatch = useDispatch();

  const fetchDoctor = async () => {
      if(doctorID==""){
        try {
          const doctor = await client.models.Doctor.list({
            filter: {
              email: {
                eq: email,
              },
            },
          });
          if (doctor.data.length > 0) {
            dispatch(setDoctorID(doctor.data[0].id));
          }
        } catch (error) {
          console.error("Error fetching doctor data:", error);
        } finally {
          setIsLoading(false);
        }
      }
      else{
        setIsLoading(false);
      }
  };

  const handleSignOut = () => {
    dispatch(setDoctorID(""));
    signOut();
  };

  useEffect(() => {
    fetchDoctor();
  },[]); //[] is important do not remove

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route
        path="/*"
        element={
          doctorID === "" ? (
            <DoctorForm />
          ) : (
            <>
              <h1>Hi {doctorID}</h1>
              <div>Doctor Dashboard</div>
              <button onClick={handleSignOut}>Sign out</button>
            </>
          )
        }
      />
    <Route path="upload" element={<AudioUpload />} />
    <Route path= "/audioTextPreview" element={<Preview />} />
    </Routes>
  );
}

export default DoctorDashboard;
