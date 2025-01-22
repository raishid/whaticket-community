import { useRef, useState } from "react";
import { convertToMP3 } from "../utils/converToMp3";

export const useMp3Recorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const audioChunksRef = useRef<Blob[]>([]);

  const [blob, setBlob] = useState<Blob | null>(null);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType,
      });
      if (mediaRecorderRef.current === null) {
        throw new Error("MediaRecorder is null.");
      }

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        console.log("Recording ondataavailable called...");
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log("Recording onstop called...");

        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mimeType,
          });
          const arrayBuffer = await audioBlob.arrayBuffer();
          const mp3Blob = await convertToMP3(arrayBuffer);
          console.log("MP3 Blob:", mp3Blob);

          setBlob(mp3Blob);
          audioChunksRef.current = [];
        }
      };

      mediaRecorderRef.current.start();

      console.log("Recording started...");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  }

  function stopRecording(recorder: MediaRecorder): void {
    recorder.stop();
  }

  return { startRecording, stopRecording, blob, mediaRecorderRef, setBlob };
};
