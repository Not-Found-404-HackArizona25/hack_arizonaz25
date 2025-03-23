import { apiFetch } from "@/lib/utils";
import type { Route } from "./+types/userpage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@/lib/userSlice";
import type { LikeData, PostData, SuperData } from "@/lib/types";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
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
    const [userData, likeData, postData, superData]: [
      { data: User },
      { data: PostData[] },
      { data: PostData[] },
      { data: SuperData[] },
    ] = [
      await user.json(),
      await likes.json(),
      await posts.json(),
      await supers.json(),
    ];
    return {
      userData: userData.data,
      likeData: likeData.data,
      postData: postData.data,
      superData: superData.data,
    };
  }
}

export default function UserPage({ loaderData }: Route.ComponentProps) {
  // Add null checks with optional chaining and default empty arrays
  const userData = loaderData?.userData || {} as User;
  const postData = loaderData?.postData || [] as PostData[];
  const superData = loaderData?.superData || [] as SuperData[];
  const likeData = loaderData?.likeData || [] as PostData[];

  return (
    <div>
      <h1>{userData.display_name || userData.username}</h1>
      {userData.profile_picture && (
        <img src={userData.profile_picture} alt="Profile" />
      )}
      <Tabs defaultValue="posts" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="supers">Activities</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <h2>Posts</h2>
          {postData.length > 0 ? (
            <div className="posts-list">
              {postData.map((post: PostData) => (
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
        </TabsContent>
        <TabsContent value="supers">
          <h2>Activities</h2>
          {superData.length > 0 ? (
            <div className="posts-list">
              {superData.map((superItem: SuperData) => (
                <div
                  key={superItem.id}
                  className="post-card rounded-4xl border-2 border-green-400"
                >
                  <h3>{superItem.name}</h3>
                  <p>{superItem.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No supers yet.</p>
          )}
        </TabsContent>
        <TabsContent value="likes">
          <h2>Likes</h2>
          {likeData.length > 0 ? (
            <div className="posts-list">
              {likeData.map((post: PostData) => (
                <div key={post.id} className="post-card">
                  <p>{post.username}</p>
                  <h3>{post.title}</h3>
                  <p>{post.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No liked posts yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
