import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'prescripify-storage',
  access: allow => ({
    'prescripify/{doctor_id}/*': [
      allow.authenticated.to(['get', 'write', 'delete']),
    ],
    'prescripify/{doctor_id}/patients/{patient_id}/tempAudio/*': [
      allow.authenticated.to(['get', 'write', 'delete']),
    ],
    'prescripify/{doctor_id}/patients/{patient_id}/text/*': [
      allow.authenticated.to(['get', 'write', 'delete']),
    ],
    'prescripify/{doctor_id}/patients/{patient_id}/prescription/*': [
      allow.authenticated.to(['get', 'write', 'delete']),
    ]
  })
});

