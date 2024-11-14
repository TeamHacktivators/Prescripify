import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'prescripify-storage',
  access: (allow) => ({
    'doctor/*': [
      allow.guest.to(['read', 'write', 'delete']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    
    'patient/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  })
});

