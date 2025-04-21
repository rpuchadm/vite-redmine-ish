import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import dayjs from "dayjs"

import Alert from "react-bootstrap/Alert"
import Badge from "react-bootstrap/Badge"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/esm/Col"
import Container from "react-bootstrap/esm/Container"
import ListGroup from "react-bootstrap/ListGroup"
import Row from "react-bootstrap/Row"
import Spinner from "react-bootstrap/Spinner"
import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa"

import AppConfig from "../../AppConfig"
import { Category, CategoryData, Issue, User } from "../../types"
import CategoryForm from "./CategoryForm"
import { useToast } from "../Layout/ToastContext"

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

const mutationFn = async (data: { category: Category; method: string }) => {
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
}

const CategoryContainer = () => {
  const { id } = useParams()
  const iid = id ? parseInt(id) : 0
  const queryKey = ["category", id]
  const { data, error, isLoading } = useQuery({
    queryKey,
    queryFn: () => queryFn(iid),
    enabled: !!iid,
  })

  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      addToast(
        "Saved successfully",
        "The category has been saved successfully",
        "success"
      )
      queryClient.invalidateQueries({ queryKey })
    },
    onError: (error: Error) => {
      addToast("Error saving", error.message, "danger")
    },
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
  if (iid && (!data || !data.category)) {
    return (
      <Alert variant="danger">
        <FaExclamationTriangle size={25} /> Error: Category not found
      </Alert>
    )
  }
  // sacar el parámetro project_id del querystring
  // si no existe, asignar 0
  const project_id =
    new URLSearchParams(window.location.search).get("project_id") || "0"
  const category = data?.category || {
    id: 0,
    name: "",
    project_id: parseInt(project_id),
  }
  return (
    <>
      {data && (
        <>
          <Link to={`/project/${data.project.id}`}>{data.project.name}</Link>
          <h1>Category {data.category.name}</h1>
          {data.issues?.length ? (
            <Card>
              <Card.Header>Issues</Card.Header>
              <ListGroup>
                {data.issues.map((issue) => (
                  <IssueItem
                    key={issue.id}
                    issue={issue}
                    user={data.users?.find(
                      (u) => u.id === issue.assigned_to_id
                    )}
                    tracker={
                      data.trackers?.find((t) => t.id === issue.tracker_id)
                        ?.name
                    }
                  />
                ))}
              </ListGroup>
            </Card>
          ) : (
            <Alert variant="info">
              <FaInfoCircle /> No issues found.
            </Alert>
          )}
          <hr />
        </>
      )}
      <CategoryForm {...{ category, mutation }} />
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
