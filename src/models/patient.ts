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
    const { data: doctorPatients } =
      await modelClient.models.DoctorPatient.list({
        filter: { doctorId: { eq: doctorId } },
      });

    const patientIds = doctorPatients.map((dp) => dp.patientId);

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
      const newPatient = await modelClient.models.Patient.create({
        name: patientData.name,
        age: patientData.age,
        email: patientData.email,
      });
      if (newPatient.data?.id) {
        patientId = newPatient.data.id;
      } else {
        throw new Error("Failed to create new patient: ID is undefined");
      }
    } else {
      patientId = patient.id;
    }
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

export async function getPatientAndDoctorsByEmail(email: string) {
  try {
    const { data: patients } = await modelClient.models.Patient.list({
      filter: { email: { eq: email } },
    });

    if (patients.length === 0) {
      throw new Error(`No patient found with email: ${email}`);
    }

    const patient = patients[0];
    const patientId = patient.id;

    const { data: doctorPatients } =
      await modelClient.models.DoctorPatient.list({
        filter: { patientId: { eq: patientId } },
      });

    if (doctorPatients.length === 0) {
      return { patient, doctors: [] };
    }

    const doctorIds = doctorPatients.map((dp) => dp.doctorId);

    const doctors = [];
    for (const doctorId of doctorIds) {
      const doctor = await modelClient.models.Doctor.get({ id: doctorId });
      if (doctor) {
        doctors.push(doctor);
      }
    }

    return { patient, doctors };
  } catch (error) {
    console.error("Error fetching patient and doctors by email:", error);
    throw error;
  }
}
