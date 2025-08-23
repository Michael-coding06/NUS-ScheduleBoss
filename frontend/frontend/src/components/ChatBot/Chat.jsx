import './Chat.css'
import logo from './logo.png'
import React, { useState, useEffect, useRef} from 'react'

const Chat = ({
    setModules,
    setSelectedSpans,
    setHighlightedSpans,
    showChat,
    setShowChat,
    messages,
    setMessages,
    setModuleArrange,
    setAcademicPlan,
    setShowSlots,
    addCustomSection
}) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);
    useEffect(() => {
        if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(message.trim()){
            setMessages(prevMessages => [...prevMessages, {sender: 'user', text: message}])
            setMessage('')
        }
        // test
        setLoading(true)
        setMessages(prev => [...prev, { sender: 'bot', text: '.' }]);
        const CHATBOT = process.env.REACT_APP_CHATBOT_URL
        console.log(CHATBOT)
        const response = await fetch(CHATBOT,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: message.trim()
            }),
        });
        const result = await response.json()
        console.log('Type of command', result['classified'])
        if('add_span' in result['type']){
            const spans = result['type'].add_span;
            if(spans.length == 0){
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: 'Sorry, I couldn\'t find that module slot. Please verify the module code and time details.'
                }]);
                setLoading(false);
                return;
            }
            console.log(spans)
            let capitalizedType = spans[0].type.charAt(0).toUpperCase() + spans[0].type.slice(1);
            addCustomSection(capitalizedType)
            const spans_ = spans
            .filter(span => span.type !== 'module')
            .map(span => ({
                name: span.name,
                type: span.type.toLowerCase(),
                visibility: {default: true},
                day: span.day,
                start: span.start,
                end: span.end,
                details: ''
            }))
            setSelectedSpans(prev => [...prev, ...spans_]);
            setHighlightedSpans(prev => [...prev, ...spans_]);
            const mod = spans
                .filter(span => span.type === 'module')
                .map(span => ({
                    name: span.name,
                    type: 'module',
                    subtitle: 'No Exam • 0 Units',
                    visibility: { default: true },
                    details: ''
                }));
            setModules(prev => [...prev, ...mod]);
        }
        if(result['classified'] == 'module_arrangement'){
            setModuleArrange(true)
        } 
        if(result['classified'] == 'academic_plan'){
            setAcademicPlan(true)
        }
        if('find_mod_time' in result['type']){
            console.log(result)
            setShowSlots(true)
        }
        setMessages(prev => {
            const updated = [...prev];
            updated.pop();
            const lines = result['response'].split('\n');
            const newMessages = lines
                .filter(line => line.trim() !== '') 
                .map(line => ({ sender: 'bot', text: line.trim() }));
            
            return [...updated, ...newMessages];
        });
        setLoading(false);
    }
    return (
        <div className= {`container-chat ${showChat ? 'show' : ''}`}>
            <div className="chat-pop-up">
                <div className="chat-header">
                    <div className="cheader">
                        <img src={logo} alt="" className='chat-img'/>
                        <h2 className="chat-header-text">
                            ChatBot
                        </h2>
                    </div>
                    <button className='chat-button' onClick={() => setShowChat(!showChat)}>✖</button>  
                </div>
                <div className="chat-body" ref={containerRef}>
                    {messages.map((msg, index) => (
                        <div key = {index} className = {`${msg.sender}-message`}>
                            {msg.sender === 'bot' && <img src = {logo} className='chat-img'/>}
                            <p className={msg.text === '.' ? 'message-text loading-dots' : 'message-text'}>
                                {msg.text}
                            </p>
                        </div>  
                    ))}
                </div>
                <div className="chat-footer">
                    <form onSubmit={handleSubmit} className='chat-form'>
                        <button type = 'button' className= 'chat-button tooltip-container' onClick={() => setMessages([])}>➕<span className="tooltip-text">New chat</span></button>
                        <input type="text" placeholder='Type here...' className='message-input' value={message}
                        onChange={(e) =>setMessage(e.target.value)}/>
                        <button type = 'submit' className='chat-button'>↑</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;