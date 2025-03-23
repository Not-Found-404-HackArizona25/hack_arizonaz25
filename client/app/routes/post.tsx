import type { CommentData, PostData } from "@/lib/types";
import { apiFetch } from "@/lib/utils";
import type { Route } from "./+types/post";
import Post from "@/components/ui/post";
import Comment from "@/components/ui/comment";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const posts = await apiFetch(`/posts/${params.postID}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const comments = await apiFetch(`/comments?id=${params.postID}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (posts.ok) {
    const postData: { data: { post: PostData } } = await posts.json();
    const commentData: { data: CommentData[] } = await comments.json();
    console.log(postData.data);
    return {
      postData: postData.data.post,
      commentData: commentData.data
    };
  }
}


export default function PostRoute({loaderData}: Route.ComponentProps){
return <>
    <Post post={(loaderData?.postData) as PostData}/>
    {loaderData?.commentData?loaderData?.commentData.map((comment: CommentData)=>{
        return <Comment comment={comment}/>
    }):<></>}
</>
}