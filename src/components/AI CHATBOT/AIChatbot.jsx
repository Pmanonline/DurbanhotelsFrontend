// import React, { useState, useRef, useEffect } from "react";

// const AIChatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       role: "assistant",
//       content: "Hello! I'm Segun's AI assistant. How can I help you today?",
//       timestamp: new Date(),
//     },
//   ]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [sessionId, setSessionId] = useState("");
//   const [connectionStatus, setConnectionStatus] = useState("ready");
//   const [currentAudio, setCurrentAudio] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);
//   const audioRef = useRef(null);

//   // API Configuration
//   const API_CONFIG = {
//     url: "https://personal-brand-agentic-chatbot.onrender.com/chat",
//     apiKey: "sk-d8ngvPonimkUI3Nm4f8drh709TwcgdBh",
//   };

//   // Detect mobile on mount
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Generate session ID on mount
//   useEffect(() => {
//     setSessionId(
//       `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
//     );
//   }, []);

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Focus input when chatbot opens
//   useEffect(() => {
//     if (isOpen) {
//       inputRef.current?.focus();
//     }
//   }, [isOpen]);

//   const sendMessage = async () => {
//     if (!inputMessage.trim() || isLoading) return;

//     const userMessage = {
//       role: "user",
//       content: inputMessage,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     const messageToSend = inputMessage;
//     setInputMessage("");
//     setIsLoading(true);
//     setConnectionStatus("ready");

//     const requestBody = {
//       message: messageToSend,
//       session_id: sessionId,
//     };

//     try {
//       const response = await fetch(API_CONFIG.url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-API-Key": API_CONFIG.apiKey,
//           Accept: "application/json",
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         throw new Error(`Request failed (${response.status})`);
//       }

//       const data = await response.json();

//       const assistantMessage = {
//         role: "assistant",
//         content:
//           data.response ||
//           data.message ||
//           data.answer ||
//           "I received your message but got an unexpected response format.",
//         timestamp: new Date(),
//         audioUrl: data.audio_url || null,
//         audioTitle: data.audio_title || null,
//       };

//       setMessages((prev) => [...prev, assistantMessage]);
//       setConnectionStatus("success");
//     } catch (error) {
//       let errorMessage =
//         "I apologize, but I'm having trouble connecting right now. Please try again.";

//       const errorMsg = {
//         role: "assistant",
//         content: errorMessage,
//         timestamp: new Date(),
//         isError: true,
//       };

//       setMessages((prev) => [...prev, errorMsg]);
//       setConnectionStatus("error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const formatTime = (date) => {
//     return date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const clearChat = () => {
//     setMessages([
//       {
//         role: "assistant",
//         content: "Chat cleared. How can I help you?",
//         timestamp: new Date(),
//       },
//     ]);
//     setConnectionStatus("ready");
//     setCurrentAudio(null);
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;
//     }
//   };

//   const playAudio = (url, title) => {
//     setCurrentAudio({ url, title });
//     setTimeout(() => {
//       if (audioRef.current) {
//         audioRef.current.play();
//       }
//     }, 100);
//   };

//   const stopAudio = () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;
//     }
//     setCurrentAudio(null);
//   };

//   // Format message content with clickable links
//   const formatMessageContent = (content) => {
//     // Enhanced regex to match URLs and markdown links
//     const urlRegex =
//       /(\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\))|(https?:\/\/[^\s]+)/g;
//     const parts = [];
//     let lastIndex = 0;
//     let match;

//     while ((match = urlRegex.exec(content)) !== null) {
//       // Add text before the match
//       if (match.index > lastIndex) {
//         parts.push({
//           type: "text",
//           content: content.substring(lastIndex, match.index),
//         });
//       }

//       // Check if it's a markdown link [text](url)
//       if (match[1]) {
//         parts.push({
//           type: "link",
//           text: match[2],
//           url: match[3],
//         });
//       } else {
//         // Regular URL
//         parts.push({
//           type: "link",
//           text: match[4],
//           url: match[4],
//         });
//       }

//       lastIndex = match.index + match[0].length;
//     }

//     // Add remaining text
//     if (lastIndex < content.length) {
//       parts.push({
//         type: "text",
//         content: content.substring(lastIndex),
//       });
//     }

//     return parts.length > 0 ? parts : [{ type: "text", content }];
//   };

//   // Mobile full-screen view
//   if (isMobile && isOpen) {
//     return (
//       <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
//         {/* Mobile Header */}
//         <div className="bg-gradient-to-r from-primary-300 to-primary-400 px-4 py-3 flex items-center justify-between shadow-lg">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
//               <img
//                 src={
//                   "https://imgcdn.stablediffusionweb.com/2024/9/27/c87912a9-2727-40af-9fa8-ec93d2ae96c0.jpg"
//                 }
//                 alt="User Avatar"
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             <div>
//               <h3 className="text-white font-semibold text-base">
//                 AI Assistant
//               </h3>
//               <p className="text-purple-100 text-xs flex items-center gap-1">
//                 <span
//                   className={`w-2 h-2 rounded-full ${
//                     connectionStatus === "success"
//                       ? "bg-green-300"
//                       : "bg-yellow-300"
//                   }`}></span>
//                 {connectionStatus === "success" ? "Online" : "Ready"}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={clearChat}
//               className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                 />
//               </svg>
//             </button>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Messages Container */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
//           {messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
//               <div
//                 className={`max-w-[85%] rounded-2xl px-4 py-3 ${
//                   msg.role === "user"
//                     ? "bg-gradient-to-r from-purple-600 to-secondary-light/70 text-white rounded-br-sm"
//                     : msg.isError
//                       ? "bg-red-900/30 text-red-200 rounded-bl-sm"
//                       : "bg-gray-800 text-gray-100 rounded-bl-sm"
//                 }`}>
//                 <div className="text-sm leading-relaxed">
//                   {formatMessageContent(msg.content).map((part, i) =>
//                     part.type === "link" ? (
//                       <a
//                         key={i}
//                         href={part.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-300 underline hover:text-blue-200 break-all">
//                         {part.text}
//                       </a>
//                     ) : (
//                       <span key={i} className="whitespace-pre-wrap">
//                         {part.content}
//                       </span>
//                     )
//                   )}
//                 </div>
//                 {msg.audioUrl && (
//                   <div className="mt-3 pt-3 border-t border-gray-600">
//                     <button
//                       onClick={() => playAudio(msg.audioUrl, msg.audioTitle)}
//                       className="flex items-center gap-2 w-full px-3 py-2 bg-purple-900/40 hover:bg-purple-900/60 rounded-lg transition-colors">
//                       <svg
//                         className="w-5 h-5 text-purple-400"
//                         fill="currentColor"
//                         viewBox="0 0 20 20">
//                         <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
//                       </svg>
//                       <div className="flex-1 text-left">
//                         <p className="text-sm font-medium text-gray-100">
//                           {msg.audioTitle || "Play Audio"}
//                         </p>
//                         <p className="text-xs text-gray-400">Click to play</p>
//                       </div>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {isLoading && (
//             <div className="flex justify-start">
//               <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
//                 <div className="flex space-x-2">
//                   <div
//                     className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                     style={{ animationDelay: "0ms" }}></div>
//                   <div
//                     className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                     style={{ animationDelay: "150ms" }}></div>
//                   <div
//                     className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                     style={{ animationDelay: "300ms" }}></div>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Area */}
//         <div className="bg-gray-800 border-t border-gray-700 p-4 pb-safe">
//           {currentAudio && (
//             <div className="mb-3 p-3 bg-purple-900/20 rounded-lg border border-purple-700">
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-100 truncate">
//                     {currentAudio.title || "Now Playing"}
//                   </p>
//                   <p className="text-xs text-gray-400">Audio Player</p>
//                 </div>
//                 <button
//                   onClick={stopAudio}
//                   className="text-red-400 hover:text-red-300 p-1">
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               </div>
//               <audio
//                 ref={audioRef}
//                 src={currentAudio.url}
//                 controls
//                 className="w-full"
//                 onEnded={() => setCurrentAudio(null)}>
//                 Your browser does not support the audio element.
//               </audio>
//             </div>
//           )}

//           <div className="flex items-center gap-2 w-full overflow-hidden">
//             <input
//               ref={inputRef}
//               type="text"
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Type your message..."
//               className="flex-1 min-w-0 bg-gray-700 text-white placeholder-gray-400 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
//               disabled={isLoading}
//             />

//             <button
//               onClick={sendMessage}
//               disabled={!inputMessage.trim() || isLoading}
//               className="bg-gradient-to-r from-purple-600 to-secondary-light text-white rounded-xl px-4 py-3 hover:from-secondary-500 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center">
//               <svg
//                 className="w-5 h-5 sm:w-6 sm:h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Desktop view (original with improvements)
//   return (
//     <>
//       {/* Floating Chat Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`fixed bottom-6 right-6 z-50 mid:w-12 mid:h-12  w-14 h-14 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group ${
//           isOpen
//             ? "bg-red-500 hover:bg-red-600"
//             : connectionStatus === "error"
//               ? "bg-yellow-500 hover:bg-yellow-600"
//               : "bg-gradient-to-r from-secondary-light to-secondary-400 hover:from-purple-700 hover:to-secondary-600"
//         }`}
//         aria-label={isOpen ? "Close chat" : "Open chat"}>
//         {isOpen ? (
//           <svg
//             className="w-6 h-6 text-white"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         ) : (
//           <>
//             <svg
//               className="w-7 h-7 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
//               />
//             </svg>
//             {connectionStatus === "error" ? (
//               <span className="absolute -top-1 -right-1 flex h-3 w-3">
//                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
//               </span>
//             ) : (
//               <span className="absolute -top-1 -right-1 flex h-3 w-3">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
//               </span>
//             )}
//           </>
//         )}
//       </button>

//       {/* Chat Window - Desktop */}
//       {isOpen && (
//         <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-4rem)] h-[800px] max-h-[calc(100vh-6rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
//           {/* Header */}
//           <div className=" bg-gradient-to-r from-primary-300 to-primary-400  px-6 py-4 flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center">
//                 <img
//                   src={
//                     "https://imgcdn.stablediffusionweb.com/2024/9/27/c87912a9-2727-40af-9fa8-ec93d2ae96c0.jpg"
//                   }
//                   alt=""
//                 />
//               </div>
//               <div>
//                 <h3 className="text-white font-semibold text-lg">
//                   AI Assistant
//                 </h3>
//                 <p className="text-purple-100 text-xs flex items-center gap-1">
//                   <span
//                     className={`w-2 h-2 rounded-full ${
//                       connectionStatus === "success"
//                         ? "bg-green-300"
//                         : "bg-yellow-300"
//                     }`}></span>
//                   {connectionStatus === "success" ? "Online" : "Ready"}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={clearChat}
//                 className="text-white  hover:bg-white/20 hover:text-white/50 rounded-full p-1 transition-colors"
//                 title="Clear Chat">
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                   />
//                 </svg>
//               </button>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="text-white hover:bg-white/20 hover:text-red-900 rounded-full p-1 transition-colors">
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* Messages Container */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
//             {messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
//                 <div
//                   className={`max-w-[85%] rounded-2xl px-4 py-3 ${
//                     msg.role === "user"
//                       ? "bg-gradient-to-r from-purple-600 to-secondary-light/70 text-white rounded-br-sm"
//                       : msg.isError
//                         ? "bg-red-900/30 text-red-200 rounded-bl-sm"
//                         : "bg-gray-800 text-gray-100 rounded-bl-sm"
//                   }`}>
//                   <div className="text-sm leading-relaxed">
//                     {formatMessageContent(msg.content).map((part, i) =>
//                       part.type === "link" ? (
//                         <a
//                           key={i}
//                           href={part.url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className={`${msg.role === "user" ? "text-blue-200" : "text-blue-600 dark:text-blue-400"} underline hover:opacity-80 break-all`}>
//                           {part.text}
//                         </a>
//                       ) : (
//                         <span key={i} className="whitespace-pre-wrap">
//                           {part.content}
//                         </span>
//                       )
//                     )}
//                   </div>
//                   {msg.audioUrl && (
//                     <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
//                       <button
//                         onClick={() => playAudio(msg.audioUrl, msg.audioTitle)}
//                         className="flex items-center gap-2 w-full px-3 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-lg transition-colors">
//                         <svg
//                           className="w-5 h-5 text-purple-600 dark:text-purple-400"
//                           fill="currentColor"
//                           viewBox="0 0 20 20">
//                           <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
//                         </svg>
//                         <div className="flex-1 text-left">
//                           <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                             {msg.audioTitle || "Play Audio"}
//                           </p>
//                           <p className="text-xs text-gray-500 dark:text-gray-400">
//                             Click to play
//                           </p>
//                         </div>
//                       </button>
//                     </div>
//                   )}
//                   <p
//                     className={`text-xs mt-1 ${
//                       msg.role === "user"
//                         ? "text-purple-100"
//                         : "text-gray-500 dark:text-gray-400"
//                     }`}></p>
//                 </div>
//               </div>
//             ))}

//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
//                   <div className="flex space-x-2">
//                     <div
//                       className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "0ms" }}></div>
//                     <div
//                       className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "150ms" }}></div>
//                     <div
//                       className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "300ms" }}></div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Area */}
//           <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
//             {currentAudio && (
//               <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
//                       {currentAudio.title || "Now Playing"}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Audio Player
//                     </p>
//                   </div>
//                   <button
//                     onClick={stopAudio}
//                     className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M6 18L18 6M6 6l12 12"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//                 <audio
//                   ref={audioRef}
//                   src={currentAudio.url}
//                   controls
//                   className="w-full h-10"
//                   onEnded={() => setCurrentAudio(null)}>
//                   Your browser does not support the audio element.
//                 </audio>
//               </div>
//             )}

//             <div className="flex space-x-2">
//               <textarea
//                 ref={inputRef}
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Type your message..."
//                 rows={1}
//                 className="flex-1 resize-none rounded-xl px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 disabled={isLoading}
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={!inputMessage.trim() || isLoading}
//                 className="bg-gradient-to-r from-purple-600 to-secondary-light text-white rounded-xl px-4 py-3 hover:from-secondary-500 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center">
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AIChatbot;
import React, { useState, useRef, useEffect } from "react";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm Segun's AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("ready");
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const audioRef = useRef(null);

  // API Configuration
  const API_CONFIG = {
    url: "https://personal-brand-agentic-chatbot.onrender.com/chat",
    apiKey: "sk-d8ngvPonimkUI3Nm4f8drh709TwcgdBh",
  };

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Generate session ID on mount
  useEffect(() => {
    setSessionId(
      `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    );
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage("");
    setIsLoading(true);
    setConnectionStatus("ready");

    const requestBody = {
      message: messageToSend,
      session_id: sessionId,
    };

    try {
      const response = await fetch(API_CONFIG.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_CONFIG.apiKey,
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content:
          data.response ||
          data.message ||
          data.answer ||
          "I received your message but got an unexpected response format.",
        timestamp: new Date(),
        audioUrl: data.audio_url || null,
        audioTitle: data.audio_title || null,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setConnectionStatus("success");
    } catch (error) {
      let errorMessage =
        "I apologize, but I'm having trouble connecting right now. Please try again.";

      const errorMsg = {
        role: "assistant",
        content: errorMessage,
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMsg]);
      setConnectionStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared. How can I help you?",
        timestamp: new Date(),
      },
    ]);
    setConnectionStatus("ready");
    setCurrentAudio(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const playAudio = (url, title) => {
    setCurrentAudio({ url, title });
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 100);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentAudio(null);
  };

  // Enhanced text formatting function
  const formatMessageContent = (content) => {
    const parts = [];

    // Remove markdown-style formatting and convert to readable format
    let formattedContent = content
      // Remove hashtags (###, ##, #)
      .replace(/^#{1,6}\s+/gm, "")
      // Convert **bold** to bold text
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      // Convert *italic* to italic text
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      // Convert bullet points (-, *, +) to proper bullets
      .replace(/^[\-\*\+]\s+/gm, "• ")
      // Convert numbered lists
      .replace(/^\d+\.\s+/gm, (match) => match)
      // Handle line breaks
      .replace(/\n\n/g, "\n")
      .trim();

    // Enhanced regex to match URLs and markdown links
    const urlRegex =
      /(\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\))|(https?:\/\/[^\s<]+)/g;
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(formattedContent)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        const textBefore = formattedContent.substring(lastIndex, match.index);
        parts.push({
          type: "text",
          content: textBefore,
        });
      }

      // Check if it's a markdown link [text](url)
      if (match[1]) {
        parts.push({
          type: "link",
          text: match[2],
          url: match[3],
        });
      } else {
        // Regular URL
        parts.push({
          type: "link",
          text: match[4],
          url: match[4],
        });
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < formattedContent.length) {
      parts.push({
        type: "text",
        content: formattedContent.substring(lastIndex),
      });
    }

    return parts.length > 0
      ? parts
      : [{ type: "text", content: formattedContent }];
  };

  // Render formatted text with HTML
  const renderFormattedText = (content) => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="whitespace-pre-wrap break-words"
      />
    );
  };

  // Mobile full-screen view
  if (isMobile && isOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
        {/* Mobile Header */}
        <div className="bg-gradient-to-r from-primary-300 to-primary-400 px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <img
                src="https://imgcdn.stablediffusionweb.com/2024/9/27/c87912a9-2727-40af-9fa8-ec93d2ae96c0.jpg"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-white font-semibold text-base">
                AI Assistant
              </h3>
              <p className="text-purple-100 text-xs flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === "success"
                      ? "bg-green-300"
                      : "bg-yellow-300"
                  }`}></span>
                {connectionStatus === "success" ? "Online" : "Ready"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-secondary-light/70 text-white rounded-br-sm"
                    : msg.isError
                      ? "bg-red-900/30 text-red-200 rounded-bl-sm"
                      : "bg-gray-800 text-gray-100 rounded-bl-sm"
                }`}>
                <div className="text-sm leading-relaxed">
                  {formatMessageContent(msg.content).map((part, i) =>
                    part.type === "link" ? (
                      <a
                        key={i}
                        href={part.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 underline hover:text-blue-200 break-all">
                        {part.text}
                      </a>
                    ) : (
                      <span key={i}>{renderFormattedText(part.content)}</span>
                    )
                  )}
                </div>
                {msg.audioUrl && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <button
                      onClick={() => playAudio(msg.audioUrl, msg.audioTitle)}
                      className="flex items-center gap-2 w-full px-3 py-2 bg-purple-900/40 hover:bg-purple-900/60 rounded-lg transition-colors">
                      <svg
                        className="w-5 h-5 text-purple-400"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-100">
                          {msg.audioTitle || "Play Audio"}
                        </p>
                        <p className="text-xs text-gray-400">Click to play</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-gray-800 border-t border-gray-700 p-4 pb-safe">
          {currentAudio && (
            <div className="mb-3 p-3 bg-purple-900/20 rounded-lg border border-purple-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-100 truncate">
                    {currentAudio.title || "Now Playing"}
                  </p>
                  <p className="text-xs text-gray-400">Audio Player</p>
                </div>
                <button
                  onClick={stopAudio}
                  className="text-red-400 hover:text-red-300 p-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <audio
                ref={audioRef}
                src={currentAudio.url}
                controls
                className="w-full"
                onEnded={() => setCurrentAudio(null)}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div className="flex items-center gap-2 w-full overflow-hidden">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 min-w-0 bg-gray-700 text-white placeholder-gray-400 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              disabled={isLoading}
            />

            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-secondary-light text-white rounded-xl px-4 py-3 hover:from-secondary-500 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 mid:w-12 mid:h-12 w-14 h-14 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : connectionStatus === "error"
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-gradient-to-r from-secondary-light to-secondary-400 hover:from-purple-700 hover:to-secondary-600"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}>
        {isOpen ? (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <>
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            {connectionStatus === "error" ? (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            ) : (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Window - Desktop */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-4rem)] h-[800px] max-h-[calc(100vh-6rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-300 to-primary-400 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center">
                <img
                  src="https://imgcdn.stablediffusionweb.com/2024/9/27/c87912a9-2727-40af-9fa8-ec93d2ae96c0.jpg"
                  alt=""
                />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  AI Assistant
                </h3>
                <p className="text-purple-100 text-xs flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      connectionStatus === "success"
                        ? "bg-green-300"
                        : "bg-yellow-300"
                    }`}></span>
                  {connectionStatus === "success" ? "Online" : "Ready"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="text-white hover:bg-white/20 hover:text-white/50 rounded-full p-1 transition-colors"
                title="Clear Chat">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 hover:text-red-900 rounded-full p-1 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-secondary-light/70 text-white rounded-br-sm"
                      : msg.isError
                        ? "bg-red-900/30 text-red-200 rounded-bl-sm"
                        : "bg-gray-800 text-gray-100 rounded-bl-sm"
                  }`}>
                  <div className="text-sm leading-relaxed">
                    {formatMessageContent(msg.content).map((part, i) =>
                      part.type === "link" ? (
                        <a
                          key={i}
                          href={part.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${msg.role === "user" ? "text-blue-200" : "text-blue-600 dark:text-blue-400"} underline hover:opacity-80 break-all`}>
                          {part.text}
                        </a>
                      ) : (
                        <span key={i}>{renderFormattedText(part.content)}</span>
                      )
                    )}
                  </div>
                  {msg.audioUrl && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <button
                        onClick={() => playAudio(msg.audioUrl, msg.audioTitle)}
                        className="flex items-center gap-2 w-full px-3 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-lg transition-colors">
                        <svg
                          className="w-5 h-5 text-purple-600 dark:text-purple-400"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {msg.audioTitle || "Play Audio"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Click to play
                          </p>
                        </div>
                      </button>
                    </div>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      msg.role === "user"
                        ? "text-purple-100"
                        : "text-gray-500 dark:text-gray-400"
                    }`}></p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            {currentAudio && (
              <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {currentAudio.title || "Now Playing"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Audio Player
                    </p>
                  </div>
                  <button
                    onClick={stopAudio}
                    className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <audio
                  ref={audioRef}
                  src={currentAudio.url}
                  controls
                  className="w-full h-10"
                  onEnded={() => setCurrentAudio(null)}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            <div className="flex space-x-2">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 resize-none rounded-xl px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-secondary-light text-white rounded-xl px-4 py-3 hover:from-secondary-500 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
