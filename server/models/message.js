import { Schema, model, models } from "mongoose";

const schema = new Schema(
  {
    content: {
      type: String,
    },
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    attachments: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);
export const Message = models.Message || model("Message", schema);
