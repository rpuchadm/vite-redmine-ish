import { Project } from "../../types"

interface ProjectItemProps {
  project: Project
}

const ProjectItem = ({ project }: ProjectItemProps) => {
  return (
    <div>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
    </div>
  )
}

export default ProjectItem
