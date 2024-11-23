import styles from "./Preview.module.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import PreviewLoader from "../previewLoader/PreviewLoader";
import PatientData from "../patientData/PatientData";
import {
  selectTempAudioUrl,
  setTempAudioUrl,
  setTempText,
  selectTempText,
} from "../../redux/reducers/doctorReducer";
import {
  setPatientData,
  selectPatientData,
} from "../../redux/reducers/patientReducer";
import CheckComponent from "../checkComponent/CheckComponent";
import { toast } from "react-toastify";

function Preview() {
  const dispatch = useDispatch();
  const tempAudioUrl = useSelector(selectTempAudioUrl);
  const tempText = useSelector(selectTempText);
  const patientData = useSelector(selectPatientData);
  const [processing, setProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(tempText || null);
  const [editMode, setEditMode] = useState(false);
  const postURL = import.meta.env.VITE_API_SPEECHTOTEXT;
  const analysisURL = import.meta.env.VITE_API_DIGITALOCEAN_URL;

  const fetchResponse = async () => {
    if (!tempAudioUrl) return;
    try {
      const { data } = await axios.post(postURL, { audioUrl: tempAudioUrl });
      const transcription = JSON.parse(data.body).transcription;
      setResponse(transcription);
      dispatch(setTempText(transcription));
      dispatch(setTempAudioUrl(""));
    } catch (error) {
      toast.error("Error fetching transcription.");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (tempAudioUrl) {
      setProcessing(true);
      const timer = setTimeout(fetchResponse, 2000);
      return () => clearTimeout(timer);
    }
  }, [tempAudioUrl]);

  const analyzeData = async () => {
    if (!response) return;
    setProcessing(true);
    try {
      const { data } = await axios.post(
        analysisURL,
        { text: response },
        { headers: { "Content-Type": "application/json" } }
      );
      dispatch(setPatientData(data));
      dispatch(setTempText(""));
    } catch (error) {
      toast.error("Error analyzing data.");
    } finally {
      setProcessing(false);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditMode(true);
    setResponse(event.target.value);
  };

  const handleSave = () => {
    if (response) {
      setEditMode(false);
      dispatch(setTempText(response));
    }
  };

  if (!processing && tempText === "" && patientData[0]?.patient === "") {
    return <CheckComponent />;
  }

  if (processing) return <PreviewLoader />;

  return (
    <>
      {patientData[0]?.patient !== "" ? (
        <PatientData />
      ) : (
        <div id={styles.previewContainer}>
          <h1 id={styles.previewHeading}>Audio Text Preview</h1>
          <textarea
            name="description"
            id="description"
            value={response || ""}
            onChange={handleTextChange}
            className={styles.textarea}
          />
          <div id={styles.btnContainer}>
            <button className={styles.previewBTN} onClick={handleSave}>
              Save
            </button>
            {!editMode && (
              <button className={styles.previewBTN} onClick={analyzeData}>
                Analyze
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Preview;
