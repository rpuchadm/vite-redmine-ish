import { Link } from "react-router-dom"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"

import { Project } from "../../types"

interface ProjectItemProps {
  project: Project
}

const ProjectItem = ({ project }: ProjectItemProps) => {
  return (
    <Col>
      <Card>
        <Card.Header>
          <Link to={`/project/${project.id}`}>
            <strong>{project.name}</strong>
          </Link>
        </Card.Header>
        <Card.Body>{project.description}</Card.Body>
      </Card>
      <br />
    </Col>
  )
}

export default ProjectItem
