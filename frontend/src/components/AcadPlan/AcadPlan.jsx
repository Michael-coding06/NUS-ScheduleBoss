import './AcadPlan.css';
import React, { Children, useState } from 'react';
import { core_modules,recommended_modules, prereq_tree } from './data';

const AcadPlan = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [hoveredModule, setHoveredModule] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [selectedModules, setSelectedModules] = useState([]);
  // const [acceptModule, setAcceptModule] = useState(false);
  const [cancelModule, setCancelModule] = useState(false)
  const [currentSemester, setCurrentSemester] = useState(8);
  const [academicModules, setAcademicModules] = useState(core_modules)
  
  const handleModuleHover = (e, module) => {
    setShowInfo(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: rect.left + (rect.width / 2),
      y: rect.top + window.scrollY - 10
    });
    setHoveredModule(module);
  };

  const handleModuleLeave = () => {
    setShowInfo(false);
    setHoveredModule(null);
  };

  const handleModuleSelect = (module) => {
    if (!selectedModules.includes(module)) {
      console.log(prereq_tree[module.name])
      setSelectedModules([...selectedModules, module]);
      academicModules[`Sem ${currentSemester}`].push(module)
    }
  };

  const PrereqModules = (node) => {
    if (typeof node === 'string'){
      return <span className="module-option" key={node}>{node}</span>
    }
    
    if (typeof node === 'object' && !Array.isArray(node)) {
      return Object.entries(node).map(([operator, children], index) => (
        <div className="operator-container" key={`${operator}-${index}`}>
          <div className="operator-label">{operator}</div>
          <div className="prereq-group">
            {PrereqModules(children)}
          </div>
        </div>
      ));
    }
    
    if(Array.isArray(node)) {
      return node.map((item, index) => (
        <div key={index}>
          {PrereqModules(item)}
        </div>
      ))
    }
  }
  
  return (
    <div className='academic-planner'>
      <div className="header">
        <h1>Specialization: Agent AI</h1>
        <h2>Your current Year: 2</h2>
        
        <div className="recommendation-box">
          <div className="recommendation-title">
            Recommended Modules
          </div>
          <div className="recommendation-bar">
            {recommended_modules
              .filter(mod => !selectedModules.includes(mod))
              .map((mod, index) => (
                <div className="module-container" key={index}>
                  <span 
                    className="module-box"
                    onMouseEnter={(e) => handleModuleHover(e, mod)}
                    onMouseLeave={handleModuleLeave}
                    onClick={() => handleModuleSelect(mod)}
                  >
                    {mod.name}
                  </span>
                </div>
              ))}
          </div>
          <div className="preview-controls">
            <button 
              className="move-sem"
              onClick={() => setCurrentSemester(prev => prev === 1? 8 : prev-1)}
            >
              ← Prev Sem
            </button>
            <button 
              className="move-sem"
              onClick={() => setCurrentSemester(prev => prev === 8? 1 : prev+1)}
            >
              Next Sem →
            </button>
          </div>
        </div>
      </div>

      <div className="mod-planning">
        {Object.keys(academicModules).map((semester, index) => (
          <div className="mod-year" key={semester}>
            <h3 className={`year-header ${semester === `Sem ${currentSemester}` ? 'current-semester' : ''}`}>
              {semester}
            </h3>
            {academicModules[semester].map((mod, index) => (
              <div className="module-container" key={index}>
                <span 
                  className="selected"
                  onMouseEnter={(e) => handleModuleHover(e, mod)}
                  onMouseLeave={handleModuleLeave}
                >
                  {mod.name}
                </span>
              </div>
            ))}

            {semester === `Sem ${currentSemester}` && (
              <div className="prereq-tree">
                {PrereqModules(prereq_tree['CS4222'])}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {showInfo && hoveredModule && (
        <div
          className="module-info"
          style={{
            position: 'absolute',
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
          }}
        >
          {hoveredModule.info}
        </div>
      )}
    </div>
  );
};

export default AcadPlan;