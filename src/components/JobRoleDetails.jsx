import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const JobRoleDetails = () => {
  const { jobRoleName } = useParams();
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`https://flask-auradb-api.onrender.com/get_job_roles`)
      .then((response) => {
        const foundJob = response.data.find(
          (job) => job.job_role.toLowerCase() === jobRoleName.toLowerCase()
        );
        setJobDetails(foundJob || {});
      })
      .catch((error) => console.error("Failed to load job role details:", error));
  }, [jobRoleName]);

  if (!jobDetails) return <p>Loading job details...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{jobDetails.job_role}</h1>
      <p className="text-gray-700">{jobDetails.description}</p>

      <h2 className="text-xl font-bold mt-4">Required Skills</h2>
      <ul className="list-disc pl-5">
        {jobDetails.required_skills?.length > 0 ? (
          jobDetails.required_skills.map((skill, index) => <li key={index}>{skill}</li>)
        ) : (
          <p>No required skills listed.</p>
        )}
      </ul>

      <h2 className="text-xl font-bold mt-4">Career Transitions</h2>
      <ul className="list-disc pl-5">
        {jobDetails.career_transitions?.length > 0 ? (
          jobDetails.career_transitions.map((transition, index) => <li key={index}>{transition}</li>)
        ) : (
          <p>No career transitions listed.</p>
        )}
      </ul>

      <h2 className="text-xl font-bold mt-4">Related Job Roles</h2>
      <ul className="list-disc pl-5">
        {jobDetails.related_roles?.length > 0 ? (
          jobDetails.related_roles.map((role, index) => <li key={index}>{role}</li>)
        ) : (
          <p>No related roles listed.</p>
        )}
      </ul>
    </div>
  );
};

export default JobRoleDetails;
