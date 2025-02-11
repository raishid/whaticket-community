import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

export const convertToMP3 = async (arrayBuffer: ArrayBuffer) => {
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm";
  const ffmpegRef = new FFmpeg();

  await ffmpegRef.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  await ffmpegRef.writeFile("input.webm", new Uint8Array(arrayBuffer));

  const outputFileName = "output.mp3";

  await ffmpegRef.exec([
    "-i",
    "input.webm",
    "-vn",
    "-ar",
    "44100",
    "-ac",
    "1",
    "-ab",
    "128k",
    outputFileName,
  ]);

  const mp3Data = await ffmpegRef.readFile(outputFileName);

  const mp3Blob = new Blob([mp3Data], { type: "audio/mp3" });

  return mp3Blob;
};
