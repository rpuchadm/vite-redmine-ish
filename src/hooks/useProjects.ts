import { useEffect, useState } from "react"
import { ProjectsData } from "../types"
import AppConfig from "../AppConfig"

const useProjects = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [projects, setProjects] = useState<ProjectsData>({
    count: 0,
    projects: [],
  })

  const url = AppConfig.API_BASE_URL + "projects"
  useEffect(() => {
    const fetchData = async () => {
      const lstoken = localStorage.getItem(AppConfig.TOKEN_ITEM_NAME)
      const response = await fetch(url, {
        method: "GET",
        credentials: "omit",
        headers: {
          Authorization: `Bearer ${lstoken}`,
        },
      })
      const data = await response.json().then((data) => data as ProjectsData)
      if (data) {
        setProjects(data)
      }
      setIsLoading(false)
    }
    setIsLoading(true)
    fetchData()
  }, [])

  return { projects, isLoading, error }
}

export default useProjects
