import styles from "./DoctorDetails.module.css";
import { useState } from "react";
import { uploadData, getUrl } from "aws-amplify/storage";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useDispatch } from "react-redux";
import { setDoctorID } from "../../redux/reducers/doctorReducer";
import { createDoctor, updateDoctor } from "../../models/doctor";

function DoctorDetails() {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    clinicName: "",
    profilePic: null as File | null,
    signaturePic: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, signOut } = useAuthenticator();
  const email = user?.signInDetails?.loginId || "";
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      // Create Doctor
      const newDoctor = await createDoctor({
        name: formData.name,
        email,
        specialization: formData.specialization,
        clinicName: formData.clinicName,
      });

      const doctorID = newDoctor.data?.id;
      if (!doctorID) throw new Error("Failed to create doctor.");

      // Upload files and get URLs
      const profileUrl = formData.profilePic
        ? (
            await uploadFile(
              formData.profilePic,
              `doctor/${doctorID}/${formData.profilePic.name}`
            )
          ).split("?")[0]
        : null;

      const signatureUrl = formData.signaturePic
        ? (
            await uploadFile(
              formData.signaturePic,
              `doctor/${doctorID}/${formData.signaturePic.name}`
            )
          ).split("?")[0]
        : null;

      console.log("Profile URL:", profileUrl);
      console.log("Signature URL:", signatureUrl);

      // Update doctor details with image URLs
      const { errors } = await updateDoctor(doctorID, {
        profilePic: profileUrl,
        signaturePic: signatureUrl,
      });

      if (errors) throw new Error("Failed to update doctor with images.");

      dispatch(setDoctorID(doctorID));
      alert("Doctor registration completed successfully!");
    } catch (error) {
      console.error("Error:", error);
      setError(
        "There was an error during the registration process. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, path: string) => {
    await uploadData({ path, data: file });
    const url = await getUrl({ path });
    return url?.url.toString();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profilePic" | "signaturePic"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: file,
      }));
    }
  };

  const isFormValid = () => {
    // Ensure all fields and files are provided
    return (
      formData.name &&
      formData.specialization &&
      formData.clinicName &&
      formData.profilePic &&
      formData.signaturePic
    );
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="specialization">Specialization</label>
          <input
            type="text"
            id="specialization"
            value={formData.specialization}
            onChange={(e) =>
              setFormData({ ...formData, specialization: e.target.value })
            }
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="clinicName">Clinic Name</label>
          <input
            type="text"
            id="clinicName"
            value={formData.clinicName}
            onChange={(e) =>
              setFormData({ ...formData, clinicName: e.target.value })
            }
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Profile Picture</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "profilePic")}
            accept="image/*"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Signature Picture</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "signaturePic")}
            accept="image/*"
            required
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || !isFormValid()}
        >
          {loading ? "Submitting..." : "Complete Registration"}
        </button>
        <button
          type="button"
          onClick={signOut}
          className={styles.signOutButton}
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}

export default DoctorDetails;
