import AudioPostModel, { AudioPost } from "../models/audiopost";

//GET all
function index() {
  return AudioPostModel.find().exec();
}

//GET one
function get(id: string) {
  return AudioPostModel.findById(id).exec();
}

//GET by artist
function byArtist(artist: string) {
  return AudioPostModel.find({ artist }).exec();
}

//CREATE
function create(post: AudioPost) {
  return new AudioPostModel(post).save();
}

//UPDATE
function update(id: string, data: AudioPost) {
  return AudioPostModel.findByIdAndUpdate(id, data, { new: true }).exec();
}

//DELETE
function remove(id: string) {
  return AudioPostModel.findByIdAndDelete(id).exec();
}

export default { index, get, byArtist, create, update, remove };