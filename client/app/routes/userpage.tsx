import { apiFetch } from "@/lib/utils";
import type { Route } from "./+types/userpage";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await apiFetch(`/super`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: 'project',
      name: 'blah blah',
      description: "boring",
    })
  });
  const user = await apiFetch(`/users/${params.username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const likes = await apiFetch(`/likes/user/${params.username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const posts = await apiFetch(`/posts/user/${params.username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const supers = await apiFetch(`/super/user/${params.username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (user.ok && likes.ok && posts.ok && supers.ok) {
    const [userData, likeData, postData, superData] = [
      await user.json(),
      await likes.json(),
      await posts.json(),
      await supers.json(),
    ];

    return {
      userData,
      likeData,
      postData,
      superData
    };
  }
}

export default function UserPage({ loaderData }: Route.ComponentProps) {
  return <p>{JSON.stringify(loaderData)}</p>;
}
