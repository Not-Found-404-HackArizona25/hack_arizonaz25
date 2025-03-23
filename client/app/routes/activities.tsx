import { apiFetch } from "@/lib/utils"
import { useState } from "react"

export default function Activities() {
  const [activities, setActivities] = useState<Array<any>>([])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const params = new URLSearchParams()
    const search = formData.get('search')
    if (search) params.append('search', search.toString())

    try {
      const response = await apiFetch(`/super?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
        const json = await response.json()
        setActivities(json.data.activities as Array<any>)
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
        <input name="search" className="border-1 border-black" />
        <button>Search</button>
      </form>
      <div>
        {activities.map((activity: any) => (
          <p key={activity.id}>{activity.name}</p>
        ))}
      </div>
    </div>
  )
}
