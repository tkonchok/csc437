// app/src/messages.ts
import type { AudioPost, UserProfile } from "./model";

export type Msg =
  | ["posts/request", {}]
  | ["posts/load", { posts: AudioPost[] }]
  | ["profile/request", { username: string }]
  | ["profile/load", { profile: UserProfile }];