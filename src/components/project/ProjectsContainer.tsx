import { useQuery } from "@tanstack/react-query"

import Alert from "react-bootstrap/Alert"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Spinner from "react-bootstrap/Spinner"
import { FaExclamationTriangle } from "react-icons/fa"

import ProjectItem from "./ProjectItem"
import AppConfig from "../../AppConfig"
import { ProjectsData } from "../../types"

const queryFn = async () => {
  const url = AppConfig.API_BASE_URL + "projects"
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
  return data as ProjectsData
}

const ProjectsContainer = () => {
  const queryKey = ["projects"]
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
  return (
    <Container>
      <Row>
        {data.projects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </Row>
    </Container>
  )
}

export default ProjectsContainer
