import React, { useEffect, useRef, useState} from 'react';
import './Timetable.css';
import { days, timeSlots, moduleTimes } from './data/data';
import useManagement from './hooks/useManagement';
import useUI from './hooks/useUI';
import ModulesSection from './ModuleSection';
import TasksSection from './TaskSection';
import { useNavigate } from 'react-router-dom';
import GameExperience from '../GameModel/GameExperience';
import chat_icon from '../ChatBot/logo.png';
import Chat from '../ChatBot/Chat';
const Timetable = ({token}) => {
  const [showChat, setShowChat] = useState(false)
  const duplicateBookRef = useRef();
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
    handleTimeSlotSelect
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

  let navigate = useNavigate()
  function handleLogout(){
    sessionStorage.removeItem('token')
    navigate('/signup')
  }

  let userEmail = token.user.user_metadata.email;
  const BACKEND_URL = 'https://backend-server-r1tg.onrender.com';
  // const BACKEND_URL = 'http://localhost:3001'
  const handleSave = async () => {
    console.log(userEmail);
    const response = await fetch(`${BACKEND_URL}/api/timetable`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userEmail,
          spans: selectedSpans 
        }),
    });
    const result = await response.json();
    console.log(result.message);
  };
  const handleGet = async () => {
    const response = await fetch(`${BACKEND_URL}/api/timetable_data`, { method: 'GET' });
    const data = await response.json();
    console.log('API Response:', data);  
  
    let spans = data.receivedspans[userEmail];
    if (!Array.isArray(spans)) {
      spans = [];
    }
    console.log(`User: ${userEmail}, Spans:`,  JSON.stringify(spans));
    setSelectedSpans(spans);
    setHighlightedSpans(spans);
    const mod = spans
      .filter(span => span.type === 'module')
      .map(module => ({
        name: module.name,
        subtitle: 'No Exam • 0 Units' 
      }));
      setModules(mod)
    const task = spans
      .filter(span => span.type === 'task')
      .map(tasks => ({
        name: tasks.name,
      }));
      setTasks(task)
    console.log(`Mods: ${JSON.stringify(mod)} and tasks: ${JSON.stringify(task)}`)

  };
  const handleDuplicate = () => {
    duplicateBookRef.current();
  }

  useEffect(() => {
    handleGet();
  }, []);
  return (
    <div className="timetable">
      <div className="header-row">
      <h1 className="header">{token.user.user_metadata.fullname}'s Schedule</h1>
      {/* <h1 className="header">{token.user.user_metadata.email}'s Schedule</h1> */}
      {/* <h2 className="header">Week 3</h2> */}
      <div className='div-button'>
          <button onClick={handleLogout} className='submit-2'>Log Out</button>
          <button onClick = {handleSave} className='submit-2'>Save</button>
          {/* <button onClick = {handleGet} className='submit-2'>Get</button> */}
          {/* <button onClick = {handleDuplicate} className='submit-2'>+1</button> */}
      </div>
      </div>
      <div className='content-wrapper'>
        <div className="table-wrapper">
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
                    const isModuleAlreadySelected = span && isModuleSelected(span.name);
                    const isHighlightable = span && !isSelected && !isModuleAlreadySelected;
                    return (
                      <td
                        key={`${day}-${time}`}
                        onClick={() => {
                          if (isHighlightable) {
                            handleTimeSlotSelect(span)
                            setSelectedSpans([...selectedSpans, span]);
                          }
                        }}
                        className={
                            (isSelected ? 'selected' : '') +
                            (isHighlightable ? 'highlight' : '') +
                            ((isHighlightable || isSelected) && time === span?.start ? ' timeslot-start' : '')
                        }
                      >
                        {isSelected && (
                          <div className={`span-name ${span.type === 'task' ? 'task-span' : ''}`}>
                            {span.name}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="right-group">
          <div className="calendar">
            <h2 className="header">My Calendar</h2>
            <div className="calendar-wrapper">
              <div className="calendar-check">
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
              <div className="game-3d-layout">
                <GameExperience duplicateBookRef={duplicateBookRef}/>
              </div>
            </div>
          </div>
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
                selectedSpans={selectedSpans}
                setSelectedSpans={setSelectedSpans}
              />
            )}

            {activeSection === "Meetings" && (
              <div className="feature-card">🎬 Meeting times</div>
            )}
          </div>
        </div>

        
      </div>
      <div className={`chat-container ${showChat ? ' chat-container-active' : ''}`}>
      {/* <div className="chat-container"> */}
        <Chat setModules={setModules}
                          setTasks={setTasks}
                          setSelectedSpans={setSelectedSpans}
                          setHighlightedSpans={setHighlightedSpans}
                          setShowChat = {setShowChat}
                          showChat = {showChat}/>
      </div>
      <button className='chat-toggler' onClick={() => setShowChat(!showChat)}>
          <img src={chat_icon} alt="" className='chat-img-2'/>
      </button>
    </div>
  );
};

export default Timetable
