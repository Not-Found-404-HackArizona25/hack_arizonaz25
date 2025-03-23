import { apiFetch } from "@/lib/utils";
import type { Route } from "./+types/dashboard";

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const response = await apiFetch("/super?type=club&search=enth", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok){
      const json = await response.json();
      return json.data;
    }
  }

  export default function Dashboard({ loaderData }: Route.ComponentProps ) {
    return <p>{JSON.stringify(loaderData)}</p>
    
}