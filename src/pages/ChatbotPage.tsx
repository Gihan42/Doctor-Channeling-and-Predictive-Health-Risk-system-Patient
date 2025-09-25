import { useEffect, useState, useRef } from 'react';
import { SendIcon, BotIcon, CopyIcon, CheckIcon, AlertTriangleIcon } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotPage = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    text: "Hello! I'm your health assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Sample suggested questions
  const suggestedQuestions = ['What are the symptoms of a heart attack?', 'How can I reduce my cancer risk?', "What should I do if I'm experiencing chest pain?", 'How often should I get cancer screenings?'];

  // Medical disclaimer component
  const MedicalDisclaimer = () => (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
      <div className="flex items-start">
        <AlertTriangleIcon className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-medium text-yellow-800">
            Important Medical Disclaimer
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            I am an AI assistant and not a medical professional. The information provided is for educational purposes only and should not be considered medical advice. Always consult with a qualified healthcare provider for medical concerns.
          </p>
        </div>
      </div>
    </div>
  );

  // Format bot response with proper styling
  const formatBotResponse = (text: string) => {
    // Split by markdown-style headers and lists
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Handle headers (like **1. Define Your Goals:**)
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={index} className="font-bold text-lg text-teal-700 mt-4 mb-2">
            {line.replace(/\*\*/g, '')}
          </h3>
        );
      }
      
      // Handle bold text within paragraphs
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="mb-2">
            {parts.map((part, i) => 
              i % 2 === 1 ? (
                <strong key={i} className="font-semibold text-gray-800">{part}</strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }
      
      // Handle list items starting with *
      if (line.trim().startsWith('*')) {
        return (
          <li key={index} className="flex items-start mb-1 ml-4">
            <span className="text-teal-500 mr-2 mt-1">•</span>
            <span>{line.replace('*', '').trim()}</span>
          </li>
        );
      }
      
      // Handle numbered lists (like 1., 2., etc.)
      if (/^\d+\./.test(line.trim())) {
        return (
          <li key={index} className="flex items-start mb-1 ml-4">
            <span className="font-semibold text-teal-600 mr-2">{line.match(/^\d+\./)?.[0]}</span>
            <span>{line.replace(/^\d+\.\s*/, '')}</span>
          </li>
        );
      }
      
      // Handle regular paragraphs
      if (line.trim()) {
        return (
          <p key={index} className="mb-2">
            {line}
          </p>
        );
      }
      
      // Handle empty lines as spacing
      return <div key={index} className="h-2" />;
    });
  };

  // Copy message text to clipboard
  const copyToClipboard = async (text: string, messageId: number) => {
    try {
      // Remove markdown formatting for plain text copy
      const plainText = text.replace(/\*\*/g, '');
      await navigator.clipboard.writeText(plainText);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Validate if the question is medical-related
    const medicalKeywords = [
      'health', 'medical', 'doctor', 'hospital', 'symptom', 'disease',
      'illness', 'pain', 'treatment', 'medicine', 'drug', 'pharmacy',
      'diagnosis', 'cancer', 'heart', 'blood', 'pressure', 'diabetes',
      'fever', 'headache', 'cough', 'allergy', 'asthma', 'infection',
      'vaccine', 'vaccination', 'screening', 'checkup', 'appointment',
      'emergency', 'clinic', 'physician', 'surgeon', 'nurse', 'patient',
      'prescription', 'therapy', 'recovery', 'rehab', 'mental', 'physical',
      'exercise', 'diet', 'nutrition', 'weight', 'obesity', 'fit', 'fitness'
    ];

    const isMedicalQuestion = medicalKeywords.some(keyword =>
      input.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!isMedicalQuestion) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "I'm sorry, I can only answer health and medical-related questions. Please ask about symptoms, diseases, treatments, or other health topics.",
        sender: 'bot',
        timestamp: new Date()
      }]);
      setInput('');
      return;
    }

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${baseUrl}ml/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: input
            }
          ]
        })
      });

      if (!response.ok) throw new Error('Failed to fetch bot response');

      const data = await response.json();

      const botResponseText = data.response || "Sorry, I didn't understand that. Could you please rephrase your medical question?";

      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "Something went wrong. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-14">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden h-[calc(100vh-120px)] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white px-6 py-4">
            <h1 className="text-xl font-semibold">Health Assistant</h1>
            <p className="text-sm text-blue-100">
              Ask questions about symptoms, diseases, or preventive care
            </p>
          </div>
          
          {/* Chat Messages */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-4 py-3 ${message.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-start">
                      {message.sender === 'bot' && <BotIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />}
                      <div className={`${message.sender === 'bot' ? 'bot-response' : ''}`}>
                        {/* Show medical disclaimer only for bot messages (except the first welcome message) */}
                        {message.sender === 'bot' && message.id !== 1 && (
                          <MedicalDisclaimer />
                        )}
                        {message.sender === 'bot' ? formatBotResponse(message.text) : message.text}
                      </div>
                    </div>
                    
                    {/* Copy Button for bot messages */}
                    {message.sender === 'bot' && (
                      <button
                        onClick={() => copyToClipboard(message.text, message.id)}
                        className="ml-2 p-1 rounded hover:bg-gray-200 transition-colors"
                        title="Copy response"
                      >
                        {copiedMessageId === message.id ? (
                          <CheckIcon className="h-3 w-3 text-green-600" />
                        ) : (
                          <CopyIcon className="h-3 w-3 text-gray-500" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className={`text-xs ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'} text-right mt-2`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-500 rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggested Questions */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button 
                  key={index} 
                  onClick={() => handleSuggestedQuestion(question)} 
                  className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
          
          {/* Input Form */}
          <div className="bg-white px-4 py-3 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex items-center">
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                placeholder="Type your health question..." 
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="bg-teal-500 text-white px-4 py-2 rounded-r-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                <SendIcon className="h-5 w-5" />
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              This health assistant provides general information only. Always
              consult a healthcare professional for medical advice.
            </p>
          </div>
        </div>
      </div>
      
      {/* Custom styles for bot responses */}
      <style>{`
        .bot-response ul {
          list-style-type: none;
          padding-left: 0;
          margin: 0.5rem 0;
        }
        .bot-response li {
          margin-bottom: 0.25rem;
        }
        .bot-response h3 {
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .bot-response p {
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default ChatbotPage;