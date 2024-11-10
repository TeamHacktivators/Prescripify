import { useState, useEffect } from 'react';

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    useEffect(() => {
        // Request permission and set up the MediaRecorder
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);
                recorder.ondataavailable = (event) => {
                    setAudioBlob(event.data);
                };
            })
            .catch(error => {
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

    return (
        <div>
            <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            {audioBlob && (
                <audio controls src={URL.createObjectURL(audioBlob)} />
            )}
        </div>
    );
};

export default AudioRecorder;
