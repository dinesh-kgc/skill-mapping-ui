import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import SkillGraph from "./components/SkillGraph.jsx";
import JobRoleList from "./components/JobRoleList.jsx";
import JobRoleDetails from "./components/JobRoleDetails.jsx";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-56 bg-gray-800 text-white flex flex-col p-4 fixed h-full">
        <h1 className="text-xl font-bold mb-6">Skill Engine</h1>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "bg-gray-700 px-3 py-2 rounded mb-2" : "px-3 py-2 mb-2"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/skill-graph"
          className={({ isActive }) =>
            isActive ? "bg-gray-700 px-3 py-2 rounded mb-2" : "px-3 py-2 mb-2"
          }
        >
          Skill Graph
        </NavLink>
        <NavLink
          to="/job-roles"
          className={({ isActive }) =>
            isActive ? "bg-gray-700 px-3 py-2 rounded" : "px-3 py-2"
          }
        >
          Job Roles
        </NavLink>
      </nav>

      {/* Main Content */}
      <div className="ml-56 w-full p-6">{children}</div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <h1 className="text-2xl font-bold">Welcome to Skill Engine</h1>
              <p>Select an option from the sidebar.</p>
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p>This is a placeholder for future dashboard features.</p>
            </Layout>
          }
        />
        <Route
          path="/skill-graph"
          element={
            <Layout>
              <SkillGraph />
            </Layout>
          }
        />
        <Route
          path="/job-roles"
          element={
            <Layout>
              <JobRoleList />
            </Layout>
          }
        />
        <Route
          path="/job-role/:jobRoleName"
          element={
            <Layout>
              <JobRoleDetails />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
