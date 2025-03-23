//import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import HomePage from "./components/HomePage"
import ProjectsContainer from "./components/project/ProjectsContainer"
import ProjectContainer from "./components/project/ProjectContainer"
import UsersContainer from "./components/user/UsersContainer"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/project/:id" element={<ProjectContainer />} />
        <Route path="/projects" element={<ProjectsContainer />} />
        <Route path="/users" element={<UsersContainer />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App
