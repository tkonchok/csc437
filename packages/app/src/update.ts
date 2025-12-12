// app/src/update.ts
import { Auth, ThenUpdate } from "@calpoly/mustang";
import type { Msg } from "./messages";
import type { Model, AudioPost, UserProfile } from "./model";

export default function update(
  message: Msg,
  model: Model,
  user: Auth.User
): Model | ThenUpdate<Model, Msg> {
  const [type, payload, callbacks] = message as any;

  switch (type) {
    //POSTS (unchanged)
    case "posts/request":
      return [
        model,
        fetchPosts(user).then(
          (posts): Msg => ["posts/load", { posts }]
        )
      ];

    case "posts/load":
      return { ...model, posts: payload.posts };

    //PROFILE LOAD
    case "profile/request":
      return [
        model,
        fetchMyProfile(user).then(
          (profile): Msg => ["profile/load", { profile }]
        )
      ];

    case "profile/load":
      return { ...model, profile: payload.profile };

    //PROFILE SAVE (MVU FORM)
    case "profile/save": {
      const { profile } = payload;
      const { onSuccess, onFailure } = callbacks || {};

      return saveProfile(profile, user)
        .then((saved) => {
          onSuccess?.();
          return ["profile/load", { profile: saved }];
        })
        .catch((err) => {
          onFailure?.(err);
          throw err;
        });
    }
    case "upload/create": {
        const { form } = payload;
        const { onSuccess, onFailure } = callbacks || {};

        return [
          model,
          (async () => {
            try {
              const token = localStorage.getItem("dra_token");
              if (!token) throw new Error("Not logged in");

              const res = await fetch("/api/audioposts", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`
                },
                body: form
              });

              if (!res.ok) {
                const t = await res.text();
                throw new Error(t || "Upload failed");
              }

              onSuccess?.();
              return ["posts/request", {}] as Msg;
            } catch (err) {
              onFailure?.(err as Error);
              throw err;
            }
          })()
        ];
      }
    default:
      return model;
  }
}

//HELPERS

function fetchPosts(user: Auth.User): Promise<AudioPost[]> {
  return fetch("/api/audioposts_rest", {
    headers: Auth.headers(user)
  }).then((r) => r.json());
}

function fetchMyProfile(user: Auth.User): Promise<UserProfile> {
  return fetch("/profile/me", {
    headers: Auth.headers(user)
  }).then((r) => r.json());
}

function saveProfile(
  profile: UserProfile,
  user: Auth.User
): Promise<UserProfile> {
  return fetch("/profile/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify({ bio: profile.bio })
  }).then((r) => {
    if (!r.ok) throw new Error("Save failed");
    return r.json();
  });
}