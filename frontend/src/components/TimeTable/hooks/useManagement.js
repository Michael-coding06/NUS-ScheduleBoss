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
      ...span,
      name: modName,
      type: "module"
    }));
    const newSpans = highlightedSpans.filter(s => s.module !== modName);
    setHighlightedSpans([...newSpans, ...spans]);
  };

  const handleTimeSlotSelect = (span) => {
    if (selectedSpans.some(s => s.module === span.name && s.day === span.day && s.start === span.start)) {
      setSelectedSpans(selectedSpans.filter(s => !(s.name === span.name && s.day === span.day && s.start === span.start)));
    } else {
      setSelectedSpans([...selectedSpans, span]);
    }
    setHighlightedSpans([...selectedSpans, span]);
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
    handleTimeSlotSelect
  };
}