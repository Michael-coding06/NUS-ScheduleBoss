import './AcadPlan.css';
import React, { useState } from 'react';
import { recommended_modules, prereq_tree } from './data';

const AcadPlan = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [hoveredModule, setHoveredModule] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [selectedModules, setSelectedModules] = useState([]);

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
      setSelectedModules([...selectedModules, module]);
    }
  };

  const handleModuleRemove = (moduleToRemove) => {
    setSelectedModules(selectedModules.filter(mod => mod !== moduleToRemove));
  };

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
        </div>
      </div>

      <div className="mod-planning">
        <div className="mod-year">
          <h3 className="year-header">Semester 8</h3>
          {selectedModules.map((mod, index) => (
            <div className="module-container" key={index}>
              <span
                className="selected"
                onMouseEnter={(e) => handleModuleHover(e, mod)}
                onMouseLeave={handleModuleLeave}
                onClick={() => handleModuleRemove(mod)}
              >
                {mod.name}
              </span>
            </div>
          ))}
        </div>
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