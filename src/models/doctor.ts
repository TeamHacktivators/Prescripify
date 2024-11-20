import modelClient from "./client";

// Create a Doctor
export async function createDoctor(data: { name: string; email: string; specialization: string; clinicName: string; profilePic?: string; signaturePic?: string; owner?: string }) {
    const doctor = await modelClient.models.Doctor.create(data);
    return doctor;
  }
  
  // Get a Doctor by ID
  export async function getDoctorById(doctorId: string) {
    const doctor = await modelClient.models.Doctor.get({ id: doctorId });
    return doctor;
  }
  
  // List all Doctors
  export async function listDoctors() {
    const doctors = await modelClient.models.Doctor.list();
    return doctors;
  }

  //list doctor using email
    export async function listDoctorByEmail(email: string) {
        const doctor = await modelClient.models.Doctor.list({
        filter: {
            email: {
            eq: email,
            },
        },
        });
        return doctor;
    }
  
  // Update a Doctor
  export async function updateDoctor(doctorId: string, updatedData : object) {
    const doctor = await modelClient.models.Doctor.update({
      id: doctorId,
      ...updatedData,
    });
    return doctor;
  }
  
  // Delete a Doctor
  export async function deleteDoctor(doctorId: string) {
    await modelClient.models.Doctor.delete({ id: doctorId });
    return `Doctor with ID ${doctorId} deleted successfully.`;
  }