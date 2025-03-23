import { apiFetch } from "@/lib/utils";
import type { Route } from "./+types/dashboard";

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const response1 = await apiFetch("/super", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: 'HackPath',
      leader: 2,
      description: 'Path to hack!',
      type: 'club',
    })
  })
  const test = await response1.json();
  console.log(test.data)
  const response = await apiFetch("/super", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: test.data.id,
        name: 'HackPath EDITED',
        description: "A better way forwrard",
        type: 'club'
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