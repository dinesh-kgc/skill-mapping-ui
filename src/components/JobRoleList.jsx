import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JobRoleList = () => {
  const [jobRoles, setJobRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://flask-auradb-api.onrender.com/get_job_roles")
      .then((response) => {
        setJobRoles(response.data);
      })
      .catch((error) => console.error("Failed to load job roles:", error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Job Roles</h1>
      <ul className="list-disc pl-5">
        {jobRoles.map((job, index) => (
          <li
            key={index}
            className="cursor-pointer text-blue-600 hover:underline"
            onClick={() => navigate(`/job-role/${encodeURIComponent(job.job_role)}`)}
          >
            {job.job_role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobRoleList;
