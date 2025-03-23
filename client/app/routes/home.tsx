import { apiFetch } from "@/lib/utils";
import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FORWARD" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const response =
    await apiFetch('/posts', {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
  if (response.ok){
    const json: { data: { posts: PostData[] } } = await response.json();
    return json.data.posts;
  }
}

export default function Home({ loaderData }): Route.ComponentProps {
  const createPost = async () => {
    const response = await apiFetch('/posts', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "test title",
        text: "WOW post away",
        contentType: "TEXT",
        misc: 56789376592,
      })
    })
    if (response.ok){
        const json: { data: PostData[] } = await response.json();
      loaderData.push(json.data);
    }
  }
  
  createPost();
  const postData = loaderData || [];
  
  return (
    <div>
      <Link to="/login">
        Login
      </Link>
      <br/>
      <Link to="/register">
        Register
      </Link>
      <h2>Posts</h2>
      {postData.length > 0 ? (
        <div className="posts-list">
          {postData.map((post: any) => (
            <div key={post.id} className="post-card">
              <p>{post.username}</p>
              <h3>{post.title}</h3>
              <p>{post.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No posts yet.</p>
      )}
    </div>
  );
}
