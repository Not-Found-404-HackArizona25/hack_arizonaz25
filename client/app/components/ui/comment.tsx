import type { CommentData,  } from "@/lib/types";
import { Link, Navigate, useNavigate } from "react-router";
export default function Comment({ comment }: { comment: CommentData }) {


  return (
    <div className="border-secondary-foreground bg-secondary text-secondary-foreground flex items-start gap-3 rounded-3xl border p-4">
      <Link to={"/" + comment.username}>
      <div
        className={`flex min-w-10 min-h-10 items-center justify-center overflow-hidden rounded-full mt-4 ${
          comment.profile_picture
            ? ""
            : "border-muted-foreground border-1 border-solid"
        }`}
      >
        {comment.profile_picture ? (
          <img src={comment.profile_picture} className="object-cover size-10" />
        ) : (
          <p className="text-secondary-foreground text-base font-light">
            {(comment.display_name || "   ").substring(0, 2).toUpperCase()}
          </p>
        )}
      </div>
      </Link>
      <div className="flex w-full flex-col">
        <Link to={"/" + comment.username}>
          <div className="flex w-full items-end gap-2">
            <p className="text-secondary-foreground">
              <strong>{comment.display_name}</strong>{" "}
              <span className="text-muted-foreground text-sm font-light">
                @{comment.username}
              </span>
            </p>
          </div>
          <div>
          </div>
          <div>{comment.text && <p className="w-[30ch]">{comment.text}</p>}</div>
          </Link>
      </div>
    </div>
  );
}
