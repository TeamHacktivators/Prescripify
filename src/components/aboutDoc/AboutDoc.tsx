/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getDoctorById } from "../../models/doctor";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDoctorID } from "../../redux/reducers/doctorReducer";
import { getPatientsByDoctorId } from "../../models/patient";
import { getPrescriptionByDoctorAndPatientId } from "../../models/prescription";
import { FaUpload, FaSignOutAlt } from "react-icons/fa";
import styles from "./AboutDoc.module.css";
import Loader from "../loader/Loader";
import { useAuthenticator } from "@aws-amplify/ui-react";

interface AboutDocProps {
  docID: string;
}

function AboutDoc({ docID }: AboutDocProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [doctor, setDoctor] = useState<any>();
  const [patientsWithPrescriptions, setPatientsWithPrescriptions] = useState<
    any[]
  >([]);
  const { signOut } = useAuthenticator();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchDoctorData = async () => {
    try {
      const doctorData = await getDoctorById(docID);
      setDoctor(doctorData);

      const patients = await getPatientsByDoctorId(docID);
      const patientDataWithPrescriptions = await Promise.all(
        patients.map(async (p: any) => {
          const prescriptions = await getPrescriptionByDoctorAndPatientId(
            docID,
            p.data.id
          );
          return {
            ...p.data,
            prescriptions: prescriptions || [],
          };
        })
      );

      setPatientsWithPrescriptions(patientDataWithPrescriptions);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    dispatch(setDoctorID(""));
    signOut();
  };

  const navigateToUpload = () => {
    navigate("upload");
  };

  useEffect(() => {
    fetchDoctorData();
  }, [docID]);

  if (isLoading) {
    return <Loader />;
  }

  const doctorInfo = [
    { label: "Name", value: doctor?.data?.name || "Not Available" },
    {
      label: "Specialization",
      value: doctor?.data?.specialization || "Not Available",
    },
    { label: "Clinic", value: doctor?.data?.clinicName || "Not Available" },
    {
      label: "Email",
      value: (
        <a
          href={`mailto:${doctor?.data?.email || ""}`}
          className={styles.infoValue}
        >
          {doctor?.data?.email || "Not Available"}
        </a>
      ),
    },
  ];

  const totalPrescriptions = patientsWithPrescriptions.reduce(
    (count, patient) => count + patient.prescriptions.length,
    0
  );

  return (
    <div className={styles.dashboard}>
      {/* Doctor Profile Section */}
      <div className={styles.doctorProfile}>
        <div className={styles.profileContainer}>
          <img
            src={doctor?.data?.profilePic || ""}
            alt="Doctor"
            className={styles.profileImage}
          />
          <div id={styles.infoContainer}>
            {doctorInfo.map((info, index) => (
              <div key={index} className={styles.infoItem}>
                <span className={styles.infoLabel}>{info.label}:</span>{" "}
                {info.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id={styles.dashButtonContainer}>
        <button className={styles.dashBtn} onClick={navigateToUpload}>
          <FaUpload /> Upload audio
        </button>
        <button className={styles.dashBtn} onClick={handleSignOut}>
          <FaSignOutAlt /> Signout
        </button>
      </div>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        {[
          {
            title: "Patients Treated",
            value: patientsWithPrescriptions.length,
          },
          { title: "Prescriptions Issued", value: totalPrescriptions },
        ].map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <h3>{stat.title}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Patients and Prescriptions Section */}
      <div className={styles.patientList}>
        <h2>Patients and Prescriptions</h2>
        <div className={styles.patientGrid}>
          {patientsWithPrescriptions.map((patient, index) => (
            <div key={patient.id} className={styles.patientCard}>
              <h3>{index + 1 + ") " + patient.name}</h3>
              <p>Age: {patient.age}</p>
              <ul className={styles.prescriptionList}>
                {patient.prescriptions.map((prescription: any) => (
                  <li key={prescription.id}>
                    <strong>Illness:</strong> {prescription.illness} <br />
                    <a href={prescription.path} download>
                      Download Prescription
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutDoc;
