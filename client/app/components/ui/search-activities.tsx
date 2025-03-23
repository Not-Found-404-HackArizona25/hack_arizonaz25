import { apiFetch } from "@/lib/utils"
import { useState } from "react"
import type { ProjectData, EventData, ClubData } from "@/lib/types"

interface SearchProps {
    setActivities: React.Dispatch<React.SetStateAction<Array<ProjectData|EventData|ClubData>>>;
  }

export default function SearchActivities({ setActivities }: SearchProps) {
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Ensure e.target is treated as a form
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const params = new URLSearchParams()
    const search = formData.get('search') || ''
    const type = formData.get('type') || ''
    if (search) params.append('search', search.toString())
    if (type) params.append('type', type.toString())
    
    try {
      const response = await apiFetch(`/super?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
        const json = await response.json()
        setActivities(json.data.activities as Array<ProjectData|EventData|ClubData>)
      } else {
        // Handle the error state if needed
        console.error('Error fetching data:', response.statusText)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input placeholder="What activities you want to find?" name="search" className="border-1 border-secondary-foreground **:text-secondary-foreground" />
        <select title="Activity Type: " name="type" defaultValue="project">
            <option value="project">Project</option>
            <option value="club">Club</option>
            <option value="event">Event</option>
        </select>
        <button type="submit" className="border-1 border-secondary-foreground rounded-2xl px-3">Search</button>
      </form>
    </div>
  )
}
