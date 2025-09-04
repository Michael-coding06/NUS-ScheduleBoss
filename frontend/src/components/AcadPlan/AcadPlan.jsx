import './AcadPlan.css';
import React, { useEffect, useState } from 'react';
import { core_modules, recommended_modules, prereq_tree } from './data';
import {moduleDetails} from '../Timetable/data/data'
const AcadPlan = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [hoveredModule, setHoveredModule] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [selectedModules, setSelectedModules] = useState([]);
  const [currentSemester, setCurrentSemester] = useState(8);
  const [academicModules, setAcademicModules] = useState(core_modules);
  const [showPrereq, setShowPrereq] = useState(false);
  const [clickedModule, setClickedModule] = useState(null);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [lineCoords, setLineCoords] = useState(null);
  const [showOr, setShowOr] = useState(true)
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
      academicModules[`Sem ${currentSemester}`].push(module);
    }
  };

  const handleModuleOptionClick = (module) => {
    const mod = {name: module, info: moduleDetails[module]}
    academicModules[`Sem ${currentSemester}`].push(mod);
    // setShowOr(false)
  }

  const handleModuleClick = (e, module) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: rect.left + (rect.width / 2),
      y: rect.top + window.scrollY + (rect.height / 2) // Use center of module
    });
    setShowPrereq(!showPrereq);
    setClickedModule(module.name);
  };
  const PrereqModules = (node, i) => {
    console.log(i)
    if (typeof node === 'string') {
      return <span className= "module-option" key={node} 
        onMouseEnter={(e) => handleModuleHover(e, node)}
        onMouseLeave={handleModuleLeave}
        onClick={(e) => handleModuleOptionClick(node)}
      >{node}</span>;
    }
    if (typeof node === 'object' && !Array.isArray(node)) {
      return Object.entries(node).map(([operator, children], index) => (
        <div className="operator-container" key={`${operator}-${index}`}>
          <div className={operator === 'and' ? 'prereq-group-and' : 'prereq-group-or'}>
            {PrereqModules(children, i +1)}
          </div>
        </div>
      ));
    }
    
    if (Array.isArray(node)) {
      return node.map((item, index) => (
        <div key={index}>
          {PrereqModules(item, i)}
        </div>
      ));
    }
  };
  useEffect(() => {
    if (showPrereq && clickPosition.x !== 0) {
      setTimeout(() => {
        const prereqBoxes = document.querySelectorAll('.prereq-group-or');
        const connections = [];
        
        prereqBoxes.forEach((prereqBox, index) => {
          const prereqRect = prereqBox.getBoundingClientRect();
          const prereqBottomCenter = {
            x: prereqRect.left + (prereqRect.width / 2),
            y: prereqRect.bottom + window.scrollY 
          };
          
          connections.push({
            x1: clickPosition.x,
            y1: clickPosition.y,
            x2: prereqBottomCenter.x,
            y2: prereqBottomCenter.y,
            id: `line-${index}`
          });
        });
        
        if (connections.length === 0) {
          const prereqTree = document.querySelector('.prereq-box-or');
          if (prereqTree) {
            const treeRect = prereqTree.getBoundingClientRect();
            const treeBottomCenter = {
              x: treeRect.left + (treeRect.width / 2),
              y: treeRect.bottom + window.scrollY
            };
            
            connections.push({
              x1: clickPosition.x,
              y1: clickPosition.y,
              x2: treeBottomCenter.x,
              y2: treeBottomCenter.y,
              id: 'line-tree'
            });
          }
        }
        
        setLineCoords(connections);
      }, 100); 
    } else {
      setLineCoords(null);
    }
  }, [showPrereq, clickPosition]);

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
              onClick={() => setCurrentSemester(prev => prev === 1 ? 8 : prev - 1)}
            >
              ← Prev Sem
            </button>
            <button 
              className="move-sem"
              onClick={() => setCurrentSemester(prev => prev === 8 ? 1 : prev + 1)}
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
                  className="acad-selected"
                  onMouseEnter={(e) => handleModuleHover(e, mod)}
                  onMouseLeave={handleModuleLeave}
                  onClick={(e) => handleModuleClick(e, mod)}
                >
                  {mod.name}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {lineCoords && showPrereq && (
        <svg
          className="connection-line"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <polygon
                points="0 0, 8 4, 0 8"
                fill="#666"
              />
            </marker>
          </defs>
          {lineCoords.map((line, index) => {
            const point1X = line.x1;
            const point1Y = (line.y1 + line.y2)/2.1  ;
            
            const point2X = line.x2;
            const point2Y = (line.y1 + line.y2)/2.1;
            
            return (
              <g key={line.id || index}>
                <path
                  d={`M ${line.x1} ${line.y1} L ${point1X} ${point1Y} L ${point2X} ${point2Y} L ${line.x2} ${line.y2}`}
                  stroke="#666"
                  strokeWidth="1.5"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className="connection-path"
                />
                <circle cx={point1X} cy={point1Y} r="2" fill="#666" className="connection-dot" style={{ animationDelay: `${index * 0.1}s` }} />
                <circle cx={point2X} cy={point2Y} r="2" fill="#666" className="connection-dot" style={{ animationDelay: `${index * 0.15}s` }} />
              </g>
            );
          })}
        </svg>
      )}

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
          {typeof hoveredModule !== 'string' ? hoveredModule.info : moduleDetails[hoveredModule]}
        </div>
      )}

      {showPrereq && clickedModule && (
        <div 
          className="prereq-tree"
          style={{
            position: 'absolute',
            left: `${clickPosition.x}px`,
            top: `${clickPosition.y}px`,
            transform: 'translateX(-55%) translateY(-200%)', 
          }}
        >
          {PrereqModules(prereq_tree[clickedModule], 0)}
        </div>
      )}
    </div>
  );
};

export default AcadPlan;