import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
    doctorID:"",
    tempAudioUrl: "",
    doctorEmail:"",
    tempText: "",
};

const doctorSlice = createSlice({
    name: "doctor",
    initialState,
    reducers: {
        setDoctorID: (state, action) => {
            state.doctorID = action.payload;
        },
        setTempAudioUrl: (state, action) => {
            state.tempAudioUrl = action.payload;
        },
        setEmail: (state, action) => {
            state.doctorEmail = action.payload;
        },
        setTempText: (state, action) => {
            state.tempText = action.payload;
        },
    },
});

export const { setDoctorID, setTempAudioUrl, setEmail, setTempText } = doctorSlice.actions;
export default doctorSlice.reducer;
export const selectDoctorID = (state: RootState) => state.doctor.doctorID;
export const selectTempAudioUrl = (state: RootState) => state.doctor.tempAudioUrl;
export const selectEmail = (state: RootState) => state.doctor.doctorEmail;
export const selectTempText = (state: RootState) => state.doctor.tempText;