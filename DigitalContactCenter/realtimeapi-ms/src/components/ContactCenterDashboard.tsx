import React, { useState, useEffect, useRef } from 'react';
import { 
  FaPhone, 
  FaClock, 
  FaUsers, 
  FaCheckCircle, 
  FaStar, 
  FaPhoneSlash, 
  FaHeadset,
  FaChartLine,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaPlay,
  FaPause,
  FaPaperPlane,
  FaBook,
  FaFileAlt,
  FaTimes,
  FaMicrophone,
  FaSearch,
  FaHeart,
  FaGraduationCap,
  FaHome,
  FaGavel,
  FaUser,
  FaRobot
} from 'react-icons/fa';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  suffix?: string;
  withoutAI?: string | number;
  worstChange?: number;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, suffix = '', withoutAI, worstChange }) => {
  const isPositive = change > 0;
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 to-black p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <div className="text-gray-700">
                {icon}
              </div>
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-gray-500'}`}>
          {isPositive ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div>
        <h3 className="text-gray-500 text-xs font-medium mb-1">{title}</h3>
        <p className="text-2xl font-light text-gray-900">{value}{suffix}</p>
      </div>
      
      {/* Without AI comparison in bottom right */}
      {withoutAI && worstChange && (
        <div className="absolute bottom-2 right-2 text-right">
          <div className="text-xs text-red-500 font-medium">w/o AI: {withoutAI}</div>
          <div className="text-xs text-red-600 font-bold flex items-center justify-end gap-1">
            <FaArrowDown size={6} />
            {Math.abs(worstChange)}%
          </div>
        </div>
      )}
    </div>
  );
};

interface AgentCardProps {
  name: string;
  status: 'available' | 'busy' | 'away';
  callsHandled: number;
  avgCallTime: string;
  rating: number;
  department?: string;
  type?: 'human' | 'ai';
}

const AgentCard: React.FC<AgentCardProps> = ({ name, status, callsHandled, avgCallTime, rating, department, type = 'human' }) => {
  const statusConfig = {
    available: { color: 'border-emerald-200 bg-emerald-50', dot: 'bg-emerald-500' },
    busy: { color: 'border-gray-200 bg-gray-50', dot: 'bg-gray-400' },
    away: { color: 'border-amber-200 bg-amber-50', dot: 'bg-amber-500' }
  };

  const isAI = type === 'ai';

  return (
    <div className={`bg-white rounded-lg p-4 border transition-all duration-300 ${
      isAI 
        ? 'border-blue-200 bg-blue-50 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/60' 
        : 'border-gray-100 hover:shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center relative">
            {isAI ? (
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center relative">
                <span className="text-white font-bold text-xs">AI</span>
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-pulse opacity-30"></div>
              </div>
            ) : (
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 to-black p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-gray-700 font-medium text-xs">{name.split(' ').map(n => n[0]).join('')}</span>
                </div>
              </div>
            )}
            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${statusConfig[status].dot} rounded-full border border-white`}></div>
          </div>
          <div>
            <h4 className={`font-medium text-sm ${isAI ? 'text-blue-900' : 'text-gray-900'}`}>{name}</h4>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[status].color} text-gray-600`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              {department && (
                <span className={`text-xs ${isAI ? 'text-blue-600' : 'text-gray-500'}`}>
                  {department}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
            <FaStar className="text-white" size={6} />
          </div>
          <span className="text-xs font-medium text-gray-700">{rating}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-gray-400 font-medium text-xs">Calls Today</span>
          <p className="font-semibold text-gray-900 text-sm">{callsHandled}</p>
        </div>
        <div>
          <span className="text-gray-400 font-medium text-xs">Avg Time</span>
          <p className="font-semibold text-gray-900 text-sm">{avgCallTime}</p>
        </div>
      </div>
    </div>
  );
};

const ContactCenterDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '**Welcome to Government Agent Assistant!**\n\nUse agent commands:\n• @health - Health services and medical support\n• @edu - Education grants and scholarships\n• @welfare - Social welfare and housing assistance\n• @legal - Legal aid and documentation\n\nHow can I help with government services today?', timestamp: '2:30 PM' }
  ]);
  const [loading, setLoading] = useState(false);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMcpAgents, setShowMcpAgents] = useState(false);
  const [showApprovalQueue, setShowApprovalQueue] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showSTPMonitor, setShowSTPMonitor] = useState(false);
  const [showDocumentProcessor, setShowDocumentProcessor] = useState(false);
  const [showValidationSelector, setShowValidationSelector] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResults, setProcessingResults] = useState<any>(null);
  const [processingStep, setProcessingStep] = useState('');
  const [activeAIAgents, setActiveAIAgents] = useState([
    { name: 'Health AI Assistant', type: 'Healthcare Services', status: 'active', requests: '156 today' },
    { name: 'Education AI Advisor', type: 'Education & Grants', status: 'active', requests: '89 today' },
    { name: 'Welfare AI Specialist', type: 'Social Welfare', status: 'active', requests: '134 today' },
    { name: 'Legal AI Counselor', type: 'Legal Aid', status: 'active', requests: '67 today' }
  ]);
  
  const [aiActivityFeed, setAiActivityFeed] = useState([
    { id: 1, agent: 'Health AI Assistant', action: 'Processed medical document for Citizen #MY001247', status: 'completed', timestamp: '2 min ago', needsApproval: false },
    { id: 2, agent: 'Education AI Advisor', action: 'Evaluated scholarship application for Citizen #MY001248', status: 'pending_approval', timestamp: '3 min ago', needsApproval: true },
    { id: 3, agent: 'Legal AI Counselor', action: 'Generated legal document template for Citizen #MY001250', status: 'completed', timestamp: '5 min ago', needsApproval: false },
    { id: 4, agent: 'Welfare AI Specialist', action: 'Calculated housing assistance eligibility', status: 'completed', timestamp: '7 min ago', needsApproval: false }
  ]);

  // Add AI agent function
  const addAIAgent = (service: any) => {
    const newAgent = {
      name: service.name,
      type: service.type,
      status: 'active' as const,
      requests: '0 today'
    };
    
    setActiveAIAgents(prev => [...prev, newAgent]);
    
    // Add to activity feed
    const newActivity = {
      id: Date.now(),
      agent: 'System',
      action: `${service.name} has been activated and is ready for citizen services`,
      status: 'completed' as const,
      timestamp: 'now',
      needsApproval: false
    };
    setAiActivityFeed(prev => [newActivity, ...prev.slice(0, 9)]);
    
    // Add success message
    const newMessage: Message = {
      role: 'assistant',
      content: `**${service.name} Connected!**\n\nThe ${service.type} AI agent has been successfully added to your government services. This agent is now available to assist with citizen requests.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Live AI activity feed simulation
  useEffect(() => {
    const activities = [
      'Processed citizen ID verification',
      'Generated tax calculation report',
      'Analyzed healthcare eligibility',
      'Created legal document draft',
      'Evaluated education grant application',
      'Calculated welfare benefits',
      'Translated document to Malay',
      'Optimized service routing',
      'Validated compliance requirements',
      'Processed emergency response request'
    ];

    const interval = setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      const randomAgent = activeAIAgents[Math.floor(Math.random() * activeAIAgents.length)];
      const needsApproval = Math.random() > 0.7; // 30% chance needs approval
      
      if (randomAgent) {
        const newActivity = {
          id: Date.now(),
          agent: randomAgent.name,
          action: randomActivity,
          status: needsApproval ? 'pending_approval' as const : 'completed' as const,
          timestamp: 'now',
          needsApproval
        };
        
        setAiActivityFeed(prev => [newActivity, ...prev.slice(0, 9)]);
      }
    }, 4000); // New activity every 4 seconds

    return () => clearInterval(interval);
  }, [activeAIAgents]);

  // Handle approval
  const handleApproval = (activityId: number) => {
    setAiActivityFeed(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, status: 'completed' as const, needsApproval: false }
          : activity
      )
    );
  };

  // Handle review
  const handleReview = (activity: any) => {
    setSelectedActivity(activity);
    setShowReviewModal(true);
  };

  const processDocument = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProcessingResults(null);
    
    try {
      // Step 1: Convert file to base64
      setProcessingStep('Converting document...');
      const base64 = await fileToBase64(selectedFile);
      
      // Step 2: Call OpenAI Vision API for document extraction
      setProcessingStep('Analyzing with AI...');
      
      const response = await fetch('/api/document-process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          filename: selectedFile.name,
          fileType: selectedFile.type
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process document');
      }

      const result = await response.json();
      
      // Step 3: External validation simulation
      setProcessingStep('External validation...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 4: Internal checks
      setProcessingStep('Internal validation...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProcessingResults(result);
      setProcessingStep('Complete');
      
    } catch (error) {
      console.error('Document processing error:', error);
      setProcessingStep('Error processing document');
    } finally {
      setIsProcessing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = error => reject(error);
    });
  };

  // Get pending approvals count
  const pendingApprovals = aiActivityFeed.filter(activity => activity.needsApproval).length;

  // Handle agent selection
  const handleAgentSelection = async (type: 'person' | 'ai') => {
    if (type === 'ai') {
      // Close the add agent modal and open MCP configuration
      setShowAddAgentModal(false);
      setShowSettings(true);
      setShowMcpAgents(true); // Automatically expand MCP agents section
      
      console.log('Opening MCP configuration settings...');
    } else {
      // Handle person addition
      setShowAddAgentModal(false);
      
      const newMessage: Message = {
        role: 'assistant',
        content: '👥 **Human Agent Invited!**\n\nA government service officer has been notified and will join this conversation shortly. They will receive:\n• Full conversation context\n• Citizen service history\n• Current case details\n• Relevant documentation\n\nPlease wait for the officer to join.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMessage]);
    }
  };

  // Function to render markdown content
  const renderMarkdown = (content: string) => {
    return (
      <div className="prose prose-sm max-w-none text-xs leading-tight">
        {content.split('\n').map((line, idx) => {
          // Handle headers (## or **)
          if (line.startsWith('## ')) {
            return <h3 key={idx} className="text-sm font-bold text-gray-900 mt-3 mb-2 border-l-4 border-blue-500 pl-3">{line.replace('## ', '')}</h3>;
          }
          // Handle bold headers
          else if (line.startsWith('**') && line.endsWith('**')) {
            return <div key={idx} className="font-semibold text-gray-800 text-xs leading-tight mb-1">{line.replace(/\*\*/g, '')}</div>;
          }
          // Handle bold text inline
          else if (line.includes('**')) {
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            return <div key={idx} className="text-gray-700 text-xs leading-tight mb-1">
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
              <span className="text-gray-700 text-xs">{text}</span>
            </div>;
          }
          // Handle numbered lists
          else if (/^\d+\.\s/.test(line)) {
            return <div key={idx} className="mb-1 ml-4 text-gray-700 text-xs">{line}</div>;
          }
          // Handle links
          else if (line.trim()) {
            const linkRegex = /(https?:\/\/[^\s\)\]]+)/g;
            if (linkRegex.test(line)) {
              const parts = line.split(linkRegex);
              return <div key={idx} className="text-gray-700 mb-1 leading-relaxed text-xs">
                {parts.map((part, partIdx) => 
                  linkRegex.test(part) ? 
                    <a key={partIdx} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline break-all text-xs bg-blue-50 px-1 py-0.5 rounded">{part}</a> : 
                    part
                )}
              </div>;
            }
            return <div key={idx} className="text-gray-700 text-xs leading-tight mb-1">{line}</div>;
          }
          // Handle empty lines
          else if (line.trim() === '') {
            return <div key={idx} className="mb-1"></div>;
          }
          return null;
        })}
      </div>
    );
  };
  
  // Call functionality states
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTranscript, setCallTranscript] = useState<string>('');
  const [isSessionReady, setIsSessionReady] = useState(false);
  
  // WebRTC refs
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  
  // Enhanced Citizen Center prompt with web search and knowledge base
  const [customPrompt] = useState(`You are an AI Assistant for Malaysia Government Contact Center EMPLOYEES and SERVICE OFFICERS. You provide operational support to help staff serve citizens effectively.

EMPLOYEE SUPPORT FUNCTIONS:
1. **CASE MANAGEMENT**: Help agents handle complex citizen cases, escalation procedures, and inter-department coordination
2. **POLICY CLARIFICATION**: Provide latest policy updates, regulatory changes, and procedural guidelines for staff
3. **SYSTEM NAVIGATION**: Guide agents through government portals, databases, and internal tools
4. **QUALITY ASSURANCE**: Suggest best practices for citizen interactions, compliance standards, and service excellence
5. **REAL-TIME ASSISTANCE**: Support agents during live calls with citizens - provide quick reference information
6. **PERFORMANCE METRICS**: Help interpret service KPIs, citizen satisfaction data, and operational benchmarks

OPERATIONAL KNOWLEDGE FOR STAFF:
🏛️ **INTERNAL PROCESSES**: Workflow management, approval chains, documentation requirements, SLA compliance
📊 **REPORTING TOOLS**: Dashboard navigation, data interpretation, performance tracking, citizen feedback analysis
🔧 **TROUBLESHOOTING**: System issues, citizen portal problems, payment processing, document verification
👥 **TEAM COORDINATION**: Inter-department referrals, specialist consultations, supervisor escalations
📋 **COMPLIANCE**: Data protection (PDPA), service standards, audit requirements, security protocols

MALAYSIA GOVERNMENT SERVICES EXPERTISE FOR STAFF:
- **Health Services**: Staff procedures for MySejahtera, hospital referrals, emergency protocols, insurance processing
- **Education Services**: Officer guidelines for scholarship processing, school enrollment procedures, grant approvals
- Social Welfare: Financial assistance, housing aid, disability support, senior citizen benefits, BR1M/STR
- Legal Services: Court proceedings, legal aid, document authentication, marriage/divorce certificates

CRITICAL SEARCH INSTRUCTIONS:
- ALWAYS search uploaded government documents FIRST for any policy or service information
- If documents don't contain sufficient information, use web_search for current Malaysian government information
- For current government announcements, policy updates, or time-sensitive information: use web_search
- For government policies, procedures, or internal information: search documents first
- When officers need real-time data or external Malaysian government information: use web_search immediately

RESPONSE STRATEGY:
1. Check knowledge base/documents for official government information
2. Use web search for current Malaysian government updates, news, or verification
3. Combine both sources for comprehensive responses
4. Always indicate your information sources to officers
5. Prioritize Malaysian government official sources and websites

Be professional, respectful, and helpful. Always prioritize accuracy and provide actionable information for government service officers serving Malaysian citizens. Use appropriate Malaysian honorifics (Datuk, Tan Sri, Encik, Puan, etc.) when relevant.`);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Call duration timer
  useEffect(() => {
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

  // Handle realtime events
  const handleRealtimeEvent = (event: any) => {
    console.log('📨 Contact Center received event:', event.type, event);
    
    switch (event.type) {
      case 'response.audio_transcript.delta':
        setCallTranscript(prev => prev + event.delta);
        break;
        
      case 'session.created':
        setIsSessionReady(true);
        break;
        
      case 'response.function_call_arguments.done':
        // Handle function calls for search
        console.log('🔧 Contact Center function call detected:', event.name, event.arguments);
        if (event.name === 'web_search') {
          const args = JSON.parse(event.arguments);
          console.log('🌐 Contact Center searching web for:', args.query);
          setCallTranscript(prev => prev + `\n\n🔍 **Searching web:** ${args.query}\n\n`);
          
          // Add to messages for visibility
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `🔍 Searching the web for: "${args.query}"...`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          
          handleWebSearch(args.query, event.call_id);
        } else if (event.name === 'document_search') {
          const args = JSON.parse(event.arguments);
          console.log('📄 Contact Center searching documents for:', args.query);
          setCallTranscript(prev => prev + `\n\n📄 **Searching documents:** ${args.query}\n\n`);
          handleDocumentSearch(args.query, event.call_id);
        }
        break;
        
      case 'response.audio_transcript.done':
        console.log('AI audio transcript done:', event.transcript);
        if (event.transcript) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: event.transcript,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }
        break;
        
      case 'conversation.item.input_audio_transcription.completed':
        console.log('User said:', event.transcript);
        if (event.transcript) {
          setMessages(prev => [...prev, {
            role: 'user',
            content: event.transcript,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }
        break;
        
      case 'error':
        console.error('OpenAI API Error:', event);
        setCallTranscript(prev => prev + `\n\n❌ **Error:** ${event.error?.message || 'Unknown error'}\n\n`);
        break;
        
      default:
        console.log('Unhandled Contact Center event:', event.type, event);
        break;
    }
  };

  // Handle web search function call with streaming
  const handleWebSearch = async (query: string, callId: string) => {
    try {
      console.log('🚀 Contact Center starting web search for:', query, 'with callId:', callId);
      
      const response = await fetch('/api/web-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      console.log('📡 Contact Center web search API response status:', response.status);
      
      if (!response.ok) {
        console.error('❌ Contact Center web search API error:', response.status, response.statusText);
        throw new Error('Web search failed');
      }
      
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }
      
      let searchResults = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.type === 'status') {
                setCallTranscript(prev => prev + `${parsed.message}\n`);
              } else if (parsed.type === 'content') {
                console.log('📄 Contact Center received content:', parsed.content?.substring(0, 100));
                if (parsed.content) {
                  searchResults += parsed.content;
                  setCallTranscript(prev => {
                    const lines = prev.split('\n');
                    const lastSearchIndex = lines.findLastIndex(line => line.includes('🔍 **Searching web:'));
                    if (lastSearchIndex !== -1) {
                      const beforeSearch = lines.slice(0, lastSearchIndex + 1).join('\n');
                      const formattedResults = searchResults
                        .replace(/## /g, '\n**')
                        .replace(/\n\*/g, '\n• ')
                        .trim();
                      
                      return beforeSearch + `\n\n📊 **Live Results:**\n${formattedResults}\n\n`;
                    }
                    return prev + searchResults;
                  });
                }
              } else if (parsed.type === 'complete') {
                if (searchResults.trim()) {
                  const finalResults = searchResults
                    .replace(/## /g, '\n**')
                    .replace(/\n\*/g, '\n• ')
                    .replace(/°F/g, '°F')
                    .replace(/°C/g, '°C')
                    .trim();
                  
                  setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `🔍 **Search Results:**\n\n${finalResults}`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }]);
                }
                
                setCallTranscript(prev => prev + `\n\n✅ Web search completed!\n\n`);
                
                // Send results back to OpenAI if we have a data channel
                if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
                  const event = {
                    type: 'conversation.item.create',
                    item: {
                      type: 'function_call_output',
                      call_id: callId,
                      output: searchResults || 'Search completed successfully'
                    }
                  };
                  dataChannelRef.current.send(JSON.stringify(event));
                  
                  const responseEvent = {
                    type: 'response.create'
                  };
                  dataChannelRef.current.send(JSON.stringify(responseEvent));
                }
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Error handling Contact Center web search:', error);
      setCallTranscript(prev => prev + `\n\n❌ **Web search error:** ${error}\n\n`);
    }
  };

  // Handle document search function call
  const handleDocumentSearch = async (query: string, callId: string) => {
    try {
      console.log('🚀 Contact Center starting document search for:', query);
      
      const response = await fetch('/api/document-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        console.error('❌ Contact Center document search error:', response.status);
        throw new Error('Document search failed');
      }
      
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }
      
      let searchResults = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.type === 'content') {
                searchResults += parsed.content;
                setCallTranscript(prev => prev + parsed.content);
              } else if (parsed.type === 'complete') {
                if (searchResults.trim()) {
                  setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `📄 **Document Search Results:**\n\n${searchResults}`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }]);
                }
                
                setCallTranscript(prev => prev + `\n\n✅ Document search completed!\n\n`);
                
                // Send results back to OpenAI if we have a data channel
                if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
                  const event = {
                    type: 'conversation.item.create',
                    item: {
                      type: 'function_call_output',
                      call_id: callId,
                      output: searchResults || 'Document search completed successfully'
                    }
                  };
                  dataChannelRef.current.send(JSON.stringify(event));
                  
                  const responseEvent = {
                    type: 'response.create'
                  };
                  dataChannelRef.current.send(JSON.stringify(responseEvent));
                }
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Error handling Contact Center document search:', error);
      setCallTranscript(prev => prev + `\n\n❌ **Document search error:** ${error}\n\n`);
    }
  };

  // Send message using OpenAI Responses API
  const handleSend = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((msgs) => [...msgs, userMessage]);
    const currentInput = chatInput;
    setChatInput('');
    setLoading(true);
    
    try {
      const webRes = await fetch('/api/openai-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `${customPrompt}

User Query: ${currentInput}

Please provide a helpful response for the contact center agent.`,
          stream: true,
          vectorStoreId: 'vs_687b5aa0b19c8191bd628a0111b79bc7' // Use the same knowledge base
        }),
      });
      
      if (!webRes.ok) {
        throw new Error(`HTTP error! status: ${webRes.status}`);
      }

      const reader = webRes.body?.getReader();
      const decoder = new TextDecoder();
      let responseContent = '';

      const responseMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((msgs) => [...msgs, responseMessage]);

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ') && !line.includes('[DONE]')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.delta) {
                    responseContent += data.delta;
                    setMessages((msgs) => {
                      const newMessages = [...msgs];
                      const lastMessage = newMessages[newMessages.length - 1];
                      if (lastMessage && lastMessage.role === 'assistant') {
                        lastMessage.content = responseContent;
                      }
                      return newMessages;
                    });
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((msgs) => [...msgs, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Start call functionality
  const startCall = async () => {
    try {
      setIsCallActive(true);
      setCallDuration(0);
      setCallTranscript('');
      setIsSessionReady(false);

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

      // Create a peer connection
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // Set up to play remote audio from the model
      const audioElement = document.createElement('audio');
      audioElement.autoplay = true;
      audioElementRef.current = audioElement;
      
      pc.ontrack = (e) => {
        audioElement.srcObject = e.streams[0];
      };

      // Add local audio track for microphone input
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

      // Set up data channel for sending and receiving events
      const dataChannel = pc.createDataChannel('oai-events');
      dataChannelRef.current = dataChannel;

      dataChannel.addEventListener('message', (e) => {
        try {
          const event = JSON.parse(e.data);
          handleRealtimeEvent(event);
        } catch (error) {
          console.error('Error parsing data channel message:', error);
        }
      });

      // Start the session using the Session Description Protocol (SDP)
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = 'https://api.openai.com/v1/realtime';
      const model = 'gpt-4o-realtime-preview-2024-12-17';
      
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
      
      const answer = {
        type: 'answer' as RTCSdpType,
        sdp: answerSdp,
      };
      
      await pc.setRemoteDescription(answer);
      
      // Set session ready after connection is established
      setTimeout(() => {
        setIsSessionReady(true);
      }, 1000); // Small delay to ensure audio streams are fully connected

    } catch (error) {
      console.error('Error starting call:', error);
      setIsCallActive(false);
      setIsSessionReady(false);
    }
  };

  // End call functionality
  const endCall = () => {
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
    
    // Add call ended message to chat
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '🎙️ Voice call ended.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  // Live KPI state with AI impact comparison
  const [kpis, setKpis] = useState([
    {
      title: 'Active Citizens',
      value: 23,
      change: 12,
      icon: <FaPhone size={14} />,
      withoutAI: 8,
      worstChange: -65
    },
    {
      title: 'Avg Service Time',
      value: '2:34',
      change: -18,
      icon: <FaClock size={14} />,
      withoutAI: '12:45',
      worstChange: 400
    },
    {
      title: 'Available Officers',
      value: 15,
      change: 5,
      icon: <FaHeadset size={14} />,
      withoutAI: 4,
      worstChange: -73
    },
    {
      title: 'Service Resolution',
      value: 96,
      change: 3,
      icon: <FaCheckCircle size={14} />,
      suffix: '%',
      withoutAI: '67%',
      worstChange: -30
    },
    {
      title: 'Citizen Satisfaction',
      value: 4.9,
      change: 2,
      icon: <FaStar size={14} />,
      suffix: '/5',
      withoutAI: '3.1/5',
      worstChange: -37
    },
    {
      title: 'Pending Requests',
      value: 3,
      change: -45,
      icon: <FaExclamationTriangle size={14} />,
      withoutAI: 47,
      worstChange: 1467
    }
  ]);

  // Live KPI updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setKpis(prevKpis => prevKpis.map(kpi => {
        const randomVariation = Math.random() * 2 - 1; // -1 to +1 variation
        let newChange = kpi.change + randomVariation;
        let newValue = kpi.value;
        
        // Keep changes within reasonable bounds and positive trends for AI impact
        if (kpi.title === 'Active Citizens') {
          newChange = Math.max(8, Math.min(18, newChange));
          const variation = Math.floor(Math.random() * 3) - 1; // -1 to +1
          newValue = Math.max(20, Math.min(28, (typeof kpi.value === 'number' ? kpi.value : 23) + variation));
        } else if (kpi.title === 'Avg Service Time') {
          newChange = Math.max(-25, Math.min(-15, newChange));
          // Keep time realistic
          const baseMinutes = 2;
          const baseSeconds = 34;
          const totalSeconds = baseMinutes * 60 + baseSeconds + Math.floor(Math.random() * 30) - 15;
          const newMinutes = Math.floor(totalSeconds / 60);
          const newSecs = totalSeconds % 60;
          newValue = `${newMinutes}:${newSecs.toString().padStart(2, '0')}`;
        } else if (kpi.title === 'Available Officers') {
          newChange = Math.max(2, Math.min(8, newChange));
          const variation = Math.floor(Math.random() * 3) - 1;
          newValue = Math.max(13, Math.min(17, (typeof kpi.value === 'number' ? kpi.value : 15) + variation));
        } else if (kpi.title === 'Service Resolution') {
          newChange = Math.max(1, Math.min(6, newChange));
          const variation = Math.floor(Math.random() * 3) - 1;
          newValue = Math.max(94, Math.min(98, (typeof kpi.value === 'number' ? kpi.value : 96) + variation));
        } else if (kpi.title === 'Citizen Satisfaction') {
          newChange = Math.max(1, Math.min(4, newChange));
          const variation = (Math.random() * 0.2) - 0.1;
          newValue = Math.max(4.7, Math.min(5.0, (typeof kpi.value === 'number' ? kpi.value : 4.9) + variation));
          newValue = Math.round(newValue * 10) / 10;
        } else if (kpi.title === 'Pending Requests') {
          newChange = Math.max(-55, Math.min(-35, newChange));
          const variation = Math.floor(Math.random() * 3) - 1;
          newValue = Math.max(1, Math.min(6, (typeof kpi.value === 'number' ? kpi.value : 3) + variation));
        }
        
        return { ...kpi, change: Math.round(newChange * 10) / 10, value: newValue };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const agents = [
    { name: 'Dr. Siti Nurhaliza', status: 'available' as const, callsHandled: 15, avgCallTime: '6:12', rating: 4.9, department: 'Health Services', type: 'human' },
    { name: 'Encik Rahman Ismail', status: 'busy' as const, callsHandled: 22, avgCallTime: '4:35', rating: 4.8, department: 'Education Services', type: 'human' },
    { name: 'Puan Aminah Yusof', status: 'available' as const, callsHandled: 18, avgCallTime: '5:45', rating: 4.7, department: 'Social Welfare', type: 'human' },
    { name: 'Datuk Ahmad Rashid', status: 'away' as const, callsHandled: 12, avgCallTime: '7:20', rating: 4.9, department: 'Legal Services', type: 'human' },
    { name: 'AI Health Agent', status: 'available' as const, callsHandled: 89, avgCallTime: '0:45', rating: 4.9, department: 'Health AI', type: 'ai' },
    { name: 'AI Education Agent', status: 'available' as const, callsHandled: 127, avgCallTime: '0:32', rating: 4.8, department: 'Education AI', type: 'ai' },
    { name: 'AI Welfare Agent', status: 'available' as const, callsHandled: 156, avgCallTime: '0:28', rating: 4.9, department: 'Welfare AI', type: 'ai' },
    { name: 'AI Legal Agent', status: 'available' as const, callsHandled: 98, avgCallTime: '0:52', rating: 4.8, department: 'Legal AI', type: 'ai' }
  ];

  const queueItems = [
    { id: 1, customer: 'Citizen #MY001247', waitTime: '0:45', priority: 'High', category: 'Health Emergency' },
    { id: 2, customer: 'Citizen #MY001248', waitTime: '1:23', priority: 'Medium', category: 'Education Grant' },
    { id: 3, customer: 'Citizen #MY001249', waitTime: '2:01', priority: 'Low', category: 'Social Welfare' },
    { id: 4, customer: 'Citizen #MY001250', waitTime: '0:12', priority: 'High', category: 'Legal Documentation' }
  ];

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Citizen Center</h1>
            <p className="text-gray-500 text-sm">Real-time citizen services monitoring and analytics</p>
          </div>
                    <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Current Time</p>
              <p className="text-sm font-medium text-gray-900">{currentTime.toLocaleTimeString()}</p>
            </div>
            <button
              onClick={() => setShowPhoneModal(true)}
              className="flex items-center justify-center px-2 py-1.5 rounded-lg text-sm font-medium transition-colors text-green-600 hover:text-green-700"
              title="Voice Call"
            >
              <FaPhone size={14} />
            </button>
            <button
              onClick={() => setIsRealTimeActive(!isRealTimeActive)}
              className={`flex items-center justify-center px-2 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isRealTimeActive 
                  ? 'text-emerald-600 hover:text-emerald-700' 
                  : 'text-gray-600 hover:text-gray-700'
              }`}
              title={isRealTimeActive ? 'Live' : 'Paused'}
            >
              {isRealTimeActive ? <FaPause size={14} /> : <FaPlay size={14} />}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {kpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Live AI Activity Feed */}
          <div className="col-span-2 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">Live AI Activity Feed</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">Live</span>
              </div>
            </div>
            <div className="space-y-0.5 h-[32rem] overflow-y-auto">
              {aiActivityFeed.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-2 bg-gray-50/50 rounded-md border border-gray-100/50">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      activity.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-xs">{activity.agent}</p>
                      <p className="text-xs text-gray-600 leading-tight">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div className="text-xs text-gray-500">{activity.timestamp}</div>
                    {activity.needsApproval && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleReview(activity)}
                          className="text-xs text-blue-600 px-3 py-1.5 bg-blue-50/50 border border-blue-200/50 rounded-full hover:bg-blue-100/50 transition-all"
                        >
                          Review
                        </button>
                        <button 
                          onClick={() => handleApproval(activity.id)}
                          className="text-xs text-green-600 px-3 py-1.5 bg-green-50/50 border border-green-200/50 rounded-full hover:bg-green-100/50 transition-all"
                        >
                          Quick Approve
                        </button>
                      </div>
                    )}
                    {activity.status === 'completed' && (
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Management Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Management View</h2>
            <div className="space-y-3">
              <button 
                onClick={() => setShowApprovalQueue(true)}
                className="w-full text-left p-4 hover:bg-amber-50/70 rounded-lg transition-colors group bg-amber-50/60 relative shadow-sm hover:shadow-md border border-amber-200 hover:border-amber-300"
              >
                <div className="font-bold text-gray-900 group-hover:text-gray-700 text-lg">Approval Queue</div>
                <div className="text-sm text-gray-500 mt-1">Pending reviews</div>
                <div className="flex items-center gap-2 mt-3">
                  {pendingApprovals > 0 && (
                    <div className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                      {pendingApprovals} Pending
                    </div>
                  )}
                </div>
              </button>
              
              <button 
                onClick={() => setShowSTPMonitor(true)}
                className="w-full text-left p-4 hover:bg-blue-50/70 rounded-lg transition-colors group bg-blue-50/60 shadow-sm hover:shadow-md border border-blue-200 hover:border-blue-300"
              >
                <div className="font-bold text-gray-900 group-hover:text-gray-700 text-lg">STP Monitor</div>
                <div className="text-sm text-gray-500 mt-1">Processing analytics</div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="text-xs text-blue-600">78.5% automation rate • 1,245 documents</div>
                  <div className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    Review Exceptions
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => setShowDocumentProcessor(true)}
                className="w-full text-left p-4 hover:bg-green-50/70 rounded-lg transition-colors group bg-green-50/60 shadow-sm hover:shadow-md border border-green-200 hover:border-green-300"
              >
                <div className="font-bold text-gray-900 group-hover:text-gray-700 text-lg">Document Processor</div>
                <div className="text-sm text-gray-500 mt-1">Test document processing</div>
                <div className="text-xs text-blue-600 mt-2">Document Intelligence • Multi-format support • Real-time analysis</div>
              </button>
              
              <button className="w-full text-left p-4 hover:bg-red-50/70 rounded-lg transition-colors group bg-red-50/60 shadow-sm hover:shadow-md border border-red-200 hover:border-red-300">
                <div className="font-bold text-gray-900 group-hover:text-gray-700 text-lg">Emergency Override</div>
                <div className="text-sm text-gray-500 mt-1">Critical controls</div>
                <div className="text-xs text-blue-600 mt-2">System override • Manual intervention • Priority escalation</div>
              </button>
            </div>
          </div>
        </div>

        {/* Agent Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Agent Status - AI & Human Officers</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-600">Available: {agents.filter(a => a.status === 'available').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600">Busy: {agents.filter(a => a.status === 'busy').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-gray-600">Away: {agents.filter(a => a.status === 'away').length}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {agents.map((agent, index) => (
              <AgentCard key={index} {...agent} />
            ))}
          </div>
        </div>

        {/* Government Agent Assistant */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 w-full">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full border border-transparent bg-clip-padding flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-800 to-black p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <FaBook className="text-gray-700" size={12} />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Government Agent Assistant</h3>
                  <div className="text-sm text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Online • Use @health, @edu, @welfare, or @legal
                  </div>
                </div>
              </div>
              
              {/* Government Agent Indicators with Add Agent Button */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-white border border-transparent bg-clip-padding flex items-center justify-center relative"
                       style={{
                         backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #dc2626, #ef4444)',
                         backgroundOrigin: 'border-box',
                         backgroundClip: 'padding-box, border-box'
                       }}>
                    <div className="text-gray-700 text-xs">
                      <FaHeart />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-white"></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">Health</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-white border border-transparent bg-clip-padding flex items-center justify-center relative"
                       style={{
                         backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #2563eb, #3b82f6)',
                         backgroundOrigin: 'border-box',
                         backgroundClip: 'padding-box, border-box'
                       }}>
                    <div className="text-gray-700 text-xs">
                      <FaGraduationCap />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-white"></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">Education</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-white border border-transparent bg-clip-padding flex items-center justify-center relative"
                       style={{
                         backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #059669, #10b981)',
                         backgroundOrigin: 'border-box',
                         backgroundClip: 'padding-box, border-box'
                       }}>
                    <div className="text-gray-700 text-xs">
                      <FaHome />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-white"></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">Welfare</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-white border border-transparent bg-clip-padding flex items-center justify-center relative"
                       style={{
                         backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #7c3aed, #8b5cf6)',
                         backgroundOrigin: 'border-box',
                         backgroundClip: 'padding-box, border-box'
                       }}>
                    <div className="text-gray-700 text-xs">
                      <FaGavel />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-white"></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">Legal</span>
                </div>
                
                {/* Add Agent Button */}
                <button
                  onClick={() => setShowAddAgentModal(true)}
                  className="w-5 h-5 rounded-full bg-white border border-gray-300 hover:border-blue-400 flex items-center justify-center transition-colors hover:bg-blue-50"
                  title="Add Government Agent"
                >
                  <span className="text-gray-400 hover:text-blue-600 text-xs font-bold">+</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md p-3 rounded-lg text-sm ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.role === 'user' ? (
                    <p className="text-white text-xs">{message.content}</p>
                  ) : (
                    <div className="text-gray-900">
                      {message.content.includes('🔍 **Search Results:**') ? (
                        <div className="space-y-2 text-sm">
                          <div className="font-medium text-blue-600 mb-2 flex items-center gap-2 pb-2 border-b border-blue-100 text-sm">
                            <FaSearch size={12} />
                            Search Results
                          </div>
                          {renderMarkdown(message.content.replace('🔍 **Search Results:**\n\n', ''))}
                        </div>
                      ) : (
                        renderMarkdown(message.content)
                      )}
                    </div>
                  )}
                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about products, policies, procedures..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0 w-full"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && chatInput.trim()) {
                    handleSend();
                  }
                }}
              />
              <button 
                onClick={handleSend}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
              >
                <FaPaperPlane size={12} />
              </button>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FaHeart size={10} />
                Health
              </span>
              <span className="flex items-center gap-1">
                <FaGraduationCap size={10} />
                Education
              </span>
              <span className="flex items-center gap-1">
                <FaHome size={10} />
                Welfare
              </span>
              <span className="flex items-center gap-1">
                <FaGavel size={10} />
                Legal
              </span>
              <span>Government AI Agents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Call Modal */}
      {showPhoneModal && (
        <div className="fixed top-20 right-6 z-50">
          <div className="backdrop-blur-xl rounded-xl p-6 w-80 shadow-2xl border border-white/30 relative"
            style={{
              background: 'rgba(255,255,255,0.9)'
            }}>
            {/* Call Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-blue-500 font-semibold text-sm">AI</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-700">AI Contact Center</h3>
                  <p className="text-xs text-gray-600">
                    {isCallActive ? formatDuration(callDuration) : 'Ready'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="text-gray-600 hover:text-gray-800 p-1"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Call Status & Controls */}
            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="flex items-center gap-3">
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

              {/* Session Ready Indicator */}
              {isCallActive && (
                <div className="flex items-center gap-2 text-xs">
                  {isSessionReady ? (
                    <>
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <FaMicrophone className="text-white" size={10} />
                        </div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                      <span className="text-blue-600 font-medium">Ready to speak</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-orange-600 font-medium">Connecting...</span>
                    </>
                  )}
                </div>
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

            {/* Call Transcript */}
            {isCallActive && callTranscript && (
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <h4 className="text-xs font-medium text-white/80 mb-2">Live Transcript:</h4>
                <p className="text-xs text-white/60">{callTranscript}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Agent Modal */}
      {showAddAgentModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add to Government Services</h3>
              <button
                onClick={() => setShowAddAgentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-400" size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">Choose what you'd like to add to this citizen service thread:</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleAgentSelection('person')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600" size={16} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Add Government Officer</div>
                    <div className="text-sm text-gray-500">Invite a human officer to join this thread</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleAgentSelection('ai')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FaRobot className="text-purple-600" size={16} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Add AI Agent</div>
                    <div className="text-sm text-gray-500">Connect specialized AI agent for advanced assistance</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MCP Server Management Modal */}
      {showMcpAgents && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Government AI Agent Management</h3>
              <button
                onClick={() => setShowMcpAgents(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-400" size={16} />
              </button>
            </div>
            
            <div className="p-6">
              {/* Active AI Agents */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Active AI Agents ({activeAIAgents.length})</h4>
                <div className="grid grid-cols-2 gap-3">
                  {activeAIAgents.map((agent) => (
                    <div key={agent.name} className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-900 text-sm">{agent.name}</h5>
                          <p className="text-xs text-gray-600">{agent.type}</p>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{agent.requests}</span>
                        <button className="text-blue-600 hover:text-blue-800">Configure</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Services */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Available Services</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: 'Document AI Processor', type: 'Document Intelligence', available: true },
                    { name: 'Citizen Analytics AI', type: 'Data Analysis', available: true },
                    { name: 'Multilingual AI', type: 'Translation Services', available: true },
                    { name: 'Service Optimizer AI', type: 'Process Optimization', available: true },
                    { name: 'Compliance AI', type: 'Regulatory Assistant', available: true },
                    { name: 'Emergency Response AI', type: 'Crisis Management', available: true }
                  ].filter(service => !activeAIAgents.some(agent => agent.name === service.name))
                  .map((service) => (
                    <button
                      key={service.name}
                      onClick={() => addAIAgent(service)}
                      className="border border-gray-200 rounded-lg p-2 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-xs">{service.name}</p>
                          <p className="text-xs text-gray-500">{service.type}</p>
                        </div>
                      </div>
                      <div className="text-xs text-blue-600">+ Add</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm font-bold text-green-600">{activeAIAgents.length}</p>
                    <p className="text-xs text-gray-600">Active AI</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-600">{activeAIAgents.reduce((sum, agent) => sum + parseInt(agent.requests.split(' ')[0]), 0)}</p>
                    <p className="text-xs text-gray-600">Requests Today</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-600">99.9%</p>
                    <p className="text-xs text-gray-600">Uptime</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-yellow-600">0.8s</p>
                    <p className="text-xs text-gray-600">Avg Response</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Queue Modal */}
      {showApprovalQueue && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Approval Queue</h3>
                <p className="text-sm text-gray-500">{pendingApprovals} items pending review</p>
              </div>
              <button
                onClick={() => setShowApprovalQueue(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <FaTimes className="text-gray-400" size={14} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-3">
                {aiActivityFeed.filter(activity => activity.needsApproval).map((activity) => (
                  <div key={activity.id} className="p-4 bg-gray-50/50 hover:bg-gray-100/50 rounded-xl transition-colors border border-gray-100/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium text-gray-900">{activity.agent}</div>
                          <div className="text-sm text-gray-600 mt-1">{activity.action}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">{activity.timestamp}</div>
                    </div>
                    <div className="flex gap-2 ml-5">
                      <button 
                        onClick={() => handleReview(activity)}
                        className="text-xs text-blue-600 px-3 py-1.5 bg-blue-50/50 border border-blue-200/50 rounded-full hover:bg-blue-100/50 transition-all"
                      >
                        Review
                      </button>
                      <button 
                        onClick={() => handleApproval(activity.id)}
                        className="text-xs text-green-600 px-3 py-1.5 bg-green-50/50 border border-green-200/50 rounded-full hover:bg-green-100/50 transition-all"
                      >
                        Approve
                      </button>
                      <button className="text-xs text-red-600 px-3 py-1.5 bg-red-50/50 border border-red-200/50 rounded-full hover:bg-red-100/50 transition-all">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
                
                {pendingApprovals === 0 && (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="text-green-600">✓</div>
                    </div>
                    <p className="text-gray-600">All caught up</p>
                    <p className="text-sm text-gray-400">No pending approvals</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedActivity && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Activity Review</h3>
                <p className="text-sm text-gray-500">Comprehensive verification and approval workflow</p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <FaTimes className="text-gray-400" size={14} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column - Main Details */}
                <div className="space-y-6">
                  <div className="bg-blue-50/30 rounded-lg p-4 border border-blue-100">
                    <h4 className="font-medium text-gray-900 mb-3">Activity Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">AI Agent:</span>
                        <span className="font-medium text-gray-900">{selectedActivity.agent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Action:</span>
                        <span className="font-medium text-gray-900">{selectedActivity.action}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timestamp:</span>
                        <span className="font-medium text-gray-900">{selectedActivity.timestamp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Time:</span>
                        <span className="font-medium text-gray-900">1.3s</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50/30 rounded-lg p-4 border border-green-100">
                    <h4 className="font-medium text-gray-900 mb-3">Verification Results</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Document Authenticity</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">✓ Verified</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Data Extraction</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">✓ 98% Confidence</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Compliance Check</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">✓ Passed</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Risk Assessment</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">✓ Low Risk</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Policy Validation</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">✓ Compliant</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/30 rounded-lg p-4 border border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-3">Data Sources</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">Ministry of Education Database</span>
                        <span className="text-xs text-green-600 ml-auto">✓ Connected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">National ID Registry</span>
                        <span className="text-xs text-green-600 ml-auto">✓ Validated</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-600">Financial Records API</span>
                        <span className="text-xs text-green-600 ml-auto">✓ Accessed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-600">Academic Transcript System</span>
                        <span className="text-xs text-green-600 ml-auto">✓ Retrieved</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Detailed Analysis */}
                <div className="space-y-6">
                  <div className="bg-purple-50/30 rounded-lg p-4 border border-purple-100">
                    <h4 className="font-medium text-gray-900 mb-3">Citizen Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Citizen ID:</span>
                        <span className="font-mono text-gray-900">MY001248</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium text-gray-900">Ahmad Bin Abdullah</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Application Type:</span>
                        <span className="font-medium text-gray-900">Education Grant</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Grant Amount:</span>
                        <span className="font-medium text-gray-900">RM 15,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Academic Level:</span>
                        <span className="font-medium text-gray-900">Bachelor's Degree</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50/30 rounded-lg p-4 border border-yellow-100">
                    <h4 className="font-medium text-gray-900 mb-3">AI Analysis</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Overall Confidence</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">87%</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        <strong>Recommendation:</strong> Approve with standard terms. All eligibility criteria met, financial need verified, and academic performance satisfactory.
                      </div>
                      <div className="text-sm text-gray-700">
                        <strong>Risk Factors:</strong> None identified. Standard processing recommended.
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/30 rounded-lg p-4 border border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-3">Processing History</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium text-gray-900">Document Received</div>
                          <div className="text-gray-600">15:23 - Uploaded via citizen portal</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium text-gray-900">Data Extraction</div>
                          <div className="text-gray-600">15:23 - OCR and field extraction completed</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium text-gray-900">Verification</div>
                          <div className="text-gray-600">15:24 - Cross-referenced with 4 databases</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium text-gray-900">Pending Approval</div>
                          <div className="text-gray-600">15:24 - Awaiting human review</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decision Section */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-4">Your Decision</h4>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      handleApproval(selectedActivity.id);
                      setShowReviewModal(false);
                    }}
                    className="px-6 py-2 text-green-600 border border-green-200 bg-green-50/50 rounded-full hover:bg-green-100/50 transition-all text-sm font-medium"
                  >
                    ✓ Approve
                  </button>
                  <button className="px-6 py-2 text-red-600 border border-red-200 bg-red-50/50 rounded-full hover:bg-red-100/50 transition-all text-sm font-medium">
                    ✗ Reject
                  </button>
                  <button className="px-6 py-2 text-yellow-600 border border-yellow-200 bg-yellow-50/50 rounded-full hover:bg-yellow-100/50 transition-all text-sm font-medium">
                    ? Request Info
                  </button>
                  <button className="px-6 py-2 text-blue-600 border border-blue-200 bg-blue-50/50 rounded-full hover:bg-blue-100/50 transition-all text-sm font-medium">
                    ⏸ Hold
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STP Monitor Modal */}
      {showSTPMonitor && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">STP Monitor</h3>
                <p className="text-sm text-gray-500">Visualize document processing pipeline and performance</p>
              </div>
              <button
                onClick={() => setShowSTPMonitor(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <FaTimes className="text-gray-400" size={14} />
              </button>
            </div>
            
            <div className="p-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Overall STP Rate</h3>
                  <div className="text-sm text-gray-400 mb-3">Documents automatically processed</div>
                  <div className="text-3xl font-light text-gray-900 mb-2">78.5%</div>
                  <div className="text-xs text-green-600">+3.2% from last period</div>
                  <div className="mt-4 bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-900 rounded-full h-2" style={{ width: '78.5%' }}></div>
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Documents Processed</h3>
                  <div className="text-sm text-gray-400 mb-3">Total documents in the pipeline</div>
                  <div className="text-3xl font-light text-gray-900 mb-2">1,245</div>
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Completed: 978</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-600">In Progress: 189</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600">Failed: 78</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Average Processing Time</h3>
                  <div className="text-sm text-gray-400 mb-3">Time from receipt to completion</div>
                  <div className="text-3xl font-light text-gray-900 mb-2">2m 45s</div>
                  <div className="text-xs text-green-600">-15% from last period</div>
                  <div className="mt-4 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 rounded-full h-2" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Exception Rate</h3>
                  <div className="text-sm text-gray-400 mb-3">Documents requiring manual review</div>
                  <div className="text-3xl font-light text-gray-900 mb-2">21.5%</div>
                  <div className="text-xs text-green-600">-2.3% from last period</div>
                  <div className="mt-4 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 rounded-full h-2" style={{ width: '21.5%' }}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Processing Pipeline */}
                  <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Processing Pipeline</h2>
                    <p className="text-sm text-gray-500 mb-6">Document flow through the STP process</p>
                    
                    <div className="grid grid-cols-4 gap-6">
                      {[
                        { name: 'Received', percentage: 100, count: 1345, color: 'bg-slate-100' },
                        { name: 'Extracted', percentage: 93.7, count: 1247, color: 'bg-slate-200' },
                        { name: 'Validated', percentage: 84.8, count: 1139, color: 'bg-slate-300' },
                        { name: 'Routed', percentage: 78.6, count: 1029, color: 'bg-slate-400' }
                      ].map((step) => (
                        <div key={step.name} className="text-center">
                          <div className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center mx-auto mb-3 border border-gray-300`}>
                            <div className="w-3 h-3 bg-white rounded-sm"></div>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-1">{step.name}</h3>
                          <p className="text-xl font-light text-gray-900 mb-1">{step.percentage}%</p>
                          <p className="text-xs text-gray-500">{step.count.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">-{Math.floor(Math.random() * 10 + 1)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Document Types */}
                  <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">STP Rate by Document Type</h2>
                    <p className="text-sm text-gray-500 mb-6">Success rate across different document categories</p>
                    
                    <div className="space-y-4">
                      {[
                        { type: 'Payroll', count: 356, rate: 85, color: 'bg-blue-500' },
                        { type: 'Bank Statement', count: 289, rate: 72, color: 'bg-green-500' },
                        { type: 'Misc', count: 178, rate: 91, color: 'bg-purple-500' },
                        { type: 'Utility Bill', count: 245, rate: 79, color: 'bg-yellow-500' },
                        { type: 'Loan Application', count: 177, rate: 65, color: 'bg-red-500' }
                      ].map((doc) => (
                        <div key={doc.type} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 ${doc.color} rounded`}></div>
                            <span className="text-sm font-medium text-gray-900">{doc.type}</span>
                            <span className="text-sm text-gray-500">{doc.count} documents</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{doc.rate}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Drop-off Analysis */}
                  <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Drop-off Analysis</h2>
                    
                    <div className="space-y-4">
                      {[
                        { type: 'Extraction Failures', count: 78, percentage: 6.3, reason: 'Poor image quality (65%)', icon: '⚠️' },
                        { type: 'Validation Failures', count: 111, percentage: 9.5, reason: 'Missing required fields (72%)', icon: '⚠️' },
                        { type: 'Routing Failures', count: 78, percentage: 7.4, reason: 'Policy violations (38%)', icon: '⚠️' }
                      ].map((failure) => (
                        <div key={failure.type} className="border-l-4 border-yellow-400 pl-4 py-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">{failure.icon}</span>
                            <h3 className="font-medium text-gray-900 text-sm">{failure.type}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{failure.count} documents ({failure.percentage}%)</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Top Reason:</span>
                            <span className="text-xs text-gray-700">{failure.reason}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* LLM Insights */}
                  <div className="bg-blue-50/30 rounded-xl p-6 border border-blue-100/50">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">LLM Insights</h2>
                    <p className="text-sm text-blue-600 mb-6">AI-powered analysis of processing bottlenecks</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-blue-800 mb-2">Processing Optimization</h3>
                        <p className="text-sm text-blue-700 mb-3">Based on the current pipeline analysis, here are the key bottlenecks and recommended optimizations:</p>
                        <ul className="space-y-2 text-sm text-blue-600">
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-500">●</span>
                            <div>
                              <strong>Citizen ID verification failures (35%)</strong>
                              <div className="text-xs text-blue-500">Recommendation: Update validation rules for new MyKad format and enhance OCR accuracy for government documents.</div>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-500">●</span>
                            <div>
                              <strong>Education grant document extraction issues (28%)</strong>
                              <div className="text-xs text-blue-500">Recommendation: Add specific extraction rules for university transcripts and income statements from various institutions.</div>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500">●</span>
                            <div>
                              <strong>Processing time spike during 9-11 AM</strong>
                              <div className="text-xs text-blue-500">Recommendation: Adjust resource allocation to handle morning citizen service requests peak.</div>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="border-t border-blue-200 pt-4">
                        <h3 className="font-semibold text-blue-800 mb-2">Flow Optimization</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="font-medium text-blue-700 mb-2">Current Processing Steps:</p>
                            <ol className="space-y-1 text-blue-600">
                              <li>1. Document receipt and classification</li>
                              <li>2. OCR and data extraction</li>
                              <li>3. Field validation against rules</li>
                              <li>4. Manual review for exceptions</li>
                              <li>5. Routing to downstream systems</li>
                            </ol>
                            <p className="text-blue-500 mt-2">Average processing time: 2m 45s</p>
                          </div>
                          <div>
                            <p className="font-medium text-blue-700 mb-2">Optimized Flow:</p>
                            <div className="text-blue-600">
                              <p className="font-medium mb-1">Current Processing State:</p>
                              <ul className="space-y-1">
                                <li>• Document receipt and classification</li>
                                <li>• OCR and intelligent extraction</li>
                                <li>• Field validation against rules</li>
                                <li>• Manual review for exceptions</li>
                                <li>• Routing to downstream systems</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Processor Modal */}
      {showDocumentProcessor && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Document Processor</h3>
                <p className="text-sm text-gray-500">Test document processing capabilities</p>
              </div>
              <button
                onClick={() => setShowDocumentProcessor(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <FaTimes className="text-gray-400" size={14} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Document Intelligence Processor</h3>
                <p className="text-sm text-gray-500 mb-4">Upload a document for comprehensive AI analysis and validation</p>
                {selectedFile ? (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Selected: {selectedFile.name}</p>
                    <button 
                      onClick={() => setSelectedFile(null)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Remove file
                    </button>
                  </div>
                ) : null}
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden" 
                  id="document-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                    }
                  }}
                />
                <label 
                  htmlFor="document-upload"
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 rounded-full hover:from-blue-500/30 hover:to-blue-600/30 transition-all cursor-pointer border border-blue-300/30 hover:border-blue-400/40 backdrop-blur-sm"
                >
                  {selectedFile ? 'Change File' : 'Choose File'}
                </label>
                <p className="text-xs text-gray-400 mt-2">Supports PDF, JPG, PNG, DOC, DOCX</p>
                {selectedFile && (
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <button 
                      onClick={processDocument}
                      disabled={isProcessing}
                      className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700 rounded-full hover:from-green-500/30 hover:to-green-600/30 transition-all border border-green-300/30 hover:border-green-400/40 backdrop-blur-sm disabled:opacity-50 flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <div className="w-3 h-3 border border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="text-sm font-medium">✓</span>
                      )}
                    </button>
                    {isProcessing && (
                      <div className="text-xs text-gray-600 text-center">
                        {processingStep || 'Processing...'}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Processing Results */}
                {processingResults && (
                  <div className="mt-6 p-4 bg-green-50/30 rounded-xl border border-green-100">
                    <h4 className="font-semibold text-gray-900 mb-3">AI Extraction Results</h4>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-64">
                        {JSON.stringify(processingResults, null, 2)}
                      </pre>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition-colors">
                        Approve & Route
                      </button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors">
                        Review Further
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-blue-50/20 rounded-xl border border-blue-100/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">External Validation Checks</h4>
                    <button 
                      onClick={() => setShowValidationSelector(true)}
                      className="w-7 h-7 bg-blue-400/70 text-white rounded-full flex items-center justify-center hover:bg-blue-500/80 transition-colors text-sm font-medium"
                    >
                      +
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-gray-700">MyKad Database Verification</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-gray-700">JPJ Vehicle Registration</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-gray-700">LHDN Tax Records</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-gray-700">Bank Negara Credit Check</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-700">Immigration Status</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-700">Education Ministry Records</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-green-50/30 rounded-xl border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Internal Validation Checks</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-gray-700">Document Authenticity</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-gray-700">Field Completeness</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-gray-700">Data Consistency</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-gray-700">Format Compliance</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-700">Duplicate Detection</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-700">Risk Assessment</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-2">Processing Pipeline</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>Document Upload & Classification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>OCR Text Extraction & Field Detection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>External Source Validation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>Internal Consistency Checks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>LLM Analysis & Recommendation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Selector Popup */}
      {showValidationSelector && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Add External Validation</h3>
              <button
                onClick={() => setShowValidationSelector(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <FaTimes className="text-gray-400" size={14} />
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              <h4 className="font-medium text-gray-900 mb-3">Available Validation Sources:</h4>
              
              {[
                { name: 'SOCSO Employment Records', category: 'Employment' },
                { name: 'EPF Contribution History', category: 'Employment' },
                { name: 'MOH Medical Records', category: 'Healthcare' },
                { name: 'MOE Academic Transcripts', category: 'Education' },
                { name: 'MACC Asset Declaration', category: 'Anti-Corruption' },
                { name: 'Royal Malaysian Police Records', category: 'Security' },
                { name: 'Companies Commission (SSM)', category: 'Business' },
                { name: 'Customs Department', category: 'Trade' },
                { name: 'Insolvency Department', category: 'Financial' },
                { name: 'Land Office Registry', category: 'Property' }
              ].map((source) => (
                <button
                  key={source.name}
                  onClick={() => {
                    // Add validation logic here
                    setShowValidationSelector(false);
                  }}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{source.name}</div>
                      <div className="text-xs text-gray-500">{source.category}</div>
                    </div>
                    <div className="text-blue-600 text-xs font-medium">+ Add</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactCenterDashboard; 