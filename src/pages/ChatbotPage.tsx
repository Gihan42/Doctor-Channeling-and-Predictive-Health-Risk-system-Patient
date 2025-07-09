import  { useEffect, useState, useRef } from 'react';
import { SendIcon, BotIcon } from 'lucide-react';
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    text: "Hello! I'm your health assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Sample suggested questions
  const suggestedQuestions = ['What are the symptoms of a heart attack?', 'How can I reduce my cancer risk?', "What should I do if I'm experiencing chest pain?", 'How often should I get cancer screenings?'];
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);
/*  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };*/


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
      const response = await fetch('http://localhost:8080/api/v1/ml/chat', {
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
  // Very simple response generation - in a real app this would connect to an AI service
/*  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('heart') && lowerInput.includes('attack')) {
      return "Heart attack symptoms include chest pain or discomfort, shortness of breath, pain in the arms, back, neck, jaw or stomach, and cold sweats. If you're experiencing these symptoms, please seek emergency medical attention immediately by calling emergency services.";
    } else if (lowerInput.includes('cancer') && lowerInput.includes('risk')) {
      return 'To reduce cancer risk, avoid tobacco, maintain a healthy weight, exercise regularly, protect yourself from the sun, get vaccinated against HPV and Hepatitis B, and attend regular screenings. Would you like more specific information about a particular type of cancer?';
    } else if (lowerInput.includes('chest') && lowerInput.includes('pain')) {
      return 'Chest pain could be a sign of several conditions, including heart attack. If the pain is severe or accompanied by shortness of breath, sweating, nausea, or pain radiating to your jaw, arm, or back, please seek emergency medical attention immediately.';
    } else if (lowerInput.includes('screening') || lowerInput.includes('check')) {
      return 'Cancer screening recommendations vary by age, gender, and risk factors. Generally, adults should have regular check-ups with their doctor who can recommend appropriate screenings based on your personal health history. Would you like information about a specific type of cancer screening?';
    } else if (lowerInput.includes('doctor') || lowerInput.includes('appointment')) {
      return "If you'd like to schedule an appointment with a doctor, you can use our channeling system. Would you like me to guide you through the registration process so you can book an appointment with a specialist?";
    } else {
      return "I understand you're asking about health concerns. For more specific guidance, could you provide more details about your symptoms or questions? If this is an emergency, please contact emergency services immediately.";
    }
  };*/
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto  px-4 sm:px-6 lg:px-8 py-8 mt-14">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden h-[calc(100vh-120px)] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-400  to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white px-6 py-4">
            <h1 className="text-xl font-semibold">Health Assistant</h1>
            <p className="text-sm text-blue-100">
              Ask questions about symptoms, diseases, or preventive care
            </p>
          </div>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${message.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                  <div className="flex items-start mb-1">
                    {message.sender === 'bot' && <BotIcon className="h-4 w-4 mr-1 mt-0.5" />}
                    <div className="flex-1">{message.text}</div>
                  </div>
                  <div className={`text-xs ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'} text-right`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>)}
            {isTyping && <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-500 rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
                  animationDelay: '0ms'
                }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
                  animationDelay: '150ms'
                }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
                  animationDelay: '300ms'
                }}></div>
                  </div>
                </div>
              </div>}
            <div ref={messagesEndRef} />
          </div>
          {/* Suggested Questions */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => <button key={index} onClick={() => handleSuggestedQuestion(question)} className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100">
                  {question}
                </button>)}
            </div>
          </div>
          {/* Input Form */}
          <div className="bg-white px-4 py-3 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex items-center">
              <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type your health question..." className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit" disabled={!input.trim()}
                      className="bg-teal-500 text-white px-4 py-2 rounded-r-md hover:from-teal-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
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
    </div>;
};
export default ChatbotPage;