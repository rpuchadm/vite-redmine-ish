import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import dayjs from "dayjs"

import Alert from "react-bootstrap/Alert"
import Badge from "react-bootstrap/Badge"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import ListGroup from "react-bootstrap/ListGroup"
import Spinner from "react-bootstrap/Spinner"
import Row from "react-bootstrap/Row"
import { FaExclamationTriangle } from "react-icons/fa"

import { UserData, Role, Issue, Project, Category } from "../../types"
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
          <br />
        </>
      )}

      {data.issues?.length && (
        <>
          Issues:
          <ListGroup>
            {data.issues.map((issue) => (
              <IssueItem
                key={issue.id}
                issue={issue}
                project={data.projects?.find((p) => p.id === issue.project_id)}
                category={data.categories?.find(
                  (c) => c.id === issue.category_id
                )}
                tracker={
                  data.trackers?.find((t) => t.id === issue.tracker_id)?.name
                }
              />
            ))}
          </ListGroup>
          <br />
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

interface IssueItemProps {
  issue: Issue
  project?: Project
  category?: Category
  tracker?: string
}

const IssueItem = ({ issue, project, category, tracker }: IssueItemProps) => {
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
          <Col>{issue.description}</Col>
          <Col xs="auto">
            <Badge bg="info">{issue.status}</Badge>
          </Col>
        </Row>
        <Row>
          <Col>
            {issue.project_id && project ? (
              <>
                project:{" "}
                <Link to={`/project/${project.id}`}>{project.name}</Link>
              </>
            ) : null}
            {issue.category_id && category ? (
              <>
                category:{" "}
                <Link to={`/category/${category.id}`}>{category.name}</Link>
              </>
            ) : null}
          </Col>
          <Col style={{ textAlign: "right" }}>
            <small>
              created: {dayjs(issue.created_at).format("DD/MM/YYYY")}, modified:{" "}
              {dayjs(issue.updated_at).format("DD/MM/YYYY")}
            </small>
          </Col>
        </Row>
      </Container>
    </ListGroup.Item>
  )
}

export default UserContainer
