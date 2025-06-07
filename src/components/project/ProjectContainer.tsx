import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import dayjs from "dayjs"

import Alert from "react-bootstrap/Alert"
import Badge from "react-bootstrap/Badge"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import ListGroup from "react-bootstrap/ListGroup"
import Modal from "react-bootstrap/Modal"
import Row from "react-bootstrap/Row"
import Spinner from "react-bootstrap/Spinner"
import { FaExclamationTriangle, FaPlusCircle } from "react-icons/fa"

import { Category, Issue, ProjectData, Role, User } from "../../types"
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

/*
const categoryMutationFn = async (data: {
  category: Category
  method: string
}) => {
  const url =
    AppConfig.API_BASE_URL +
    "category" +
    (data.category.id ? "/" + data.category.id : "")
  const lstoken = localStorage.getItem(AppConfig.TOKEN_ITEM_NAME)
  const response = await fetch(url, {
    method: data.method,
    credentials: "omit",
    headers: {
      Authorization: `Bearer ${lstoken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data.category),
  })
  const res = await response.json()
  if (response.status !== 200 || res.error) {
    throw new Error(res.error)
  }
  return res as Category
}*/

const ProjectContainer = () => {
  const { id } = useParams()
  const iid = id ? parseInt(id) : 0
  const queryKey = ["project", id]
  const { data, error, isLoading } = useQuery({
    queryKey,
    queryFn: () => queryFn(iid),
  })

  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const handleCloseNewCategoryModal = () => setShowNewCategoryModal(false)
  const handleShowNewCategoryModal = () => setShowNewCategoryModal(true)

  //const { addToast } = useToast()
  //const queryClient = useQueryClient()
  /*const categoryMutation = useMutation({
    mutationFn: categoryMutationFn,
    onSuccess: () => {
      addToast(
        "Saved successfully",
        "The category has been saved successfully",
        { variant: "success" }
      )
      queryClient.invalidateQueries({ queryKey })
    },
    onError: (error: Error) => {
      addToast("Error saving", error.message, { variant: "danger" })
    },
  })*/

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
      <a href="#" onClick={handleShowNewCategoryModal} className="float-end">
        Add Category
      </a>

      <br />
      <Link
        to={`/issue/0?project_id=${data.project.id}`}
        className="btn btn-primary"
      >
        <FaPlusCircle size={25} /> New Issue
      </Link>

      {data.issues_no_category?.length ? (
        <>
          <hr />
          <Card>
            <Card.Header>Issues with no category</Card.Header>
            <ListGroup>
              {data.issues_no_category.map((issue) => (
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
          </Card>
        </>
      ) : null}

      <hr />

      {data.members?.length && (
        <>
          Members:
          <ListGroup>
            {data.members.map((member) => (
              <MemberItem
                key={member.id}
                user={data.users?.find((u) => u.id === member.user_id)}
                role={data.roles?.find((r) => r.id === member.role_id)}
              />
            ))}
          </ListGroup>
          <br />
        </>
      )}
      <Modal show={showNewCategoryModal} onHide={handleCloseNewCategoryModal}>
        <Modal.Header closeButton>
          <Modal.Title>New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Form goes here</p>
        </Modal.Body>

        <Modal.Footer>
          <button onClick={handleCloseNewCategoryModal}>Close</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

interface MemberItemProps {
  user?: User
  role?: Role
}

const MemberItem = ({ user, role }: MemberItemProps) => {
  return (
    <ListGroup.Item>
      <Container>
        <Row>
          <Col>
            {user && (
              <Link to={`/user/${user.id}`}>
                <strong>{user.username}</strong>
              </Link>
            )}
          </Col>
          <Col xs="auto">
            <small>{role?.name}</small>
          </Col>
        </Row>
      </Container>
    </ListGroup.Item>
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

export default ProjectContainer
