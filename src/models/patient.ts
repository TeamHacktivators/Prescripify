import modelClient from "./client";

export async function createPatient(data: {
  name: string;
  age: string;
  email: string;
}) {
  try {
    return await modelClient.models.Patient.create(data);
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
}

export async function createDoctorPatient({
  doctorId,
  patientId,
}: {
  doctorId: string;
  patientId: string;
}) {
  try {
    const doctorPatient = await modelClient.models.DoctorPatient.create({
      doctorId,
      patientId,
    });
    return doctorPatient;
  } catch (error) {
    console.error("Error creating DoctorPatient relationship:", error);
    throw error;
  }
}

export async function getPatientsByDoctorId(doctorId: string) {
  try {
    // Fetch DoctorPatient relationships for the given doctorId
    const { data: doctorPatients } = await modelClient.models.DoctorPatient.list({
      filter: { doctorId: { eq: doctorId } },
    });

    // Extract patientIds from the DoctorPatient relationships
    const patientIds = doctorPatients.map((dp) => dp.patientId);

    // Fetch Patient records for the extracted patientIds
    const patients = [];
    for (const patientId of patientIds) {
      const patient = await modelClient.models.Patient.get({ id: patientId });
      if (patient) {
        patients.push(patient);
      }
    }

    return patients;
  } catch (error) {
    console.error("Error fetching patients by doctor ID:", error);
    throw error;
  }
}


export async function getPatientByEmail(email: string) {
  try {
    const { data } = await modelClient.models.Patient.list({
      filter: { email: { eq: email } },
    });
    return data[0];
  } catch (error) {
    console.error("Error fetching patient by email:", error);
    throw error;
  }
}

export async function updatePatient(
  patientId: string,
  updates: Partial<{ name: string; age: string; email: string }>
) {
  try {
    return await modelClient.models.Patient.update({
      id: patientId,
      ...updates,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    throw error;
  }
}

export async function deletePatient(patientId: string) {
  try {
    return await modelClient.models.Patient.delete({ id: patientId });
  } catch (error) {
    console.error("Error deleting patient:", error);
    throw error;
  }
}

export async function handlePatientAndDoctorRelationship({
  doctorId,
  patientData,
}: {
  doctorId: string;
  patientData: { name: string; age: string; email: string };
}) {
  try {
    const existingPatients = await modelClient.models.Patient.list({
      filter: {
        email: { eq: patientData.email },
        name: { eq: patientData.name },
      },
    });
    const patient = existingPatients.data[0];
    let patientId = "";
    if (!patient) {
      console.log(patientData); // Debug
      const newPatient = await modelClient.models.Patient.create(
        {
          name: patientData.name,
          age: patientData.age,
          email: patientData.email,
        }
      );
      console.log("New patient created:", newPatient); // Debug
      if (newPatient.data?.id) {
        patientId = newPatient.data.id;
      } else {
        throw new Error("Failed to create new patient: ID is undefined");
      }
    }

    patientId = patientId === "" ? patient.id : patientId;

    console.log("Patient ID:", patientId); // Debug
    console.log("Doctor ID:", doctorId); // Debug
    const doctorPatients = await modelClient.models.DoctorPatient.list({
      filter: { doctorId: { eq: doctorId } },
    });

    const isLinked = doctorPatients.data.some(
      (patient) => patient.patientId === patientId
    );

    if (isLinked) {
      return { message: "Doctor and patient are already linked.", patientId };
    }

    const doctorPatient = await modelClient.models.DoctorPatient.create({
      doctorId,
      patientId,
    });

    const patientID = doctorPatient.data?.patientId;
    return {
      message: "Doctor and patient linked successfully.",
      patientId: patientID,
    };
  } catch (error) {
    console.error("Error handling patient and doctor relationship:", error);
    throw error;
  }
}
