import ProjectItem from "./ProjectItem"
import useProjects from "../../hooks/useProjects"

import Alert from "react-bootstrap/Alert"
import Spinner from "react-bootstrap/Spinner"
import { FaExclamationTriangle } from "react-icons/fa"

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
    <div>
      {data.projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  )
}

export default ProjectsContainer
