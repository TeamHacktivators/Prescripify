import styles from "./AboutPat.module.css";

function AboutPat() {
  const formData = {
    name: "Vediie",
    age: 20,
    email: "vediie@gmail.com",
  };

  const patientInfo = [
    { label: "Name", value: formData.name },
    { label: "Age", value: formData.age },
    {
      label: "Email",
      value: (
        <a href={`mailto:${formData.email}`} className={styles.infoValue}>
          {formData.email}
        </a>
      ),
    },
  ];

  const patientsWithPrescriptions = [
    {
      id: 1,
      name: "John Doe",
      age: 35,
      doctorName: "Dr. Smith",
      clinicName: "HealthCare Clinic",
      prescriptions: [
        { id: 1, illness: "Fever", path: "/prescriptions/john_doe_fever.pdf" },
      ],
      viewMoreLink: "/prescriptiondetail",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 28,
      doctorName: "Dr. Johnson",
      clinicName: "Wellness Center",
      prescriptions: [
        { id: 1, illness: "Headache", path: "/prescriptions/jane_smith_headache.pdf" },
      ],
      viewMoreLink: "/prescriptiondetail",
    },
    {
      id: 3,
      name: "Mark Taylor",
      age: 40,
      doctorName: "Dr. Brown",
      clinicName: "City Hospital",
      prescriptions: [
        { id: 1, illness: "Back Pain", path: "/prescriptions/mark_taylor_backpain.pdf" },
      ],
      viewMoreLink: "/prescriptiondetail",
    },
  ];

  return (
    <div className={styles.dashboard}>
        <h1 className={styles.header}>Patient Dashboard</h1>
      <div className={styles.patientProfile}>
        <div id={styles.infoContainer}>
          {patientInfo.map((info, index) => (
            <div key={index} className={styles.infoItem}>
              <span className={styles.infoLabel}>{info.label}:</span>{" "}
              {info.value}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.patientList}>
        <h2>Previous Prescriptions</h2>
        <div className={styles.patientflex}>
          {patientsWithPrescriptions.map((patient) => (
            <div key={patient.id} className={styles.patientCard}>
            <div>
              <div className={styles.cardHeader}>
                <h3 className={styles.clinicName}>{patient.clinicName}</h3><br />
                <a
                  href={patient.viewMoreLink}
                  className={styles.viewMoreLink}
                >
                  View More &gt;
                </a>   
            </div>
            <p>Doctor: {patient.doctorName}</p>
            </div>
            </div>
          ))}
        </div>
      </div>
      </div>
  );
}

export default AboutPat;
