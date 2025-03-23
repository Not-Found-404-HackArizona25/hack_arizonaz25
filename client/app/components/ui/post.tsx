import type { PostData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { apiFetch } from "@/lib/utils";
import { Link, Navigate, useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

export default function Post({ post }: { post: PostData }) {
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
    <div className="border-secondary-foreground flex items-start gap-3 rounded-3xl border p-4">
      <Link to={"/" + post.username}>
        <img src={"/Amber-1705-cropped.jpg"} className="size-10 rounded-full" />
      </Link>
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
          <div>{post.text && <p className="w-[30ch]">{post.text}</p>}</div>
          </Link>
          <div className="tags">
            <Badge
              variant={`outline`}
              className={` ${
                post.club?.name
                  ? "bg-blue-100"
                  : post.project?.name
                    ? "bg-green-100"
                    : post.event?.name
                      ? "bg-red-100"
                      : "bg-yellow-100"
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
                stroke={like ? "red" : "black"}
              />
            </button>
            {likeCount}
          </div>
          <Dialog>
            <DialogTrigger>
              <MessageCircle />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Post a reply</DialogTitle>
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
          <Share2 />
        </div>
      </div>
    </div>
  );
}
