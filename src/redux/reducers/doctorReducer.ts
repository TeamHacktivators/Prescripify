import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
    id:"",
    tempAudioUrl: "",
    email:"",
    tempText: "",
};

const doctorSlice = createSlice({
    name: "doctor",
    initialState,
    reducers: {
        setDoctorID: (state, action) => {
            state.id = action.payload;
        },
        setTempAudioUrl: (state, action) => {
            state.tempAudioUrl = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setTempText: (state, action) => {
            state.tempText = action.payload;
        },
    },
});

export const { setDoctorID, setTempAudioUrl, setEmail, setTempText } = doctorSlice.actions;
export default doctorSlice.reducer;
export const selectDoctorID = (state: RootState) => state.doctor.id;
export const selectTempAudioUrl = (state: RootState) => state.doctor.tempAudioUrl;
export const selectEmail = (state: RootState) => state.doctor.email;
export const selectTempText = (state: RootState) => state.doctor.tempText;