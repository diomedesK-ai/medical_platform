"use client";
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  FaRegComments, 
  FaMicrophone, 
  FaPaperPlane, 
  FaSearch, 
  FaUserCircle, 
  FaCog,
  FaPlus,
  FaEllipsisV,
  FaPhone,
  FaInfoCircle,
  FaBell,
  FaArchive,
  FaTrash,
  FaStar,
  FaFilter,
  FaTimes,
  FaPhoneSlash,
  FaCloudUploadAlt,
  FaFileAlt,
  FaChevronRight,
  FaUndo,
  FaGlobe,
  FaUniversity
} from 'react-icons/fa';
import ContactCenterDashboard from '@/components/ContactCenterDashboard';
import ExperienceSelector from '@/components/ExperienceSelector';
import WealthAdvisorInterface from '@/components/WealthAdvisorInterface';
import BancassuranceInterface from '@/components/BancassuranceInterface';
import PatientServicesInterface from '@/components/PatientServicesInterface';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import SplashScreen from '@/components/SplashScreen';
import { getWealthAdvisorPrompt } from '@/utils/wealthAdvisorScenarios';

// Message type for ChatWindow
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unread: number;
  isOnline: boolean;
}

const NAV_ITEMS = [
  { icon: <FaPhone size={20} />, label: 'Healthcare Control Tower', key: 'contact', active: true },
  { icon: <FaGlobe size={20} />, label: 'Patient Care Concierge', key: 'citizen', active: false },
  { icon: <FaBell size={20} />, label: 'Alerts & Notifications', key: 'alerts', active: false },
  { icon: <FaArchive size={20} />, label: 'Knowledge Base', key: 'knowledge', active: false },
  { icon: <FaCog size={20} />, label: 'Global Settings', key: 'settings', active: false },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Emergency Department',
    lastMessage: 'Triage update: Chest pain patient (ID: MY001247) prioritized to urgent. ECG ordered and vitals monitored.',
    timestamp: '2 min ago',
    avatar: 'ED',
    unread: 2,
    isOnline: true
  },
  {
    id: '2',
    name: 'Cardiology',
    lastMessage: 'Consult scheduled for Ahmad Bin Abdullah. Echo at 11:15 AM; please review ECG and labs beforehand.',
    timestamp: '8 min ago',
    avatar: 'CD',
    unread: 3,
    isOnline: true
  },
  {
    id: '3',
    name: 'Radiology',
    lastMessage: 'Chest X-ray booked for 12:05 PM. No pregnancy or contrast allergy reported. Portable requested.',
    timestamp: '15 min ago',
    avatar: 'RAD',
    unread: 0,
    isOnline: true
  },
  {
    id: '4',
    name: 'Laboratory',
    lastMessage: 'CBC and Troponin results posted. Troponin pending confirmatory run in 10 minutes.',
    timestamp: '32 min ago',
    avatar: 'LAB',
    unread: 1,
    isOnline: false
  },
  {
    id: '5',
    name: 'Pharmacy',
    lastMessage: 'Medication reconciliation complete. Flagged interaction between simvastatin and clarithromycin; recommended alternative.',
    timestamp: '1 hour ago',
    avatar: 'RX',
    unread: 0,
    isOnline: true
  },
  {
    id: '6',
    name: 'Bed Management',
    lastMessage: 'ICU bed availability: 2. Step-down: 4. Estimated transfer readiness for MY001247 in 40 minutes.',
    timestamp: '2 hours ago',
    avatar: 'BED',
    unread: 0,
    isOnline: false
  },
  {
    id: '7',
    name: 'Discharge Planning',
    lastMessage: 'Tentative discharge tomorrow pending cardiology sign-off and home oxygen assessment.',
    timestamp: '3 hours ago',
    avatar: 'DC',
    unread: 2,
    isOnline: true
  },
  {
    id: '8',
    name: 'Patient Relations',
    lastMessage: 'Satisfaction survey reminder sent to three recent discharges. Two responses received (avg 4.6/5).',
    timestamp: '4 hours ago',
    avatar: 'PR',
    unread: 0,
    isOnline: true
  }
];

const MESSAGE_TABS = ['Comms', 'Priority', 'Escalations', 'Archive'];

function HomeContent() {
  // Add custom CSS for breathing animation and line clamp
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes breathe {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.2);
          opacity: 0.8;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const [showSplash, setShowSplash] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setShowSplash(true);
  }, []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedNav, setSelectedNav] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTranscript, setCallTranscript] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>(getWealthAdvisorPrompt());
  const [promptInput, setPromptInput] = useState<string>('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // URL routing for navigation
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'contact' | 'government' | 'health' | 'citizen' | 'bancassurance' | 'knowledge' | 'settings' | 'alerts'>('contact');

  // Handle URL-based navigation
  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'contact') {
      setCurrentView('contact');
      setSelectedNav(0); // Healthcare Control Tower nav item
    } else if (view === 'citizen') {
      setCurrentView('citizen');
      setSelectedNav(1); // Patient Care Concierge nav item
    } else if (view === 'alerts') {
      setCurrentView('alerts');
      setSelectedNav(2); // Alerts & Notifications nav item
    } else if (view === 'knowledge') {
      setCurrentView('knowledge');
      setSelectedNav(3); // Knowledge Base nav item
    } else if (view === 'settings') {
      setCurrentView('settings');
      setSelectedNav(4); // Global Settings nav item
    } else if (view === 'bancassurance') {
      setCurrentView('bancassurance');
      setSelectedNav(1); // Legacy Bancassurance uses patient services slot
    } else {
      setCurrentView('contact');
      setSelectedNav(0); // Default to Healthcare Control Tower
    }
  }, [searchParams]);

  // Navigation handler
  const handleNavigation = (navIndex: number, key: string) => {
    setSelectedNav(navIndex);
    if (key === 'contact') {
      setCurrentView('contact');
      router.push('/?view=contact');
    } else if (key === 'government') {
      setCurrentView('government');
      router.push('/?view=government');
    } else if (key === 'health') {
      setCurrentView('health');
      router.push('/?view=health');
    } else if (key === 'citizen') {
      setCurrentView('citizen');
      router.push('/?view=citizen');
    } else if (key === 'bancassurance') {
      setCurrentView('bancassurance');
      router.push('/?view=bancassurance');
    } else if (key === 'knowledge') {
      setCurrentView('knowledge');
      router.push('/?view=knowledge');
    } else if (key === 'settings') {
      setCurrentView('settings');
      router.push('/?view=settings');
    }
  };

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isUpdatingPrompt, setIsUpdatingPrompt] = useState(false);
  const [promptUpdated, setPromptUpdated] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isSessionReady, setIsSessionReady] = useState(false);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  // Knowledge Base states
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [vectorStoreId, setVectorStoreId] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  // Dynamic wallpaper detection
  const [wallpapers, setWallpapers] = useState([
    { name: 'Purple Gradient', path: '/purple-gradient-bg.jpg' }
  ]);
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);

  // Experience selector states
  const [selectedExperience, setSelectedExperience] = useState<string>('wealth');
  const [showWealthAdvisor, setShowWealthAdvisor] = useState(true);

  // Handle experience selection
  const handleExperienceSelect = (experience: string) => {
    setSelectedExperience(experience);
    if (experience === 'wealth') {
      setShowWealthAdvisor(true);
      // Set the wealth advisor prompt automatically
      const wealthPrompt = getWealthAdvisorPrompt();
      setCustomPrompt(wealthPrompt);
    } else {
      setShowWealthAdvisor(false);
    }
  };

  // Handle wealth advisor scenario selection
  const handleWealthScenarioSelect = (scenarioPrompt: string) => {
    setCustomPrompt(scenarioPrompt);
    setShowWealthAdvisor(false);
    // Show a welcome message for the selected scenario
    const welcomeMessage: Message = {
      role: 'assistant',
      content: "I've configured myself as your Private Wealth Advisor with the selected client scenario. I'm ready to provide comprehensive wealth management guidance. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMessage]);
  };

  // Handle immediate wealth advisor analysis
  const handleImmediateAnalysis = async (analysisPrompt: string, analysisType: string, clientName: string) => {
    setCustomPrompt(analysisPrompt);
    setShowWealthAdvisor(false);
    setLoading(true);

    // Add user message indicating the analysis request
    const userMessage: Message = {
      role: 'user',
      content: `Please provide a ${analysisType} for ${clientName}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      console.log('🚀 Starting immediate wealth analysis...');
      console.log('📝 Analysis type:', analysisType);
      console.log('💼 Client:', clientName);

      // Use the chat API which we know works
      const formattedPrompt = `${analysisPrompt}

**RESPONSE FORMATTING REQUIREMENTS:**
1. Use clear markdown formatting with headers (##, ###)
2. Use bullet points and numbered lists for recommendations
3. Include specific data points and percentages where relevant
4. Structure response with clear sections and subsections
5. End with a clear "Next Steps" or "Action Items" section
6. Use **bold** for key terms and important figures
7. Use tables for comparative data when applicable

Please provide a comprehensive, well-formatted response that follows these formatting guidelines.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [
            {
              role: 'user',
              content: formattedPrompt
            }
          ]
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('💬 Chat API response:', result);
      
      // Extract content from OpenAI chat completion format
      const content = result.choices?.[0]?.message?.content || 'Analysis completed successfully.';
      
      // Add the response to messages
      const responseMessage: Message = {
        role: 'assistant',
        content: content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error('Error in immediate analysis:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I apologize, but I encountered an error while generating the ${analysisType}. Please try again or let me know if you'd like assistance with something else.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Load available wallpapers dynamically
  React.useEffect(() => {
    const loadWallpapers = async () => {
      try {
        // Define potential wallpaper files (you can add more as needed)
        const potentialWallpapers = [
          { name: 'Purple Gradient', path: '/purple-gradient-bg.jpg' },
          { name: 'Color2', path: '/color2.jpg' },
          { name: 'Color3', path: '/color3.jpg' },
          { name: 'Color4', path: '/color4.jpg' },
          { name: 'Colorful', path: '/colorful.jpg' }
        ];

        // Check which files actually exist
        const availableWallpapers = [];
        for (const wallpaper of potentialWallpapers) {
          try {
            const response = await fetch(wallpaper.path, { method: 'HEAD' });
            if (response.ok) {
              availableWallpapers.push(wallpaper);
            }
          } catch (error) {
            // File doesn't exist, skip it
            console.log(`Wallpaper not found: ${wallpaper.path}`);
          }
        }

        if (availableWallpapers.length > 0) {
          setWallpapers(availableWallpapers);
        }
      } catch (error) {
        console.error('Error loading wallpapers:', error);
      }
    };

    loadWallpapers();
  }, []);

  // Load saved prompt, timestamp, and wallpaper from localStorage on component mount
  React.useEffect(() => {
    const savedPrompt = localStorage.getItem('customPrompt');
    const savedTimestamp = localStorage.getItem('lastUpdated');
    const savedWallpaper = localStorage.getItem('currentWallpaperIndex');
    
    if (savedPrompt) {
      setCustomPrompt(savedPrompt);
    }
    
    if (savedTimestamp) {
      setLastUpdated(savedTimestamp);
    }

    if (savedWallpaper) {
      setCurrentWallpaperIndex(parseInt(savedWallpaper));
    }
  }, []);

  // Save prompt to localStorage whenever it changes
  React.useEffect(() => {
    if (customPrompt !== 'Please add your prompt for your agent') {
      localStorage.setItem('customPrompt', customPrompt);
    }
  }, [customPrompt]);

  // Save timestamp to localStorage whenever it changes
  React.useEffect(() => {
    if (lastUpdated) {
      localStorage.setItem('lastUpdated', lastUpdated);
    }
  }, [lastUpdated]);

  // Save wallpaper index to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('currentWallpaperIndex', currentWallpaperIndex.toString());
  }, [currentWallpaperIndex]);

  // Generate welcome message based on custom prompt
  const generateWelcomeMessage = (prompt: string) => {
    if (prompt && prompt !== 'Please add your prompt for your agent') {
      // Extract key capabilities from the prompt
      const lowerPrompt = prompt.toLowerCase();
      let capabilities = [];
      
      if (lowerPrompt.includes('customer') || lowerPrompt.includes('service')) capabilities.push('customer service');
      if (lowerPrompt.includes('technical') || lowerPrompt.includes('support')) capabilities.push('technical support');
      if (lowerPrompt.includes('sales') || lowerPrompt.includes('business')) capabilities.push('business operations');
      if (lowerPrompt.includes('analytics') || lowerPrompt.includes('data')) capabilities.push('data analytics');
      if (lowerPrompt.includes('compliance') || lowerPrompt.includes('regulatory')) capabilities.push('compliance monitoring');
      if (lowerPrompt.includes('banking') || lowerPrompt.includes('financial')) capabilities.push('financial services');
      
      if (capabilities.length === 0) {
        capabilities = ['business intelligence', 'operational support'];
      }
      
      return `Welcome to your Healthcare AI Assistant. I'm configured to help you with ${capabilities.join(', ')}, and real-time patient services. How can I assist you today?`;
    }
    
    return 'Welcome to your Healthcare AI Assistant. I can help you with patient insights, operational analytics, compliance monitoring, and real-time healthcare services. How can I assist you today?';
  };

  // Initialize welcome message when component mounts or prompt changes
  React.useEffect(() => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: generateWelcomeMessage(customPrompt),
      timestamp: '10:30 AM'
    };
    
    setMessages([welcomeMessage]);
  }, [customPrompt]);

  // Change wallpaper function
  const changeWallpaper = () => {
    setCurrentWallpaperIndex((prev) => (prev + 1) % wallpapers.length);
  };

  // Load uploaded files for vector store
  const loadUploadedFiles = React.useCallback(async (storeId: string) => {
    try {
      console.log('🔄 Refreshing file status for vector store:', storeId);
      const response = await fetch(`/api/vector-store?vectorStoreId=${storeId}`);
      const data = await response.json();
      if (data.success) {
        console.log('📁 Files loaded:', data.files?.map((f: any) => ({ name: f.filename, status: f.status })) || []);
        setUploadedFiles(data.files || []);
        
        // Check if any files are still in progress
        const inProgressFiles = (data.files || []).filter((f: any) => f.status === 'in_progress');
        if (inProgressFiles.length > 0) {
          console.log('⏳ Files still processing:', inProgressFiles.length);
          console.log('📋 Processing details:', inProgressFiles.map((f: any) => ({ 
            name: f.filename, 
            size: f.bytes, 
            uploaded: new Date(f.created_at * 1000).toLocaleString() 
          })));
          
          // Auto-refresh after 10 seconds if files are still processing
          setTimeout(() => {
            console.log('🔄 Auto-refreshing due to in-progress files...');
            loadUploadedFiles(storeId);
          }, 10000);
        } else {
          console.log('✅ All files processed successfully');
        }
      }
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  }, []);

  // Initialize vector store on component mount
  React.useEffect(() => {
    const initializeVectorStore = async () => {
      const savedVectorStoreId = localStorage.getItem('vectorStoreId');
      if (savedVectorStoreId) {
        setVectorStoreId(savedVectorStoreId);
        loadUploadedFiles(savedVectorStoreId);
      } else {
        // Create new vector store
        try {
          const response = await fetch('/api/vector-store', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create' }),
          });
          const data = await response.json();
          if (data.success) {
            setVectorStoreId(data.vectorStore.id);
            localStorage.setItem('vectorStoreId', data.vectorStore.id);
          }
        } catch (error) {
          console.error('Failed to create vector store:', error);
        }
      }
    };

    initializeVectorStore();
  }, [loadUploadedFiles]);


  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    if (!vectorStoreId) {
      alert('Vector store not ready. Please try again.');
      return;
    }

    setIsUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('vectorStoreId', vectorStoreId);

      try {
        const response = await fetch('/api/upload-file', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          return data.file;
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(Boolean);
    
    if (successfulUploads.length > 0) {
      setUploadedFiles(prev => [...prev, ...successfulUploads]);
    }

    setIsUploading(false);
  };

  // Delete file from knowledge base
  const handleDeleteFile = async (fileId: string) => {
    try {
      const response = await fetch('/api/vector-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'delete_file', 
          vectorStoreId, 
          fileName: fileId 
        }),
      });

      const data = await response.json();
      if (data.success) {
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  // Voice-to-text (Web Speech API)
  const handleMic = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    
    recognition.onstart = () => {
      setListening(true);
      setIsTranscribing(true);
    };
    
    recognition.onend = () => {
      setListening(false);
      setIsTranscribing(false);
    };
    
    recognition.onerror = () => {
      setListening(false);
      setIsTranscribing(false);
    };
    
    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
      inputRef.current?.focus();
    };
    
    recognition.start();
  };

  // Send message (calls Realtime API, then function-calls Responses API for web search)
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((msgs) => [...msgs, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);
    
    try {
      console.log('🚀 Sending request to Responses API...');
      console.log('📝 Prompt:', customPrompt);
      console.log('💬 User input:', currentInput);
      console.log('📁 Vector store ID:', vectorStoreId);
      
      // Use Responses API for regular chat (with web search and file search capabilities)
      const webRes = await fetch('/api/openai-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `${customPrompt}

SEARCH INSTRUCTIONS:
- ALWAYS search uploaded documents THOROUGHLY for any information related to the user's query
- If documents contain relevant information, provide a comprehensive answer based on the documents
- If documents don't contain sufficient information, or if user specifically asks to "check online" or "search web", then use web search
- After providing document-based answers, ask the user: "Would you like me to check online for additional information?"
- MAINTAIN CONTEXT from previous messages in this conversation
- Be thorough and detailed in your analysis of document content
- If user says "check online", "search web", or similar, ALWAYS use web search

User Query: ${currentInput}

Please provide a helpful response. Search documents first, then web if needed or requested.`,
          vectorStoreId: vectorStoreId || undefined,
          stream: true
        }),
      });
      
      console.log('📡 Response status:', webRes.status);
      
      if (!webRes.ok) {
        const errorText = await webRes.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`API Error: ${webRes.status} - ${errorText}`);
      }
      
      let assistantResponse = '';
      let citations: any[] = [];
      
      // Handle streaming response
      if (webRes.headers.get('content-type')?.includes('text/event-stream')) {
        console.log('📡 Handling streaming response');
        
        // Add initial assistant message that will be updated
        const assistantMessage: Message = {
          role: 'assistant',
          content: '🔍 Searching...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((msgs) => [...msgs, assistantMessage]);
        
        const reader = webRes.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        if (reader) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              
              // Keep the last incomplete line in the buffer
              buffer = lines.pop() || '';
              
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const jsonStr = line.slice(6).trim();
                  if (jsonStr === '[DONE]') {
                    console.log('🏁 Streaming completed');
                    break;
                  }
                  
                  if (jsonStr === '') continue; // Skip empty data lines
                  
                  try {
                    const data = JSON.parse(jsonStr);
                    console.log('📦 Streaming data:', data);
                    
                    // Handle different streaming event types from Responses API
                    if (data.output && Array.isArray(data.output)) {
                      for (const output of data.output) {
                        // Handle message content updates
                        if (output.type === 'message' && output.content) {
                          for (const content of output.content) {
                            if (content.type === 'output_text' && content.text) {
                              assistantResponse = content.text;
                              
                              // Collect citations
                              if (content.annotations) {
                                citations = content.annotations;
                              }
                              
                              // Update the message in real-time
                              setMessages((msgs) => {
                                const newMsgs = [...msgs];
                                const lastMsg = newMsgs[newMsgs.length - 1];
                                if (lastMsg.role === 'assistant') {
                                  lastMsg.content = assistantResponse;
                                }
                                return newMsgs;
                              });
                            }
                          }
                        }
                        // Handle file search status updates
                        else if (output.type === 'file_search_call') {
                          if (output.status === 'in_progress') {
                            setMessages((msgs) => {
                              const newMsgs = [...msgs];
                              const lastMsg = newMsgs[newMsgs.length - 1];
                              if (lastMsg.role === 'assistant') {
                                lastMsg.content = '📄 Searching documents...';
                              }
                              return newMsgs;
                            });
                          } else if (output.status === 'completed') {
                            console.log('✅ File search completed');
                          }
                        }
                      }
                    }
                    
                    // Handle direct response updates (alternative format)
                    if (data.type === 'response.output_text.delta' && data.delta) {
                      assistantResponse += data.delta;
                      setMessages((msgs) => {
                        const newMsgs = [...msgs];
                        const lastMsg = newMsgs[newMsgs.length - 1];
                        if (lastMsg.role === 'assistant') {
                          lastMsg.content = assistantResponse;
                        }
                        return newMsgs;
                      });
                    }
                    
                    // Handle completion events
                    if (data.type === 'response.done' || data.status === 'completed') {
                      console.log('✅ Response completed');
                    }
                    
                  } catch (e) {
                    console.log('⚠️ JSON Parse Error:', e, 'Raw line:', jsonStr);
                  }
                }
              }
            }
          } catch (streamError) {
            console.error('❌ Streaming error:', streamError);
          }
        }
        
        // Add citations after streaming is complete
        if (citations.length > 0) {
          const webCitations = citations.filter((a: any) => a.type === 'url_citation');
          const fileCitations = citations.filter((a: any) => a.type === 'file_citation');
          
          if (webCitations.length > 0 || fileCitations.length > 0) {
            assistantResponse += '\n\n**Sources:**\n';
            
            // Web sources
            webCitations.forEach((annotation: any, index: number) => {
              assistantResponse += `${index + 1}. [${annotation.title || 'Web Source'}](${annotation.url})\n`;
            });
            
            // File sources
            fileCitations.forEach((annotation: any, index: number) => {
              const fileIndex = webCitations.length + index + 1;
              assistantResponse += `${fileIndex}. 📄 ${annotation.filename || 'Document'}\n`;
            });
            
            // Update final message with citations
            setMessages((msgs) => {
              const newMsgs = [...msgs];
              const lastMsg = newMsgs[newMsgs.length - 1];
              if (lastMsg.role === 'assistant') {
                lastMsg.content = assistantResponse;
              }
              return newMsgs;
            });
          }
        }
      } else {
        // Handle regular JSON response (fallback)
        console.log('📦 Handling regular JSON response');
        const webData = await webRes.json();
        console.log('📦 Response data:', webData);
        console.log('🔍 Parsing response data structure:', JSON.stringify(webData, null, 2));
        
        // Handle the Responses API format - check multiple possible structures
        if (webData) {
          // Try direct output array first
          if (webData.output && Array.isArray(webData.output)) {
            console.log('📋 Found direct output array');
            
            // Look for message type in output array
            const messageOutput = webData.output.find((o: any) => o.type === 'message');
            if (messageOutput && messageOutput.content && Array.isArray(messageOutput.content)) {
              const textContent = messageOutput.content.find((c: any) => c.type === 'output_text');
              if (textContent && textContent.text) {
                assistantResponse = textContent.text;
                console.log('✅ Extracted text from message in direct output');
                
                // Add citations if available
                if (textContent.annotations && textContent.annotations.length > 0) {
                  const webCitations = textContent.annotations.filter((a: any) => a.type === 'url_citation');
                  const fileCitations = textContent.annotations.filter((a: any) => a.type === 'file_citation');
                  
                  if (webCitations.length > 0 || fileCitations.length > 0) {
                    assistantResponse += '\n\n**Sources:**\n';
                    
                    // Web sources
                    webCitations.forEach((annotation: any, index: number) => {
                      assistantResponse += `${index + 1}. [${annotation.title || 'Web Source'}](${annotation.url})\n`;
                    });
                    
                    // File sources
                    fileCitations.forEach((annotation: any, index: number) => {
                      const fileIndex = webCitations.length + index + 1;
                      assistantResponse += `${fileIndex}. 📄 ${annotation.filename || 'Document'}\n`;
                    });
                  }
                }
              }
            }
            
            // Fallback to direct output_text type
            if (!assistantResponse) {
              const textOutput = webData.output.find((o: any) => o.type === 'output_text');
              if (textOutput && textOutput.text) {
                assistantResponse = textOutput.text;
                console.log('✅ Extracted text from direct output fallback');
              }
            }
          }
          
          // Try nested response.output structure
          else if (webData.response && webData.response.output && Array.isArray(webData.response.output)) {
            console.log('📋 Found nested response.output array');
            
            // Look for message type first
            const messageOutput = webData.response.output.find((o: any) => o.type === 'message');
            if (messageOutput && messageOutput.content && Array.isArray(messageOutput.content)) {
              const textContent = messageOutput.content.find((c: any) => c.type === 'output_text');
              if (textContent && textContent.text) {
                assistantResponse = textContent.text;
                console.log('✅ Extracted text from message content');
                
                // Add citations if available
                if (textContent.annotations && textContent.annotations.length > 0) {
                  const webCitations = textContent.annotations.filter((a: any) => a.type === 'url_citation');
                  const fileCitations = textContent.annotations.filter((a: any) => a.type === 'file_citation');
                  
                  if (webCitations.length > 0 || fileCitations.length > 0) {
                    assistantResponse += '\n\n**Sources:**\n';
                    
                    // Web sources
                    webCitations.forEach((annotation: any, index: number) => {
                      assistantResponse += `${index + 1}. [${annotation.title || 'Web Source'}](${annotation.url})\n`;
                    });
                    
                    // File sources
                    fileCitations.forEach((annotation: any, index: number) => {
                      const fileIndex = webCitations.length + index + 1;
                      assistantResponse += `${fileIndex}. 📄 ${annotation.filename || 'Document'}\n`;
                    });
                  }
                }
              }
            }
            
            // Fallback to direct output_text in response.output
            if (!assistantResponse) {
              const textOutput = webData.response.output.find((o: any) => o.type === 'output_text');
              if (textOutput && textOutput.text) {
                assistantResponse = textOutput.text;
                console.log('✅ Extracted text from response output fallback');
              }
            }
          }
          
          // Try other possible structures
          else if (webData.choices && Array.isArray(webData.choices) && webData.choices[0]) {
            console.log('📋 Found choices array (Chat API format)');
            const choice = webData.choices[0];
            if (choice.message && choice.message.content) {
              assistantResponse = choice.message.content;
              console.log('✅ Extracted text from choices format');
            }
          }
          
          // Direct text property
          else if (webData.text) {
            assistantResponse = webData.text;
            console.log('✅ Extracted direct text property');
          }
          
          // Content property
          else if (webData.content) {
            assistantResponse = webData.content;
            console.log('✅ Extracted direct content property');
          }
        }
        
        if (!assistantResponse) {
          console.warn('⚠️ Could not extract response text from any known format');
          console.log('🔍 Full response structure:', webData);
        }
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: assistantResponse || 'I apologize, but I was unable to generate a response. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages((msgs) => [...msgs, assistantMessage]);
      }
      
      // If streaming was used, the message was already added during streaming
      if (!webRes.headers.get('content-type')?.includes('text/event-stream') && assistantResponse) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: assistantResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages((msgs) => [...msgs, assistantMessage]);
      }
    } catch (e) {
      console.error('Chat error:', e);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Error: Could not get response. Please check your connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((msgs) => [...msgs, errorMessage]);
    }
    setLoading(false);
  };

  // Explicit web search button (only web search, not chat)
  const handleWebSearchButton = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const webRes = await fetch('/api/openai-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const webData = await webRes.json();
      
      let webSummary = '';
      if (webData && webData.output && webData.output.length > 0) {
        // Handle the new Responses API format
        const messageOutput = webData.output.find((o: any) => o.type === 'message');
        if (messageOutput && messageOutput.content) {
          const textContent = messageOutput.content.find((c: any) => c.type === 'output_text');
          if (textContent && textContent.text) {
            webSummary = textContent.text;
            
            // Add citations if available
            if (textContent.annotations && textContent.annotations.length > 0) {
              webSummary += '\n\n**Sources:**\n';
              textContent.annotations.forEach((annotation: any, index: number) => {
                if (annotation.type === 'url_citation') {
                  webSummary += `${index + 1}. [${annotation.title}](${annotation.url})\n`;
                }
              });
            }
          }
        }
        
        // Fallback to direct output_text type
        if (!webSummary) {
          const out = webData.output.find((o: any) => o.type === 'output_text');
          if (out && out.text) {
            webSummary = out.text;
          }
        }
      }
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: `Web Search Result:\n${webSummary}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((msgs) => [...msgs, assistantMessage]);
    } catch (e) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Error: Web search failed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((msgs) => [...msgs, errorMessage]);
    }
    setLoading(false);
  };

  // Generate custom prompt using OpenAI
  const handleGeneratePrompt = async () => {
    if (!promptInput.trim()) return;
    
    setIsGeneratingPrompt(true);
    try {
      const response = await fetch('/api/openai-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Create a detailed, professional AI assistant prompt for: "${promptInput}". The prompt should be comprehensive, include specific instructions for tone, expertise, and behavior. Make it suitable for a business/enterprise context. Return only the prompt text, no explanations.`
        }),
      });
      
      const data = await response.json();
      
      if (data && data.output && data.output.length > 0) {
        const output = data.output.find((o: any) => o.type === 'output_text');
        if (output && output.text) {
          setCustomPrompt(output.text);
          setPromptInput('');
        }
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  // Update AI prompt for realtime API
  const handleUpdatePrompt = async () => {
    if (!customPrompt.trim()) return;
    
    setIsUpdatingPrompt(true);
    setPromptUpdated(false);
    
    try {
      // Step 1: Enhance the prompt using OpenAI with streaming
      console.log('🔄 Enhancing prompt with OpenAI...');
      
      const enhanceResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `You are an expert AI prompt engineer. Please enhance the following prompt to make it enterprise-grade and highly effective.

CURRENT PROMPT TO ENHANCE:
"${customPrompt}"

REQUIREMENTS:
1. Make it professional and comprehensive for enterprise use
2. Add specific instructions for tone, behavior, and capabilities
3. Include guidelines for voice calls and text conversations
4. Add context handling and response formatting instructions
5. Include safety and professional conduct guidelines
6. Make it suitable for customer service and business interactions
7. Add instructions for handling complex queries and escalation
8. Include personality traits that build trust and rapport
9. Add technical specifications for optimal performance
10. Ensure it maintains conversation context and builds on previous responses

IMPORTANT: Your response must be in this exact format:
SUMMARY: [One sentence describing what this AI assistant does]
---
[The complete enhanced prompt]

Please create an enhanced, professional version of this prompt.`
          }],
          stream: true
        }),
      });

      if (!enhanceResponse.ok) {
        throw new Error('Failed to enhance prompt');
      }

      // Step 2: Stream the enhanced prompt and update the display in real-time
      const reader = enhanceResponse.body?.getReader();
      const decoder = new TextDecoder();
      let enhancedPrompt = '';
      
      console.log('📡 Starting to stream enhanced prompt...');
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === '[DONE]') {
                console.log('🏁 Streaming completed');
                break;
              }
              
              try {
                const data = JSON.parse(jsonStr);
                console.log('📦 Received data:', data);
                
                // Handle Chat Completions API streaming format
                if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
                  const content = data.choices[0].delta.content;
                  enhancedPrompt += content;
                  console.log('📝 Streaming prompt update:', enhancedPrompt.length, 'characters');
                  
                  // Show streaming in textarea - display the raw content as it comes
                  setCustomPrompt(enhancedPrompt);
                }
              } catch (e) {
                console.log('⚠️ JSON Parse Error:', e instanceof Error ? e.message : 'Unknown error');
                console.log('⚠️ Problematic line:', line);
                
                // Try to extract text content even if JSON parsing fails
                if (line.includes('"text":"')) {
                  try {
                    // Extract text content using regex as fallback
                    const textMatch = line.match(/"text":"([^"\\]*(\\.[^"\\]*)*)"/);
                    if (textMatch && textMatch[1]) {
                      const extractedText = textMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                      enhancedPrompt += extractedText;
                      console.log('📝 Extracted text via regex:', extractedText.length, 'characters');
                      setCustomPrompt(enhancedPrompt);
                    }
                  } catch (regexError) {
                    console.log('⚠️ Regex extraction also failed:', regexError);
                  }
                }
              }
            }
          }
        }
      }
      
      console.log('✅ Final enhanced prompt length:', enhancedPrompt.length);
      console.log('📄 Enhanced prompt preview:', enhancedPrompt.substring(0, 200) + '...');
      
      // If streaming didn't capture the content, try to get it from the final response
      if (!enhancedPrompt.trim()) {
        console.log('🔄 Streaming didn\'t capture content, trying non-streaming approach...');
        
        const fallbackResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [{
              role: 'user',
              content: `You are an expert AI prompt engineer. Please enhance the following prompt to make it enterprise-grade and highly effective.

CURRENT PROMPT TO ENHANCE:
"${customPrompt}"

REQUIREMENTS:
1. Make it professional and comprehensive for enterprise use
2. Add specific instructions for tone, behavior, and capabilities
3. Include guidelines for voice calls and text conversations
4. Add context handling and response formatting instructions
5. Include safety and professional conduct guidelines
6. Make it suitable for customer service and business interactions
7. Add instructions for handling complex queries and escalation
8. Include personality traits that build trust and rapport
9. Add technical specifications for optimal performance
10. Ensure it maintains conversation context and builds on previous responses

IMPORTANT: Your response must be in this exact format:
SUMMARY: [One sentence describing what this AI assistant does]
---
[The complete enhanced prompt]

Please create an enhanced, professional version of this prompt.`
            }],
            stream: false
          }),
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log('📦 Fallback response:', fallbackData);
          
          // Extract the enhanced prompt from the Chat API response
          if (fallbackData.choices && fallbackData.choices[0] && fallbackData.choices[0].message && fallbackData.choices[0].message.content) {
            enhancedPrompt = fallbackData.choices[0].message.content;
            setCustomPrompt(enhancedPrompt); // Update textarea with fallback content
            console.log('✅ Got enhanced prompt from fallback:', enhancedPrompt.length, 'characters');
          }
          
          // Additional fallback - try to get any text content from the response
          if (!enhancedPrompt && fallbackData.response) {
            console.log('🔄 Trying additional fallback extraction...');
            const responseStr = JSON.stringify(fallbackData.response);
            const textMatches = responseStr.match(/"text":"([^"\\]*(\\.[^"\\]*)*)"/g);
            if (textMatches && textMatches.length > 0) {
              // Get the longest text content (likely the main response)
              let longestText = '';
              for (const match of textMatches) {
                const textMatch = match.match(/"text":"([^"\\]*(\\.[^"\\]*)*)"/);
                if (textMatch && textMatch[1] && textMatch[1].length > longestText.length) {
                  longestText = textMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                }
              }
              if (longestText) {
                enhancedPrompt = longestText;
                setCustomPrompt(enhancedPrompt);
                console.log('✅ Got enhanced prompt from additional fallback:', enhancedPrompt.length, 'characters');
              }
            }
          }
        }
      }
      
      // Extract summary and final prompt
      let finalPrompt = '';
      let promptSummary = '';
      
      if (enhancedPrompt.trim()) {
        // Try to extract summary and prompt from the response
        const parts = enhancedPrompt.split('---');
        if (parts.length > 1) {
          // Extract summary from first part
          const summaryMatch = parts[0].match(/SUMMARY:\s*(.+)/i);
          if (summaryMatch) {
            promptSummary = summaryMatch[1].trim();
          } else {
            // Fallback: analyze the prompt content for meaningful summary
            const content = parts[1].toLowerCase();
            if (content.includes('cimb bank') || content.includes('banking')) {
              if (content.includes('contact center') || content.includes('customer service')) {
                promptSummary = 'CIMB Bank contact center assistant specializing in financial services and customer support';
              } else {
                promptSummary = 'professional banking and financial services assistant';
              }
            } else if (content.includes('customer') && content.includes('service')) {
              promptSummary = 'professional customer service representative';
            } else {
              promptSummary = 'professional AI assistant with enhanced capabilities';
            }
          }
          finalPrompt = parts[1].trim();
        } else {
          // No separator found, use the whole content as prompt
          finalPrompt = enhancedPrompt.trim();
          
          // Analyze the content to generate a meaningful summary
          const content = finalPrompt.toLowerCase();
          
          if (content.includes('cimb bank') || content.includes('banking')) {
            if (content.includes('contact center') || content.includes('customer service')) {
              promptSummary = 'CIMB Bank contact center assistant specializing in financial services and customer support';
            } else {
              promptSummary = 'professional banking and financial services assistant';
            }
          } else if (content.includes('customer') && content.includes('service')) {
            promptSummary = 'professional customer service representative';
          } else if (content.includes('support') && content.includes('technical')) {
            promptSummary = 'technical support specialist';
          } else if (content.includes('assistant') && content.includes('professional')) {
            promptSummary = 'professional AI assistant with enhanced capabilities';
          } else {
            promptSummary = 'professional AI assistant';
          }
        }
        
        // Keep the full enhanced prompt in the textarea (including summary if present)
        setCustomPrompt(enhancedPrompt.trim());
        console.log('🎯 Final prompt set successfully');
        console.log('📝 Summary:', promptSummary);
      } else {
        throw new Error('Enhanced prompt is empty - OpenAI may not have responded correctly');
      }

      // Step 3: Test the enhanced prompt with OpenAI Realtime API
      console.log('🔄 Validating enhanced prompt with Realtime API...');
      
      const testResponse = await fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt
        }),
      });
      
      if (!testResponse.ok) {
        throw new Error('Failed to validate enhanced prompt with OpenAI Realtime API');
      }
      
      // Step 4: Update everything with the new enhanced prompt
      console.log('✅ AI prompt enhanced and validated successfully');
      
      // Update the welcome message to reflect the new prompt with summary
      setMessages(prev => {
        const updatedMessages = [...prev];
        // Find and update the first AI message (welcome message)
        const welcomeIndex = updatedMessages.findIndex(msg => msg.role === 'assistant');
        if (welcomeIndex !== -1) {
          // Clean the summary of any markdown formatting
          const cleanSummary = promptSummary.replace(/\*\*/g, '').replace(/\*/g, '').trim();
          updatedMessages[welcomeIndex] = {
            ...updatedMessages[welcomeIndex],
            content: `Welcome! I'm your ${cleanSummary}. How can I help you today?`
          };
        }
        return updatedMessages;
      });
      
      // Add simple confirmation message to chat with summary
      const cleanSummary = promptSummary.replace(/\*\*/g, '').replace(/\*/g, '').trim();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ **AI Prompt Successfully Enhanced & Updated!**

I'm now your **${cleanSummary}** and ready to assist you with enhanced capabilities across all voice calls and conversations.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      
      // Show success indicator and set timestamp
      setPromptUpdated(true);
      setLastUpdated(new Date().toLocaleString());
      
      // Hide the success indicator after 3 seconds
      setTimeout(() => {
        setPromptUpdated(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error updating prompt:', error);
      
      // Add detailed error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ **Failed to Update AI Prompt**

**Error:** ${error instanceof Error ? error.message : 'Unknown error occurred'}

**Please try:**
• Check your internet connection
• Ensure your prompt is clear and well-formatted
• Try again in a few moments

Your original prompt has been preserved.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
    setIsUpdatingPrompt(false);
  };

  const handleResetPrompt = () => {
    setCustomPrompt('');
    localStorage.removeItem('customPrompt');
    setPromptUpdated(false);
    setLastUpdated('');
  };

  const filteredConversations = MOCK_CONVERSATIONS.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Phone call functions with real OpenAI Realtime API integration
  // Send event to OpenAI via data channel
  const sendClientEvent = (message: any) => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      message.event_id = message.event_id || crypto.randomUUID();
      dataChannelRef.current.send(JSON.stringify(message));
      console.log('📤 Sent event:', message.type);
    } else {
      console.error('❌ Data channel not ready, message dropped:', message.type);
    }
  };

  const startCall = async () => {
    try {
      setIsCallActive(true);
      setCallDuration(0);
      setCallTranscript('');
      setIsSessionReady(false);

      console.log('🔑 Getting ephemeral token...');
      
      // Get ephemeral token from our API
      const tokenResponse = await fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: customPrompt
        }),
      });
      
      if (!tokenResponse.ok) {
        throw new Error('Failed to get ephemeral token');
      }
      
      const tokenData = await tokenResponse.json();
      const EPHEMERAL_KEY = tokenData.client_secret.value;
      console.log('✅ Got ephemeral token');

      // Create a peer connection
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // Set up to play remote audio from the model
      const audioElement = document.createElement('audio');
      audioElement.autoplay = true;
      audioElementRef.current = audioElement;
      
      pc.ontrack = (e) => {
        console.log('🎵 Received audio track from OpenAI');
        audioElement.srcObject = e.streams[0];
      };

      // Add local audio track for microphone input
      console.log('🎤 Getting microphone access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      mediaStreamRef.current = mediaStream;
      pc.addTrack(mediaStream.getTracks()[0]);
      console.log('✅ Added microphone track to peer connection');

      // Set up data channel for sending and receiving events
      const dataChannel = pc.createDataChannel('oai-events');
      dataChannelRef.current = dataChannel;

      // Set up data channel event listeners
      dataChannel.addEventListener('open', () => {
        console.log('📡 Data channel opened');
        setIsSessionReady(true);
        
        // Configure session to enable audio transcription
        sendClientEvent({
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: `SYSTEM CONTEXT RULES (ALWAYS FOLLOW):
1. MAINTAIN CONVERSATION CONTEXT: Always remember and reference previous parts of our conversation. When users ask follow-up questions, consider the full conversation history.
2. REFERENCE PREVIOUS TOPICS: If a user asks "what about that?" or "tell me more" or similar follow-ups, refer back to what we were discussing.
3. BUILD ON PREVIOUS RESPONSES: Each response should acknowledge and build upon previous exchanges in the conversation.
4. CONVERSATION CONTINUITY: Treat each interaction as part of an ongoing dialogue, not isolated queries.
5. CONTEXT AWARENESS: Always consider what has been said before when formulating responses.

WEB SEARCH RULES:
- If user asks to "check online", "search web", "look it up", or similar phrases, ALWAYS use web_search function
- If you don't have current information about something, offer to search the web
- For current events, news, or time-sensitive information, automatically suggest web search
- When providing answers, if web search would be helpful, ask: "Would you like me to search online for more current information?"
- For financial markets, interest rates, exchange rates, or economic data: IMMEDIATELY use web_search function
- WEALTH ADVISORS ALWAYS need current market data - use web_search proactively

DOCUMENT SEARCH CAPABILITY:
- You have access to uploaded documents through file search
- ALWAYS search uploaded documents THOROUGHLY for any information related to the user's query
- If documents contain relevant information, provide a comprehensive answer based on the documents
- If documents don't contain sufficient information, or if user specifically asks to "check online" or "search web", then use web search

USER ROLE INSTRUCTIONS:
${customPrompt}`,
            voice: 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: {
              model: 'whisper-1'
            },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 200
            },
            tools: [
              {
                type: 'function',
                name: 'web_search',
                description: 'Search the web for current information. Use when user asks to check online or when current information is needed.',
                parameters: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      description: 'The search query'
                    }
                  },
                  required: ['query']
                }
              },
              {
                type: 'function',
                name: 'document_search',
                description: 'Search uploaded documents for information. Use when user asks about documents or when document information is needed.',
                parameters: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      description: 'The search query for documents'
                    }
                  },
                  required: ['query']
                }
              }
            ],
            tool_choice: 'auto'
          }
        });
        
        // Add call started message to main chat
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '🎙️ Voice call started. You can now speak...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      });

      dataChannel.addEventListener('message', (e) => {
        try {
          const event = JSON.parse(e.data);
          console.log('📨 Received event:', event.type);
          handleRealtimeEvent(event);
        } catch (error) {
          console.error('Error parsing data channel message:', error);
        }
      });

      dataChannel.addEventListener('close', () => {
        console.log('📡 Data channel closed');
      });

      // Start the session using the Session Description Protocol (SDP)
      console.log('🤝 Creating WebRTC offer...');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = 'https://api.openai.com/v1/realtime';
      const model = 'gpt-4o-realtime-preview-2024-12-17';
      
      console.log('📡 Sending SDP offer to OpenAI...');
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          'Authorization': `Bearer ${EPHEMERAL_KEY}`,
          'Content-Type': 'application/sdp',
        },
      });

      if (!sdpResponse.ok) {
        throw new Error(`SDP request failed: ${sdpResponse.status}`);
      }

      const answerSdp = await sdpResponse.text();
      console.log('✅ Received SDP answer from OpenAI');
      
      const answer = {
        type: 'answer' as RTCSdpType,
        sdp: answerSdp,
      };
      
      await pc.setRemoteDescription(answer);
      console.log('🎉 WebRTC connection established!');

    } catch (error) {
      console.error('Error starting call:', error);
      setIsCallActive(false);
      setIsSessionReady(false);
    }
  };

  // Handle realtime events from OpenAI
  const handleRealtimeEvent = (event: any) => {
    console.log('📨 Received event:', event.type, event);
    
    switch (event.type) {
      case 'response.audio.delta':
        // Audio is handled automatically by WebRTC
        break;
        
      case 'response.function_call_arguments.done':
        // Handle function calls
        console.log('🔧 Function call detected:', event.name, event.arguments);
        if (event.name === 'web_search') {
          const args = JSON.parse(event.arguments);
          console.log('🌐 AI is searching the web for:', args.query);
          setCallTranscript(prev => prev + `\n\n🔍 **Searching web:** ${args.query}\n\n`);
          
          // Also add to main chat for visibility
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `🔍 Searching the web for: "${args.query}"...`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          
          handleWebSearch(args.query, event.call_id);
        } else if (event.name === 'document_search') {
          const args = JSON.parse(event.arguments);
          console.log('📄 AI is searching documents for:', args.query);
          setCallTranscript(prev => prev + `\n\n📄 **Searching documents:** ${args.query}\n\n`);
          handleDocumentSearch(args.query, event.call_id);
        }
        break;
        
      case 'input_audio_buffer.speech_started':
        console.log('User started speaking');
        setCallTranscript(prev => prev + `\n\n🎤 **You:** `);
        break;
        
      case 'input_audio_buffer.speech_stopped':
        console.log('User stopped speaking');
        break;
        
      case 'response.text.delta':
        console.log('AI response delta:', event.delta);
        if (event.delta) {
          setCallTranscript(prev => {
            // Check if we need to add AI response header
            if (!prev.includes('🤖 **AI:**')) {
              return prev + `\n\n🤖 **AI:** ${event.delta}`;
            }
            return prev + event.delta;
          });
        }
        break;

      case 'response.audio_transcript.delta':
        console.log('AI audio transcript delta:', event.delta);
        if (event.delta) {
          setCallTranscript(prev => {
            // Check if we need to add AI response header
            if (!prev.includes('🤖 **AI:**')) {
              return prev + `\n\n🤖 **AI:** ${event.delta}`;
            }
            return prev + event.delta;
          });
        }
        break;

      case 'response.audio_transcript.done':
        console.log('AI audio transcript done:', event.transcript);
        if (event.transcript) {
          // Add AI response to main chat
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: event.transcript,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          
          setCallTranscript(prev => {
            // Replace or add the complete AI response
            if (prev.includes('🤖 **AI:**')) {
              // Replace the AI response section with the complete transcript
              const lines = prev.split('\n');
              const aiIndex = lines.findLastIndex(line => line.includes('🤖 **AI:**'));
              if (aiIndex !== -1) {
                lines[aiIndex] = `🤖 **AI:** ${event.transcript}`;
                // Remove any subsequent lines that were partial responses
                return lines.slice(0, aiIndex + 1).join('\n') + '\n\n';
              }
            }
            return prev + `\n\n🤖 **AI:** ${event.transcript}\n\n`;
          });
        }
        break;

      case 'conversation.item.input_audio_transcription.completed':
        console.log('User said:', event.transcript);
        if (event.transcript) {
          // Add user message to main chat
          setMessages(prev => [...prev, {
            role: 'user',
            content: event.transcript,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          
          setCallTranscript(prev => {
            // Replace the last "🎤 **You:** " with the actual transcript
            const lines = prev.split('\n');
            const lastLineIndex = lines.findLastIndex(line => line.includes('🎤 **You:**'));
            if (lastLineIndex !== -1) {
              lines[lastLineIndex] = `🎤 **You:** ${event.transcript}`;
              return lines.join('\n');
            }
            return prev + `\n\n🎤 **You:** ${event.transcript}\n\n`;
          });
        }
        break;

      case 'response.text.done':
        console.log('AI text response done:', event.text);
        if (event.text) {
          // Add AI response to main chat
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: event.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          
          setCallTranscript(prev => prev + `\n\n🤖 **AI:** ${event.text}\n\n`);
        }
        break;
        
      case 'response.done':
        console.log('Response completed');
        break;

      case 'error':
        console.error('OpenAI API Error:', event);
        setCallTranscript(prev => prev + `\n\n❌ **Error:** ${event.error?.message || 'Unknown error'}\n\n`);
        break;
        
      default:
        console.log('Unhandled event type:', event.type, event);
        break;
    }
  };

  // Handle web search function call with streaming
  const handleWebSearch = async (query: string, callId: string) => {
    try {
      console.log('🚀 Starting web search for:', query, 'with callId:', callId);
      
      // Call our streaming web search API
      const response = await fetch('/api/web-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      console.log('📡 Web search API response status:', response.status);
      
      if (!response.ok) {
        console.error('❌ Web search API error:', response.status, response.statusText);
        throw new Error('Web search failed');
      }
      
      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }
      
      const decoder = new TextDecoder();
      let buffer = '';
      let searchResults = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              
              if (parsed.type === 'status') {
                // Update transcript with search status
                setCallTranscript(prev => prev + `\n\n${parsed.message}\n\n`);
              } else if (parsed.type === 'content' && (parsed.text || parsed.content)) {
                // Accumulate search results from content chunks
                const contentText = parsed.content || parsed.text;
                console.log('📄 Main page received content:', contentText?.substring(0, 100));
                searchResults += contentText;
                // Update transcript in real-time with better formatting
                setCallTranscript(prev => {
                  const lines = prev.split('\n');
                  const lastSearchIndex = lines.findLastIndex(line => line.includes('🔍 Searching:'));
                  if (lastSearchIndex !== -1) {
                    // Replace everything after the search indicator with updated results
                    const beforeSearch = lines.slice(0, lastSearchIndex + 1).join('\n');
                    
                    // Format the search results nicely
                    const formattedResults = searchResults
                      .replace(/## /g, '\n\n**')
                      .replace(/\n\*/g, '\n• ')
                      .replace(/°F/g, '°F')
                      .replace(/°C/g, '°C')
                      .trim();
                    
                    return beforeSearch + `\n\n📊 **Live Results:**\n${formattedResults}\n\n`;
                  }
                  return prev + searchResults;
                });
              } else if (parsed.type === 'complete') {
                // Search completed - add final formatted results to main chat
                if (searchResults.trim()) {
                  // Format the final results for the main chat
                  const finalResults = searchResults
                    .replace(/## /g, '\n**')
                    .replace(/\n\*/g, '\n• ')
                    .replace(/°F/g, '°F')
                    .replace(/°C/g, '°C')
                    .trim();
                  
                  // Add search results to main chat
                  setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `🔍 **Search Results:**\n\n${finalResults}`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }]);
                }
                
                setCallTranscript(prev => prev + `\n\n${parsed.message}\n\n`);
                
                // Send final results back to OpenAI
                sendClientEvent({
                  type: 'conversation.item.create',
                  item: {
                    type: 'function_call_output',
                    call_id: callId,
                    output: searchResults || 'Search completed successfully'
                  }
                });
                
                // Trigger response generation
                sendClientEvent({
                  type: 'response.create'
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Error handling web search:', error);
      
      // Send error back to OpenAI
      sendClientEvent({
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: callId,
          output: JSON.stringify({ error: 'Web search failed' })
        }
      });
    }
  };

  // Handle document search function call with streaming
  const handleDocumentSearch = async (query: string, callId: string) => {
    try {
      console.log('Performing document search for:', query);
      
      if (!vectorStoreId) {
        const errorMsg = 'No documents uploaded. Please upload documents first.';
        setCallTranscript(prev => prev + `\n\n❌ **Error:** ${errorMsg}\n\n`);
        
        // Send error back to OpenAI
        sendClientEvent({
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id: callId,
            output: errorMsg
          }
        });
        return;
      }
      
      // Call our document search API (same pattern as web search)
      const response = await fetch('/api/document-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: query,
          vectorStoreId: vectorStoreId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Document search failed');
      }
      
      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }
      
      const decoder = new TextDecoder();
      let buffer = '';
      let searchResults = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              // Document search completed
              if (searchResults.trim()) {
                // Add search results to main chat
                setMessages(prev => [...prev, {
                  role: 'assistant',
                  content: `📄 **Document Search Results:**\n\n${searchResults}`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
              }
              
              setCallTranscript(prev => prev + `\n\n✅ Document search completed!\n\n`);
              
              // Send results back to OpenAI
              sendClientEvent({
                type: 'conversation.item.create',
                item: {
                  type: 'function_call_output',
                  call_id: callId,
                  output: searchResults || 'Document search completed successfully'
                }
              });
              
              // Trigger response generation
              sendClientEvent({
                type: 'response.create'
              });
              return;
            }
            
            try {
              const parsed = JSON.parse(data);
              
              if (parsed.type === 'status') {
                // Update transcript with search status
                setCallTranscript(prev => prev + `\n\n${parsed.message}\n\n`);
              } else if (parsed.type === 'content' && (parsed.text || parsed.content)) {
                // Accumulate search results from content chunks (same as web search)
                const contentText = parsed.content || parsed.text;
                console.log('📄 Main page document search received content:', contentText?.substring(0, 100));
                searchResults += contentText;
                // Update transcript in real-time with better formatting
                setCallTranscript(prev => {
                  const lines = prev.split('\n');
                  const lastSearchIndex = lines.findLastIndex(line => line.includes('📄 Searching documents:'));
                  if (lastSearchIndex !== -1) {
                    // Replace everything after the search indicator with updated results
                    const beforeSearch = lines.slice(0, lastSearchIndex + 1).join('\n');
                    
                    // Format the search results nicely
                    const formattedResults = searchResults
                      .replace(/## /g, '\n\n**')
                      .replace(/\n\*/g, '\n• ')
                      .trim();
                    
                    return beforeSearch + `\n\n📊 **Live Results:**\n${formattedResults}\n\n`;
                  }
                  return prev + searchResults;
                });
              } else if (parsed.type === 'complete') {
                // Search completed - add final formatted results to main chat
                if (searchResults.trim()) {
                  // Format the final results for the main chat
                  const finalResults = searchResults
                    .replace(/## /g, '\n**')
                    .replace(/\n\*/g, '\n• ')
                    .trim();
                  
                  // Add search results to main chat
                  setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `📄 **Document Search Results:**\n\n${finalResults}`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }]);
                }
                
                setCallTranscript(prev => prev + `\n\n${parsed.message}\n\n`);
                
                // Send final results back to OpenAI
                sendClientEvent({
                  type: 'conversation.item.create',
                  item: {
                    type: 'function_call_output',
                    call_id: callId,
                    output: searchResults || 'Document search completed successfully'
                  }
                });
                
                // Trigger response generation
                sendClientEvent({
                  type: 'response.create'
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Error handling document search:', error);
      
      // Send error back to OpenAI
      sendClientEvent({
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: callId,
          output: JSON.stringify({ error: 'Document search failed' })
        }
      });
    }
  };

  const endCall = () => {
    console.log('🔚 Ending call...');
    
    // Close data channel
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }

    // Stop all media tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Clean up audio element
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
      audioElementRef.current = null;
    }

    setIsCallActive(false);
    setIsSessionReady(false);
    
    // Add call ended message to main chat
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '🎙️ Voice call ended.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  // Call duration timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Splash Screen */}
      {isMounted && showSplash && (
        <SplashScreen onClose={() => setShowSplash(false)} />
      )}
      
      <div className="min-h-screen flex items-center justify-center p-4 relative" style={{
          backgroundImage: `url(${wallpapers[currentWallpaperIndex]?.path || '/purple-gradient-bg.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}>
      {/* Wallpaper Changer Button */}
      <button
        onClick={changeWallpaper}
        className="fixed top-6 right-6 z-50 w-8 h-8 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:bg-white/25 hover:text-white/80 transition-all duration-300 hover:scale-110 group shadow-lg"
        title={`Current: ${wallpapers[currentWallpaperIndex]?.name || 'Loading...'} - Click to change`}
      >
        <FaChevronRight size={8} className="group-hover:translate-x-0.5 transition-transform duration-200" />
      </button>
      {/* Tablet container with three-column layout */}
      <div className="flex w-full max-w-[2226px] h-[90vh] rounded-3xl shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-white/30">
        
        {/* Column 1: Left Sidebar */}
        <aside className="w-72 bg-black border-r border-gray-800 flex flex-col shadow-lg">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div>
                <h1 className="text-lg font-bold text-white">Healthcare AI Hub</h1>
                <p className="text-xs text-gray-400">Healthcare Intelligence Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {NAV_ITEMS.map((item, idx) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(idx, item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    selectedNav === idx
                      ? 'bg-gray-800 text-white shadow-lg border-2 border-transparent bg-clip-padding relative'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  style={selectedNav === idx ? {
                    background: 'rgb(31, 41, 55)',
                    backgroundImage: 'linear-gradient(rgb(31, 41, 55), rgb(31, 41, 55)), linear-gradient(45deg, #3b82f6, #6366f1)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box'
                  } : {}}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-800">
            <div 
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-900 cursor-pointer hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setShowSplash(true)}
              title="Click to view Omni-Health Experience"
            >
              <div className="w-10 h-10 rounded-full bg-white border-2 border-transparent bg-clip-padding flex items-center justify-center text-gray-700 font-semibold relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-gray-700 font-semibold text-sm">
                      {currentView === 'citizen' ? 'AB' : 'SJ'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">
                  {currentView === 'citizen' ? 'Ahmad Bin Abdullah' : 'Sarah Johnson'}
                </div>
                <div className="text-xs text-gray-400">
                  {currentView === 'citizen' ? 'Patient ID 12345' : 'Operations Director'}
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-300">
                <FaEllipsisV size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* Column 2: Messages Section - Only visible in hospital view (contact) */}
        {currentView === 'contact' && (
          <div className="w-96 bg-white border-r border-blue-200 flex flex-col shadow-lg">
          {/* Messages Header */}
          <div className="p-6 border-b border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Messages</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <FaFilter size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <FaPlus size={16} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Message Tabs */}
          <div className="px-6 py-3 border-b border-blue-100">
            <div className="flex space-x-1">
              {MESSAGE_TABS.map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(idx)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedTab === idx
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
        </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedConversation === conv.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-transparent bg-clip-padding flex items-center justify-center text-gray-700 font-semibold text-xs relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-0.5">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <span className="text-gray-700 font-semibold text-xs">{conv.avatar}</span>
                        </div>
                      </div>
                    </div>
                    {conv.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                    {conv.unread > 0 && (
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                        {conv.unread}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{conv.name}</h3>
                      <span className="text-xs text-gray-500">{conv.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{conv.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Column 3: Chat Area, Knowledge Base, or Settings */}
        <main className="flex-1 flex flex-col bg-white">
          {currentView === 'contact' ? (
            /* Healthcare Control Tower Dashboard */
            <ContactCenterDashboard />
          ) : currentView === 'citizen' ? (
            /* Patient Care Concierge */
            <PatientServicesInterface />
          ) : currentView === 'bancassurance' ? (
            /* Legacy Bancassurance Interface */
            <BancassuranceInterface />
          ) : currentView === 'knowledge' ? (
            /* Knowledge Base Panel */
            <div className="flex-1 p-6">
              <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Document Intelligence Hub</h2>
                    <p className="text-sm text-gray-600 mt-1">AI-powered document processing with auto-detection and intelligent assignment</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaArchive size={16} />
                      <span>{uploadedFiles.length} files uploaded</span>
                    </div>
                    <button
                      onClick={() => loadUploadedFiles(vectorStoreId)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Refresh file status"
                    >
                      <FaUndo size={14} />
                    </button>
                  </div>
                </div>

                {/* Document Intelligence Status */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <h3 className="font-medium text-gray-900">Auto-Detection</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-600">98.7%</p>
                    <p className="text-xs text-gray-500">Document classification accuracy</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <h3 className="font-medium text-gray-900">Auto-Assignment</h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">247</p>
                    <p className="text-xs text-gray-500">Documents processed today</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                      <h3 className="font-medium text-gray-900">Processing Time</h3>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">1.3s</p>
                    <p className="text-xs text-gray-500">Average processing time</p>
                  </div>
                </div>

                {/* File Upload Area */}
                <div 
                  className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6 hover:border-purple-400 transition-colors"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-purple-400', 'bg-purple-50');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50');
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      handleFileUpload(files);
                    }
                  }}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-full flex items-center justify-center border-2 border-transparent bg-clip-padding relative shadow-lg" style={{
                      background: 'white',
                      backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #d1d5db, #9ca3af)',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box'
                    }}>
                      <FaCloudUploadAlt size={18} className="text-gray-300" />
                      {/* Glow effect behind the circle */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-300/20 to-gray-400/20 blur-xl -z-10 scale-150"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Intelligent Document Processing</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload documents for AI-powered auto-detection, classification, and assignment to government services
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.txt,.doc,.docx,.md"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="file-upload"
                      className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-800 rounded-lg border-2 border-transparent bg-clip-padding hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden group text-sm ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{
                        background: 'white',
                        backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #8b5cf6, #6366f1)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box'
                      }}
                    >
                      {/* Glow effect behind button */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/20 to-indigo-400/20 blur-lg -z-10 scale-110"></div>
                      
                      {/* Light effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent font-semibold">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <FaPlus size={16} className="text-purple-600" />
                          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent font-semibold">Choose Files</span>
                        </>
                      )}
                    </label>
        </div>
                </div>

                {/* Uploaded Files List */}
                <div className="bg-white border border-gray-200 rounded-xl">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
                  </div>
                  
                  {uploadedFiles.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <FaFileAlt size={20} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500">No documents uploaded yet</p>
                      <p className="text-sm text-gray-400 mt-1">Upload documents to enhance AI responses with your knowledge base</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {uploadedFiles.map((file, index) => (
                        <div key={file.id || index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FaFileAlt size={16} className="text-blue-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{file.filename || file.name}</h4>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{file.bytes ? `${Math.round(file.bytes / 1024)} KB` : 'Unknown size'}</span>
                                <span>{file.created_at ? new Date(file.created_at * 1000).toLocaleDateString() : 'Recently uploaded'}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                  file.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  file.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {file.status === 'in_progress' && (
                                    <div className="w-2 h-2 border border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                                  )}
                                  {file.status === 'completed' ? 'Ready' : 
                                   file.status === 'in_progress' ? 'Processing...' : 
                                   file.status || 'Processed'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete file"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Knowledge Base Info */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle size={16} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">How it works</h4>
                      <p className="text-sm text-blue-800">
                        Uploaded documents are automatically processed and indexed using OpenAI's file search technology. 
                        When you ask questions, the AI will search both the web and your uploaded documents to provide 
                        comprehensive, accurate responses based on your organization's knowledge.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : currentView === 'settings' ? (
            /* Settings Panel */
            <div className="flex-1 p-6">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
                
                {/* AI Prompt Configuration */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">AI Assistant Prompt</h3>
                    <div className="flex flex-col items-end gap-1">
                      {promptUpdated && (
                        <div className="flex items-center gap-2 text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Updated</span>
                        </div>
                      )}
                      {lastUpdated && (
                        <span className="text-xs text-gray-400">Last updated: {lastUpdated}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Customize the AI assistant's behavior and personality for voice calls and conversations.
                  </p>
                  
                  {/* Text Input - Now at the top */}
                  <div className="mb-4">
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-xs text-gray-400"
                      rows={6}
                      placeholder="Please enter the prompt you want to enhance here..."
                    />
                  </div>
                  
                  {/* Prompt Display - Now at the bottom */}
                  <div className="mb-4">
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent min-h-[150px] max-h-[400px] overflow-y-auto bg-gray-50">
                      {customPrompt ? (
                        <div className="text-xs text-gray-500 leading-relaxed">
                          {customPrompt.split('\n').map((line, idx) => {
                            // Handle headers
                            if (line.startsWith('## ')) {
                              return <div key={idx} className="font-bold text-gray-700 mb-2 mt-3 text-sm border-b border-gray-200 pb-1">{line.replace('## ', '')}</div>;
                            } else if (line.startsWith('# ')) {
                              return <div key={idx} className="font-bold text-gray-800 mb-2 mt-4 text-base">{line.replace('# ', '')}</div>;
                            }
                            // Handle bold text
                            else if (line.includes('**')) {
                              const parts = line.split(/(\*\*[^*]+\*\*)/g);
                              return <div key={idx} className="mb-2 text-gray-600">
                                {parts.map((part, partIdx) => {
                                  if (part.startsWith('**') && part.endsWith('**')) {
                                    return <span key={partIdx} className="font-semibold text-gray-700">{part.replace(/\*\*/g, '')}</span>;
                                  }
                                  return part;
                                })}
                              </div>;
                            }
                            // Handle bullet points
                            else if (line.startsWith('• ') || line.startsWith('- ')) {
                              const text = line.replace(/^[•-]\s/, '');
                              return <div key={idx} className="flex items-start gap-2 mb-1 ml-4">
                                <span className="text-purple-400 mt-0.5 text-xs">•</span>
                                <span className="text-gray-600 text-xs">{text}</span>
                              </div>;
                            }
                            // Handle numbered lists
                            else if (/^\d+\.\s/.test(line)) {
                              return <div key={idx} className="mb-1 ml-4 text-gray-600 text-xs">{line}</div>;
                            }
                            // Handle empty lines
                            else if (line.trim() === '') {
                              return <div key={idx} className="mb-2"></div>;
                            }
                            // Regular text
                            else if (line.trim()) {
                              return <div key={idx} className="mb-2 text-gray-600 text-xs leading-relaxed">{line}</div>;
                            }
                            return null;
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic">Enhanced prompt will appear here after clicking "Update AI Prompt"...</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Update and Reset Buttons */}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={handleResetPrompt}
                      disabled={!customPrompt.trim()}
                      className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:bg-gray-200 hover:scale-105"
                      title="Reset prompt to empty"
                    >
                      <FaUndo size={12} />
                    </button>
                    
                    <button
                      onClick={handleUpdatePrompt}
                      disabled={isUpdatingPrompt || !customPrompt.trim()}
                      className="px-5 py-1.5 bg-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border-2 border-transparent bg-clip-padding hover:shadow-lg hover:scale-105 relative overflow-hidden group text-sm"
                      style={{
                        background: 'white',
                        backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #8b5cf6, #6366f1)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box'
                      }}
                    >
                      {/* Light effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      
                      {isUpdatingPrompt ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent font-semibold text-sm">
                            Updating...
                          </span>
                        </>
                      ) : (
                        <>
                          <FaCog size={12} className="text-purple-600" />
                          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent font-semibold text-sm">
                            Update AI Prompt
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* Chat Interface */
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-blue-100 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-transparent bg-clip-padding flex items-center justify-center text-gray-700 font-semibold text-sm relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-0.5">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <span className="text-gray-700 font-semibold text-sm">AI</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Healthcare AI Assistant</h3>
                      <div className="text-sm text-green-600 flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Online • Real-time analytics enabled
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Minimalistic Status Icons */}
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 flex items-center justify-center" title="Document search enabled">
                        <FaFileAlt size={12} className="text-gray-400" />
                      </div>
                      <div className="w-5 h-5 flex items-center justify-center" title="Web search available">
                        <FaGlobe size={12} className="text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowPhoneModal(true)}
                        className="w-9 h-9 rounded-full bg-white border-2 border-transparent bg-clip-padding flex items-center justify-center transition-all duration-200 hover:scale-105"
                        style={{
                          backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #10b981, #059669)',
                          backgroundOrigin: 'border-box',
                          backgroundClip: 'padding-box, border-box'
                        }}
                        title="Start Voice Call"
                      >
                        <FaPhone size={14} className="text-green-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience Selector */}
              <div className="px-6 py-2 border-b border-gray-100 bg-gray-50">
                <ExperienceSelector 
                  selected={selectedExperience} 
                  onSelect={handleExperienceSelect} 
                />
              </div>

              {/* Wealth Advisor Interface */}
              {showWealthAdvisor && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <WealthAdvisorInterface 
                    onScenarioSelect={handleWealthScenarioSelect}
                    onImmediateAnalysis={handleImmediateAnalysis}
                  />
                </div>
              )}

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* Live Call Transcript */}
                {isCallActive && callTranscript && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">Live Call Transcript</span>
                    </div>
                    <div className="max-h-32 overflow-y-auto">
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {callTranscript.split('\n').map((line, idx) => {
                          if (line.startsWith('**You:**')) {
                            return <div key={idx} className="font-medium text-blue-600 mb-1 flex items-center gap-2 text-xs">
                              <span>🎤</span>
                              <span>{line.replace('**You:**', 'You:')}</span>
                            </div>;
                          } else if (line.startsWith('**AI:**')) {
                            return <div key={idx} className="font-medium text-green-600 mb-1 flex items-center gap-2 text-xs">
                              <span>🤖</span>
                              <span>{line.replace('**AI:**', 'AI:')}</span>
                            </div>;
                          } else if (line.includes('🔍 Searching:')) {
                            return <div key={idx} className="font-medium text-orange-600 mb-1 bg-orange-50 px-2 py-1 rounded text-xs">{line}</div>;
                          } else if (line.includes('📊 **Live Results:**')) {
                            return <div key={idx} className="font-medium text-purple-600 mb-1 bg-purple-50 px-2 py-1 rounded border-l-3 border-purple-400 text-xs">{line.replace('📊 **Live Results:**', '📊 Live Results:')}</div>;
                          } else if (line.startsWith('## ')) {
                            return <div key={idx} className="font-bold text-gray-900 mb-1 pl-6 border-l-2 border-blue-400 text-xs">{line.replace('## ', '')}</div>;
                          } else if (line.startsWith('**') && line.endsWith('**')) {
                            return <div key={idx} className="font-semibold text-gray-800 mb-1 pl-6 text-xs">{line.replace(/\*\*/g, '')}</div>;
                          } else if (line.includes('**')) {
                            const parts = line.split(/(\*\*[^*]+\*\*)/g);
                            return <div key={idx} className="mb-1 pl-6 text-gray-700 text-xs leading-relaxed">
                              {parts.map((part, partIdx) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return <span key={partIdx} className="font-semibold">{part.replace(/\*\*/g, '')}</span>;
                                }
                                return part;
                              })}
                            </div>;
                          } else if (line.startsWith('• ') || line.startsWith('- ')) {
                            const text = line.replace(/^[•-]\s/, '');
                            return <div key={idx} className="flex items-start gap-2 pl-8 mb-1">
                              <span className="text-blue-500 mt-0.5 text-xs">•</span>
                              <span className="text-gray-700 text-xs">{text}</span>
                            </div>;
                          } else if (line.includes('°F') || line.includes('°C')) {
                            return <div key={idx} className="mb-1 pl-6 text-gray-700 bg-blue-50 px-2 py-0.5 rounded text-xs font-medium inline-block">{line}</div>;
                          } else if (line.startsWith('"') && line.endsWith('"')) {
                            return <div key={idx} className="mb-1 pl-6 text-gray-600 italic border-l-2 border-gray-300 pl-3 text-xs">{line}</div>;
                          } else if (line.trim()) {
                            return <div key={idx} className="mb-1 pl-6 text-gray-700 text-xs leading-relaxed">{line}</div>;
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                {messages.filter(msg => msg.role !== 'user').map((msg, idx) => (
                  <div key={idx} className={`flex items-start gap-3 w-full justify-start`}>
                    <div className={`w-8 h-8 rounded-full bg-white border-2 border-transparent bg-clip-padding flex items-center justify-center text-gray-700 font-semibold text-xs relative flex-shrink-0`}>
                      <div className={`absolute inset-0 rounded-full p-0.5 bg-gradient-to-r from-blue-500 to-indigo-600`}>
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <span className="text-gray-700 font-semibold text-xs">AI</span>
                        </div>
                      </div>
                    </div>
                    <div className={`flex flex-col max-w-[85%] items-start mr-auto`}>
                      <div className={`rounded-2xl shadow-sm bg-gray-100 text-gray-900 rounded-bl-md px-3 py-2`}>
                        {msg.content.includes('🔍 **Search Results:**') ? (
                          <div className="space-y-2 text-sm">
                            <div className="font-medium text-blue-600 mb-2 flex items-center gap-2 pb-2 border-b border-blue-100 text-sm">
                              <FaSearch size={12} />
                              Search Results
                            </div>
                            <div className="prose prose-sm max-w-none text-xs">
                              {msg.content.replace('🔍 **Search Results:**\n\n', '').split('\n').map((line, idx) => {
                                // Handle headers (## or **)
                                if (line.startsWith('## ')) {
                                  return <h3 key={idx} className="text-sm font-bold text-gray-900 mt-3 mb-2 border-l-4 border-blue-500 pl-3">{line.replace('## ', '')}</h3>;
                                } else if (line.startsWith('**') && line.endsWith('**')) {
                                  return <h4 key={idx} className="text-xs font-semibold text-gray-800 mt-2 mb-1">{line.replace(/\*\*/g, '')}</h4>;
                                }
                                // Handle inline bold text **text**
                                else if (line.includes('**')) {
                                  const parts = line.split(/(\*\*[^*]+\*\*)/g);
                                  return <div key={idx} className="text-gray-700 mb-1 leading-relaxed text-xs">
                                    {parts.map((part, partIdx) => {
                                      if (part.startsWith('**') && part.endsWith('**')) {
                                        return <span key={partIdx} className="font-semibold">{part.replace(/\*\*/g, '')}</span>;
                                      }
                                      return part;
                                    })}
                                  </div>;
                                }
                                // Handle bullet points
                                else if (line.startsWith('• ') || line.startsWith('- ')) {
                                  const text = line.replace(/^[•-]\s/, '');
                                  return <div key={idx} className="flex items-start gap-2 ml-2 mb-1">
                                    <span className="text-blue-500 mt-0.5 text-xs">•</span>
                                    <span className="text-gray-700 leading-relaxed text-xs">{text}</span>
                                  </div>;
                                }
                                // Handle numbered lists
                                else if (/^\d+\.\s/.test(line)) {
                                  const match = line.match(/^(\d+)\.\s(.+)$/);
                                  if (match) {
                                    return <div key={idx} className="flex items-start gap-2 ml-2 mb-1">
                                      <span className="text-blue-600 font-medium mt-0.5 text-xs">{match[1]}.</span>
                                      <span className="text-gray-700 leading-relaxed text-xs">{match[2]}</span>
                                    </div>;
                                  }
                                }
                                // Handle links
                                else if (line.includes('http')) {
                                  const linkRegex = /(https?:\/\/[^\s\)\]]+)/g;
                                  const parts = line.split(linkRegex);
                                  return <div key={idx} className="text-gray-700 mb-1 leading-relaxed text-xs">
                                    {parts.map((part, partIdx) => 
                                      linkRegex.test(part) ? 
                                        <a key={partIdx} href={part} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 underline break-all text-xs bg-purple-50 px-1 py-0.5 rounded">{part}</a> : 
                                        part
                                    )}
                                  </div>;
                                }
                                // Handle temperature and special formatting
                                else if (line.includes('°F') || line.includes('°C')) {
                                  return <div key={idx} className="text-gray-700 mb-1 font-medium bg-blue-50 px-2 py-1 rounded inline-block text-xs">{line}</div>;
                                }
                                // Handle quoted text
                                else if (line.startsWith('"') && line.endsWith('"')) {
                                  return <div key={idx} className="text-gray-600 mb-1 italic border-l-2 border-gray-300 pl-3 text-xs">{line}</div>;
                                }
                                // Regular text with potential inline links
                                else if (line.trim()) {
                                  const linkRegex = /(https?:\/\/[^\s\)\]]+)/g;
                                  if (linkRegex.test(line)) {
                                    const parts = line.split(linkRegex);
                                    return <div key={idx} className="text-gray-700 mb-1 leading-relaxed text-xs">
                                      {parts.map((part, partIdx) => 
                                        linkRegex.test(part) ? 
                                          <a key={partIdx} href={part} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 underline break-all text-xs bg-purple-50 px-1 py-0.5 rounded">{part}</a> : 
                                          part
                                      )}
                                    </div>;
                                  }
                                  return <div key={idx} className="text-gray-700 mb-1 leading-relaxed text-xs">{line}</div>;
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        ) : (
                          <MarkdownRenderer 
                            content={msg.content}
                            className="text-xs"
                          />
                        )}
                      </div>
                      {msg.timestamp && (
                        <span className="text-xs text-gray-500 mt-1 px-1">{msg.timestamp}</span>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-transparent bg-clip-padding flex items-center justify-center text-gray-700 font-semibold text-xs relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-0.5">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <span className="text-gray-700 font-semibold text-xs">AI</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Transcription Status */}
              {isTranscribing && (
                <div className="px-6 py-2 bg-blue-50 border-t border-blue-100">
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Transcribing speech...</span>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="px-6 py-4 border-t border-blue-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type your message..."
                      disabled={listening || loading}
                      className="w-full pl-6 pr-12 py-4 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                      rows={1}
                      style={{ 
                        minHeight: '52px', 
                        maxHeight: '120px',
                        fontSize: '0.85rem' // 15% smaller than text-sm (0.875rem)
                      }}
                    />
                    {/* Send Button Inside Textarea */}
                    <button
                      onClick={handleSend}
                      disabled={loading || !input.trim()}
                      className="absolute right-3 w-8 h-8 rounded-full bg-white border-2 border-transparent bg-clip-padding flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                      style={{
                        backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #3b82f6, #6366f1)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                        top: '45%',
                        transform: 'translateY(-50%)'
                      }}
                      title="Send Message"
                    >
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="text-blue-600"
                      >
                        <path 
                          d="M9 18L15 12L9 6" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Phone Call Modal - Minimal & Clean */}
      {showPhoneModal && (
        <div className="fixed top-20 right-6 z-50">
          <div className="backdrop-blur-xl rounded-xl p-6 w-80 shadow-2xl border border-white/30 relative"
            style={{
              background: 'rgba(255,255,255,0.03)'
            }}>
            {/* Call Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-blue-500 font-semibold text-sm">AI</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">AI Contact Center</h3>
                                      <p className="text-xs bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                      {isCallActive ? formatDuration(callDuration) : 'Ready'}
                    </p>
                </div>
              </div>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Call Status & Controls */}
            <div className="flex items-center justify-center gap-3 mb-4">
              {!isCallActive ? (
                <button
                  onClick={startCall}
                  className="w-11 h-11 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                  title="Start Call"
                >
                  <FaPhone size={14} />
                </button>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live</span>
                  </div>
                  <button
                    onClick={endCall}
                    className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                    title="End Call"
                  >
                    <FaPhoneSlash size={14} />
                  </button>
                </>
              )}
            </div>

            {/* Voice Activity Bars */}
            {isCallActive && (
              <div className="flex justify-center items-center gap-1 mb-4 h-12">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-white/60 rounded-full animate-pulse`}
                    style={{
                      height: `${[16, 24, 32, 20, 12][i]}px`,
                      animationDelay: `${i * 200}ms`,
                      animationDuration: '1.5s'
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
