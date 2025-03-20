import React, { useEffect, useState, useRef  } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import axios from 'axios';

const SkillGraph = () => {
    const [elements, setElements] = useState([]);
    const cyRef = useRef(null);

    useEffect(() => {
        axios.get('https://flask-auradb-api.onrender.com/get_skills_graph')
            .then(response => {
                const { nodes, edges } = response.data;

                const formattedNodes = nodes.map(node => ({
                    data: { id: node.id, label: node.label }
                }));

                const formattedEdges = edges.map(edge => ({
                    data: { source: edge.source, target: edge.target }
                }));

                setElements([...formattedNodes, ...formattedEdges]);
            })
            .catch(error => console.error('Error fetching skills:', error));
    }, []);

     // Force Cytoscape to run layout after elements are set
     useEffect(() => {
        if (cyRef.current && elements.length > 0) {
            const layout = cyRef.current.layout({
                name: "cose",
                fit: true,
                padding: 50,
                nodeRepulsion: 5000,  // Stronger repulsion for better spacing
                idealEdgeLength: 150,  // Ensures proper edge spacing
                edgeElasticity: 0.5,
                gravity: 0.3
            });
            layout.run();  // Runs layout properly after elements update
        }
    }, [elements]);  // Runs when elements update

    return (
        <div style={{ 
            height: "90vh",  // Use 90% of viewport height
            width: "calc(100% - 500px)",  // Adjust width considering sidebar width
            marginLeft: "320px",  // Shift graph right to account for sidebar
            marginTop: "10px",  // Add small spacing from navbar
            marginRight: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
         }}>
            <CytoscapeComponent 
                cy={(cy) => { cyRef.current = cy; }}  // Store Cytoscape instance
                elements={elements}
                style={{  width: "100%", height: "100%", border: "1px solid #ccc", background: "#f9f9f9"  }}
                layout={{
                    name: "cose",  // Organic layout for spreading out nodes
                    fit: true,  // Ensures all nodes fit in the viewport
                    padding: 30,  // Adds padding to prevent edge clipping
                    nodeRepulsion: 4000,  // Higher value pushes nodes apart
                    idealEdgeLength: 200,  // Increases spacing between connected nodes
                    edgeElasticity: 0.2,  // Keeps edges flexible
                    gravity: 0.5  // Ensures better centering
                }}
                stylesheet={[
                    {
                        selector: "node",
                        style: {
                            "background-color": "#007bff",
                            content: "data(label)",
                            "text-valign": "top",
                            "text-halign": "bottom",
                            color: "#000000",
                            "font-size": "10px",
                            //"text-outline-width": 2,
                            //"text-outline-color": "#007bff",
                            width: 20,  // Bigger node size for better visibility
                            height: 20,
                        }
                    },
                    {
                        selector: "edge",
                        style: {
                            width: 2,
                            "line-color": "#ccc",
                            "target-arrow-color": "#ccc",
                            "target-arrow-shape": "triangle",
                            "curve-style": "bezier",
                        }
                    }
                ]}
            />
        </div>
    );
};

export default SkillGraph;
