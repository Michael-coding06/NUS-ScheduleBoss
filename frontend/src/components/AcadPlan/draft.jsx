import './AcadPlan.css';
import React, {useState, useEffect, useRef} from 'react';
import { recommended_modules, prereq_tree } from './data';

const AcadPlan = () => {
  const [showInfo, setShowInfo] = useState(false)
  const [hoveredModule, setHoveredModule] = useState(null)
  const [hoverPosition, setHoverPosition] = useState({x:0, y:0})
  const [selectedModules, setSelectedModules] = useState([])
  const [flickering, setFlickering] = useState(true) 
  return(
    <div className='acad-plan'>
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
              .map((mod, index) => {
              const isSelected = selectedModules.includes(mod)
              return(
                <div className="module-container" key = {index}>
                  <span 
                    className = {(isSelected ? 'selected': 'module-box')}
                    onMouseEnter={(e) => {
                      setShowInfo(true);
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoverPosition({
                        x: rect.left + (rect.width / 2), 
                        y: rect.top + window.scrollY - 10 
                      })
                      setHoveredModule(mod);
                    }}
                    onMouseLeave={(e) => {
                      setShowInfo(false);
                      setHoveredModule(null);
                    }}
                    onClick={(e) => {
                      setSelectedModules([...selectedModules, mod])
                    //   if(selectedModules.length == 4){
                    //     setFlickering(false) // since there's a delay, setting it to 4 will actually stop at 5
                    //   }
                    }}
                  >{mod.name}</span>
                </div>
              )
              })}
          </div>
        </div>
      </div>
      <div className="mod-planning">
        <div className="mod-year">
          <div>HIIII</div>
          {selectedModules.map((mod, index) => {
            <div className="module-container" key = {index}>
                <span 
                  className = 'selected'
                  onMouseEnter={(e) => {
                    setShowInfo(true);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoverPosition({
                      x: rect.left + (rect.width / 2), 
                      y: rect.top + window.scrollY - 10 
                    })
                    setHoveredModule(mod);
                  }}
                  onMouseLeave={(e) => {
                    setShowInfo(false);
                    setHoveredModule(null);
                  }}
                  onClick={(e) => {
                    setSelectedModules([...selectedModules, mod])
                    console.log(selectedModules)
                    if(selectedModules.length == 4){
                      setFlickering(false) // since there's a delay, setting it to 4 will actually stop at 5
                    }
                  }}
                >{mod.name}</span>
              </div>
          })}
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
  )
};

export default AcadPlan;