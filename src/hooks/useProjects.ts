import { useEffect, useState } from "react"
import { ProjectsData } from "../types"
import AppConfig from "../AppConfig"

const useProjects = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [data, setData] = useState<ProjectsData>({
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
      const data = await response.json()

      if (response.status !== 200 || data.error) {
        setError(data.error)
      } else {
        setData(data as ProjectsData)
      }
      setIsLoading(false)
    }
    setIsLoading(true)
    fetchData()
  }, [])

  return { data, isLoading, error }
}

export default useProjects
