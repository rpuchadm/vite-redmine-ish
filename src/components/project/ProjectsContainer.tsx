import Alert from "react-bootstrap/Alert"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Spinner from "react-bootstrap/Spinner"
import { FaExclamationTriangle } from "react-icons/fa"

import ProjectItem from "./ProjectItem"
import useProjects from "../../hooks/useProjects"

const ProjectsContainer = () => {
  const { data, isLoading, error } = useProjects()
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
