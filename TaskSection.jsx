const TasksSection = ({
  days,
  timeSlots,
  newTaskName,
  setNewTaskName,
  tasks,
  setTasks,
  taskDay,
  setTaskDay,
  taskStart,
  setTaskStart,
  taskEnd,
  setTaskEnd,
  dropdownOpen_task,
  setDropdownOpen_task,
  highlightedSpans,
  setHighlightedSpans,
  hiddenTasks,
  setHiddenTasks
}) => {
  const handleAddTask = () => {
    if (newTaskName.trim() && taskDay && taskStart && taskEnd) {
      const newTask = {
        module: newTaskName.trim(),
        day: taskDay,
        start: taskStart,
        end: taskEnd,
        type: "task"
      };
      setTasks([...tasks, newTask]);
      setHighlightedSpans([...highlightedSpans, newTask]);
      setNewTaskName('');
      setTaskDay(days[0]);
      setTaskStart(timeSlots[0]);
      setTaskEnd(timeSlots[1]);
      setDropdownOpen_task(false);
    }
  };

  const handleDeleteTask = (index, taskName) => {
    setTasks(tasks.filter((_, i) => i !== index));
    setHighlightedSpans(highlightedSpans.filter(span => span.module !== taskName));
  };

  const handleToggleTaskVisibility = (taskName) => {
    setHiddenTasks(prev =>
      prev.includes(taskName)
        ? prev.filter(t => t !== taskName)
        : [...prev, taskName]
    );
  };

  return (
    <div className="feature-card">
      <div className="task-section-header">
        Add your task here
        <button 
          className="dropdown-button" 
          onClick={() => setDropdownOpen_task(!dropdownOpen_task)}
        >
          ➕
        </button>
      </div>

      {dropdownOpen_task && (
        <div className="dropdown-menu">
          <div className="task-info">
            <div className="task-info-item">
              <div className="task-label">Name of your task:</div>
              <input type="text" className="task-input" placeholder='E.g. chores' value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} autoFocus/>
            </div>

            <div className="task-info-item">
              <div className="task-label">Day:</div>
              <select className="task-input"  value={taskDay} onChange={(e) => setTaskDay(e.target.value)}>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="task-info-item">
              <div className="task-label">Start Time:</div>
              <select className="task-input" value={taskStart} onChange={(e) => setTaskStart(e.target.value)}>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div className="task-info-item">
              <div className="task-label">End Time:</div>
              <select className="task-input" value={taskEnd} onChange={(e) => setTaskEnd(e.target.value)}>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <button onClick={handleAddTask}>
              Add Task
            </button>
          </div>
        </div>
      )}

      <div className="task-list">
        {tasks.map((task, index) => (
          <div key={index} className="task-card">
            <div className="color-box-task"></div>
            <div className="task-info-2">
              <div className="task-title">{task.module}</div>
            </div>
            <div className="mod-action">
              <button className="icon" onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(index, task.module);
                }}
              >
                🗑️
              </button>
              <button className="icon" onClick={(e) => {
                  e.stopPropagation();
                  handleToggleTaskVisibility(task.module);
                }}
              >
                🙈
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksSection;