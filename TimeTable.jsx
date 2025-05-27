import React, {use, useState} from 'react'
import './TimeTable.css'
const Timetable = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
    const moduleTimes = {
    "CS1010E": [
        { day: "Tue", start: "10:00", end: "12:00" },
        { day: "Thu", start: "13:00", end: "16:00" }
        ],
    "MA1508E": [{ day: "Mon", start: "17:00", end: "18:00" },
                { day: "Fri", start: "09:00", end: "14:00" }
    ],
    }
    const [isChecked, setIsChecked] = useState(true);
    const [activeSection, setActiveSection] = useState('Modules');

    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    const [customSections, setCustomSections] = useState([]);
    const [addingNewSection, setAddingNewSection] = useState(false);
    const [newSectionName, setNewSectionName] = useState("");

    const [newModuleName, setNewModuleName] = useState("");
    const [modules, setModules] = useState([]);

    const [highlightedSlots, setHighlightedSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [highlightedSpans, setHighlightedSpans] = useState([]);
    const [selectedSpans, setSelectedSpans] = useState([]); 

    const [dropdownOpen_task, setDropdownOpen_task] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");
    const [tasks, setTasks] = useState([]);
    const [taskDay, setTaskDay] = useState(days[0]);
    const [taskStart, setTaskStart] = useState(timeSlots[0]);
    const [taskEnd, setTaskEnd] = useState(timeSlots[1]);
    const [isTaskChecked, setIsTaskChecked] = useState(true);

    const handleModuleClick = (modName) => {
        const spans = moduleTimes[modName].map(span => ({
            ...span, module : modName
        }));
        
        const alreadySelected = selectedSpans.some(s => s.module === modName);
        if(!alreadySelected){
            const newSpans = highlightedSpans.filter(s => s.module !== modName);
            setHighlightedSpans([...newSpans, ...spans]);
        }
    };

    const isTimeInSpan = (day, time, span) => (
        span.day === day && time >= span.start && time < span.end
    );

    const sectionVisibility = {
        module: isChecked,
        task: isTaskChecked,
    };

    const visibleHighlightedSpans = highlightedSpans.filter(span => {
        const type = span.type || 'module';
        return !sectionVisibility[type];
    });
    const findSpanForCell = (day, time) => {
        return visibleHighlightedSpans.find(span => isTimeInSpan(day, time, span));
    };
    const isSpanSelected = (span) => {
        return selectedSpans.some(sel =>
            sel.day === span.day &&
            sel.start === span.start &&
            sel.end === span.end &&
            sel.module === span.module
        );
    };
    const isModuleSelected = (modName) => {
        return selectedSpans.some(s => s.module === modName);
    }
    return(
        <div className="timetable">
            <h1 className="header">My Schedule</h1>
            <h2 className="header">Week 3</h2>
            <div className='content-wrapper'>
                <table>
                    <thead>
                        <th></th>
                        {days.map((day) => (
                            <th key = {day}>{day}</th>
                        ))}
                    </thead>
                    <tbody>
                    {timeSlots.map((time) => (
                        <tr key={time}>
                            <td>{time}</td>
                            {days.map((day) => {
                                const span = findSpanForCell(day, time);
                                const isSelected = span && isSpanSelected(span);
                                const isModuleAlreadySelected = span && isModuleSelected(span.module);
                                const isHighlightable = span && !isSelected  && !isModuleAlreadySelected;

                                return (
                                    <td
                                        key={`${day}-${time}`}
                                        onClick={() => {
                                            if (isHighlightable) {
                                                setSelectedSpans([...selectedSpans, span ]);
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
                                        {isSelected && (  <div className={`span-name ${span.type === 'task' ? 'task-span' : ''}`}>
                                            {span.module}</div>)}
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
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="dropdown-button">▼</button>
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                {["Modules", "Tasks", "Meetings", ...customSections].map(item => (
                                    <div key={item} className="dropdown-item" onClick={() => {
                                        setActiveSection(item);
                                        setDropdownOpen(false);
                                    }}>{item}</div>
                                ))}
                                <input type="text" className="dropdown-input" placeholder="Others.." value={newSectionName}
                                    onChange={(e) => setNewSectionName(e.target.value)} onKeyDown={(e) => {
                                        if (e.key === 'Enter' && newSectionName.trim()) {
                                        const newName = newSectionName.trim()
                                        setCustomSections([...customSections, newName]);
                                        setActiveSection(newName);
                                        setNewSectionName('');
                                        setAddingNewSection(false);
                                        setDropdownOpen(false);
                                        } else if (e.key === 'Escape'){ setAddingNewSection(false); setNewSectionName('')}
                                    }} autoFocus/>
                            </div>
                        )}
                        </div>
                    </div>

                {activeSection === "Modules" && 
                    <><input className="mod-search" type="text" placeholder="Search module"
                    value = {newModuleName} onChange={(e) => setNewModuleName(e.target.value)} onKeyDown={(e) =>{
                       if(e.key === "Enter" && newModuleName.trim()){
                         const moduleName = newModuleName.trim();
                         setModules([...modules, {name: moduleName, subtitle: "No Exam • 4 Units"}]);
                         setNewModuleName('');
                       } 
                    }}autoFocus/>   
                    {modules.map((mod, index) => (
                        <div key ={index} className="mod-card" onClick={() =>handleModuleClick(mod.name)}>
                            <div className="color-box"></div>
                            <div className="mod-info">
                                <div className="mod-title">{mod.name}</div>
                                <div className="mod-sub">{mod.subtitle}</div>
                            </div>
                            <div className="mod-action">
                                <button className="icon" onClick={(e) => {
                                    e.stopPropagation();
                                    setModules(modules.filter((_, i) => i !== index));
                                    setSelectedSpans(selectedSpans.filter(span => span.module !== mod.name));
                                    setHighlightedSpans(highlightedSpans.filter(span => span.module !== mod.name));
                                }}> 🗑️</button>
                                <button className="icon">🙈</button>
                            </div>
                        </div>
                    ))}
                    <div className="mod-card">
                        <div className="color-box"></div>
                        <div className="mod-info">
                        <div className="mod-title">CS1010E: Programming Methodology</div>
                        <div className="mod-sub">No Exam • 4 Units</div>
                        </div>
                        <div className="mod-action">
                        <button className="icon">🗑️</button>
                        <button className="icon">🙈</button>
                        </div>
                    </div>
                    </>
                }

                {activeSection === "Tasks" && (
                    <div className="feature-card">Add your task here
                        <button className = "dropdown-button" onClick={() => setDropdownOpen_task(!dropdownOpen_task)}>➕</button>
                        {dropdownOpen_task && (
                            <div className="dropdown-menu">
                                <div className="task-info">
                                    <div className="task-info-item">
                                    <div className="task-label">Name of your task:</div>
                                    <input type="text" className="task-input" placeholder='E.g. chores'
                                    value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} autoFocus/>
                                    </div>

                                    <div className="task-info-item">
                                    <div className="task-label">Day:</div>
                                    <select className = "task-input" value={taskDay} onChange={(e) => setTaskDay(e.target.value)}>
                                        {days.map(day => <option key={day} value={day}>{day}</option>)} 
                                    </select>
                                    </div>

                                    <div className="task-info-item">
                                    <div className="task-label">Start Time:</div>
                                    <select className = "task-input" value={taskStart} onChange={(e) => setTaskStart(e.target.value)}>
                                        {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                                    </select>
                                    </div>

                                    <div className="task-info-item">
                                    <div className="task-label">End Time:</div>
                                    <select className = "task-input" value={taskEnd} onChange={(e) => setTaskEnd(e.target.value)}>
                                        {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                                    </select>
                                    </div>

                                    <button onClick={() => {
                                        if (newTaskName.trim() && taskDay && taskStart && taskEnd) {
                                            const newTask = {
                                                module: newTaskName.trim(),
                                                day: taskDay,
                                                start: taskStart,
                                                end: taskEnd,
                                                type: "task"
                                            
                                            }; setTasks([...tasks, newTask]);

                                            setHighlightedSpans([...highlightedSpans, newTask])
                                            setNewTaskName('');
                                            setTaskDay(days[0]);
                                            setTaskStart(timeSlots[0]);
                                            setTaskEnd(timeSlots[1]);
                                            setDropdownOpen_task(false);
                                        }
                                    }}>Add Task</button>

                                </div>
                            </div>
                        )}
                        {tasks.map((task, index) => (
                                        <div key = {index} className="task-card">
                                            <div className="color-box-task"></div>
                                            <div className="task-info-2">
                                                <div className="task-title">{task.module}</div>
                                            </div>
                                            <div className="mod-action">
                                                <button className="icon" onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTasks(tasks.filter((_, i) => i !== index));
                                                    setHighlightedSpans(selectedSpans.filter(span => span.module !== task.module))
                                                }}> 🗑️</button>
                                                <button className="icon">🙈</button>
                                            </div>
                                        </div>
                            ))
                        }
                    </div>
                )}

                {activeSection === "Meetings" && (
                    <div className="feature-card">🎬 Meeting times</div>
                )}
                </div>

                <div className="calendar">
                    <h2 className="header">My Calendar</h2>
                    <div 
                        className={`calendar-item ${isChecked ? 'active' : ''}`} 
                        onClick={() => setIsChecked(!isChecked)}>
                        <div className="color-box"></div>
                        <div className="item">Modules</div>
                    </div>
                    <div 
                        className={`calendar-item ${isTaskChecked ? 'active' : ''}`} 
                        onClick={() => setIsTaskChecked(!isTaskChecked)}>
                        <div className="color-box-task"></div>
                        <div className="item">Tasks</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timetable