import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "./reducers/doctorReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage for web

const persistConfig = {
  key: "root",
  storage,
};

const persistedDoctorReducer = persistReducer(persistConfig, doctorReducer);

const store = configureStore({
  reducer: {
    doctor: persistedDoctorReducer,
  },
});

export const persistor = persistStore(store);
export default store;
export type RootState = ReturnType<typeof store.getState>;
