import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router"

import Alert from "react-bootstrap/Alert"
import Spinner from "react-bootstrap/Spinner"
import { Issue, IssueData } from "../../types"
import AppConfig from "../../AppConfig"
import { FaExclamationTriangle } from "react-icons/fa"
import { useToast } from "../Layout/ToastContext"
import { Link } from "react-router-dom"
import IssueForm from "./IssueForm"

const queryFn = async (id: number) => {
  const url = AppConfig.API_BASE_URL + "issue/" + id
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
  return data as IssueData
}

const mutationFn = async (data: { issue: Issue; method: string }) => {
  const url =
    AppConfig.API_BASE_URL +
    "issue" +
    (data.issue.id ? "/" + data.issue.id : "")
  const lstoken = localStorage.getItem(AppConfig.TOKEN_ITEM_NAME)
  const response = await fetch(url, {
    method: data.method,
    credentials: "omit",
    headers: {
      Authorization: `Bearer ${lstoken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data.issue),
  })
  const res = await response.json()
  if (response.status !== 200 || res.error) {
    throw new Error(res.error)
  }
  return res as Issue
}

const IssueContainer = () => {
  const { id } = useParams()
  const iid = id ? parseInt(id) : 0
  const queryKey = ["category", id]
  const { data, error, isLoading } = useQuery<IssueData>({
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
        "The issue has been saved successfully",
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

  if (iid && (!data || !data.issue)) {
    return (
      <Alert variant="danger">
        <FaExclamationTriangle size={25} /> Error: Issue not found
      </Alert>
    )
  }

  // sacar el parámetro project_id y category_id del querystring
  // si no existen, asignar 0
  const project_id =
    new URLSearchParams(window.location.search).get("project_id") || "0"
  const category_id =
    new URLSearchParams(window.location.search).get("category_id") || "0"
  const issue =
    data?.issue ||
    ({
      id: 0,
      subject: "",
      description: "",
      project_id: parseInt(project_id),
      category_id: parseInt(category_id),
      status: "new",
    } as Issue)

  return (
    <>
      {data && (
        <>
          <Link to={`/project/${data.project.id}`}>{data.project.name}</Link>
          {data.category && (
            <>
              {" "}
              /{" "}
              <Link to={`/category/${data.category.id}`}>
                {data.category.name}
              </Link>
            </>
          )}
          <h1>Issue {data.issue.subject}</h1>
        </>
      )}
      <IssueForm {...{ issue, mutation }} />
    </>
  )
}

export default IssueContainer
