import mongoose, {Schema} from "mongoose";

const subscriptionSchema= new Schema({
    subscriber :{
        type:Schema.type.ObjectId, // one who is subscribing
        ref:"User"
    },
    channel :{
        type:Schema.Types.ObjectId, // one to who 'subscribingis subscrbing
        ref:"User"
    }
},
{
    timestamps:true
})

export const Subscription = mongoose.model("Subscription" ,subscriptionSchema)