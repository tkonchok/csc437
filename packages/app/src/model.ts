// app/src/model.ts

export interface AudioPost {
  title: string;
  artist: string;
  imgSrc: string;
  audioSrc: string;
}

export interface Model {
  posts?: AudioPost[];
}

export interface AudioPost {
  title: string;
  artist: string;
  imgSrc: string;
  audioSrc: string;
}

export interface UserProfile {
  username: string;
  userType: "artist" | "curator";
  bio?: string;
  avatarSrc?: string;
}

export interface Model {
  posts?: AudioPost[];
  profile?: UserProfile;
}

export const init: Model = {};