//import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import HomePage from "./components/HomePage"
import ProjectsContainer from "./components/project/ProjectsContainer"
import ProjectContainer from "./components/project/ProjectContainer"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/project/:id" element={<ProjectContainer />} />
        <Route path="/projects" element={<ProjectsContainer />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App
