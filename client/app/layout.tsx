import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";
// ^ https://sonner.emilkowal.ski/
import { useClient } from "@/lib/useClient";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import Header from "./components/header";
import { apiFetch } from "./lib/utils";
import Footer from "./components/footer";

export default function Layout() {
  const { windowDimensions } = useClient();
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <>
      <div
        className={`bg-background flex min-h-[100vh] flex-col content-evenly text-base`}
      >
        <Header/>
        <div className="flex flex-grow flex-col pt-20">
          <Outlet />
        </div>
        <Footer/>
        <Toaster richColors closeButton={windowDimensions.width > 1024} />
      </div>
    </>
  );
}
