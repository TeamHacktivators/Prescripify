import { useEffect, useState } from "react";
import styles from "./AudioUpload.module.css";
import { FaMicrophone, FaFileAudio } from "react-icons/fa";

function AudioUpload() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [uploadedAudio, setUploadedAudio] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<Blob | null>(null); // Single audio file for upload

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.ondataavailable = (event) => {
          setAudioBlob(event.data);
          setAudioFile(event.data); // Set the recorded audio as the file to be uploaded
          setUploadedAudio(null); // Clear any previously uploaded audio preview
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
      setAudioFile(file); // Set the selected audio file for upload
      setAudioBlob(null); // Clear any previously recorded audio
    } else {
      alert("Please upload a valid .mp3 file.");
    }
  };

  const deleteAudio = () => {
    setAudioBlob(null);
    setUploadedAudio(null);
    setAudioFile(null); // Clear the file to be uploaded
  };

  const uploadToS3 = async () => {
    if (!audioFile) return;
    try {
      // Replace with actual S3 upload logic
      // await Storage.put(`audio/${audioFile.name}`, audioFile, {
      //   contentType: audioFile.type
      // });
      alert("Audio uploaded successfully!");
      deleteAudio();
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

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
            <li>Medicine should include its name, quantity, and time of intake</li>
            <li>Doctor can also mention any other important information/tips</li>
          </ul>
        </div>
        <div id={styles.uploadingContainer}>
          <div id={styles.recordingMenu}>
            <div id={styles.uploadingRecord}>
              <button
                className={styles.button}
                onClick={isRecording ? stopRecording : startRecording}
              >
                <FaMicrophone /> {isRecording ? "Stop Recording" : "Start Recording"}
              </button>
            </div>
            <div id={styles.chooseFile}>
              <input type="file" id="audioFile" accept=".mp3" onChange={handleFileUpload} />
              <label htmlFor="audioFile" className={styles.button}>
                <FaFileAudio /> Choose Audio
              </label>
            </div>
          </div>
          <div>
            <p>Here is your audio preview:</p>
            {(audioBlob || uploadedAudio) && (
              <div className={styles.audioPreview}>
                <audio controls src={audioBlob ? URL.createObjectURL(audioBlob) : uploadedAudio || undefined} />
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
