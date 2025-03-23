import { Link } from "react-router";
import type { Route } from "./+types/home";
import { apiFetch } from "@/lib/utils";
import type { PostData } from "@/lib/types";
import Post from "@/components/ui/post";
import { useState } from "react";
import SearchPosts from "@/components/ui/search-posts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FORWARD" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const posts = await apiFetch(`/posts?order=reverse`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (posts.ok) {
    const postData: { data: { posts: PostData[] } } = await posts.json();
    console.log(postData.data);
    return {
      postData: postData.data.posts,
    };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const postData = loaderData?.postData || ([] as PostData[]);
  const [posts, setPosts] = useState(postData)
  
  return (
    <div>
      <SearchPosts setPosts={setPosts}/>
      <h2>Posts</h2>
      {posts.length > 0 ? (
        <div className="posts-list flex flex-col gap-5">
          {posts.map((post: PostData) => (
            <Post post={post} />
          ))}
        </div>
      ) : (
        <p>No posts yet.</p>
      )}
    </div>
  );
}
