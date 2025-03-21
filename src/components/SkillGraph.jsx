import React, { useEffect, useState, useRef, useMemo } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import axios from "axios";

// Memoized Graph Component
const GraphComponent = React.memo(({ elements, cyRef, stylesheet }) => {
  return (
    <CytoscapeComponent
      elements={elements}
      style={{ width: "100%", height: "100%" }}
      cy={(cy) => {
        cyRef.current = cy;
        // Run the layout only once
        if (!cy.data("layoutApplied")) {
          // Force a resize first, ensuring Cytoscape knows the container size
          cy.resize();

          // Use a concentric layout to spread nodes radially
          const layout = cy.layout({
            name: "concentric",
            fit: false,                     // We'll fit/center manually
            avoidOverlap: true,            // Tries to prevent node overlap
            nodeDimensionsIncludeLabels: true,
            minNodeSpacing: 80,            // Extra space between nodes
            concentric: (node) => node.degree(), // Higher degree => placed further out
            levelWidth: () => 2,           // Spacing factor for each concentric level
            spacingFactor: 1.5,            // Adjust for more or less spacing
            padding: 50,
          });

          layout.run();

          // Now manually fit and center the graph with some padding
          cy.fit(cy.$("node"), 50);
          cy.center();

          // Mark layout as applied
          cy.data("layoutApplied", true);
        }
      }}
      stylesheet={stylesheet}
    />
  );
});

const SkillGraph = () => {
  const [elements, setElements] = useState([]);
  const [clickedSkill, setClickedSkill] = useState(null);
  const cyRef = useRef(null);

  // Custom stylesheet with text wrapping & label offset
  const cyStylesheet = useMemo(() => [
    // Node styling
    {
      selector: "node",
      style: {
        "background-color": "#777",
        label: "data(label)",
        // Center label horizontally, shift below node vertically
        "text-halign": "center",
        "text-valign": "center",
        "text-margin-y": 10,
        color: "#000000",
        "font-size": "12px",
        width: "20px",
        height: "20px",
        // Wrap text to avoid overlap
        "text-wrap": "wrap",
        "text-max-width": "50px",
      },
    },
    // Edge styling
    {
      selector: "edge",
      style: {
        "curve-style": "bezier",
        width: 1,
        "line-color": "#bbb",
        "target-arrow-shape": "triangle",
        "target-arrow-color": "#bbb",
        label: "data(label)",
        "text-rotation": "autorotate",
        "font-size": "8px",
        color: "#555",
      },
    },
  ], []);

  // Fetch the skill graph data on mount
  useEffect(() => {
    axios
      .get("https://flask-auradb-api.onrender.com/get_skills_graph")
      .then((response) => {
        const { nodes, edges } = response.data;

        // Format nodes for Cytoscape
        const formattedNodes = nodes.map((node) => ({
          data: {
            id: node.id,
            label: node.label,
          },
        }));

        // Format edges for Cytoscape
        const formattedEdges = edges.map((edge) => ({
          data: {
            source: edge.source,
            target: edge.target,
            label: edge.relationship,
          },
        }));

        setElements([...formattedNodes, ...formattedEdges]);
      })
      .catch((error) => console.error("Failed to load skill graph:", error));
  }, []);

  // Helper function to fetch skill details
  const fetchSkillDetails = async (skillName) => {
    try {
      const response = await axios.get(
        `https://flask-auradb-api.onrender.com/get_skill_details?skill=${encodeURIComponent(skillName)}`
      );
      return response.data || { name: skillName, error: "Skill details not found." };
    } catch (error) {
      console.error("Failed to load skill details:", error);
      if (error.response && error.response.status === 404) {
        return { name: skillName, error: "Skill details not found." };
      }
      return { name: skillName, error: "Error fetching skill details." };
    }
  };

  // Attach node click event
  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      // Remove any previous event listeners
      cy.off("tap", "node");
      cy.on("tap", "node", async (evt) => {
        const clickedSkillName = evt.target.data("label");
        const skillData = await fetchSkillDetails(clickedSkillName);
        setClickedSkill(skillData);
      });
    }
  }, [elements]);

  return (
    <div className="flex">
      {/* Graph */}
      <div className="p-4 w-3/4">
        <h1 className="text-2xl font-bold mb-4">Skill Graph</h1>
        <div style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}>
          <GraphComponent
            elements={elements}
            cyRef={cyRef}
            stylesheet={cyStylesheet}
          />
        </div>
      </div>

      {/* Side Panel */}
      <div className="p-4 w-1/4 border-l border-gray-300">
        <h2 className="text-xl font-bold mb-2">Skill Details</h2>
        {clickedSkill ? (
          <div className="p-2 bg-gray-100 rounded">
            <h3 className="font-bold">Clicked Skill</h3>
            <p className="font-semibold">{clickedSkill.name}</p>
            {clickedSkill.error ? (
              <p className="text-red-500">{clickedSkill.error}</p>
            ) : (
              <>
                <p><strong>Type:</strong> {clickedSkill.type || "N/A"}</p>
                <p><strong>Category:</strong> {clickedSkill.category || "N/A"}</p>
                <p><strong>Weightage:</strong> {clickedSkill.weightage || "N/A"}</p>
                {clickedSkill.job_roles && clickedSkill.job_roles.length > 0 && (
                  <>
                    <p className="mt-2 font-semibold">Job Roles:</p>
                    <ul className="list-disc list-inside">
                      {clickedSkill.job_roles.map((role, idx) => (
                        <li key={idx}>{role}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
            <button
              onClick={() => setClickedSkill(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Clear
            </button>
          </div>
        ) : (
          <p>No skill selected. Click a node for details.</p>
        )}
      </div>
    </div>
  );
};

export default SkillGraph;
