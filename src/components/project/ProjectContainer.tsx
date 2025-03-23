import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"

import Alert from "react-bootstrap/Alert"
import ListGroup from "react-bootstrap/ListGroup"
import Spinner from "react-bootstrap/Spinner"
import { FaExclamationTriangle } from "react-icons/fa"

import {
  Category,
  CategoryNumberOfIssues,
  ProjectData,
  User,
} from "../../types"
import AppConfig from "../../AppConfig"
import Badge from "react-bootstrap/esm/Badge"
import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/esm/Row"
import Col from "react-bootstrap/esm/Col"

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
                number_of_issues={
                  data.categorynumberofissues?.find(
                    (c) => c.category_id === category.id
                  )?.number_of_issues
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
  number_of_issues?: number
}

const CategoryItem = ({
  category,
  user,
  number_of_issues,
}: CategoryItemProps) => {
  return (
    <ListGroup.Item>
      <Container>
        <Row>
          <Col xs="auto">
            {number_of_issues ? (
              <Badge pill bg="info">
                {number_of_issues}
              </Badge>
            ) : (
              <Badge pill bg="secondary">
                0
              </Badge>
            )}
          </Col>
          <Col>
            {" "}
            <Link to={`/category/${category.id}`}>
              <strong>{category.name}</strong>
            </Link>
          </Col>
          <Col xs="auto">{user && <small>{user.username}</small>}</Col>
        </Row>
      </Container>
    </ListGroup.Item>
  )
}

export default ProjectContainer
