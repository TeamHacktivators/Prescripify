import styles from "./PatientDetails.module.css";

function PatientDetails() {
  const formData = 
    {
      name: "Vediie",
      age: 20,
      email: "vediie@gmail.com",
    };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form}>
        <h2>Patient Registration</h2>

        <div className={styles.formGroup}>
          <label htmlFor="patientName">Patient Name</label>
          <input
            type="text"
            id="patientName"
            value={formData.name}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            value={formData.age}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="emailName">Email</label>
          <input
            type="text"
            id="emailName"
            value={formData.email}
            required
          />
        </div>

        {/* Remove these buttons or adjust their logic if not needed */}
        <button type="submit" className={styles.submitButton} disabled>
          Complete Registration
        </button>
        <button type="button" className={styles.signOutButton}>
          Sign Out
        </button>
      </form>
    </div>
  );
}

export default PatientDetails;
