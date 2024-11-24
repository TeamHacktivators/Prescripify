import modelClient from "./client";


// Create Prescription
export async function createPrescription(data: { patientId: string; doctorId: string; date: string; path: string; illness:string, medicine: string}) {
    try {
      return await modelClient.models.Prescription.create({ ...data });
    } catch (error) {
      console.error("Error creating prescription:", error);
      throw error;
    }
  }
  
  // Get Prescriptions by Doctor ID
  export async function getPrescriptionsByDoctorId(doctorId: string) {
    try {
      const { data } = await modelClient.models.Prescription.list({ filter: { doctorId: { eq: doctorId } } });
      return data;
    } catch (error) {
      console.error("Error fetching prescriptions by doctor ID:", error);
      throw error;
    }
  }
  
  // Get Prescriptions by Patient ID
  export async function getPrescriptionsByPatientId(patientId: string) {
    try {
      const { data } = await modelClient.models.Prescription.list({ filter: { patientId: { eq: patientId } } });
      return data;
    } catch (error) {
      console.error("Error fetching prescriptions by patient ID:", error);
      throw error;
    }
  }

  // Get Prescription by doctor ID and patient ID
  export async function getPrescriptionByDoctorAndPatientId(doctorId: string, patientId: string) {
    try {
      const { data } = await modelClient.models.Prescription.list({ filter: { doctorId: { eq: doctorId }, patientId: { eq: patientId } } });
      return data;
    } catch (error) {
      console.error("Error fetching prescriptions by doctor ID and patient ID:", error);
      throw error;
    }
  }
  
  // Update Prescription
  export async function updatePrescription(prescriptionId: string, updates: Partial<{ path: string; medicines: Array<{ name: string; dosage: string; frequency: string; duration?: string }> }>) {
    try {
      return await modelClient.models.Prescription.update({ id: prescriptionId, ...updates });
    } catch (error) {
      console.error("Error updating prescription:", error);
      throw error;
    }
  }
  
  // Delete Prescription
  export async function deletePrescription(prescriptionId: string) {
    try {
      return await modelClient.models.Prescription.delete({ id: prescriptionId });
    } catch (error) {
      console.error("Error deleting prescription:", error);
      throw error;
    }
  }