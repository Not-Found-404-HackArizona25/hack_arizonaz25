import { apiFetch } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Book,
  BookTextIcon,
  House,
  MessageCircle,
  Plus,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import type { ClubData, EventData, ProjectData } from "@/lib/types";
import { useClient } from "@/lib/useClient";


export default function Footer() {
    const { windowDimensions } = useClient();
  const [selectType, setSelectType] = useState("misc");
  const [activities, setActivity] =
    useState<Array<ProjectData | EventData | ClubData>>();
  const [actId, setAct] = useState<ProjectData | EventData | ClubData>();
  const [open, setOpen] = useState(false);
  const [actName, setActName] = useState("");
  const navigate = useNavigate();
  const createPost = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const resp = await apiFetch("/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        text: formData.get("content"),
        project: selectType === "project" ? actId?.id : null,
        event: selectType === "event" ? actId?.id : null,
        club: selectType === "club" ? actId?.id : null,
        misc: selectType === "misc" ? actId?.id : null,
        contentType: "TEXT",
      }),
    });
    if (resp.ok) {
      navigate(0);
    }
  };
  const createActivity = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const resp = await apiFetch("/super", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        description: formData.get("description"),
        type: selectType,
        start_time: formData.get("start_time"),
        end_time: formData.get("end_time"),
        location: formData.get("location"),
      }),
    });
    if (resp.ok) {
      navigate(0);
    }
  };
  return windowDimensions.width<1024 ? (
    <div className="bg-primary fixed bottom-0 left-0 flex h-14 w-[101vw] items-center justify-evenly brightness-90">
      <Link to="/">
        <House />
      </Link>
      <Link to="/chat">
        <MessageCircle />
      </Link>

      <Dialog>
        <DialogTrigger>
          <Plus className="border-secondary-foreground size-7 rounded-full border-2" />
        </DialogTrigger>
        <DialogContent className="text-secondary-foreground">
          <DialogHeader>
            <DialogTitle>Create a Post or Activity</DialogTitle>
            <DialogDescription className="rounded-5xl flex flex-col gap-2">
              <Tabs>
                <TabsList className="bg-secondary">
                  <TabsTrigger value="post">Post</TabsTrigger>
                  <TabsTrigger value="activity">Actvity</TabsTrigger>
                </TabsList>
                <TabsContent value="post">
                  <form
                    className="mb-4 flex flex-col gap-4"
                    onSubmit={createPost}
                  >
                    <div className="flex flex-col items-start">
                      <label htmlFor="title">Post Title</label>
                      <input
                        id="title"
                        name="title"
                        className="border-secondary-foreground rounded-sm border-1"
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <label htmlFor="type">Post Type</label>
                      <select
                        className="border-secondary-foreground rounded-sm border-1"
                        id="type"
                        value={selectType}
                        onChange={(e) => setSelectType(e.target.value)}
                      >
                        <option value="project">Project</option>
                        <option value="club">Club</option>
                        <option value="event">Event</option>
                        <option value="misc">Others</option>
                      </select>
                    </div>
                    <div className="flex flex-col items-start">
                      <label htmlFor="activity">Activity Name</label>
                      <Popover open={open}>
                        <PopoverTrigger>
                          <input
                            value={actName}
                            id="activity"
                            onFocus={() => setOpen(true)}
                            className="border-secondary-foreground rounded-sm border-1"
                            onChange={async (e) => {
                              setActName(e.target.value);
                              const response = await apiFetch(
                                `/super?type=${selectType}&search=${e.target.value}`,
                                {
                                  method: "GET",
                                },
                              );

                              if (response.ok) {
                                const json = await response.json();
                                setActivity(json.data.activities);
                              }
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="bg-secondary flex flex-col">
                          {activities &&
                            activities.length > 0 &&
                            activities.map((act) => {
                              return (
                                <button
                                  className="active:backdrop-brightness-150"
                                  onClick={() => {
                                    setAct(act);
                                    setOpen(false);
                                    setActName(act.name ?? "");
                                  }}
                                >
                                  {act.name}
                                </button>
                              );
                            })}
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex flex-col items-start">
                      <label htmlFor="content">Post Content</label>
                      <textarea
                        id="content"
                        name="content"
                        className="bg-background-gray text-secondary-foreground border-secondary-foreground text-top h-20 w-full resize-none rounded-md border p-2 leading-normal"
                      ></textarea>
                    </div>
                    <DialogClose>
                      <button className="text-md bg-primary text-primary-foreground ml-auto rounded-4xl p-2 px-4">
                        Post
                      </button>
                    </DialogClose>
                  </form>
                </TabsContent>
                <TabsContent value="activity">
                  <form
                    className="mb-4 flex flex-col gap-4"
                    onSubmit={createActivity}
                  >
                    <div className="flex flex-col items-start">
                      <label htmlFor="type">Activity Type</label>
                      <select
                        className="border-secondary-foreground rounded-sm border-1"
                        id="type"
                        value={selectType}
                        onChange={(e) => setSelectType(e.target.value)}
                      >
                        <option value="project">Project</option>
                        <option value="club">Club</option>
                        <option value="event">Event</option>
                        <option value="misc">Others</option>
                      </select>
                    </div>
                    <div className="flex flex-col items-start">
                      <label htmlFor="name">Activity Name</label>
                      <input
                        id="name"
                        name="name"
                        className="border-secondary-foreground rounded-sm border-1"
                      />
                    </div>

                    <div className="flex flex-col items-start">
                      <label htmlFor="description">
                        Describe your activity
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        className="bg-background-gray text-secondary-foreground border-secondary-foreground text-top h-20 w-full resize-none rounded-md border p-2 leading-normal"
                      ></textarea>
                    </div>

                    {selectType === "event" && (<div className="flex gap-2 flex-col">
                        <div className="flex flex-col items-start">
                        <label htmlFor="location">Event Location</label>
                        <input
                          id="location"
                          name="location"
                          className="border-secondary-foreground rounded-sm border-1"
                        />
                      </div>
                      <div className="flex flex-row text-xs max-h-10 **:max-w-[20ch] justify-between">
                        <div className="flex flex-col items-start">
                          <label htmlFor="start_time">
                            Start Time
                          </label>
                          <input type='datetime-local'
                            id="start_time"
                            name="start_time"
                            className="bg-background-gray text-secondary-foreground border-secondary-foreground text-top h-20 w-full resize-none rounded-md border p-2 leading-normal"
                          ></input>
                        </div>
                        <div className="flex flex-col items-start">
                          <label htmlFor="end_time">
                            End Time
                          </label>
                          <input type='datetime-local'
                            id="end_time"
                            name="end_time"
                            className="bg-background-gray text-secondary-foreground border-secondary-foreground text-top h-20 w-full resize-none rounded-md border p-2 leading-normal"
                          ></input>
                        </div>
                      </div>
                      </div>
                    )}
                    <div className="w-full flex items-end justify-end mt-2">
                    <DialogClose>
                      <button className="text-md bg-primary text-primary-foreground ml-auto rounded-4xl p-2 px-4">
                        Create activity
                      </button>
                      
                    </DialogClose>
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value="activity"></TabsContent>
              </Tabs>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <button>
        <Search />
      </button>

      <Link to="/activities">
        <BookTextIcon />
      </Link>
    </div>
  ):<Dialog>
  <DialogTrigger>
    <Plus className="border-secondary-foreground size-12 fixed right-8 bottom-8 bg-primary rounded-full border-1" />
  </DialogTrigger>
  <DialogContent className="text-secondary-foreground">
    <DialogHeader>
      <DialogTitle>Create a Post or Activity</DialogTitle>
      <DialogDescription className="rounded-5xl flex flex-col gap-2">
        <Tabs>
          <TabsList className="bg-secondary">
            <TabsTrigger value="post">Post</TabsTrigger>
            <TabsTrigger value="activity">Actvity</TabsTrigger>
          </TabsList>
          <TabsContent value="post">
            <form
              className="mb-4 flex flex-col gap-4"
              onSubmit={createPost}
            >
              <div className="flex flex-col items-start">
                <label htmlFor="title">Post Title</label>
                <input
                  id="title"
                  name="title"
                  className="border-secondary-foreground rounded-sm border-1"
                />
              </div>
              <div className="flex flex-col items-start">
                <label htmlFor="type">Post Type</label>
                <select
                  className="border-secondary-foreground rounded-sm border-1"
                  id="type"
                  value={selectType}
                  onChange={(e) => setSelectType(e.target.value)}
                >
                  <option value="project">Project</option>
                  <option value="club">Club</option>
                  <option value="event">Event</option>
                  <option value="misc">Others</option>
                </select>
              </div>
              <div className="flex flex-col items-start">
                <label htmlFor="activity">Activity Name</label>
                <Popover open={open}>
                  <PopoverTrigger>
                    <input
                      value={actName}
                      id="activity"
                      onFocus={() => setOpen(true)}
                      className="border-secondary-foreground rounded-sm border-1"
                      onChange={async (e) => {
                        setActName(e.target.value);
                        const response = await apiFetch(
                          `/super?type=${selectType}&search=${e.target.value}`,
                          {
                            method: "GET",
                          },
                        );

                        if (response.ok) {
                          const json = await response.json();
                          setActivity(json.data.activities);
                        }
                      }}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="bg-secondary flex flex-col">
                    {activities &&
                      activities.length > 0 &&
                      activities.map((act) => {
                        return (
                          <button
                            className="active:backdrop-brightness-150"
                            onClick={() => {
                              setAct(act);
                              setOpen(false);
                              setActName(act.name ?? "");
                            }}
                          >
                            {act.name}
                          </button>
                        );
                      })}
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col items-start">
                <label htmlFor="content">Post Content</label>
                <textarea
                  id="content"
                  name="content"
                  className="bg-background-gray text-secondary-foreground border-secondary-foreground text-top h-20 w-full resize-none rounded-md border p-2 leading-normal"
                ></textarea>
              </div>
              <DialogClose>
                <button className="text-md bg-primary text-primary-foreground ml-auto rounded-4xl p-2 px-4">
                  Post
                </button>
              </DialogClose>
            </form>
          </TabsContent>
          <TabsContent value="activity">
            <form
              className="mb-4 flex flex-col gap-4"
              onSubmit={createActivity}
            >
              <div className="flex flex-col items-start">
                <label htmlFor="type">Activity Type</label>
                <select
                  className="border-secondary-foreground rounded-sm border-1"
                  id="type"
                  value={selectType}
                  onChange={(e) => setSelectType(e.target.value)}
                >
                  <option value="project">Project</option>
                  <option value="club">Club</option>
                  <option value="event">Event</option>
                  <option value="misc">Others</option>
                </select>
              </div>
              <div className="flex flex-col items-start">
                <label htmlFor="name">Activity Name</label>
                <input
                  id="name"
                  name="name"
                  className="border-secondary-foreground rounded-sm border-1"
                />
              </div>

              <div className="flex flex-col items-start">
                <label htmlFor="description">
                  Describe your activity
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="bg-background-gray text-secondary-foreground border-secondary-foreground text-top h-20 w-full resize-none rounded-md border p-2 leading-normal"
                ></textarea>
              </div>

              {selectType === "event" && (<div className="flex gap-2 flex-col">
                  <div className="flex flex-col items-start">
                  <label htmlFor="location">Event Location</label>
                  <input
                    id="location"
                    name="location"
                    className="border-secondary-foreground rounded-sm border-1"
                  />
                </div>
                <div className="flex flex-row text-xs max-h-10 **:max-w-[20ch] justify-between">
                  <div className="flex flex-col items-start">
                    <label htmlFor="start_time">
                      Start Time
                    </label>
                    <input type='datetime-local'
                      id="start_time"
                      name="start_time"
                      className="bg-background-gray text-secondary-foreground border-secondary-foreground text-top h-20 w-full resize-none rounded-md border p-2 leading-normal"
                    ></input>
                  </div>
                  <div className="flex flex-col items-start">
                    <label htmlFor="end_time">
                      End Time
                    </label>
                    <input type='datetime-local'
                      id="end_time"
                      name="end_time"
                      className="bg-background-gray text-secondary-foreground border-secondary-foreground text-top h-20 w-full resize-none rounded-md border p-2 leading-normal"
                    ></input>
                  </div>
                </div>
                </div>
              )}
              <div className="w-full flex items-end justify-end mt-2">
              <DialogClose>
                <button className="text-md bg-primary text-primary-foreground ml-auto rounded-4xl p-2 px-4">
                  Create activity
                </button>
                
              </DialogClose>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="activity"></TabsContent>
        </Tabs>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>;
}
