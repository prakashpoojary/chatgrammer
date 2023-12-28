import React, { useState } from 'react';
import './App.css'; // Import your CSS file

function App() {
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const openaiApiKey = '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'; // Replace with your OpenAI API key
  const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';

  const appendMessage = (role, content, isVisible = true) => {
    setChatMessages(prevMessages => [...prevMessages, { role, content, isVisible }]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const sendMessage = () => {
    const trimmedUserInput = userInput.trim();
    if (trimmedUserInput === '') return;

    const invisibleText = "- please write this without any grammar mistake";
    const userMessage = `${trimmedUserInput} ${invisibleText}`;
    appendMessage('User', userMessage, false);

    // Send user message to OpenAI API
    fetch(openaiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: userMessage }
        ]
      })
    })
    .then(response => response.json())
    .then(data => {
      const aiMessage = data.choices[0].message.content;
      appendMessage('AI', aiMessage);
    })
    .catch(error => console.error('Error:', error));

    setUserInput(''); // Clear input field
  };

  return (
    <div>
      <h1>Grammar Notes</h1>
      <div id="chat-container" className="chat-container">
        <div id="chat-box" className="chat-box">
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'User' ? 'user-message' : 'ai-message'}`}
            >
              {message.isVisible ? (
                <>
                  {message.content}
                  {message.role === 'AI' && (
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="copy-button"
                    >
                      Copy
                    </button>
                  )}
                </>
              ) : null}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className="user-input"
            style={{ border: 'none' }} // Hide input border
          />
          <button onClick={sendMessage} className="send-button">Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
