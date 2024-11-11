import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorForm from "../DoctorForm/DoctorForm";
import type { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

function SignIN() {
  const client = generateClient<Schema>();
  const navigate = useNavigate();
  const [showDoctorForm, setShowDoctorForm] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      const doctor = await client.models.Doctor.list();
      console.log(doctor.data.length);
      if (doctor.data.length === 0) {
        setShowDoctorForm(true);
      } else {
        navigate("/doctor");
      }
    };

    fetchDoctor();
  }, [client, navigate]);

  return showDoctorForm ? <DoctorForm /> : null;
}

export default SignIN;
