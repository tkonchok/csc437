// app/src/messages.ts
import type { AudioPost, UserProfile } from "./model";

export type Msg =
  | ["posts/request", {}]
  | ["posts/load", { posts: AudioPost[] }]
  | ["profile/request", { username: string }]
  | ["profile/load", { profile: UserProfile }]
  | [
      "profile/save",
      { profile: UserProfile },
      {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
    "upload/create",
    {
      form: FormData;
    },
    {
      onSuccess?: () => void;
      onFailure?: (err: Error) => void;
    }
  ];