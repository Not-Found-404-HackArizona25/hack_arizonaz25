import React from "react";
import { useAuth } from "@/lib/useAuth";
import * as Sheet from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import * as DropdownMenu from "@/components/ui/dropdown-menu";
import { useClient } from "@/lib/useClient";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Link } from "react-router";

export default function Header() {
  const { logout } = useAuth();
  const { windowDimensions } = useClient();
  const user = useSelector((state: RootState) => state.user.user);

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div
        className={`bg-primary/30 fixed -top-1 -mb-20 box-border flex items-center backdrop-blur-md **:text-white ${
          user ? "pr-6 pl-6" : "px-12"
        } border-b-primary-border h-18 w-full border-b-1`}
      >
        {/* This is the desktop menu */}
        {windowDimensions.width > 1024 ? (
          <ul className="ml-auto flex list-none items-center gap-6 font-medium *:hover:underline">
            <li>
              <Link to={"/"}>Feed</Link>
            </li>
            <li>
              <Link to={"/"+user?.username}>Account</Link>
            </li>
            <li>
              <Link to={"/activities"}>Activities</Link>
            </li>
            <li>
              {/* BUG: radixui applies a data-scroll-lock css class to the body with the
                  !important modifier, this causes an overflow on the right side of the screen.
                  Even with the overflow-x: hidden; applied, or margin-right: 0px !important;
                  the body still has a content shift due to the margin. I have looked into Radix's
                  documentation, and have found no way to disable the content shift caused by shadcn's 
                  use of their headless dialog component. It may be a case of having to use a different
                  custom component or looking further into it. For now, I am choosing to keep it.*/}
              {user ? (
                <DropdownMenu.DropdownMenu>
                  <DropdownMenu.DropdownMenuTrigger className="flex items-center gap-4 rounded-none p-3 transition-colors duration-200 hover:backdrop-brightness-115">
                    <div
                      className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ${
                        user.profile_picture
                          ? ""
                          : "border-1 border-solid border-white"
                      }`}
                    >
                      {user.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          className="object-cover"
                        />
                      ) : (
                        <p className="text-xl font-light">
                          {(user.display_name || "   ")
                            .substring(0, 2)
                            .toUpperCase()}
                        </p>
                      )}
                    </div>
                  </DropdownMenu.DropdownMenuTrigger>
                  <DropdownMenu.DropdownMenuContent className="bg-secondary text-secondary-foreground w-full rounded-sm border-none p-0 *:p-0 **:active:backdrop-brightness-95">
                    <DropdownMenu.DropdownMenuItem>
                      <Link
                        to={"/" + user.username}
                        className="w-full p-3 text-left hover:underline hover:backdrop-brightness-90"
                      >
                        Account
                      </Link>
                    </DropdownMenu.DropdownMenuItem>
                    <DropdownMenu.DropdownMenuItem>
                      <button
                        aria-label="Log Out"
                        onClick={() => {
                          logout()
                            .then(() => {
                              setOpen(false);
                              toast.success("Successfully Logged Out");
                            })
                            .catch((error: any) => {
                              toast.error(error.message);
                            });
                        }}
                        className="w-full p-3 text-left hover:underline hover:backdrop-brightness-90"
                      >
                        Log Out
                      </button>
                    </DropdownMenu.DropdownMenuItem>
                  </DropdownMenu.DropdownMenuContent>
                </DropdownMenu.DropdownMenu>
              ) : (
                <Link to={"/login"}>Log In</Link>
              )}
            </li>
          </ul>
        ) : (
          <Sheet.Sheet open={open} onOpenChange={setOpen}>
            <Sheet.SheetTrigger>
              <div
                className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ${
                  user?.profile_picture
                    ? ""
                    : "border-muted-foreground border-1 border-solid"
                }`}
              >
                {user?.profile_picture ? (
                  <img src={user.profile_picture} className="object-cover" />
                ) : (
                  <p className="text-secondary-foreground text-xl font-light">
                    {(user?.display_name || "   ")
                      .substring(0, 2)
                      .toUpperCase()}
                  </p>
                )}
              </div>
            </Sheet.SheetTrigger>
            <Sheet.SheetContent
              side={"left"}
              className={`bg-background flex flex-col px-4`}
              aria-describedby="A slide out from the right of the screen containing the navigation in a mobile-friendly way."
            >
              <Sheet.SheetTitle className="text-secondary-foreground">
                WILDCAT HUB
              </Sheet.SheetTitle>
              {
              <div className="*:bg-secondary text-secondary-foreground *:outline-secondary-border flex flex-col space-y-1 *:flex *:justify-between *:rounded-xl *:p-4 *:outline-1 *:active:bg-gray-200/80">
                <Link to={"/activities"}>Activities</Link>
                <Link to={"/chat"}>Chat</Link>
              </div>
              }
              {user ? (
                <div className="group mt-auto flex flex-col gap-4">
                  <Link
                    to={"/" + user.username}
                    className="flex w-full gap-3 active:backdrop-brightness-150"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ${
                        user.profile_picture
                          ? ""
                          : "border-muted-foreground border-1 border-solid"
                      }`}
                    >
                      {user.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          className="object-cover"
                        />
                      ) : (
                        <p className="text-secondary-foreground text-xl font-light">
                          {(user.display_name || "   ")
                            .substring(0, 2)
                            .toUpperCase()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col text-left">
                      <p className="text-secondary-foreground text-base group-hover:underline">
                        {user.display_name}
                      </p>
                      <p className="text-muted-foreground text-xs group-hover:underline">
                        {user.username}
                      </p>
                    </div>
                  </Link>
                  <button
                    aria-label="Log Out"
                    onClick={() => {
                      logout()
                        .then(() => {
                          setOpen(false);
                          toast.success("Successfully Logged Out");
                        })
                        .catch((error: any) => {
                          toast.error(error.message);
                        });
                    }}
                    className="bg-error outline-error-border w-full p-3 text-center text-white outline-1 hover:underline active:brightness-85"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary text-primary-foreground mt-auto w-full p-3 text-center active:brightness-110"
                >
                  Login
                </Link>
              )}
            </Sheet.SheetContent>
          </Sheet.Sheet>
        )}
      </div>
    </>
  );
}
