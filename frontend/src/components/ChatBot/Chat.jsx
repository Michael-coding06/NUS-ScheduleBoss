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
    moduleArrange,
    setModuleArrange,
    academicPlan,
    setAcademicPlan    
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
        console.log(result['classified'])
        console.log(result['type'])
        if('add_span' in result['type']){
            const spans = result['type'].add_span;
            setSelectedSpans(prev => [...prev, ...spans]);
            setHighlightedSpans(prev => [...prev, ...spans]);
            const mod = spans
                .filter(span => span.type === 'module')
                .map(span => ({
                    name: span.name,
                    subtitle: 'No Exam • 0 Units',
                    visibility: { default: true }
                }));
            setModules(prev => [...prev, ...mod]);
        }
        if(result['classified'] == 'module_arrangement'){
            setModuleArrange(true)
        } 
        if(result['classified'] == 'academic_plan'){
            setAcademicPlan(true)
        }
        setMessages(prev => {
            const updated = [...prev];
            updated.pop();
            return [...updated, { sender: 'bot', text: result['response'] }];
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