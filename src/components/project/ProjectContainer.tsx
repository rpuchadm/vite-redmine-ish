import Alert from "react-bootstrap/Alert"
import Container from "react-bootstrap/Container"
import ListGroup from "react-bootstrap/ListGroup"
import Spinner from "react-bootstrap/Spinner"
import { FaExclamationTriangle } from "react-icons/fa"

import useProject from "../../hooks/useProject"
import { Category, User } from "../../types"

const ProjectContainer = () => {
  const { data, isLoading, error } = useProject()

  if (isLoading) {
    return <Spinner animation="border" />
  }
  if (error) {
    return (
      <Alert variant="danger">
        <FaExclamationTriangle size={25} /> Error: {error}
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
