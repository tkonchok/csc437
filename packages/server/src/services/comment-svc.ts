import CommentModel, { IComment } from "../models/Comment";

function index() {
  return CommentModel.find().exec();
}

function get(id: string) {
  return CommentModel.findById(id).exec();
}

function forPost(postId: string) {
  return CommentModel.find({ postId }).exec();
}

function create(comment: IComment) {
  return new CommentModel(comment).save();
}

function update(id: string, data: Partial<IComment>) {
  return CommentModel.findByIdAndUpdate(id, data, { new: true }).exec();
}

function remove(id: string) {
  return CommentModel.findByIdAndDelete(id).exec();
}

export default { index, get, forPost, create, update, remove };