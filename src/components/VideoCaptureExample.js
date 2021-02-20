import { useReactMediaRecorder } from "react-media-recorder";
 
const VideoExample = () => {
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ screen: true, video : { cursor:"never"} });
 
  return (
    <div>
      <p style={{color:"white"}}>{status} Url:{mediaBlobUrl}</p>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <video src={mediaBlobUrl} controls autoplay loop />
    </div>
  );
};

export default VideoExample;