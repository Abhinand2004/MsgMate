import mongoose from "mongoose";
import { type } from "os";

const chatListSchema = new mongoose.Schema({
    sender_id: { type: String, required: true },
    receiver_id: { type: String, required: true },
    background:{type:String},
    sender:{type:Object},
    receiver:{type:Object},
    lastmsg:{type:String}

});

export default mongoose.models.ChatList || mongoose.model('ChatList', chatListSchema);
