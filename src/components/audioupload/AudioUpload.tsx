import { useEffect, useState } from "react";
import styles from "./AudioUpload.module.css";
import { FaMicrophone, FaFileAudio } from "react-icons/fa";
import { toast } from "react-toastify";
import { uploadData, getUrl } from "aws-amplify/storage";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  setTempAudioUrl,
  selectDoctorID,
  setTempText,
  selectEmail,
} from "../../redux/reducers/doctorReducer";
import { setPatientDataToInitialState } from "../../redux/reducers/patientReducer";
import { listDoctorByEmail } from "../../models/doctor";

function AudioUpload() {
  const [isRecording, setIsRecording] = useState(false);
  const [isDocRegistered, setIsDocRegistered] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [uploadedAudio, setUploadedAudio] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const email = useSelector(selectEmail);
  const doctorID = useSelector(selectDoctorID);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchDoctor = async () => {
    try {
      const doctor = await listDoctorByEmail(email ?? "");
      setIsDocRegistered(doctor.data.length > 0);
    } catch {
      toast.error("Error fetching doctor data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.ondataavailable = (event) => {
          setAudioBlob(event.data);
          setAudioFile(new File([event.data], "recorded-audio.mp3", { type: "audio/mpeg" }));
          setUploadedAudio(null);
        };
      })
      .catch(() => toast.error("Microphone access denied."));

    fetchDoctor();
    dispatch(setTempAudioUrl(""));
  }, [dispatch, email]);

  const handleRecording = () => {
    if (mediaRecorder) {
      isRecording ? mediaRecorder.stop() : mediaRecorder.start();
      setIsRecording(!isRecording);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "audio/mpeg") {
      setUploadedAudio(URL.createObjectURL(file));
      setAudioFile(file);
      setAudioBlob(null);
    } else {
      toast.error("Please upload a valid .mp3 file.");
    }
  };

  const deleteAudio = () => {
    if (audioBlob) {
      URL.revokeObjectURL(URL.createObjectURL(audioBlob));
    }
    if (uploadedAudio) {
      URL.revokeObjectURL(uploadedAudio);
    }
    setAudioBlob(null);
    setUploadedAudio(null);
    setAudioFile(null);
  };

  const uploadToS3 = async () => {
    if (!audioFile) return;
    setIsLoading(true);
    try {
      const fileToUpload = new File([audioFile], "recorded-audio.mp3", { type: "audio/mpeg" });

      await uploadData({
        path: `doctor/${doctorID}/audio/${fileToUpload.name}`,
        data: fileToUpload,
      });

      const audioUrl = await getUrl({
        path: `doctor/${doctorID}/audio/${fileToUpload.name}`,
      });

      const s3URL = `s3://${audioUrl.url.host.split(".")[0]}/${decodeURIComponent(
        audioUrl.url.pathname.substring(1)
      )}`;

      dispatch(setTempAudioUrl(s3URL));
      dispatch(setTempText(""));
      dispatch(setPatientDataToInitialState());

      toast.success("Audio uploaded successfully!");
      navigate("/doctor/audioTextPreview");
    } catch {
      toast.error("Error uploading audio.");
    } finally {
      setIsLoading(false);
      deleteAudio();
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section id={styles.uploadContainer}>
      <div id={styles.uploadRecordHeading}>
        <h1>Audio Record/Upload</h1>
      </div>
      <div id={styles.uploadRecordContainer}>
        <div id={styles.uploadingInfo}>
          <p>Here are a few guidelines your audio should follow:</p>
          <ul>
            <li>Audio should be clear with no or minimal background noise</li>
            <li>Language should be clear and understandable in English</li>
            <li>Audio should be in .mp3 format</li>
            <li>Audio should mention patient's name, age, and illness</li>
            <li>Medicine should include its name, quantity, and time of intake</li>
            <li>Doctor can also mention any other important information/tips</li>
          </ul>
        </div>

        <div id={styles.uploadingContainer}>
          <div id={styles.recordingMenu}>
            <button
              className={styles.button}
              onClick={handleRecording}
              disabled={!isDocRegistered}
            >
              <FaMicrophone /> {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            <div id={styles.chooseFile}>
              <input
                type="file"
                id="audioFile"
                accept=".mp3"
                onChange={handleFileUpload}
                key={audioFile ? audioFile.name : ""}
                disabled={!isDocRegistered}
              />
              <label htmlFor="audioFile" className={styles.button}>
                <FaFileAudio /> Choose Audio
              </label>
            </div>
          </div>
          {!isDocRegistered && (
            <p id={styles.notRegistered}>
              First <span onClick={() => navigate("/doctor")}>register as a doctor</span> to upload
              audio
            </p>
          )}
          <div id={styles.audioPreview}>
            <p>Here is your audio preview:</p>
            {(audioBlob || uploadedAudio) && (
              <div id={styles.audioPreviewControls}>
                <audio
                  key={new Date().getTime()}
                  controls
                  src={
                    audioBlob
                      ? URL.createObjectURL(audioBlob)
                      : uploadedAudio || undefined
                  }
                />
                <div id={styles.audioBtnContainer}>
                <button className={styles.deleteButton} onClick={deleteAudio}>
                  X
                </button>
                {audioFile && (
                  <button
                    className={styles.uploadButton}
                    onClick={uploadToS3}
                    disabled={!isDocRegistered}
                  >
                    Upload Audio
                  </button>
                )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ marginTop: "15px" }}>
        <h2>Still confused about how to record?</h2>
        <p style={{ textAlign: "center" }}>
          <a href="/audio/prescripify_test.mp3" download="prescripify_test.mp3">
            Click here to download a sample audio file to upload or listen.
          </a>
        </p>
      </div>
    </section>
  );
}

export default AudioUpload;
