import MessageModel, { IMessage } from "../models/Message";

//GET all messages
function index() {
  return MessageModel.find().exec();
}

//GET message by ID
function get(id: string) {
  return MessageModel.findById(id).exec();
}

//GET all messages between two users
function between(userA: string, userB: string) {
  return MessageModel.find({
    $or: [
      { from: userA, to: userB },
      { from: userB, to: userA }
    ]
  }).exec();
}

//CREATE a new message
function create(msg: IMessage) {
  return new MessageModel(msg).save();
}

export default { index, get, between, create };