interface Project {
  id: number
  name: string
  description: string
}
interface ProjectsData {
  count: number
  projects: Project[]
}
interface CategoryNumberOfIssues {
  category_id: number
  number_of_issues: number
}
interface Member {
  id: number
  user_id: number
  project_id: number
  role_id: number
  created_at: string
  updated_at: string
}
interface ProjectData {
  project: Project
  categories?: Category[]
  categorynumberofissues?: CategoryNumberOfIssues[]
  users?: User[]
  members?: Member[]
  roles: Role[]
}
interface Category {
  id: number
  name: string
  assigned_to_id?: number
}
interface CategoryData {
  category: Category
  project: Project
  issues?: Issue[]
  users?: User[]
  trackers: Tracker[]
}
interface Tracker {
  id: number
  name: string
  description: string
}
interface Issue {
  id: number
  subject: string
  description: string
  tracker_id: number
  status: string
  project_id?: number
  category_id?: number
  created_at: string
  updated_at: string
  assigned_to_id?: number
}
interface IComment {
  content: string
  created_at: string
  id: number
  issue_id: number
  updated_at: string
  user_id: number
}
interface IssueData {
  comments?: IComment[]
  issue: Issue
  category: Category
  project: Project
  users?: User[]
  //user?: User
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
  issues?: Issue[]
  projects?: Project[]
  categories?: Category[]
  trackers?: Tracker[]
}
interface SettingsData {
  trackers?: Tracker[]
}
export {
  Category,
  CategoryData,
  CategoryNumberOfIssues,
  IComment,
  Issue,
  IssueData,
  Member,
  Project,
  ProjectData,
  ProjectsData,
  User,
  UserData,
  UsersData,
  UserRole,
  Role,
  SettingsData,
  Tracker,
}
