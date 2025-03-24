import { useQuery } from "@tanstack/react-query"

import Alert from "react-bootstrap/Alert"
import Spinner from "react-bootstrap/Spinner"
import { FaExclamationTriangle } from "react-icons/fa"

import AppConfig from "../../AppConfig"
import { SettingsData } from "../../types"

const SettingsContainer = () => {
  const queryFn = async () => {
    const url = AppConfig.API_BASE_URL + "settings"
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
      throw new Error(data.error)
    }
    return data as SettingsData
  }

  const queryKey = ["settings"]
  const { data, error, isLoading } = useQuery({
    queryKey,
    queryFn: () => queryFn(),
  })

  if (isLoading) {
    return <Spinner animation="border" />
  }
  if (error) {
    return (
      <Alert variant="danger">
        <FaExclamationTriangle size={25} /> Error: {error?.message}
      </Alert>
    )
  }
  return (
    <div>
      <h1>Settings</h1>
      <br />
      {data?.trackers?.length ? (
        <>
          Trackers:
          <ul>
            {data.trackers.map((tracker) => (
              <li key={tracker.id}>{tracker.name}</li>
            ))}
          </ul>
        </>
      ) : (
        <Alert variant="info">
          <FaExclamationTriangle size={25} /> No trackers found
        </Alert>
      )}
    </div>
  )
}

export default SettingsContainer
