import { apiFetch } from "@/lib/utils";
import type { Route } from "./+types/dashboard";

export async function clientLoader({}: Route.ClientLoaderArgs) {
    const response = await apiFetch("/super", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: 'HackPath',
        leader: 2,
        description: 'Path to hack!',
        type: 'event'
      })
    });
    if (response.ok){
      const json = await response.json();
      return json.data;
    }
  }

  export default function Dashboard({ loaderData }: Route.ComponentProps ) {
    return <p>{JSON.stringify(loaderData)}</p>
    
}