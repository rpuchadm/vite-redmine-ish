interface Project {
  id: number
  name: string
  description: string
}
interface ProjectsData {
  count: number
  projects: Project[]
}

export { Project, ProjectsData }
