// For Link and Tag, the to_dict() method returns a string.
export type LinkData = string;
export type TagData = string;

// This interface is based on the output of Super.to_dict()
export interface SuperData {
  id: number;
  name: string | null;
  leader: number | null;
  followers: number[];
  description: string | null;
  links: LinkData[];
  tags: TagData[];
}

// Project extends Super and adds additional fields.
export interface ProjectData extends SuperData {
  active: boolean;
  type: 'project';
}

// Club extends Super and just adds a type field.
export interface ClubData extends SuperData {
  type: 'club';
}

// Event extends Super with additional event-specific fields.
export interface EventData extends SuperData {
  start_time: string; // ISO formatted date string
  end_time: string;   // ISO formatted date string
  location: string | null;
  club_ref: number | null;
  type: 'event';
}

// Comment model returns an object with id, text, and user.
export interface CommentData {
  id: number;
  text: string | null;
  username: string;
  display_name: string;
  profile_picture: string;
  user: number;
}

// Post model returns an object with various post details.
export type ContentType = 'text' | 'image';

export interface PostData {
  id: number;
  title: string | null;
  text: string | null;
  display_name: string;
  username: string;
  profile_picture: string|null;
  image_url: string | null;
  contentType: ContentType;
  project?: {
    id: number,
    name: string,
  }
  event?: {
    id: number,
    name: string,
  }
  club?: {
    id: number,
    name: string,
  }
  like_number: number,
  liked?: boolean,
  comments: CommentData[];
}

// Like model returns an object with user and post IDs.
export interface LikeData {
  user: number;
  post: number;
}
