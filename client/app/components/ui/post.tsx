import type { PostData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { apiFetch, cn } from "@/lib/utils";
import { Link, Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import type { ClassNameValue } from "tailwind-merge";

export default function Post({ post, className }: { post: PostData, className?: ClassNameValue }) {
  const [like, setLike] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.like_number);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const toggleLike = async () => {
    const response = await apiFetch("/likes", {
      method: like ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post: post.id,
      }),
    });
    if (response.ok) {
      setLikeCount(like ? likeCount - 1 : likeCount + 1);
      setLike(!like);
    }
  };

  const postComment = async () =>{
    const response = await apiFetch("/comments",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post: post.id,
        text: comment,
      }),
    })
    if (response.ok){
      navigate(`/post/${post.id}`);
    }
  }

  return (
    <div className={cn(className,"mx-5 border-secondary bg-secondary max-w-[50ch] flex items-start gap-3 rounded-3xl border p-4 text-secondary-foreground")}>
      <div
        className={`flex min-w-10 min-h-10 items-center justify-center overflow-hidden rounded-full mt-4 ${
          post.profile_picture
            ? ""
            : "border-muted-foreground border-1 border-solid"
        }`}
      >
        {post.profile_picture ? (
          <img src={post.profile_picture} className="object-cover size-10" />
        ) : (
          <p className="text-secondary-foreground text-base font-light">
            {(post.display_name || "   ").substring(0, 2).toUpperCase()}
          </p>
        )}
      </div>
      <div className="flex w-full flex-col">
        <Link to={"/" + post.username}>
          <div className="flex w-full items-end gap-2">
            <p className="text-secondary-foreground">
              <strong>{post.display_name}</strong>{" "}
              <span className="text-muted-foreground text-sm font-light">
                @{post.username}
              </span>
            </p>
          </div>
        </Link>
        <Link to={"/post/" + post.id}>
          <div>
            {post.title && <p className="text-xl font-bold">{post.title}</p>}
          </div>
          <div>{post.text && <p className="w-full text-wrap max-w-[50ch] break-words break-all">{post.text}</p>}</div>
          </Link>
          <div className="tags">
            <Badge
              variant={`outline`}
              className={` ${
                post.club?.name
                  ? "bg-blue-500"
                  : post.project?.name
                    ? "bg-green-500"
                    : post.event?.name
                      ? "bg-red-500"
                      : "bg-yellow-500"
              } text-secondary-foreground`}
            >
              {post.club?.name ||
                post.project?.name ||
                post.event?.name ||
                "Misc"}
            </Badge>
          </div>
        
        <div className="flex w-full items-center justify-evenly">
          <div className="flex gap-1">
            <button className="cursor-pointer" onClick={toggleLike}>
              <Heart
                fill={like ? "red" : "none"}
                stroke={like ? "red" : "var(--secondary-foreground)"}
              />
            </button>
            {likeCount}
          </div>
          <Dialog>
            <DialogTrigger>
              <MessageCircle />
            </DialogTrigger>
            <DialogContent className="bg-secondary text-secondary-foreground">
              <DialogHeader>
                <DialogTitle>Reply to this post</DialogTitle>
                <DialogDescription className="rounded-5xl flex flex-col gap-2">
                  <textarea
                    className="bg-background-gray text-secondary-foreground border-secondary-foreground text-top h-20 w-full resize-none rounded-md border p-2 leading-normal"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                  <div className="flex">
                    <DialogClose className="text-md bg-primary text-primary-foreground ml-auto rounded-4xl p-2 px-4" onClick={postComment}>
                      Post
                    </DialogClose>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <button onClick={()=>{
            navigator.clipboard.writeText("https://hack.varphi.online/post/"+post.id);
            toast.success("Copied post link to clipboard!")
            }}>
            <Share2 />
          </button>
        </div>
      </div>
    </div>
  );
}