//import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import HomePage from "./components/HomePage"
import CategoryContainer from "./components/category/CategoryContainer"
import ProjectContainer from "./components/project/ProjectContainer"
import ProjectsContainer from "./components/project/ProjectsContainer"
import UserContainer from "./components/user/UserContainer"
import UsersContainer from "./components/user/UsersContainer"
import SettingsContainer from "./components/settings/SettingsContainer"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/category/:id" element={<CategoryContainer />} />
        <Route path="/project/:id" element={<ProjectContainer />} />
        <Route path="/projects" element={<ProjectsContainer />} />
        <Route path="/user/:id" element={<UserContainer />} />
        <Route path="/users" element={<UsersContainer />} />
        <Route path="/settings" element={<SettingsContainer />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App
