import { useAuthenticator } from "@aws-amplify/ui-react";
import { Route, Routes } from "react-router-dom";
import AudioUpload from "../audioupload/AudioUpload";

function DoctorDashboard() {
  const { user, signOut } = useAuthenticator();
  return (
      <Routes>
        <Route
          path="/*"
          element={
            <>
             <h1>Hi {user?.signInDetails?.loginId}</h1>
               <div>DoctorDashboard</div>
              <button onClick={signOut}>Sign out</button>
              {" "}
            </>
          }
        />
        <Route path="/upload/*" element={<AudioUpload />} />
      </Routes>
  );
}

export default DoctorDashboard;
