import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { ProjectData } from "../types"
import AppConfig from "../AppConfig"

const useProject = () => {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [data, setData] = useState<ProjectData>({
    project: {
      id: 0,
      name: "",
      description: "",
    },
  })
  const iid = id ? parseInt(id) : 0
  const url = AppConfig.API_BASE_URL + "project/" + iid
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
        setData(data as ProjectData)
      }
      setIsLoading(false)
    }
    setIsLoading(true)
    if (iid) {
      fetchData()
    }
  }, [])

  return { data, isLoading, error }
}

export default useProject
