import { useState } from "react";
import { uploadData } from "aws-amplify/storage";
import styles from "./DoctorForm.module.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useNavigate } from "react-router-dom";

function DoctorForm() {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [signaturePic, setSignaturePic] = useState<File | null>(null);

  const navigate = useNavigate();

  const client = generateClient<Schema>();
  const { user } = useAuthenticator();
  const email = user.signInDetails?.loginId || "";

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const doctor = await client.models.Doctor.create({
        name,
        email,
        specialization,
      });
      const doctorID = doctor.data?.id;

      if (profilePic) {
        const profilUrl = await uploadData({
          path: `prescripify/${doctorID}/${profilePic.name}`,
          data: profilePic,
        });
        console.log(profilUrl);
      }
      if (signaturePic) {
        const signatureUrl = await uploadData({
          path: `prescripify/${doctorID}/${signaturePic.name}`,
          data: signaturePic,
        });
        console.log(signatureUrl);
      }
      alert("Doctor registered successfully with images uploaded!");
      navigate("/doctor");
      resetForm();
    } catch (error) {
      console.error("Error creating doctor or uploading images:", error);
      alert("There was an error registering the doctor.");
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  const resetForm = () => {
    setName("");
    setSpecialization("");
    setProfilePic(null);
    setSignaturePic(null);
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <h2>Doctor Registration</h2>

        <div className={styles.formGroup}>
          <label htmlFor="doctorName">Doctor Name</label>
          <input
            type="text"
            id="doctorName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="specialization">Specialization</label>
          <input
            type="text"
            id="specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Profile Picture</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setProfilePic)}
            accept="image/*"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Signature Picture</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setSignaturePic)}
            accept="image/*"
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Register Doctor
        </button>
      </form>
    </div>
  );
}

export default DoctorForm;
