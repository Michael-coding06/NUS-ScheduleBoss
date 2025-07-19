import { useState } from 'react';
import {moduleTimes} from './data/data'
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
    // const modules = highlightedSpans.filter(span => span.type === 'module');
    // const filteredModules = modules.filter(module =>
    //     module.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    // const sectionSpans = selectedSpans.filter(span => span.type === 'module')
    return (
        <div>
            <input  className="mod-search" type="text" placeholder="Search module" value={newModuleName} onChange={(e) => setNewModuleName(e.target.value)} onKeyDown={(e) => {
                if (e.key === "Enter" && newModuleName.trim()) {
                    const moduleName = newModuleName.trim();
                    if (modules.some(mod => mod.name === moduleName)) {
                        return;
                    }
                    setModules([...modules, {
                        name: moduleName, 
                        subtitle: "No Exam • 4 Units",
                        visibility: { default: true }
                    }]);
                    setNewModuleName('');

                    if (moduleTimes[moduleName]) {
                        console.log('find the module')
                        const spans = moduleTimes[moduleName].map(span => ({
                            ...span,
                            name: moduleName,
                            type: "module",
                            visibility: { default: true }
                        }));
                        setHighlightedSpans([...highlightedSpans, ...spans]);
                        // setSelectedSpans([...selectedSpans, ...spans])
                    }
                }
            }}
            autoFocus
            />

            {modules.map((mod, index) => (
                <div key={index} className="mod-card">
                <div className="color-box" style={{ backgroundColor: sectionColors['Module']?.box}} />
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

