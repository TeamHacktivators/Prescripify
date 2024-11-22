import { useState } from "react";
import styles from "./PrescriptionDetail.module.css";
import CheckComponent from "../checkComponent/CheckComponent";
import Prescription from "../../assets/prescription.pdf"

interface Medicine {
  name: string;
  price: string;
  link: string;
}

interface Data {
  clinicName: string;
  doctorName: string;
  illness: string;
  date: string;
  medicines: string[];
}

const pdfUrl = Prescription;

const PrescriptionDetail = (): JSX.Element => {
  const [response, setResponse] = useState<string | null>(null);

  const obtainPrice = (): JSX.Element => {
    const medicineData: Medicine[] = [
      { name: "Paracetamol", price: "$5", link: "#" },
      { name: "Pepto-Bismol", price: "$10", link: "#" },
      { name: "ORS", price: "$2", link: "#" },
      { name: "Aspirin", price: "$8", link: "#" },
      { name: "Ibuprofen", price: "$12", link: "#" },
      { name: "Amoxicillin", price: "$15", link: "#" },
      { name: "Cough Syrup", price: "$7", link: "#" },
      { name: "Vitamin C", price: "$4", link: "#" },
      { name: "Antacid", price: "$3", link: "#" },
    ];

    return (
      <div className={styles.medicineGrid}>
        {medicineData.map((med, index) => (
          <div key={index} className={styles.medicineCard}>
            <h3>{med.name}</h3>
            <p>Price: {med.price}</p>
            <a href={med.link} target="_blank" rel="noopener noreferrer">
              Buy Now
            </a>
          </div>
        ))}
      </div>
    );
  };

  const data: Data = {
    clinicName: "City Health Clinic",
    doctorName: "Dr. Alice Johnson",
    illness: "Allergy",
    date: "2024-10-25",
    medicines: ["Paracetamol", "Pepto-Bismol", "ORS"],
  };

  return (
    <section>
      <div className={styles.wrapper}>
        <div className={styles.layout}>
          {/* Left Section */}
          <div className={styles.infoleft}>
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className={styles.infoBox}>
                <span className={styles.label}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </span>{" "}
                <span className={styles.value}>
                  {Array.isArray(value) ? value.join(", ") : value}
                </span>
              </div>
            ))}
            <div
              className={styles.medbutton}
              onClick={() => setResponse("showGrid")}
            >
              <p className={styles.buttonname} id={styles.medheading}>
                Want to get the medicines at the lowest price?
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className={styles.inforight}>
            <div className={styles.pdf}>
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  title="Prescription PDF"
                  id={styles.pdfPreview}
                />
              ) : (
                <CheckComponent />
              )}
            </div>
            <div className={styles.buttonflex}>
              <a href="/patient">
                <p className={styles.buttonname} id={styles.back}>
                  Back
                </p>
              </a>
              <p
                className={styles.buttonname}
                id={styles.download}
                onClick={() => window.open(pdfUrl, "_blank")}
              >
                Download PDF
              </p>
            </div>
          </div>
        </div>

        {/* Conditional Rendering */}
        {response === "showGrid" && obtainPrice()}
        {response && response !== "showGrid" && (
          <div className={styles.responseBox}>{response}</div>
        )}
      </div>
    </section>
  );
};

export default PrescriptionDetail;
