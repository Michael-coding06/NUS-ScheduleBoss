import { useState } from 'react';

export default function useUI(highlightedSpans, isTimeInSpan, selectedSpans) {
  const [activeSection, setActiveSection] = useState('Modules');
  const [customSections, setCustomSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen_task, setDropdownOpen_task] = useState(false);

  const [isChecked, setIsChecked] = useState(true);
  const [isTaskChecked, setIsTaskChecked] = useState(true);
  const [addingNewSection, setAddingNewSection] = useState(false);

  const [hiddenModules, setHiddenModules] = useState([]);
  const [hiddenTasks, setHiddenTasks] = useState([]);

  const isSpanSelected = (span) => {
    return selectedSpans.some(sel =>
      sel.day === span.day &&
      sel.start === span.start &&
      sel.end === span.end &&
      sel.name === span.name
    );
  };

  const isModuleSelected = (modName) => {
    return selectedSpans.some(s => s.module === modName);
  };

  const sectionVisibility = {
        module: isChecked,
        task: isTaskChecked,
    };

  const visibleHighlightedSpans = highlightedSpans.filter(span => {
      const type = span.type || 'module';
      // if (isSpanSelected(span)){ return true;}
      if(type === 'module'){return !hiddenModules.includes(span.name) && !sectionVisibility[type];}  
      if(type === 'task'){return !hiddenTasks.includes(span.name) && !sectionVisibility[type]}  
      return !sectionVisibility[type];

  });

  const findSpanForCell = (day, time) => {
    return visibleHighlightedSpans.find(span => isTimeInSpan(day, time, span));
  };


  return {
    activeSection, setActiveSection,
    customSections, setCustomSections,
    newSectionName, setNewSectionName,

    dropdownOpen, setDropdownOpen,
    dropdownOpen_task, setDropdownOpen_task,

    isChecked, setIsChecked,
    isTaskChecked, setIsTaskChecked,
    addingNewSection, setAddingNewSection,

    isSpanSelected,
    isModuleSelected,
    findSpanForCell,
    hiddenModules,
    setHiddenModules,
    hiddenTasks,
    setHiddenTasks,
    sectionVisibility,
    visibleHighlightedSpans
  };
}