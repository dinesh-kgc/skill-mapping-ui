import React, { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import axios from "axios";

const SkillGraph = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    axios.get("https://your-flask-api.onrender.com/get_skills") // Fetch from Flask API
      .then((response) => {
        const nodes = response.data.skills.map((skill, index) => ({
          data: { id: `s${index}`, label: skill }, // Create nodes from API data
        }));
        setElements(nodes);
      })
      .catch((error) => console.error("Error fetching skills:", error));
  }, []);

  return (
    <div className="content">
      <h1>Skill Graph</h1>
      <CytoscapeComponent elements={elements} style={{ width: "600px", height: "400px" }} />
    </div>
  );
};

export default SkillGraph;
