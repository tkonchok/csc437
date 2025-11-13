import AudioPostModel, { AudioPost } from "../models/audiopost";

function index() {
  return AudioPostModel.find().exec();
}

function get(id: string) {
  return AudioPostModel.findById(id).exec();
}

function byArtist(artist: string) {
  return AudioPostModel.find({ artist }).exec();
}

function create(post: AudioPost) {
  return new AudioPostModel(post).save();
}

export default { index, get, create, byArtist };