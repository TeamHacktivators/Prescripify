import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
    patientID:"",
    data:[
        {
            patient: "",
            medicine:[
                {
                    description:"",
                    dosage:"",
                    duration:"",
                    name:"",
                }
            ],
            age:"",
            gender:"",
            illness:"",
            tips:"",
            patientEmail:"",
            doctor:{
                doctorName:"",
                doctorSignUrl:""
            }
        }
    ],
    doctorID:"",
    prescriptions:[],
};

const patientSlice = createSlice({
    name: "patient",
    initialState,
    reducers: {
        setPatientID: (state, action) => {
            state.patientID = action.payload;
        },
        setPatientData: (state, action) => {
            state.data = action.payload;
        },
        setDoctorID: (state, action) => {
            state.doctorID = action.payload;
        },
        setPrescriptions: (state, action) => {
            state.prescriptions = action.payload;
        },
        setPatientDataToInitialState: (state) => {
            state.data = initialState.data;
        }
    },
});


export const { setPatientID, setPatientData, setDoctorID, setPrescriptions, setPatientDataToInitialState } = patientSlice.actions;
export default patientSlice.reducer;
export const selectPatientID = (state: RootState) => state.patient.patientID;
export const selectPatientData = (state: RootState) => state.patient.data;
export const selectDoctorID = (state: RootState) => state.patient.doctorID;
export const selectPrescriptions = (state: RootState) => state.patient.prescriptions;

