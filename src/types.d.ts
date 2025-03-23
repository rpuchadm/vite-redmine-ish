interface Project {
  id: number
  name: string
  description: string
}
interface ProjectsData {
  count: number
  projects: Project[]
}
interface ProjectData {
  project: Project
  categories?: Category[]
  users?: User[]
}
interface Category {
  id: number
  name: string
  assigned_to_id?: number
}
interface User {
  id: number
  username: string
  email: string
}
interface Role {
  id: number
  name: string
  description: string
}
interface UserRole {
  user_id: number
  role_id: number
}
interface UsersData {
  users: User[]
  roles: Role[]
  user_roles: UserRole[]
}
interface UserData {
  user: User
  roles: Role[]
}
export {
  Category,
  Project,
  ProjectData,
  ProjectsData,
  User,
  UserData,
  UsersData,
  UserRole,
  Role,
}
