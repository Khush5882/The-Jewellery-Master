import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiMessageCircle } from "react-icons/fi"; 
import ReactMarkdown from "react-markdown";  // Importing react-markdown

function Chatbot() {
    const [userInput, setUserInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isOpen, setIsOpen] = useState(false); 

    useEffect(() => {
        // When the chatbot is opened for the first time, send a dummy message to ask for details
        if (isOpen && chatHistory.length === 0) {
            setChatHistory([
                {
                    user: "", 
                    bot: "Hello! I can help you find the perfect jewelry. Could you please provide some details?\n\n" +
                         "For example:\n" +
                         "Occasion: Wedding\n" +
                         "Jewelry Type: Necklace\n" +
                         "Price Range: $100 - $500\n\n" +
                         "Feel free to type your preferences below!"
                }
            ]);
        }
    }, [isOpen]); // Runs when the bot is toggled

    const handleSend = async () => {
        if (!userInput.trim()) return;  // Don't send empty input
        
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/get_suggestions/", {
                params: { preference: userInput },
            });
            const botResponse = response.data.suggestions;
            setChatHistory([
                ...chatHistory,
                { user: userInput, bot: botResponse },
            ]);
            setUserInput("");  // Reset user input after sending
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setChatHistory([
                ...chatHistory,
                { user: userInput, bot: "Sorry, I couldn't fetch suggestions. Please try again later." },
            ]);
            setUserInput("");  // Reset user input after sending
        }
    };

    return (
        <div className="fixed bottom-4 right-4 flex flex-col items-end z-50"> 
          
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
            >
                <FiMessageCircle className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 mt-2 z-50"> 
                    <h2 className="text-center text-xl font-semibold text-blue-600 mb-4">Jewelry Suggestion Bot</h2>
                    
                    <div className="chat-history h-64 overflow-y-auto p-2 border rounded bg-gray-50 mb-4">
                        {chatHistory.map((entry, index) => (
                            <div key={index} className="mb-3">
                                <div className="flex justify-end">
                                    {entry.user && (
                                        <p className="bg-blue-500 text-white p-2 rounded-lg text-sm max-w-xs">{entry.user}</p>
                                    )}
                                </div>
                                <div className="flex justify-start mt-1">
                                  {/* Use ReactMarkdown to render bot response as HTML */}
                                    <p className="bg-gray-200 text-gray-700 p-2 rounded-lg text-sm max-w-xs">
                                        <ReactMarkdown>{entry.bot}</ReactMarkdown>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="What are you looking for?"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chatbot;
