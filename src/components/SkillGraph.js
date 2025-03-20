import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CytoscapeComponent from 'react-cytoscapejs';

const SkillGraph = () => {
    const [skills, setSkills] = useState([]); // ✅ Ensure state is initialized

    useEffect(() => {
        axios.get('https://your-flask-api.onrender.com/get_skills')
            .then(response => {
                console.log("Fetched skills:", response.data.skills);  // ✅ Verify API response
                setSkills(response.data.skills);
            })
            .catch(error => console.error("Error fetching skills:", error));
    }, []);

    useEffect(() => {
        console.log("Updated skills state:", skills);  // ✅ Ensure state updates
    }, [skills]);

    return (
        <div className="skill-graph-container">
            <h1>Skill Graph</h1>
            {skills.length === 0 ? <p>Loading skills...</p> : null}  {/* ✅ Prevent empty render */}
            <CytoscapeComponent
                elements={CytoscapeComponent.normalizeElements(
                    skills.map((skill, index) => ({
                        data: { id: `skill-${index}`, label: skill }
                    }))
                )}
                layout={{ name: 'circle' }}  // ✅ Fix layout
                style={{ width: '80%', height: '80vh', border: '1px solid #ccc', background: '#f9f9f9' }}
                stylesheet={[
                    {
                        selector: 'node',
                        style: {
                            label: 'data(label)',
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#0074D9',
                            color: 'white',
                            textAlign: 'center',
                            fontSize: '12px'
                        }
                    }
                ]}
            />
        </div>
    );
};

export default SkillGraph;
