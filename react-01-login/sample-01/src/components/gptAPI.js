import React, { useState } from "react";
import axios from "axios";
import '../utils/api.css'

const ChatGPTComponent = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const payload = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": "You are a helpful assistant."
          },
          {
            "role": "user",
            "content": prompt
          }
        ]
      };
      const res = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers });
      // Assuming you only care about the last message which is the assistant's response
      const lastMessage = res.data.choices[0].message.content;
      setResponse(lastMessage);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Failed to fetch response.");
    }
    setPrompt(""); // Clear the prompt after submitting
  };

  return (
    <div className="chat-component">
      <h2 className="chat-title">Chat with Nurse-chan!</h2>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter your question"
          className="chat-input"
        />
        <button type="submit" className="chat-submit">Send</button>
      </form>
      <div className="chat-response">
        <p>Response:</p>
        <p>{response}</p>
      </div>
    </div>
  );

};

export default ChatGPTComponent;


