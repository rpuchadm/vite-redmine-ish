import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

import Alert from "react-bootstrap/Alert"
import ListGroup from "react-bootstrap/ListGroup"
import Spinner from "react-bootstrap/Spinner"
import { FaExclamationTriangle } from "react-icons/fa"

import { Category, ProjectData, User } from "../../types"
import AppConfig from "../../AppConfig"

const queryFn = async (id: number) => {
  const url = AppConfig.API_BASE_URL + "project/" + id
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
  return data as ProjectData
}

const ProjectContainer = () => {
  const { id } = useParams()
  const iid = id ? parseInt(id) : 0
  const queryKey = ["project", id]
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
  if (!data || !data.project) {
    return (
      <Alert variant="danger">
        <FaExclamationTriangle size={25} /> Error: Project not found
      </Alert>
    )
  }
  return (
    <>
      <h1>{data.project.name}</h1>
      <p>{data.project.description}</p>

      {data.categories?.length && (
        <>
          Categories:
          <ListGroup>
            {data.categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                user={
                  category.assigned_to_id
                    ? data.users?.find(
                        (user) => user.id === category.assigned_to_id
                      )
                    : undefined
                }
              />
            ))}
          </ListGroup>
        </>
      )}
    </>
  )
}

interface CategoryItemProps {
  category: Category
  user?: User
}

const CategoryItem = ({ category, user }: CategoryItemProps) => {
  return (
    <ListGroup.Item>
      <strong>{category.name}</strong>
      {user && <small> ({user.username})</small>}
    </ListGroup.Item>
  )
}

export default ProjectContainer
