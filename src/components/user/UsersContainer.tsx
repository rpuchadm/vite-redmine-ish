import { useQuery } from "@tanstack/react-query"

import Alert from "react-bootstrap/Alert"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Spinner from "react-bootstrap/Spinner"
import { FaExclamationTriangle } from "react-icons/fa"

import UserItem from "./UserItem"
import AppConfig from "../../AppConfig"
import { UsersData } from "../../types"

const queryFn = async () => {
  const url = AppConfig.API_BASE_URL + "users"
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
  return data as UsersData
}

const UsersContainer = () => {
  const queryKey = ["users"]
  const { data, error, isLoading } = useQuery({ queryKey, queryFn })
  if (isLoading) {
    return <Spinner animation="border" />
  }
  if (error) {
    return (
      <Alert variant="danger">
        <FaExclamationTriangle size={25} /> Error: {error.message}
      </Alert>
    )
  }
  if (!data || !data.users) {
    return (
      <Alert variant="danger">
        <FaExclamationTriangle size={25} /> Error: Users not found
      </Alert>
    )
  }
  return (
    <Container>
      <Row>
        {data.users.map((user) => (
          <UserItem
            key={user.id}
            {...{ user, roles: data.roles }}
            user_roles={data.user_roles.filter((ur) => ur.user_id === user.id)}
          />
        ))}
      </Row>
    </Container>
  )
}

export default UsersContainer
