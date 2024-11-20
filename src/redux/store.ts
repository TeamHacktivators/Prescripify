import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "./reducers/doctorReducer";
import patientReducer from "./reducers/patientReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage for web

const persistConfig = {
  key: "root",
  storage,
};

const persistedDoctorReducer = persistReducer(persistConfig, doctorReducer);
const persistedPatientReducer = persistReducer(persistConfig, patientReducer);

const store = configureStore({
  reducer: {
    doctor: persistedDoctorReducer,
    patient: persistedPatientReducer,
  },
});

export const persistor = persistStore(store);
export default store;
export type RootState = ReturnType<typeof store.getState>;
