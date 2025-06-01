import React from 'react';
import './Timetable.css';
import { days, timeSlots, moduleTimes } from './data/data';
import useManagement from './hooks/useManagement';
import useUI from './hooks/useUI';
import ModulesSection from './ModuleSection';
import TasksSection from './TaskSection';

const Timetable = () => {
  const {
    modules,
    setModules,
    tasks,
    setTasks,
    setHighlightedSpans,
    selectedSpans,
    setSelectedSpans,
    newModuleName,
    setNewModuleName,
    newTaskName,
    setNewTaskName,
    taskDay,
    setTaskDay,
    taskStart,
    setTaskStart,
    taskEnd,
    setTaskEnd,
    handleModuleClick,
    highlightedSpans,
    isTimeInSpan,
  } = useManagement();

  const {
    findSpanForCell,
    isSpanSelected,
    isModuleSelected,
    activeSection,
    setActiveSection,
    dropdownOpen,
    setDropdownOpen,
    dropdownOpen_task,
    setDropdownOpen_task,
    customSections,
    setCustomSections,
    newSectionName,
    setNewSectionName,
    isChecked,
    setIsChecked,
    isTaskChecked,
    setIsTaskChecked,
    hiddenModules,
    setHiddenModules,
    hiddenTasks,
    setHiddenTasks,
  } = useUI(highlightedSpans, isTimeInSpan, selectedSpans);

  return (
    <div className="timetable">
      <h1 className="header">My Schedule</h1>
      <h2 className="header">Week 3</h2>
      
      <div className='content-wrapper'>
        <table>
          <thead>
            <tr>
              <th></th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td>{time}</td>
                {days.map((day) => {
                  const span = findSpanForCell(day, time);
                  const isSelected = span && isSpanSelected(span);
                  const isModuleAlreadySelected = span && isModuleSelected(span.module);
                  const isHighlightable = span && !isSelected && !isModuleAlreadySelected;

                  return (
                    <td
                      key={`${day}-${time}`}
                      onClick={() => {
                        if (isHighlightable) {
                          setSelectedSpans([...selectedSpans, span]);
                        }
                      }}
                      className={
                        isSelected
                          ? 'selected'
                          : isHighlightable
                          ? 'highlight'
                          : ''
                      }
                    >
                      {isSelected && (
                        <div className={`span-name ${span.type === 'task' ? 'task-span' : ''}`}>
                          {span.module}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="add-mod">
          <div className="section-header">
            <h2 className="header">{activeSection}</h2>
            <div className="dropdown-container">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="dropdown-button"
              >
                ▼
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  {["Modules", "Tasks", "Meetings", ...customSections].map(item => (
                    <div 
                      key={item} 
                      className="dropdown-item" 
                      onClick={() => {
                        setActiveSection(item);
                        setDropdownOpen(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                  <input 
                    type="text" 
                    className="dropdown-input" 
                    placeholder="Others.." 
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)} 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSectionName.trim()) {
                        const newName = newSectionName.trim();
                        setCustomSections([...customSections, newName]);
                        setActiveSection(newName);
                        setNewSectionName('');
                        setDropdownOpen(false);
                      } else if (e.key === 'Escape') {
                        setNewSectionName('');
                      }
                    }} 
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>

          {activeSection === "Modules" && (
            <ModulesSection
              newModuleName={newModuleName}
              setNewModuleName={setNewModuleName}
              modules={modules}
              setModules={setModules}
              handleModuleClick={handleModuleClick}
              selectedSpans={selectedSpans}
              setSelectedSpans={setSelectedSpans}
              highlightedSpans={highlightedSpans}
              setHighlightedSpans={setHighlightedSpans}
              hiddenModules={hiddenModules}
              setHiddenModules={setHiddenModules}
            />
          )}

          {activeSection === "Tasks" && (
            <TasksSection
              days={days}
              timeSlots={timeSlots}
              newTaskName={newTaskName}
              setNewTaskName={setNewTaskName}
              tasks={tasks}
              setTasks={setTasks}
              taskDay={taskDay}
              setTaskDay={setTaskDay}
              taskStart={taskStart}
              setTaskStart={setTaskStart}
              taskEnd={taskEnd}
              setTaskEnd={setTaskEnd}
              dropdownOpen_task={dropdownOpen_task}
              setDropdownOpen_task={setDropdownOpen_task}
              highlightedSpans={highlightedSpans}
              setHighlightedSpans={setHighlightedSpans}
              hiddenTasks={hiddenTasks}
              setHiddenTasks={setHiddenTasks}
            />
          )}

          {activeSection === "Meetings" && (
            <div className="feature-card">🎬 Meeting times</div>
          )}
        </div>

        <div className="calendar">
          <h2 className="header">My Calendar</h2>
          <div
            className={`calendar-item ${isChecked ? 'active' : ''}`}
            onClick={() => setIsChecked(!isChecked)}
          >
            <div className="color-box"></div>
            <div className="item">Modules</div>
          </div>
          <div
            className={`calendar-item ${isTaskChecked ? 'active' : ''}`}
            onClick={() => setIsTaskChecked(!isTaskChecked)}
          >
            <div className="color-box-task"></div>
            <div className="item">Tasks</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;