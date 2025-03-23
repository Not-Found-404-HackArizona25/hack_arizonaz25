import { apiFetch } from "@/lib/utils";
import type { Route } from "./+types/userpage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@/lib/userSlice";
import type { LikeData, PostData, SuperData } from "@/lib/types";
import Post from "@/components/ui/post";

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
    console.log(postData.data);
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
  const userData = loaderData?.userData || ({} as User);
  const postData = loaderData?.postData || ([] as PostData[]);
  const superData = loaderData?.superData || ([] as SuperData[]);
  const likeData = loaderData?.likeData || ([] as PostData[]);

  return (
    <div className="text-secondary-foreground flex flex-col items-center">
      <h1 className="text-4xl">{userData.display_name || userData.username}</h1>
      <div
        className={`flex size-40 items-center justify-center overflow-hidden rounded-full mt-4 ${
          userData?.profile_picture
            ? ""
            : "border-muted-foreground border-1 border-solid"
        }`}
      >
        {userData?.profile_picture ? (
          <img src={userData.profile_picture} className="object-cover" />
        ) : (
          <p className="text-secondary-foreground text-6xl font-light">
            {(userData?.display_name || "   ").substring(0, 2).toUpperCase()}
          </p>
        )}
      </div>
      <Tabs
        defaultValue="posts"
        className="text-secondary-foreground flex w-[400px] flex-col items-center"
      >
        <TabsList className="bg-secondary my-6 flex w-80 justify-evenly **:w-full">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="supers">Activities</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <h2>Posts</h2>
          {postData.length > 0 ? (
            <div className="posts-list flex flex-col gap-5">
              {postData.map((post: PostData) => (
                <Post post={post} />
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
