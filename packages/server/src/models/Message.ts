import { Schema, model } from "mongoose";

export interface IMessage {
  from: string;
  to: string;
  text: string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { collection: "dra_messages" }
);

export default model<IMessage>("Message", MessageSchema);