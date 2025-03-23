import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import dayjs from "dayjs"

import Alert from "react-bootstrap/Alert"
import Badge from "react-bootstrap/Badge"
import Col from "react-bootstrap/esm/Col"
import Container from "react-bootstrap/esm/Container"
import ListGroup from "react-bootstrap/ListGroup"
import Row from "react-bootstrap/Row"
import Spinner from "react-bootstrap/Spinner"
import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa"

import AppConfig from "../../AppConfig"
import { CategoryData, Issue, User } from "../../types"

const queryFn = async (id: number) => {
  const url = AppConfig.API_BASE_URL + "category/" + id
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
  return data as CategoryData
}

const CategoryContainer = () => {
  const { id } = useParams()
  const iid = id ? parseInt(id) : 0
  const queryKey = ["category", id]
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
  if (!data || !data.category) {
    return (
      <Alert variant="danger">
        <FaExclamationTriangle size={25} /> Error: Category not found
      </Alert>
    )
  }
  return (
    <>
      <Link to={`/project/${data.project.id}`}>{data.project.name}</Link>
      <h1>Category {data.category.name}</h1>

      {data.issues?.length ? (
        <>
          Issues:
          <ListGroup>
            {data.issues.map((issue) => (
              <IssueItem
                key={issue.id}
                issue={issue}
                user={data.users?.find((u) => u.id === issue.assigned_to_id)}
                tracker={
                  data.trackers?.find((t) => t.id === issue.tracker_id)?.name
                }
              />
            ))}
          </ListGroup>
        </>
      ) : (
        <Alert variant="info">
          <FaInfoCircle /> No issues found.
        </Alert>
      )}
    </>
  )
}

interface IssueItemProps {
  issue: Issue
  user?: User
  tracker?: string
}

const IssueItem = ({ issue, user, tracker }: IssueItemProps) => {
  return (
    <ListGroup.Item>
      <Container>
        <Row>
          <Col>
            <Link to={`/issue/${issue.id}`}>
              <strong>{issue.subject}</strong>
            </Link>
          </Col>
          <Col xs="auto">{tracker && <Badge>{tracker}</Badge>}</Col>
        </Row>
        <Row>
          <Col>
            {issue.description}
            <br />
            <small>
              created: {dayjs(issue.created_at).format("DD/MM/YYYY")}, modified:{" "}
              {dayjs(issue.updated_at).format("DD/MM/YYYY")}
              {issue.assigned_to_id && user ? (
                <> assigned to: {user.username}</>
              ) : null}
            </small>
          </Col>
          <Col xs="auto">
            <Badge bg="info">{issue.status}</Badge>
          </Col>
        </Row>
      </Container>
    </ListGroup.Item>
  )
}

export default CategoryContainer
