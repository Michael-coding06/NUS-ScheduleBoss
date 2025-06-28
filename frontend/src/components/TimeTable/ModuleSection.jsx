const ModulesSection = ({
  newModuleName,
  setNewModuleName,
  modules,
  setModules,
  handleModuleClick,
  selectedSpans,
  setSelectedSpans,
  highlightedSpans,
  setHighlightedSpans,
  hiddenModules,
  setHiddenModules
}) => {
  return (
    <>
      <input  className="mod-search" type="text" placeholder="Search module" value={newModuleName} onChange={(e) => setNewModuleName(e.target.value)} onKeyDown={(e) => {
          if (e.key === "Enter" && newModuleName.trim()) {
            const moduleName = newModuleName.trim();
            setModules([...modules, {name: moduleName, subtitle: "No Exam • 4 Units"}]);
            setNewModuleName('');
          }
        }}
        autoFocus
      />
      
      {modules.map((mod, index) => (
        <div key={index} className="mod-card" onClick={() => handleModuleClick(mod.name)}>
          <div className="color-box"></div>
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
                const modName = mod.name;
                setHiddenModules(prev =>
                  prev.includes(modName)
                    ? prev.filter(m => m !== modName)
                    : [...prev, modName]
                );
              }}
            >
              🙈
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default ModulesSection;