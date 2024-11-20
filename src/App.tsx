import { Authenticator } from "@aws-amplify/ui-react";
import Home from "./components/home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DoctorDashboard from "./components/doctordashboard/DoctorDashboard";
import Working from "./components/working/Working";
import Team from "./components/team/Team";
import TechStack from "./components/techstack/TechStack";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        <Route path="/techstack" element={<TechStack />} />
        <Route path="/working" element={<Working />} /> 
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
