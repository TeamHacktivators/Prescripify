import PreviewLoader from "../previewLoader/PreviewLoader";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { selectTempAudioUrl } from "../../redux/reducers/doctorReducer";
import { useEffect, useState } from "react";
import axios from "axios";

function Preview() {
  const [processing, setProcessing] = useState(true);
  const tempAudioUrl = useSelector((state: RootState) =>
    selectTempAudioUrl(state)
  );
  const postURL = import.meta.env.VITE_API_SPEECHTOTEXT;
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        console.log("tempAudioUrl", tempAudioUrl.toString());
        const response = await axios.post(postURL, { audioUrl: tempAudioUrl });
        const transcription = JSON.parse(response.data.body).transcription;
        setResponse(transcription);
      } catch (error) {
        console.error("Error fetching response:", error);
      } finally {
        setProcessing(false);
      }
    };

    if (response === null) {
      fetchResponse();
    }
  }, [tempAudioUrl, postURL, response]);

  if (processing) {
    return <PreviewLoader />;
  }

  return (
    <>
      <textarea name="" id="" value={response || ""}></textarea>
    </>
  );
}

export default Preview;
