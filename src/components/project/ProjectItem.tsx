import { Project } from "../../types"

import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"

interface ProjectItemProps {
  project: Project
}

const ProjectItem = ({ project }: ProjectItemProps) => {
  return (
    <Col>
      <Card>
        <Card.Header>
          <a href={`/project/${project.id}`}>
            <strong>{project.name}</strong>
          </a>
        </Card.Header>
        <Card.Body>{project.description}</Card.Body>
      </Card>
      <br />
    </Col>
  )
}

export default ProjectItem
