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
  const postURL = import.meta.env.VITE_API_SPEECHTOTEXT as string;
  const [response, setResponse] = useState<string | null>(null);

  const fetchResponse = async () => {
    try {
      const response = await axios.post(postURL, { audioUrl: tempAudioUrl });
      setResponse(response.data);
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchResponse();
  }, [tempAudioUrl]);

  if (processing) {
    return <PreviewLoader />;
  }

  return (
    <>
      <p>{response}</p>
    </>
  );
}

export default Preview;
