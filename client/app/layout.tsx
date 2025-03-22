import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";
// ^ https://sonner.emilkowal.ski/
import { useClient } from "@/lib/useClient";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

export default function Layout() {
  const { windowDimensions } = useClient();
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <>
      <div
        className={`bg-background relative flex min-h-[100vh] flex-col content-evenly text-base`}
      >
        <div className="flex flex-grow">
          <Outlet />
        </div>
        <Toaster richColors closeButton={windowDimensions.width > 1024} />
      </div>
    </>
  );
}
