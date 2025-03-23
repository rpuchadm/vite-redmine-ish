import ProjectItem from "./ProjectItem"
import useProjects from "../../hooks/useProjects"

const ProjectsContainer = () => {
  const { projects, isLoading, error } = useProjects()
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error}</div>
  }
  return (
    <div>
      {projects.projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  )
}

export default ProjectsContainer
