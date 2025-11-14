import UserModel, { IUser } from "../models/user";

//GET all users
function index() {
  return UserModel.find().exec();
}

//GET a user by MongoDB _id
function get(id: string) {
  return UserModel.findById(id).exec();
}

//GET a user by username
function getByUsername(username: string) {
  return UserModel.findOne({ username }).exec();
}

//CREATE a new user
function create(user: IUser) {
  return new UserModel(user).save();
}

export default { index, get, getByUsername, create };