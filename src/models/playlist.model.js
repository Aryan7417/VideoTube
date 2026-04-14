import mongoose, { Schema } from "mongoose";



const playListSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    video:
    [ {
        type: Schema.Types.ObjectId,
        ref: "Video"
    }
],
},
    { timestamps: true })

export const playlist = mongoose.model("playlist ", playlist)