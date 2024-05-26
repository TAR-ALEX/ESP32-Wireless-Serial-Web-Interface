import React, { useState, useEffect, useRef, useCallback } from 'react';
import useStore from './useStore';

function WebSocketConsole() {
    var urlString = 'ws://' + window.location.hostname + '/ws'; // define this to override: VITE_APP_DEFAULT_URL
    if (import.meta.env.VITE_APP_DEFAULT_URL !== undefined && typeof import.meta.env.VITE_APP_DEFAULT_URL === 'string') {
        urlString = import.meta.env.VITE_APP_DEFAULT_URL; // Replace with your ESP32 WebSocket URL
    }
    const { currentForm, setCurrentForm } = useStore();
    const [triggerRender, setTriggerRender] = useState(false);
    const [url, setUrl] = useState(urlString); // Replace with your ESP32 WebSocket URL
    const [ws, setWs] = useState(null);
    const [tryReconnect, setTryReconnect] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
    const [sendOnEnter, setSendOnEnter] = useState(true);
    const textareaRef = useRef(null);
    const [isSending, setIsSending] = useState(false);
    const [printTxEnabled, setPrintTxEnabled] = useState(import.meta.env.VITE_APP_PRINT_INPUT !== undefined);
    let newlineSep = "\n";
    if (import.meta.env.VITE_APP_NEWLINES_SEPARATOR !== undefined && typeof import.meta.env.VITE_APP_NEWLINES_SEPARATOR === 'string') {
        newlineSep = import.meta.env.VITE_APP_NEWLINES_SEPARATOR; // Replace with your ESP32 WebSocket URL
    }
    const [appendEndline, setAppendEndline] = useState(newlineSep);

    const reconnectWebSocket = useCallback(() => {
        if (tryReconnect) {
            try {
                setWs(new WebSocket(url));
            } catch {
                setWs(false);
                console.log("Failed to connect to " + url);
            }
        }
    }, [tryReconnect, url]);

    useEffect(() => {
        if (ws) {
            ws.onopen = () => {
                console.log('WebSocket Connected');
                setIsConnected(true);
            };
            ws.onmessage = (event) => {
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages, event.data];
                    // Scroll to bottom if autoScrollEnabled
                    if (autoScrollEnabled && textareaRef.current) {
                        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
                    }
                    return updatedMessages;
                });
            };
            ws.onclose = () => {
                console.log('WebSocket Disconnected');
                setIsConnected(false);
                setTimeout(reconnectWebSocket, 500);
            };
            ws.onerror = (error) => {
                console.log('WebSocket Error: ', error);
                setIsConnected(false);
            };
        } else {
            if (tryReconnect) {
                reconnectWebSocket();
                setTimeout(() => {
                    setTriggerRender(prev => !prev);
                }, 1000);
            }
        }
    }, [ws, autoScrollEnabled, url, reconnectWebSocket, triggerRender, setTriggerRender, tryReconnect]);

    const connectWebSocket = () => {
        try {
            setWs(new WebSocket(url));
        } catch {
            console.log("Failed to connect to " + url);
            setTimeout(() => {
                setTriggerRender(prev => !prev);
            }, 1000);
        }
        if (import.meta.env.VITE_APP_AUTORECONNECT_SOCKETS !== undefined) { setTryReconnect(true); }
    };
    useEffect(() => {
        if (import.meta.env.VITE_APP_START_CONNECTED_SOCKETS !== undefined) {
            setTimeout(() => {
                connectWebSocket();
            }, 100);
        }
    }); // Empty dependency array means this effect runs once


    const disconnectWebSocket = () => {
        if (ws) {
            ws.close();
        }
        setTryReconnect(false);
    };

    const sendMessage = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            const lines = input.split('\n');
            let index = 0;
            if (printTxEnabled) {
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages, input+"\n"];
                    // Scroll to bottom if autoScrollEnabled
                    if (autoScrollEnabled && textareaRef.current) {
                        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
                    }
                    return updatedMessages;
                });
            }
            const sendLineWithDelay = () => {
                if (index < lines.length) {
                    ws.send(lines[index] + appendEndline);
                    console.log(lines[index] + appendEndline);
                    index++;
                    setTimeout(sendLineWithDelay, 1); // Set delay here
                } else {
                    setInput('');
                    setIsSending(false);
                }
            };
            setIsSending(true);
            sendLineWithDelay();
        }
    };


    const handleTextareaKeyDown = (e) => {
        if (sendOnEnter && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevents the default action (new line)
            // Call your send message function here
            sendMessage();
        }
    };

    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <div className="WebSocketConsole">
            {
                (import.meta.env.VITE_APP_INCLUDE_CONNECTION_URL !== undefined) && (<div>
                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} disabled={isConnected} />
                    <button onClick={connectWebSocket} disabled={isConnected}>Connect</button>
                    <button onClick={disconnectWebSocket} disabled={!(isConnected || tryReconnect)}>Disconnect</button>
                </div>)
            }
            <div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleTextareaKeyDown}
                    rows="2"
                    style={{ resize: 'vertical', overflow: 'auto' }}
                ></textarea>
                {
                    (import.meta.env.VITE_APP_HIDE_NEWLINE_SEPARATOR_MENU === undefined) && (
                        <select name="cars" value={appendEndline} onChange={(e) => setAppendEndline(e.target.value)}>
                            <option value="\n">LF</option>
                            <option value="\n\r">CRLF</option>
                            <option value="">NONE</option>
                        </select>
                    )
                }
                <button onClick={sendMessage} disabled={isSending}>Send</button>
                <button onClick={clearMessages}>Clear</button>

            </div>
            <textarea ref={textareaRef} value={messages.join("")} readOnly />

            <div className='MidSpacedContainer'>



                <div className=" MidSpacedContainerChild">
                    {(import.meta.env.VITE_APP_WIFI_CONFIG !== undefined) && (<button onClick={() => { setCurrentForm("wifi"); }}>Config Wifi</button>)}
                </div>

                <div className="MidSpacedContainerChild">

                    <label>
                        <input
                            type="checkbox"
                            checked={printTxEnabled}
                            onChange={(e) => setPrintTxEnabled(e.target.checked)}
                        />
                        Print Input
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={autoScrollEnabled}
                            onChange={(e) => setAutoScrollEnabled(e.target.checked)}
                        />
                        Enable Auto-Scroll
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={sendOnEnter}
                            onChange={(e) => setSendOnEnter(e.target.checked)}
                        />
                        Send on Enter
                    </label>
                </div>
            </div>
        </div>
    );
}

export default WebSocketConsole;