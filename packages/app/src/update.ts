// app/src/update.ts
import { Auth, ThenUpdate } from "@calpoly/mustang";
import type { Msg } from "./messages";
import type { Model, AudioPost, UserProfile } from "./model";

export default function update(
  message: Msg,
  model: Model,
  user: Auth.User
): Model | ThenUpdate<Model, Msg> {
  const [type, payload] = message;

  switch (type) {
    //
    // POSTS — already working
    //
    case "posts/request": {
      return [
        model,
        fetchPosts(user).then(
          (posts: AudioPost[]): Msg => ["posts/load", { posts }]
        )
      ];
    }

    case "posts/load": {
      return { ...model, posts: payload.posts };
    }

    //
    // PROFILE — NEW for Lab 14
    //
    case "profile/request": {
      return [
        model,
        fetchProfile(payload.username, user).then(
          (profile: UserProfile): Msg => ["profile/load", { profile }]
        )
      ];
    }

    case "profile/load": {
      return { ...model, profile: payload.profile };
    }

    //
    // DEFAULT
    //
    default:
      console.warn(`Unhandled message: ${type}`);
      return model;
  }
}

// --- HELPERS --------------------------------------------------------

function fetchPosts(user: Auth.User): Promise<AudioPost[]> {
  return fetch("/api/audioposts_rest", {
    headers: Auth.headers(user)
  }).then((res) => res.json());
}

function fetchProfile(
  username: string,
  user: Auth.User
): Promise<UserProfile> {
  return fetch(`/api/profile/${username}`, {
    headers: Auth.headers(user)
  }).then((res) => res.json());
}