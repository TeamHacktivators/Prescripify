import styles from "./PDFViewer.module.css";
import { useEffect, useState } from "react";
import PrescriptionLoader from "../prescriptionLoader/PrescriptionLoader";
import { selectDoctorID } from "../../redux/reducers/doctorReducer";
import {
  selectPatientData,
  setPatientDataToInitialState,
  selectPatientID,
} from "../../redux/reducers/patientReducer";
import { useSelector, useDispatch } from "react-redux";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getDoctorById } from "../../models/doctor";
import { getUrl, uploadData } from "aws-amplify/storage";
import { createPrescription } from "../../models/prescription";
import CheckComponent from "../checkComponent/CheckComponent";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const loadImage = (url: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
  });
};

const generatePDF = async (data: {
  patient: string;
  age: string;
  illness: string;
  patientEmail: string;
  tips: string;
  medicine: {
    name: string;
    dosage: string;
    duration: string;
    description: string;
  }[];
  doctor: {
    doctorName: string;
    doctorSignUrl: string;
    docClinic: string;
  };
}) => {
  try {
    const doc = new jsPDF();
    doc.setFontSize(25);
    doc.setFont("helvetica", "bold");
    doc.text(`${data.doctor.docClinic}`, 105, 15, { align: "center" });

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Prescription", 105, 25, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("times", "normal");
    doc.text(`Doctor : ${data.doctor.doctorName}`, 10, 30);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Information", 10, 40);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${data.patient}`, 10, 50);
    doc.text(`Age: ${data.age}`, 10, 60);
    doc.text(`Illness: ${data.illness}`, 10, 70);
    doc.text(`Email: ${data.patientEmail}`, 10, 80);

    const medicineHeaders = ["Medicine", "Dosage", "Duration", "Description"];
    const medicineRows = data.medicine.map((med) => [
      med.name,
      med.dosage,
      med.duration,
      med.description,
    ]);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Prescribed Medicines", 10, 90);

    autoTable(doc, {
      startY: 100,
      head: [medicineHeaders],
      body: medicineRows,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      styles: { fontSize: 10, halign: "center" },
    });

    const yOffset = 200;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Additional Tips", 10, yOffset);
    doc.setFont("helvetica", "normal");
    doc.text(data.tips, 10, yOffset + 10, { maxWidth: 180 });

    if (data.doctor.doctorSignUrl) {
      try {
        const signatureImage = await loadImage(data.doctor.doctorSignUrl);
        doc.addImage(signatureImage, "PNG", 140, yOffset + 40, 50, 25);
      } catch (error) {
        console.error("Error loading signature image:", error);
      }
    }

    return doc.output("blob");
  } catch (error) {
    console.error("Error generating PDF:", error);
    return null;
  }
};

function PDFViewer() {
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const docID = useSelector(selectDoctorID);
  const patientDataFromStore = useSelector(selectPatientData)[0];
  const patientID = useSelector(selectPatientID);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const uploadPDF = async (pdfBlob: Blob) => {
    try {
      const timestamp = new Date().toISOString();
      const fileName = `${patientID}_prescription_${timestamp}.pdf`;

      await uploadData({
        path: `patient/${patientID}/prescriptions/${fileName}`,
        data: pdfBlob,
      });

      const pdfPath = await getUrl({
        path: `patient/${patientID}/prescriptions/${fileName}`,
      });

      const path = pdfPath.url.toString().split("?")[0];

      await createPrescription({
        patientId: patientID,
        doctorId: docID,
        path: path,
        illness: patientDataFromStore.illness,
        date: new Date().toISOString(),
        medicine: JSON.stringify(patientDataFromStore.medicine),
      });

      dispatch(setPatientDataToInitialState());
      toast.success("Prescription generated successfully!");
    } catch (error) {
      console.error("Error uploading PDF to S3:", error);
      toast.error("Error uploading PDF. Please try again.");
    }
  };

  const fetchDoctorAndGeneratePDF = async () => {
    try {
      if (patientDataFromStore.patient === "" || !docID) return;
      const doctor = await getDoctorById(docID);
      const doctorDetails = {
        doctorName: doctor.data?.name || "Unknown Doctor",
        doctorSignUrl: doctor.data?.signaturePic || "",
        docClinic: doctor.data?.clinicName || "",
      };

      const patientData = {
        ...patientDataFromStore,
        doctor: doctorDetails,
      };

      const pdfBlob = await generatePDF(patientData);
      if (pdfBlob) {
        await uploadPDF(pdfBlob);
        setPdfUrl(URL.createObjectURL(pdfBlob));
      }
    } catch (error) {
      toast.error("Error generating PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAndGeneratePDF();
  }, [docID, patientDataFromStore]);

  if (isLoading) {
    return <PrescriptionLoader />;
  }

  return (
    <section id={styles.pdfContainer}>
      {pdfUrl ? (
        <>
          <h1 id={styles.pdfPreviewHeading}>PDF Preview</h1>
          <iframe
            src={pdfUrl}
            title="Prescription PDF"
            id={styles.pdfPreview}
          />
          <div className={styles.buttonContainer}>
            <button
              onClick={() => {
                if (pdfUrl) {
                  const link = document.createElement("a");
                  link.href = pdfUrl;
                  link.download = "prescription.pdf";
                  link.click();
                }
              }}
              id={styles.pdfDownloadButton}
            >
              Download PDF
            </button>
            <button onClick={() => navigate("/doctor")} id={styles.backButton}>
              Back to Dashboard
            </button>
          </div>
        </>
      ) : (
        <CheckComponent />
      )}
    </section>
  );
}

export default PDFViewer;
