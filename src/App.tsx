import { Authenticator } from "@aws-amplify/ui-react";
import Home from "./components/home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DoctorDashboard from "./components/doctordashboard/DoctorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/eam" element={<Eam />} />
      <Route path="/techstack" element={<Techstack />} />
      <Route path="/working" element={<Working />} /> */}
        <Route
          path="/doctor/*"
          element={
            <Authenticator variation="modal">
              <DoctorDashboard />
            </Authenticator>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
