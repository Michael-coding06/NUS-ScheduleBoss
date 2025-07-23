import { useState } from 'react';
import {moduleTimes, } from './data/data'
import { moduleDetails } from './data/data';
const ModuleSection = ({
    highlightedSpans,
    setHighlightedSpans,
    selectedSpans,
    setSelectedSpans,
    sectionColors,
    modules, 
    setModules,
    // hiddenSpans,
    // setHiddenSpans,
}) => {
    const [newModuleName, setNewModuleName] = useState("");
    const [showError, setShowError] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const showTimeSlots = (moduleName) =>{
        const spans = moduleTimes[moduleName].map(span => ({
                ...span,
                name: moduleName,
                type: "module",
                visibility: { default: true },
                details: moduleDetails[moduleName]
            }));
        setHighlightedSpans([...highlightedSpans, ...spans]);
    }
    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setShowDropdown(false);
            return;
        }
        if (e.key === "Enter" && newModuleName.trim()) {
            setNewModuleName('');
            setShowDropdown(false);
            const moduleName = newModuleName.trim();
            if (modules.some(mod => mod.name === moduleName)) {
                return;
            }
            if(!(moduleName in moduleTimes)){
                console.log('NOT FOUND')
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 2000);
                return;
            } else {setShowError(false)}
            showTimeSlots(moduleName);
            setModules([...modules, {
                name: moduleName, 
                subtitle: "No Exam • 4 Units",
                visibility: { default: true },
                details: moduleDetails[moduleName]
            }]);
            
        }
        
    };
    const filteredModules = Object.keys(moduleTimes).filter(modName => modName.toLowerCase().startsWith(newModuleName.toLocaleLowerCase()) && !modules.some(mod => mod.name === modName))

    return (
        <div>
            <input  className="mod-search" type="text" placeholder="Search module" value={newModuleName} 
            onChange={(e) => {
                setNewModuleName(e.target.value);
                if(e.target.value.length >=2) {
                    setShowDropdown(true);
                }else {setShowDropdown(false)}
            }} 
            onKeyDown={handleKeyDown}
            autoFocus
            />
            {showError && (
                <div className="mod-error">Module not found!</div>
            )}

            {showDropdown && filteredModules.length > 0 && (
                <div className='dropdown-mod'>
                {filteredModules.map((moduleName, index) => (
                    <div
                    key={moduleName}
                    className='dropdown-mod-module'
                    onClick={() => {setModules([...modules, {
                        name: moduleName, 
                        subtitle: "No Exam • 4 Units",
                        visibility: { default: true },
                        details: moduleDetails[moduleName]
                        }]);
                        setShowDropdown(false);
                        showTimeSlots(moduleName);
                        setNewModuleName('');
                    }}
                    >
                    {moduleName}
                    </div>
                ))}
                </div>
            )}

            {modules.map((mod, index) => (
                <div key={index} className="mod-card">
                <div className="color-box" style={{ 
                    backgroundColor: sectionColors['Module'].box }} />
                <div className="mod-info">
                    <div className="mod-title">{mod.name}</div>
                    <div className="mod-sub">{mod.subtitle}</div>
                </div>
                <div className="mod-action">
                    <button className="icon" onClick={(e) => {
                        e.stopPropagation();
                        setModules(modules.filter((_, i) => i !== index));
                        setSelectedSpans(selectedSpans.filter(span => span.name !== mod.name));
                        setHighlightedSpans(highlightedSpans.filter(span => span.name !== mod.name));
                    }}
                    >
                    🗑️
                    </button>
                    <button className="icon" onClick={(e) => {
                        e.stopPropagation();
                        setModules(modules.map((module, i) => {
                            if (i === index) {
                                return {
                                    ...module,
                                    visibility: {
                                        ...module.visibility,
                                        default: !module.visibility.default
                                    }
                                };
                            }
                            return module;
                        }));

                        const updateSpanVisibility = (spans) => {
                            return spans.map(span => {
                                if (span.name === mod.name && span.type === 'module') {
                                    return {
                                        ...span,
                                        visibility: {
                                            ...span.visibility,
                                            default: !mod.visibility.default
                                        }
                                    };
                                }
                                return span;
                            });
                        };
                        setSelectedSpans(prevSpans => updateSpanVisibility(prevSpans));
                        setHighlightedSpans(prevSpans => updateSpanVisibility(prevSpans));
                    }}
                    >
                    {mod.visibility.default ? '🙈' : '👁️'}
                    </button>
                </div>
                </div>
            ))};
      </div>
    );
};
export default  ModuleSection;

