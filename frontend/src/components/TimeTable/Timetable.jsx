import React, {useEffect, useRef, useState} from "react";
import useUI from "./Hook/useUI";
import { days, time} from "./data/data"
import ModuleSection from "./ModuleSection"
import GeneralSection from "./GeneralSection";
import './Timetable.css';

import { useNavigate } from 'react-router-dom';
import GameExperience from '../GameModel/GameExperience';
import chat_icon from '../ChatBot/logo.png'
import Chat from '../ChatBot/Chat'
import { Link } from "react-router-dom";

import moduleArrangement from "./Hook/useArrange";

const Timetable = ({token}) => {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const {
        sectionName,
        dropdownOpen_span,
        setDropdownOpen_span,
        selectedSpans,
        setSelectedSpans,
        highlightedSpans,
        setHighlightedSpans,
        sectionColors,
        setSectionColors,

        findSpanForCell,
        isSpanSelected,
        isModuleSelected,
        allSections,
        setSectionVisibility,
        sectionVisibility,
        toggleSectionVisibility,

        activeSection,
        dropdownOpen,
        setDropdownOpen,
        setActiveSection,
        newSectionName,
        setNewSectionName,
        addCustomSection,
        
        modules,
        setModules,

        setCustomSections,

        deleteSection,
        moduleArrange,
        setModuleArrange,
        previewSpans,
        setPreviewSpans,
        isSpanPreviewed,
        academicPlan,
        setAcademicPlan,
        showSlots,
        setShowSlots,
    } = useUI()
    let navigate = useNavigate()
    let userEmail = token.user.user_metadata.email;
    let name = token.user.user_metadata.name || 'My';
    const [spanHover, setSpanHover] = useState(false);
    const [hoveredSpan, setHoveredSpan] = useState('');
    const [hoverPosition, setHoverPosition] = useState({x:0, y:0});
    const [spanDetails, setSpanDetails] = useState("");
    const [loading, setLoading] = useState(true);
    const [modulesToArrange, setModulesToArrange] = useState("");
    const [includeCommitments, setIncludeCommitments] = useState(false);
    
    const BE_URL = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isClickInsideSpanDetails = event.target.closest('.span-details');
            if (!isClickInsideSpanDetails) {
                setSpanHover(false);
                setHoveredSpan("");
            }
        };
        if (spanHover) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [spanHover]);

    const handleSaveChat = async () => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const date_time = `${day}-${month}`;
        // const date_time = '16/06'
        const response_chat = await fetch(`${BE_URL}/api/chatbot/${userEmail}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                chatActive: showChat,
                messages:{
                    [date_time]: messages
                }
            }),
        });
        console.log('sent chat_data');
        const result = await response_chat.json();
        console.log(result.message);
    }
    const handleSave = async () => {
        const response = await fetch(`${BE_URL}/api/timetable/${userEmail}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                spans: selectedSpans,
                sections: sectionVisibility,
                colors: sectionColors,
            }),
        });
        console.log('sent')
        const result = await response.json();
        console.log(result.message);
    }; 
    const handleGet = async () => {
        const response = await fetch(`${BE_URL}/api/timetable_data/${userEmail}`, { method: 'GET' });
        const result = await response.json();  
        console.log('Receiving data:', result)  
        const data = result?.data || {};
        let spans = Array.isArray(data.spans) ? data.spans : [];
        const sections = data.sections?.[0] || {};
        const sectionNames = Object.keys(sections);
        const customSectionsFromDB = sectionNames.filter(name => 
            name !== 'Module' && name !== 'Task' && name !== '0'
        );

        const colors = data.colors?.[0] || {};
        console.log(colors)
        if(Object.keys(colors).length > 0) {setSectionColors(colors);}
        if (customSectionsFromDB.length > 0) {
            setCustomSections(customSectionsFromDB)
        }else {setCustomSections([]);}
        setSelectedSpans(spans);
        setHighlightedSpans(spans);
        if(Object.keys(sections).length !== 0){setSectionVisibility(sections);}
        const mod = spans
                    .filter(span => span.type === 'module')
                    .map(module => ({
                        name: module.name, 
                        subtitle: "No Exam • 4 Units",
                        visibility: module.visibility || { default: true },
                    }))
        setModules(mod)
    }
    const handleGetChat = async () => {
        const response_chatbot = await fetch(`${BE_URL}/api/chatbot/${userEmail}`, { method: 'GET' });
        const result = await response_chatbot.json()
        console.log('Receiving chat data: ', result)
        const data = result?.data || {};
        const chatActive = data?.chatActive || false;
        const messages_date = data?.messages || {};
        if (messages_date[2] && Array.isArray(messages_date[2]) && messages_date[2][0]) {
            const dateOfConvo = Object.keys(messages_date[2][0]).find(key => key !== '_id');
            setMessages(messages_date[2][0][dateOfConvo])
        }
        setShowChat(chatActive);

    }
    async function handleLogout(){
        await handleSave();
        await handleSaveChat();
        sessionStorage.removeItem('token')
        navigate('/signup')
    }
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await handleGet();
            await handleGetChat();
            setLoading(false)
        };
        fetchData();
    }, []);
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
                <p>Loading your timetable...</p>
            </div>
        );
    }
    return (
        <div className="timetable">
            <div className="header-row">
                <h1 className="header">
                    <Link to = "/acadplan">{name} Schedule</Link>
                </h1>
                <div className='div-button'>
                    <button onClick={handleLogout} className='submit-2'>Log Out</button>
                </div>
            </div>

            <div className="content-wrapper">
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
                            {time.map((timeSlot) => (
                                <tr key={timeSlot}>
                                <td>{timeSlot}</td>
                                {days.map((day) => {
                                    const span = findSpanForCell(day, timeSlot);
                                    const isSelected = span && isSpanSelected(span);
                                    const isModuleAlreadySelected = span && isModuleSelected(span.name);
                                    const isHighlightable = span && !isSelected && !isModuleAlreadySelected;

                                    const sectionKey = span?.type ? span.type.charAt(0).toUpperCase() + span.type.slice(1) : null;
                                    return (
                                    <td
                                        key={`${day}-${timeSlot}`}
                                        onClick={() => {
                                            if (isHighlightable) {
                                                setSelectedSpans([...selectedSpans, span]);
                                                setHighlightedSpans([...selectedSpans, span]);
                                            }
                                        }}
                                        className={
                                            (isSelected ? 'selected' : '') +
                                            (isHighlightable ? 'highlight' : '') +
                                            ((isHighlightable || isSelected) && timeSlot === span?.start ? ' timeslot-start' : '')
                                        }
                                        style={span && isSelected ?{
                                            background: sectionColors[sectionKey]?.span || 'transparent'
                                        } : {}}
                                        onMouseEnter={(e) => {
                                            if(isSelected) {
                                                setSpanHover(true);
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setHoverPosition({
                                                    x: rect.right + 10,
                                                    y: rect.top + window.scrollY
                                                })
                                                setHoveredSpan(span);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if(e.key === "Escape") {
                                                setSpanHover(false);
                                                setHoveredSpan("")
                                            }
                                        }}
                                    >
                                        {isSelected && (
                                            <div 
                                            className={`span-name ${span?.type === 'task' ? 'task-span' : ''}`} >
                                                {span?.name}
                                            </div>
                                        )}

                                    </td>
                                    );
                                })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {(spanHover) &&(
                        <div className="span-details" 
                        style={{
                            position: "absolute",
                            left: `${hoverPosition.x}px`,
                            top: `${hoverPosition.y}px`,
                        }}
                        >
                            <div className="span-details-header">{hoveredSpan.day.toUpperCase()} • {hoveredSpan.name}</div>
                            <div className = 'span-details-time'>{hoveredSpan.start} - {hoveredSpan.end}</div>
                            {(hoveredSpan.details) && (
                                <div className="span-details-details">{hoveredSpan?.details}</div>
                            )}
                            {((hoveredSpan.details).length == 0) && (
                                <input type="text" className="span-details-details" placeholder="Add details.." value={spanDetails}
                                    onChange ={(e) => setSpanDetails(e.target.value)}
                                    onKeyDown ={(e) => {
                                        if(e.key === "Enter" && spanDetails.trim()){
                                            hoveredSpan.details = spanDetails;
                                            setSpanDetails("")
                                        }else if (e.key === 'Escape'){setSpanDetails("")}
                                    }}
                                autoFocus/>
                            )}
                        </div>
                    )}
                </div>
                <div className="right-group">
                    <div className="calendar">
                        <h2 className="header">My calendar</h2>
                        <div className="calendar-wrapper">
                            <div className="calendar-check">
                                {allSections.map((section) => {
                                    const sectionColor = sectionColors?.[section]?.box || '#ffb347';
                                    return (   
                                        <div
                                            key={section}
                                            className={`calendar-item ${sectionVisibility[section] ? 'active' : ''}`}
                                            >
                                            <div 
                                                className="color-box"
                                                style={{
                                                    backgroundColor: sectionVisibility[section] ? sectionColor : 'rgba(35, 25, 50, 0.5)',
                                                    border: `1px solid ${sectionColor}`
                                                }}
                                                onClick={() => {
                                                    toggleSectionVisibility(section);
                                                }}
                                            ></div>
                                            <div className="item">{section}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="game-3d-layout">
                                <GameExperience/>
                            </div>
                        </div>
                    </div>
                    <div className="add-mod">
                        <div className="section-header">
                            <h2 className="header">{activeSection}</h2>
                            <div className="dropdown-container">
                                {activeSection !== 'Module' && activeSection !== 'Task' && (
                                    <button className="dropdown-button delete" onClick={() =>{deleteSection(activeSection)}}>✖</button>
                                )}
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="dropdown-button">
                                ▼
                                </button>
                                {dropdownOpen && (
                                    <div className="dropdown-menu">
                                        {allSections.map(item => (
                                        <div key={item} className="dropdown-item" onClick={() => { 
                                            setActiveSection(item);
                                            setDropdownOpen(false);
                                        }}>
                                            {item}
                                        </div>
                                        ))}
                                        <input type="text" className="dropdown-input" placeholder="Others.." value={newSectionName}
                                        onChange={(e) => setNewSectionName(e.target.value)} 
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && newSectionName.trim()) {
                                                addCustomSection(newSectionName.trim());
                                                setActiveSection(newSectionName);
                                                setDropdownOpen(false);
                                            } else if (e.key === 'Escape') {
                                                setNewSectionName('');
                                            }
                                        }} autoFocus/>
                                    </div>
                                )}
                                
                            </div>
                        </div>
                        {activeSection.toLowerCase() === 'module' && (
                            <ModuleSection
                                highlightedSpans = {highlightedSpans}
                                setHighlightedSpans = {setHighlightedSpans}
                                selectedSpans = {selectedSpans}
                                setSelectedSpans = {setSelectedSpans}
                                sectionColors = {sectionColors}
                                modules={modules}
                                setModules={setModules}
                            />
                        )}
                        {activeSection.toLowerCase() !== 'module' && (
                            <GeneralSection
                                highlightedSpans = {highlightedSpans}
                                setHighlightedSpans = {setHighlightedSpans}
                                selectedSpans = {selectedSpans}
                                setSelectedSpans = {setSelectedSpans}
                                sectionName = {activeSection}
                                dropdownOpen_span = {dropdownOpen_span}
                                setDropdownOpen_span = {setDropdownOpen_span}
                                sectionColors = {sectionColors}
                            />
                        )}
                    </div>
                </div>
            </div>
            {(moduleArrange) && (
                <div className="module-arrange">
                    <div>
                        <div className="module-arrange-header">
                            <h1 className="module-arrange-title">Module Scheduler</h1>
                            <button 
                                className="module-arrange-close" 
                                onClick={() => {
                                    setModuleArrange(false);
                                    setPreviewSpans([]);
                                    setModulesToArrange("");
                                }}
                            >
                                ✖
                            </button>
                        </div>
                        <div className="module-arrange-input">
                            <h2>Modules to Schedule (comma-separated)</h2>
                            <input 
                                type="text" 
                                className="mod-search" 
                                placeholder="CS2040C, CS1231, CS2107"
                                value={modulesToArrange}
                                onChange={(e) => setModulesToArrange(e.target.value)}
                            />
                        </div>
                        <div className="module-arrange-tick"
                            onClick={() => setIncludeCommitments(!includeCommitments)}
                        >
                            <div className={`box ${includeCommitments ? 'checked' : ''}`}></div>
                            <h2>Include your other commitments in our arrangement?</h2>
                        </div>
                        <div className="module-arrange-arrange"
                            onClick={() => {
                                const modulesToSchedule = modulesToArrange
                                                            .split(',')
                                                            .map((mod) => mod.trim())
                                                            .filter((mod) => mod !== '')
                                const schedule = Object.values(moduleArrangement(modulesToSchedule, includeCommitments ? selectedSpans : []))
                                console.log('Generated schedule:', schedule)
                                setPreviewSpans(schedule)
                                console.log(previewSpans)
                            }}
                        >
                            Arrange
                        </div>
                        {(previewSpans[0] !== false && previewSpans.length > 0) && (
                            <div className="preview-controls">
                                <button 
                                    className="accept-arrangement"
                                    onClick={() => {
                                        setSelectedSpans([...selectedSpans, ...previewSpans]);
                                        setHighlightedSpans([...highlightedSpans, ...previewSpans]);
                                        setModules([...modules, ...previewSpans])
                                        setModulesToArrange("");
                                        setPreviewSpans([])
                                    }}>
                                        ✓ Accept
                                </button>
                                <button 
                                    className="cancel-arrangement"
                                    onClick={() => {
                                        setModulesToArrange("");
                                        setPreviewSpans([])
                                    }}>
                                        ✖ Cancel
                                </button>
                            </div>
                        )}
                        {(previewSpans[0] === false) && (
                            <div className="mod-error">CAN NOT ARRANGE!</div>
                        )}
                        <div className="mini-timetable-container">
                            <table className="mini-timetable">
                                <thead>
                                    <tr>
                                        <th></th>
                                        {days.map((day) => (
                                            <th key={day}>{day}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {time.map((timeSlot) => (
                                        <tr key={timeSlot}>
                                            <td>{timeSlot}</td>
                                            {days.map((day) => {
                                                const span = findSpanForCell(day, timeSlot);
                                                const isSelected = span && isSpanSelected(span);
                                                const previewSpan = previewSpans.find(previewSpan => {
                                                    if (previewSpan.day === day && previewSpan.start <= timeSlot && previewSpan.end > timeSlot) {
                                                        return true;
                                                    }
                                                    return false;
                                                });
                                                const isPreview = !!previewSpan;
                                                const displaySpan = span || previewSpan;
                                                const sectionKey = displaySpan?.type ? displaySpan.type.charAt(0).toUpperCase() + displaySpan.type.slice(1) : null;
                                                
                                                return (
                                                    <td
                                                        key={`mini-${day}-${timeSlot}`}
                                                        className={
                                                            (isSelected ? 'selected' : '') +
                                                            (isPreview ? ' preview-flicker' : '') + 
                                                            ((isSelected || isPreview) && timeSlot === displaySpan?.start ? ' timeslot-start' : '')
                                                        }
                                                        style={(isSelected || isPreview) ? {
                                                            background: isPreview ? 
                                                                '' : sectionColors[sectionKey]?.span || 'transparent'
                                                        } : {}}
                                                    >
                                                        {(isSelected || isPreview) && (
                                                            <div className={`span-name ${displaySpan?.type === 'task' ? 'task-span' : ''} ${isPreview ? 'preview-text' : ''}`}>
                                                                {displaySpan?.name}
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
                    </div>
                </div>
            )}
            {(academicPlan) && (
                <div className="module-arrange">
                    <div>
                        <div className="module-arrange-header">
                            <h1 className="module-arrange-title">Academic Plan</h1>
                            <button 
                                className="module-arrange-close" 
                                onClick={() => {
                                    setModuleArrange(false);
                                    setPreviewSpans([]);
                                    setModulesToArrange("");
                                }}
                            >
                                ✖
                            </button>
                        </div>
                        <div className="module-arrange-input">
                            <h2>Current Major</h2>
                            <input 
                                type="text" 
                                className="mod-search" 
                                placeholder="E.g, Computer Science, Computer Engineering"
                                value={modulesToArrange}
                                onChange={(e) => setModulesToArrange(e.target.value)}
                            />
                        </div>
                         <div className="module-arrange-input">
                            <h2>Career Goal/ Dream Job/ Specialization</h2>
                            <input 
                                type="text" 
                                className="mod-search" 
                                placeholder="E.g, Software Engineer, Machine Learning Engineer"
                                value={modulesToArrange}
                                onChange={(e) => setModulesToArrange(e.target.value)}
                            />
                        </div>
                        <div className="module-arrange-arrange"
                            onClick={() => {
                                const modulesToSchedule = modulesToArrange
                                                            .split(',')
                                                            .map((mod) => mod.trim())
                                                            .filter((mod) => mod !== '')
                                const schedule = Object.values(moduleArrangement(modulesToSchedule, includeCommitments ? selectedSpans : []))
                                console.log('Generated schedule:', schedule)
                                setPreviewSpans(schedule)
                                console.log(previewSpans)
                            }}
                        >
                            Generate
                        </div>
                    </div>
                </div>
            )}
            <div className={`chat-container ${showChat ? ' chat-container-active' : ''}`}>
                <Chat setModules={setModules}
                                setSelectedSpans={setSelectedSpans}
                                setHighlightedSpans={setHighlightedSpans}
                                setShowChat = {setShowChat}
                                showChat = {showChat}
                                messages = {messages}
                                setMessages={setMessages}
                                setModuleArrange = {setModuleArrange}
                                setAcademicPlan = {setAcademicPlan}
                                setShowSlots = {setShowSlots}
                                addCustomSection = {addCustomSection}
                                />
            </div>
            <button className='chat-toggler' onClick={() => setShowChat(!showChat)}>
                <img src={chat_icon} alt="" className='chat-img-2'/>
            </button>
        </div>
    );
}

export default Timetable;
