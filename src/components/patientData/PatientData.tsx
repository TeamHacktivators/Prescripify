import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectPatientData,
  setPatientData,
  setPatientID,
} from "../../redux/reducers/patientReducer";
import {
  selectDoctorID,
  setTempText,
} from "../../redux/reducers/doctorReducer";
import { handlePatientAndDoctorRelationship } from "../../models/patient";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import styles from "./PatientData.module.css";
import GeneralLoader from "../generalLoader/GeneralLoader";

function PatientData() {
  const patientData = useSelector(selectPatientData)[0];
  const doctorID = useSelector(selectDoctorID);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(patientData);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => setData(patientData), [patientData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index: number | undefined,
    type: string
  ) => {
    setEditing(true);
    const { name, value } = e.target;

    if (type === "medicine" && index !== undefined) {
      setData((prev) => ({
        ...prev,
        medicine: prev.medicine.map((item, i) =>
          i === index ? { ...item, [name]: value } : item
        ),
      }));
    } else {
      setData((prev) => ({ ...prev, [type || name]: value }));
    }
  };

  const addMedicine = () =>
    setData((prev) => ({
      ...prev,
      medicine: [
        ...prev.medicine,
        { name: "", dosage: "", description: "", duration: "" },
      ],
    }));

  const removeMedicine = (index: number) =>
    setData((prev) => ({
      ...prev,
      medicine: prev.medicine.filter((_, i) => i !== index),
    }));

  const handleSave = () => {
    setEditing(false);
    dispatch(setPatientData([data]));
  };

  const generatePrescription = async () => {
    if (!data.patientEmail || !data.patient || !data.age || !data.gender) {
      toast.error("Please fill all the fields");
      return;
    }
    setLoading(true);
    const { patient, patientEmail, age, gender } = data;
    const { patientId } = await handlePatientAndDoctorRelationship({
      doctorId: doctorID,
      patientData: { name: patient, age, gender, email: patientEmail },
    });
    dispatch(setTempText(""));
    dispatch(setPatientID(patientId));
    navigate("/doctor/generatedPDF");
  };

  if (loading) {
    return <GeneralLoader />;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Patient Form Preview</h1>
      <form className={styles.form}>
        <div className={styles.grid}>
          {[
            {
              label: "Patient Name",
              type: "text",
              value: data.patient,
              name: "patient",
            },
            {
              label: "Patient Email",
              type: "email",
              value: data.patientEmail,
              name: "patientEmail",
            },
            {
              label: "Illness",
              type: "text",
              value: data.illness,
              name: "illness",
            },
            { label: "Age", type: "number", value: data.age, name: "age" },
          ].map(({ label, type, value, name }) => (
            <div key={name} className={styles.formGroup}>
              <label className={styles.label}>{label}:</label>
              <input
                className={styles.input}
                type={type}
                name={name}
                value={value}
                onChange={(e) => handleInputChange(e, undefined, name)}
                required
              />
            </div>
          ))}

          <div className={styles.formGroup}>
            <label htmlFor="gender" className={styles.label}>Gender:</label>
            <select
              id="gender"
              className={styles.select}
              name="gender"
              value={data.gender}
              onChange={(e) => handleInputChange(e, undefined, "gender")}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionHeader}>Medicines</h2>
          {data.medicine.map((medicine, index) => (
            <div key={index} className={styles.medicineCard}>
              {["name", "dosage", "description", "duration"].map((field) => (
                <div key={field} className={styles.formGroup}>
                  <label className={styles.label}>
                    {field[0].toUpperCase() + field.slice(1)}:
                  </label>
                  {field === "description" ? (
                    <textarea
                      className={styles.textarea}
                      name={field}
                      value={medicine[field as keyof typeof medicine]}
                      onChange={(e) => handleInputChange(e, index, "medicine")}
                      required
                    />
                  ) : (
                    <input
                      className={styles.input}
                      type="text"
                      name={field}
                      value={medicine[field as keyof typeof medicine]}
                      onChange={(e) => handleInputChange(e, index, "medicine")}
                      required
                    />
                  )}
                </div>
              ))}
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeMedicine(index)}
              >
                Remove Medicine
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.addButton}
            onClick={addMedicine}
          >
            Add Medicine
          </button>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionHeader}>Tips</h2>
          <textarea
            className={styles.textarea}
            name="tips"
            value={data.tips}
            onChange={(e) => handleInputChange(e, undefined, "tips")}
          />
        </div>

        <div className={styles.formGroup}>
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
          >
            Save Changes
          </button>
          {!editing && (
            <button
              type="button"
              className={styles.saveButton}
              onClick={generatePrescription}
              disabled={loading}
            >
              Generate Prescription
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PatientData;
