import mongoose from "mongoose";

const convoSchema = new mongoose.Schema(
    {
        participants:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        }
    },
    {timestamps: true}
);

export const Convo = mongoose.model("Convo", convoSchema)