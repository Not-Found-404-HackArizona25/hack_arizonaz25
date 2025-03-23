import { apiFetch } from "@/lib/utils"
import { useState } from "react"
import type { PostData } from "@/lib/types"

interface SearchProps {
    setPosts: React.Dispatch<React.SetStateAction<Array<PostData>>>;
  }

export default function SearchPosts({ setPosts }: SearchProps) {
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Ensure e.target is treated as a form
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const params = new URLSearchParams()
    const search = formData.get('search') || ""
    const type = formData.get('type') || ""
    if (search) params.append('search', search.toString())
    if (type) params.append('type', type.toString())
    

    try {
      const response = await apiFetch(`/posts?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
        const json = await response.json()
        setPosts(json.data.posts as Array<PostData>)
      } else {
        // Handle the error state if needed
        console.error('Error fetching data:', response.statusText)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }
  
  return (
    <div className="text-secondary-foreground">
      <form onSubmit={handleSubmit}>
        <input placeholder="What do you want to find?" name="search" className="border-1 border-black" />
        <select title="Post Type: " name="type" defaultValue="misc">
            <option value="project">Project</option>
            <option value="club">Club</option>
            <option value="event">Event</option>
            <option value="misc">Others</option>
        </select>
        <button type="submit">Search</button>
      </form>
    </div>
  )
}
