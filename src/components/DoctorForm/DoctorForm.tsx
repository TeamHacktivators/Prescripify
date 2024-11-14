import { useState } from "react";
import { uploadData, getUrl } from "aws-amplify/storage";
import styles from "./DoctorForm.module.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../../../amplify/data/resource";
import { useDispatch } from "react-redux";
import { setDoctorID } from "../../redux/reducers/doctorReducer";

function DoctorForm() {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [signaturePic, setSignaturePic] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const client = generateClient<Schema>();
  const { user, signOut } = useAuthenticator();
  const email = user?.signInDetails?.loginId || "";
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const newDoctor = await client.models.Doctor.create({
        name,
        email,
        specialization,
        clinicName,
      });

      const doctorID = newDoctor.data?.id;
      if (!doctorID) throw new Error("Failed to create doctor.");

      const uploadFile = async (file: File, path: string) => {
        await uploadData({ path, data: file });
        const url = await getUrl({ path });
        return url?.url.toString();
      };

      const profileUrl = profilePic ? await uploadFile(profilePic, `doctor/${doctorID}/${profilePic.name}`) : null;
      const signatureUrl = signaturePic ? await uploadFile(signaturePic, `doctor/${doctorID}/${signaturePic.name}`) : null;

      const { errors } = await client.models.Doctor.update({
        id: doctorID,
        profilePic: profileUrl,
        signaturePic: signatureUrl,
      });

      if (errors) throw new Error("Failed to update doctor with images.");

      dispatch(setDoctorID(doctorID));

      alert("Doctor registration completed successfully!");
    } catch (error) {
      console.error("Error:", error);
      setError("There was an error during the registration process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
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
          <label htmlFor="clinicName">Clinic Name</label>
          <input
            type="text"
            id="clinicName"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
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

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Submitting..." : "Complete Registration"}
        </button>
        <button type="button" onClick={signOut} className={styles.signOutButton}>
          Sign Out
        </button>
      </form>
    </div>
  );
}

export default DoctorForm;