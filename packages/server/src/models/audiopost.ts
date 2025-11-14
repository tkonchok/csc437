import { Schema, model } from "mongoose";

export interface AudioPost {
  title: string;
  artist: string;
  genre: string;
  imgSrc: string;
  audioSrc: string;
  user?: string;
}

const AudioPostSchema = new Schema<AudioPost>(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    genre: { type: String, required: true },
    imgSrc: { type: String, required: true },
    audioSrc: { type: String, required: true },
    user: { type: String }
  },
  { collection: "dra_audio_posts" }
);

export default model<AudioPost>("AudioPost", AudioPostSchema);