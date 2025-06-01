import { useState } from 'react';
import { days, timeSlots, moduleTimes } from '../data/data'
export default function useManagement() {
  const [modules, setModules] = useState([]);
  const [newModuleName, setNewModuleName] = useState("");

  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [taskDay, setTaskDay] = useState(days[0]);
  const [taskStart, setTaskStart] = useState(timeSlots[0]);
  const [taskEnd, setTaskEnd] = useState(timeSlots[1]);

  const [highlightedSpans, setHighlightedSpans] = useState([]);
  const [selectedSpans, setSelectedSpans] = useState([]);

  const handleModuleClick = (modName) => {
    const spans = moduleTimes[modName].map(span => ({
      ...span, module: modName
    }));
    const alreadySelected = selectedSpans.some(s => s.module === modName);
    if (!alreadySelected) {
      const newSpans = highlightedSpans.filter(s => s.module !== modName);
      setHighlightedSpans([...newSpans, ...spans]);
    }
  };

  const isTimeInSpan = (day, time, span) => (
    span.day === day && time >= span.start && time < span.end
  );
  


  return {
    // Modules
    modules, setModules,
    newModuleName, setNewModuleName,
    handleModuleClick,

    // Tasks
    tasks, setTasks,
    newTaskName, setNewTaskName,
    taskDay, setTaskDay,
    taskStart, setTaskStart,
    taskEnd, setTaskEnd,

    // Time Spans
    highlightedSpans, setHighlightedSpans,
    selectedSpans, setSelectedSpans,
    isTimeInSpan, 
  };
}