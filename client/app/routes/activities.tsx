import { apiFetch } from "@/lib/utils"
import { useState } from "react"
import type { ProjectData, EventData, ClubData } from "@/lib/types"
import SearchActivities from "@/components/ui/search-activities"

export default function Activities() {
  const [activities, setActivities] = useState<Array<ProjectData|EventData|ClubData>>([])

  return (
    <div>
      <SearchActivities setActivities={setActivities}/>
      <div>
        { activities.length > 0 ? (
          activities.map((activity: ProjectData|EventData|ClubData) => (
            <p key={activity.id}>{activity.name}</p>
          ))
        ) : (
          <p>No results found</p>
        )
        }
      </div>
    </div>
  )
}
