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

const Timetable = ({token}) => {
    const [showChat, setShowChat] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
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

        deleteSection
    } = useUI()
    let navigate = useNavigate()
    let userEmail = token.user.user_metadata.email;

    
    const BE_URL = process.env.REACT_APP_BACKEND_URL;


    const handleSaveChat = async () => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        // const date_time = `${day}-${month}`;
        const date_time = '16/06'
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
        setSectionColors(colors);
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
                        visibility: module.visibility,
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
            await handleGet();
            await handleGetChat();
        };
        fetchData();
    }, []);
    return (
        <div className="timetable">
            <div className="header-row">
                <h1 className="header">Khoa's Schedule</h1>
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
                                                addCustomSection();
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

            <div className={`chat-container ${showChat ? ' chat-container-active' : ''}`}>
                <Chat setModules={setModules}
                                setSelectedSpans={setSelectedSpans}
                                setHighlightedSpans={setHighlightedSpans}
                                setShowChat = {setShowChat}
                                showChat = {showChat}
                                messages = {messages}
                                setMessages={setMessages}
                                />
            </div>
            <button className='chat-toggler' onClick={() => setShowChat(!showChat)}>
                <img src={chat_icon} alt="" className='chat-img-2'/>
            </button>
        </div>
    );
}

export default Timetable;