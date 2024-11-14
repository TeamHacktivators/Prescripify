import { useEffect, useState } from "react";
import styles from "./AudioUpload.module.css";
import { FaMicrophone, FaFileAudio } from "react-icons/fa";

import { uploadData, getUrl } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTempAudioUrl } from "../../redux/reducers/doctorReducer";

function AudioUpload() {
  const { user } = useAuthenticator();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [uploadedAudio, setUploadedAudio] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<Blob | null>(null);
  const client = generateClient<Schema>();
  const [doctorID, setDoctorID] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const fetchDoctor = async () => {
    try {
      const doctor = await client.models.Doctor.list({
        filter: {
          email: { eq: user?.signInDetails?.loginId },
        },
      });
      if (doctor.data.length > 0) {
        setDoctorID(doctor.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
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
          setAudioFile(event.data); 
          setUploadedAudio(null); 
        };
      })
      .catch((error) => {
        console.error("Microphone access denied:", error);
      });
  }, []);

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "audio/mpeg") {
      setUploadedAudio(URL.createObjectURL(file));
      setAudioFile(file);
      setAudioBlob(null);
    } else {
      alert("Please upload a valid .mp3 file.");
    }
  };

  const deleteAudio = () => {
    setAudioBlob(null);
    setUploadedAudio(null);
    setAudioFile(null); 
  };

  const uploadToS3 = async () => {
    if (!audioFile) return;
    const fileToUpload =
      audioFile instanceof File
        ? audioFile
        : new File([audioFile], "recorded-audio.mp3", { type: "audio/mpeg" });
    try {
      await uploadData({
        path: `doctor/${doctorID}/audio/${fileToUpload.name}`,
        data: audioFile,
      });

      const audioUrl = await getUrl({
        path: `doctor/${doctorID}/audio/${fileToUpload.name}`,
      });
      dispatch(setTempAudioUrl(audioUrl.url.href));
      alert("Audio uploaded successfully!");
      navigate("/doctor/audioTextPreview");
      deleteAudio();
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  fetchDoctor();

  return (
    <section id={styles.uploadContainer}>
      <div id={styles.uploadRecordHeading}>
        <h1>Audio Record/Upload</h1>
      </div>
      <div id={styles.uploadRecordContainer}>
        <div id={styles.uploadingInfo}>
          <p> Here are a few guidelines your audio should follow:</p>
          <ul>
            <li>Audio should be clear with no or minimal background noise</li>
            <li>Language should be clear and understandable and in English</li>
            <li>Audio should be in .mp3 format</li>
            <li>Audio should mention patient's name, age, and illness</li>
            <li>
              Medicine should include its name, quantity, and time of intake
            </li>
            <li>
              Doctor can also mention any other important information/tips
            </li>
          </ul>
        </div>
        <div id={styles.uploadingContainer}>
          <div id={styles.recordingMenu}>
            <div id={styles.uploadingRecord}>
              <button
                className={styles.button}
                onClick={isRecording ? stopRecording : startRecording}
              >
                <FaMicrophone />{" "}
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>
            </div>
            <div id={styles.chooseFile}>
              <input
                type="file"
                id="audioFile"
                accept=".mp3"
                onChange={handleFileUpload}
              />
              <label htmlFor="audioFile" className={styles.button}>
                <FaFileAudio /> Choose Audio
              </label>
            </div>
          </div>
          <div>
            <p>Here is your audio preview:</p>
            {(audioBlob || uploadedAudio) && (
              <div className={styles.audioPreview}>
                <audio
                  controls
                  src={
                    audioBlob
                      ? URL.createObjectURL(audioBlob)
                      : uploadedAudio || undefined
                  }
                />
                <button className={styles.deleteButton} onClick={deleteAudio}>
                  X
                </button>
              </div>
            )}
            {audioFile && (
              <button className={styles.uploadButton} onClick={uploadToS3}>
                Upload Audio
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AudioUpload;
