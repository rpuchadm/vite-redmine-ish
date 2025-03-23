import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

import Alert from "react-bootstrap/Alert"
import ListGroup from "react-bootstrap/ListGroup"
import Spinner from "react-bootstrap/Spinner"
import { FaExclamationTriangle } from "react-icons/fa"

import { UserData, Role } from "../../types"
import AppConfig from "../../AppConfig"

const queryFn = async (id: number) => {
  const url = AppConfig.API_BASE_URL + "user/" + id
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
  return data as UserData
}
const UserContainer = () => {
  const { id } = useParams()
  const iid = id ? parseInt(id) : 0
  const queryKey = ["user", id]
  const { data, error, isLoading } = useQuery({
    queryKey,
    queryFn: () => queryFn(iid),
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
  if (!data || !data.user) {
    return (
      <Alert variant="danger">
        <FaExclamationTriangle size={25} /> Error: Project not found
      </Alert>
    )
  }
  return (
    <>
      <h1>{data.user.username}</h1>
      <p>{data.user.email}</p>

      {data.roles?.length && (
        <>
          Roles:
          <ListGroup>
            {data.roles.map((role) => (
              <RoleItem key={role.id} role={role} />
            ))}
          </ListGroup>
        </>
      )}
    </>
  )
}

interface RoleItemProps {
  role: Role
}

const RoleItem = ({ role }: RoleItemProps) => {
  return (
    <ListGroup.Item>
      <strong>{role.name}</strong>
      <small> {role.description}</small>
    </ListGroup.Item>
  )
}

export default UserContainer
