import React, { useState, useEffect, useRef } from 'react';
import '../style/Chat.css';
import pcData from '../data/pc.json';

interface Message {
    id: string | number;
    text: string;
    sender: "bot" | "user";
}

function Chat() {
    const rawMessages = pcData.Screen.Chat[0].messeges;
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [inputText, setInputText] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);
    
    const chatBodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isMinimized && chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isTyping, isMinimized]);

    useEffect(() => {
        if (currentIndex >= rawMessages.length) return;
        
        const nextMessageObj = rawMessages[currentIndex];
        
        if (nextMessageObj.text && nextMessageObj.sender === "Clara") {
            setIsTyping(true);
            const delay = Math.floor(Math.random() * 5000) + 5000; 
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, { id: nextMessageObj.id as string, text: nextMessageObj.text as string, sender: "bot" }]);
                setIsTyping(false);
                setCurrentIndex(prev => prev + 1);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, rawMessages]);

    const currentMessageObj = rawMessages[currentIndex];
    const pendingAnswers = currentMessageObj?.answers || null;

    const handleSend = () => {
        if (!inputText.trim()) return;
        setMessages(prev => [...prev, { id: Date.now(), text: inputText, sender: "user" }]);
        setInputText("");
        
        if (pendingAnswers) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSend();
    };

    const handleAnswerClick = (answerText: string) => {
        setMessages(prev => [...prev, { id: Date.now(), text: answerText, sender: "user" }]);
        setCurrentIndex(prev => prev + 1);
    };

    return (
        <div className={`chat-window ${isMinimized ? 'minimized' : ''}`}>
            <div className='chat-header' onClick={() => setIsMinimized(!isMinimized)} style={{ cursor: 'pointer' }}>
                <div className="header-status">
                    <span className="status-dot"></span>
                    <h3>Clara</h3>
                </div>
                <div className="header-actions">
                    <button className="minimize-btn" onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}>
                        {isMinimized ? '+' : '-'}
                    </button>
                </div>
            </div>
            
            <div className='chat-body' ref={chatBodyRef} style={{ display: isMinimized ? 'none' : 'flex' }}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`chat-message ${msg.sender}`}>
                        <div className="message-bubble">{msg.text}</div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="chat-message bot">
                        <div className="typing-indicator">
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                        </div>
                    </div>
                )}
                
                {pendingAnswers && !isTyping && (
                    <div className="answer-options">
                        {pendingAnswers.map((ans: any, idx: number) => (
                            <button 
                                key={idx} 
                                className="answer-btn"
                                onClick={() => handleAnswerClick(ans.text)}
                            >
                                {ans.text}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            <div className='chat-footer' style={{ display: isMinimized ? 'none' : 'block', borderTop: isMinimized ? 'none' : '1px solid rgba(255, 255, 255, 0.3)' }}>
                <div className="input-container">
                    <input 
                        type="text" 
                        placeholder={pendingAnswers ? "Choose an option or type..." : "Type a message..."} 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isTyping && !pendingAnswers}
                        style={{ opacity: (isTyping && !pendingAnswers) ? 0.5 : 1 }}
                    />
                    <button className="send-btn" onClick={handleSend} disabled={isTyping && !pendingAnswers}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;