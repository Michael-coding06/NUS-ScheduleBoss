import './Chat.css'
// import logo1 from './logo1.png'
// import logo2 from './logo2.png'
import logo from './logo.png'
import React, { useState, useEffect} from 'react'
import {Scrollbar} from 'react-scrollbars-custom';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {sender: 'bot', text: 'Hellow, how can I help you?'},
        {sender: 'user', text: 'How large is the ocean?'}
    ])
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(message.trim()){
            setMessages(prevMessages => [...prevMessages, {sender: 'user', text: message}])
            setMessage('')
        }
        // test
        setLoading(true)
        setMessages(prev => [...prev, { sender: 'bot', text: '.' }]);

        const response = await fetch('http://localhost:3001/data',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: message.trim()
            }),
        });
        const result = await response.json();
        setMessages(prev => {
            const updated = [...prev];
            updated.pop();
            return [...updated, { sender: 'bot', text: result }];
        });
        setLoading(false);
    }
    return (
        <div className="container">
            <div className="chat-pop-up">
                <div className="chat-header">
                    <div className="header">
                        <img src={logo} alt="" className='chat-img'/>
                        <h2 className="chat-header-text">
                            ChatBot
                        </h2>
                    </div>
                    <button className='chat-button'>✖</button>
                </div>
                <div className="chat-body">
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