import React, { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import axios from "axios";

const SkillGraph = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    axios.get("https://flask-auradb-api.onrender.com/get_skills") // Fetch from Flask API
      .then((response) => {
        console.log("Fetched skills:", response.data.skills);
        const nodes = response.data.skills.map((skill, index) => ({
          data: { id: `s${index}`, label: skill }, // Create nodes from API data
        }));
        setElements(nodes);
      })
      .catch((error) => console.error("Error fetching skills:", error));
  }, []);

  useEffect(() => {
    console.log("Updated skills state:", skills);  // ✅ Check if state is updating correctly
}, [skills]);

return (
    <div className="skill-graph-container">
        <h1>Skill Graph</h1>
        {skills.length === 0 ? <p>Loading skills...</p> : null}  {/* ✅ Show loading state */}
        <CytoscapeComponent
            elements={skills.map((skill, index) => ({
                data: { id: `skill-${index}`, label: skill }
            }))}
            style={{ width: '80%', height: '80vh', border: '1px solid #ccc', background: '#f9f9f9' }}
        />
    </div>
  );
};




export default SkillGraph;
