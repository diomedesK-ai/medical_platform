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
  FaRobot,
  FaHeartbeat,
  FaEye,
  FaPills,
  FaHospital
} from 'react-icons/fa';
import HospitalImageAnalysis from './HospitalImageAnalysis';

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
        ? 'border-gray-300 bg-gray-50 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-300/60' 
        : 'border-gray-100 hover:shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center relative">
            {isAI ? (
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center relative">
                <span className="text-white font-bold text-xs">AI</span>
                <div className="absolute inset-0 rounded-full bg-gray-400 animate-pulse opacity-20"></div>
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
            <h4 className={`font-medium text-sm ${isAI ? 'text-gray-900' : 'text-gray-900'}`}>{name}</h4>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[status].color} text-gray-600`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              {department && (
                <span className={`text-xs ${isAI ? 'text-gray-600' : 'text-gray-500'}`}>
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
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '**Health Command - Agentic System Online**\n\n**Available Agents (Ready to Execute):**\n• **@triage** - Execute intake, assign priority, route patients\n• **@cardio** - Order ECGs, initiate protocols, calculate scores\n• **@rad** - Order imaging (MRI/CT/X-ray), schedule appointments\n• **@lab** - Place orders, interpret results, dispatch LifeSignals patches\n• **@pharm** - Process prescriptions, check interactions, manage refills\n\n**Standard Operating Procedures Active**\n**Agents will EXECUTE actions, not just advise**\n\nUpload medical images for analysis, then ask agents to take action.', timestamp: '2:30 PM' }
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
  const [showClinicalValidation, setShowClinicalValidation] = useState(false);
  const [showInternalValidation, setShowInternalValidation] = useState(false);
  const [showProcessingPipeline, setShowProcessingPipeline] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResults, setProcessingResults] = useState<any>(null);
  const [processingStep, setProcessingStep] = useState('');
  const [activeAIAgents, setActiveAIAgents] = useState([
    { name: 'Triage AI', type: 'Emergency Intake', status: 'active', requests: '156 today' },
    { name: 'Cardiology AI', type: 'Cardiology', status: 'active', requests: '89 today' },
    { name: 'Radiology AI', type: 'Imaging', status: 'active', requests: '134 today' },
    { name: 'Pharmacy AI', type: 'Medication', status: 'active', requests: '67 today' }
  ]);
  
  const [aiActivityFeed, setAiActivityFeed] = useState([
    { id: 1, agent: 'Triage AI', action: 'Prioritized chest pain case to urgent', status: 'completed', timestamp: '2 min ago', needsApproval: false },
    { id: 2, agent: 'Lab AI', action: 'Posted lab test results (CBC) for Patient #MY001248', status: 'pending_approval', timestamp: '3 min ago', needsApproval: true },
    { id: 3, agent: 'Radiology AI', action: 'Scheduled Chest X-ray; checked contraindications', status: 'completed', timestamp: '5 min ago', needsApproval: false },
    { id: 4, agent: 'Pharmacy AI', action: 'Updated medication reconciliation and flagged interaction', status: 'completed', timestamp: '7 min ago', needsApproval: false }
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
      content: `**${service.name} Connected!**\n\nThe ${service.type} AI agent has been added to your patient care workspace. This agent is now available to assist with clinical requests.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Live AI activity feed simulation
  useEffect(() => {
    const activities = [
      'Processed patient ID verification',
      'Posted lab test results (CBC)',
      'Analyzed triage notes and prioritized case',
      'Updated medication reconciliation',
      'Scheduled imaging (Chest X-ray)',
      'Reviewed vitals from LifeSignals patch',
      'Retrieved FaceHeart real-time monitoring',
      'Coordinated care team assignment',
      'Validated consent and compliance requirements',
      'Processed emergency intake request'
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

  const resetDemo = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setProcessingResults(null);
    setProcessingStep('');
    setShowClinicalValidation(false);
    setShowInternalValidation(false);
    setShowProcessingPipeline(false);
  };

  // Get pending approvals count
  const pendingApprovals = aiActivityFeed.filter(activity => activity.needsApproval).length;

  // Add new activity to live feed (called by AI agents)
  const addToActivityFeed = (agent: string, action: string, patientId?: string, ticketId?: string) => {
    const newActivity = {
      id: Date.now(),
      agent,
      action: patientId ? `${action} for Patient ${patientId}` : action,
      status: 'completed' as const,
      timestamp: 'just now',
      needsApproval: false,
      ticketId
    };
    setAiActivityFeed(prev => [newActivity, ...prev.slice(0, 9)]);
  };

  // Parse agent response and add to activity feed
  const parseAndAddToActivityFeed = (userInput: string, aiResponse: string) => {
    // Extract agent type from user input
    let agentName = 'Health AI';
    if (userInput.includes('@triage')) agentName = 'Triage AI';
    else if (userInput.includes('@cardio')) agentName = 'Cardiology AI';
    else if (userInput.includes('@rad')) agentName = 'Radiology AI';
    else if (userInput.includes('@lab')) agentName = 'Lab AI';
    else if (userInput.includes('@pharm')) agentName = 'Pharmacy AI';

    // Extract patient ID from user input or AI response
    const patientMatch = (userInput + ' ' + aiResponse).match(/(?:Patient|MRN|ID)\s*[#:]?\s*([A-Z0-9]+)/i);
    const patientId = patientMatch ? patientMatch[1] : undefined;

    // Extract ticket/reference number from AI response
    const ticketMatch = aiResponse.match(/(?:Order|Ticket|Reference|ID)\s*[#:]?\s*([A-Z0-9-]+)/i);
    const ticketId = ticketMatch ? ticketMatch[1] : undefined;

    // Extract action from AI response
    let action = 'Processed request';
    if (aiResponse.includes('**ACTION TAKEN:**')) {
      const actionMatch = aiResponse.match(/\*\*ACTION TAKEN:\*\*\s*([^\n*]+)/);
      if (actionMatch) {
        action = actionMatch[1].trim();
      }
    } else {
      // Fallback: detect common actions
      if (aiResponse.toLowerCase().includes('mri') && aiResponse.toLowerCase().includes('order')) {
        action = 'Ordered MRI scan';
      } else if (aiResponse.toLowerCase().includes('lab') && aiResponse.toLowerCase().includes('order')) {
        action = 'Ordered lab tests';
      } else if (aiResponse.toLowerCase().includes('appointment') && aiResponse.toLowerCase().includes('schedul')) {
        action = 'Scheduled appointment';
      } else if (aiResponse.toLowerCase().includes('prescription') && aiResponse.toLowerCase().includes('process')) {
        action = 'Processed prescription';
      }
    }

    // Add to activity feed
    addToActivityFeed(agentName, action, patientId, ticketId);
  };

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
        content: '👥 **Human Agent Invited!**\n\nA healthcare staff member has been notified and will join this conversation shortly. They will receive:\n• Full conversation context\n• Patient service history\n• Current case details\n• Relevant documentation\n\nPlease wait for the staff member to join.',
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
  
  // Generate follow-up agent responses for Hospital Dashboard
  const generateFollowUpAgentResponses = (originalMessage: string) => {
    const responses: { agent: string; message: string; delay: number }[] = [];

    // Check for @dispatch calls from @lab
    if (originalMessage.includes('@dispatch') && originalMessage.includes('@lab')) {
      responses.push({
        agent: '@dispatch',
        message: '@dispatch here - Received equipment request from @lab. Checking inventory levels and patient delivery address... Processing order now.',
        delay: 1500
      });
      responses.push({
        agent: '@dispatch',
        message: '@dispatch confirmed - LifeSignals patches dispatched via FedEx. Tracking: FX789012345. ETA: 24-48 hours to patient location. @lab, equipment request completed!',
        delay: 4500
      });
    }

    // Check for @triage calls from @cardio
    if (originalMessage.includes('@triage') && originalMessage.includes('@cardio')) {
      responses.push({
        agent: '@triage',
        message: '@triage responding - Reviewing cardiac indicators and patient vitals... Calculating risk stratification and priority level.',
        delay: 2000
      });
      responses.push({
        agent: '@triage',
        message: '@triage assessment - Priority Level 2 assigned. Requires monitoring but not immediately critical. @cardio, proceed with standard cardiac evaluation protocol.',
        delay: 4000
      });
    }

    // Check for @ambulance calls
    if (originalMessage.includes('@ambulance')) {
      responses.push({
        agent: '@ambulance',
        message: '@ambulance dispatch - Alert received. Checking nearest available units and crew status... Preparing for potential transport.',
        delay: 1800
      });
      responses.push({
        agent: '@ambulance',
        message: '@ambulance ready - Unit 7 on standby, 3-minute ETA. Crew briefed, medical equipment checked. Standing by for transport authorization.',
        delay: 5200
      });
    }

    // Check for @rad (radiology) calls
    if (originalMessage.includes('@rad')) {
      responses.push({
        agent: '@rad',
        message: '@rad here - Imaging request received. Checking scanner availability and preparing study protocols... Scheduling in progress.',
        delay: 2200
      });
      responses.push({
        agent: '@rad',
        message: '@rad confirmed - MRI slot booked for today 3:30 PM. Patient prep instructions sent. Contrast protocol ready. Study reference: MRI-2024-0892.',
        delay: 5000
      });
    }

    // Execute the responses with delays
    responses.forEach(response => {
      setTimeout(() => {
        setMessages((msgs) => [...msgs, {
          role: 'assistant',
          content: response.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, response.delay);
    });
  };
  
  // Healthcare Control Tower prompt with web search and knowledge base
  const [customPrompt] = useState(`You are an AGENTIC AI Assistant for a Hospital Contact Center. You don't just provide information - you EXECUTE ACTIONS and follow Standard Operating Procedures.

COLLABORATIVE AGENT SPECIALIZATIONS:
• @triage - Execute intake protocols, assign priority levels, route patients, coordinate with other agents
• @cardio - Order ECGs, initiate chest pain protocols, calculate risk scores, consult @rad for imaging
• @rad - Order imaging studies (X-ray, CT, MRI, US), schedule appointments, work with @cardio/@triage
• @lab - Place lab orders, interpret results, flag critical values, call @dispatch for equipment/supplies
• @dispatch - Equipment ordering, supply management, LifeSignals patches, logistics coordination
• @pharm - Process medication orders, check interactions, manage refills, coordinate with @lab

COLLABORATIVE BEHAVIOR:
- Work as a medical team - hand off tasks to appropriate specialists
- If a request is outside your scope, call the right agent to help
- Confirm actions between agents and provide status updates
- Be proactive and solution-oriented

MULTI-AGENT COLLABORATION:
When agents need to collaborate, respond as the PRIMARY agent only. Other agents will respond automatically in separate messages.

EXAMPLE - @lab equipment request:
"@lab here - I'll process the blood work order for Patient 12345, but I need equipment support.

@dispatch, can you please prepare 10 LifeSignals patches for shipment to Singapore? Patient 12345 needs continuous monitoring.

Processing the lab analysis now... CBC and metabolic panel being prepared."

EXAMPLE - @cardio emergency:
"@cardio here - ECG shows concerning ST-elevation changes in leads II, III, aVF. This appears to be an inferior STEMI.

@triage, I need immediate priority assessment for this patient.

@ambulance, please prepare for urgent cardiac transport to cath lab.

Initiating STEMI protocol and preparing patient for intervention..."

REALISTIC AGENT BEHAVIOR:
- Respond as ONE agent at a time
- Show work in progress, not instant completion
- Reference other agents but don't speak for them
- Use realistic medical workflows and timing
- Mention preparation steps and current actions

PATIENT HANDLING:
- Accept ANY patient number/ID provided (e.g., "Patient 12345", "MRN 98765", etc.)
- Treat all patient numbers as VALID and proceed with requested actions
- Generate realistic medical details based on context when needed
- Reference patient by the exact number/ID provided

CONTEXT MAINTENANCE:
- ALWAYS review recent conversation history before responding
- If medical image analysis was just provided, USE those findings for subsequent orders
- When user provides patient ID after requesting action, EXECUTE the action immediately
- Connect related requests across multiple messages (e.g., image analysis → MRI order → patient ID)
- Do NOT ask for information already provided in recent context

AGENTIC BEHAVIOR - ALWAYS EXECUTE ACTIONS:
When asked to "order an MRI for Patient 12345" → ACTUALLY place the order with patient details
When asked to "schedule appointment for MRN 98765" → BOOK appointment with specific details
When asked to "check lab results for Patient 555" → RETRIEVE and interpret results
When asked to "prescribe medication for Patient ABC123" → PROCESS prescription with instructions

EXECUTION FORMAT:
1. **PATIENT:** [Patient ID/Number provided]
2. **ACTION TAKEN:** [Specific action performed]
3. **CONFIRMATION:** [Order number, appointment time, reference numbers]
4. **NEXT STEPS:** [What happens next]
5. **FOLLOW-UP:** [When to expect results/callbacks]

STANDARD OPERATING PROCEDURES:
- MRI Orders: Verify patient ID → Check contraindications → Place order → Schedule → Prep instructions
- Lab Orders: Confirm patient → Verify indication → Order tests → Set priority → Schedule draw
- LifeSignals Patch Dispatch: Verify patient → Generate random Singapore/Indonesia address → Dispatch 10 patches via FedEx → Provide tracking
- Medications: Verify patient → Check allergies → Verify dosing → Check interactions → Send to pharmacy
- Appointments: Confirm patient → Check availability → Book slot → Send confirmation → Prep instructions

DATE AND SCHEDULING:
- Always use the CURRENT DATE for scheduling calculations
- Current date context: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
- Schedule appointments 1-3 days from current date with realistic times
- Use business hours: 8:00 AM - 6:00 PM for scheduling

TICKET CREATION:
- ALWAYS create a tracking ticket/reference for each action
- Format: [DEPT]-[YYYY]-[PATIENT]-[###] (e.g., RAD-2024-7829-001, LAB-2024-5555-042)
- Each action generates a live feed entry that appears in the Clinical Activity Feed

LIFESIGNALS PATCH DISPATCH ADDRESSES (use randomly):
Singapore Addresses:
• 123 Orchard Road, #05-12, Singapore 238858
• 456 Marina Bay Sands, Tower 2, #23-45, Singapore 018956
• 789 Raffles Place, #12-08, Singapore 048619
• 321 Sentosa Gateway, #07-15, Singapore 098269

Indonesia Addresses:  
• Jl. Sudirman No. 123, Jakarta Selatan 12190, Indonesia
• Jl. Thamrin No. 456, Jakarta Pusat 10350, Indonesia
• Jl. Gatot Subroto No. 789, Jakarta Selatan 12930, Indonesia
• Jl. HR Rasuna Said No. 321, Jakarta Selatan 12940, Indonesia

RESPONSE STRATEGY:
1) ACCEPT the patient number/ID as provided
2) IDENTIFY the specific action requested
3) EXECUTE the action following SOPs with patient details
4) CREATE a tracking ticket and add to live activity feed
5) PROVIDE confirmation with specific details and reference numbers
6) OUTLINE next steps with realistic timeline based on current date

You are NOT just an advisor - you are an EXECUTOR. Make things happen for real patients with real tracking!`);

  useEffect(() => {
    // Initialize current time on client side only
    setCurrentTime(new Date());
    
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

CONVERSATION CONTEXT:
Recent conversation history for context maintenance:
${messages.slice(-5).map(msg => `${msg.role === 'user' ? 'USER' : 'ASSISTANT'}: ${msg.content}`).join('\n')}

CURRENT USER QUERY: ${currentInput}

IMPORTANT: Maintain context from previous messages. If a medical image analysis was just provided and user asks for an MRI with a patient ID, EXECUTE the MRI order based on the analysis findings. Do not ask for clarification when context is clear.`,
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
          
          // Parse response for actions and add to activity feed
          if (responseContent) {
            parseAndAddToActivityFeed(currentInput, responseContent);
            
            // Generate follow-up agent responses after delay
            setTimeout(() => {
              generateFollowUpAgentResponses(responseContent);
            }, 2000);
          }
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
  const [kpis, setKpis] = useState<Array<{
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
    suffix?: string;
    withoutAI: string | number;
    worstChange: number;
  }>>([
    { title: 'Patients in Care', value: 24, change: 8, icon: <FaUsers size={14} />, withoutAI: 9, worstChange: -62 },
    { title: 'Avg ED Wait', value: '23 min', change: -12, icon: <FaClock size={14} />, withoutAI: '1:12', worstChange: 320 },
    { title: 'Available Beds', value: 156, change: 3, icon: <FaHospital size={14} />, withoutAI: 98, worstChange: -44 },
    { title: 'Service Resolution', value: 98, change: 2, icon: <FaCheckCircle size={14} />, suffix: '%', withoutAI: '71%', worstChange: -27 },
    { title: 'Patient Satisfaction', value: 4.7, change: 1, icon: <FaHeartbeat size={14} />, suffix: '/5', withoutAI: '3.3/5', worstChange: -31 },
    { title: 'Critical Cases', value: 4, change: 0, icon: <FaExclamationTriangle size={14} />, withoutAI: 7, worstChange: 12 }
  ]);

  // Live KPI updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setKpis(prevKpis => prevKpis.map(kpi => {
        const randomVariation = Math.random() * 2 - 1; // -1 to +1 variation
        let newChange = kpi.change + randomVariation;
        let newValue = kpi.value;
        
        // Keep changes within reasonable bounds and positive trends for AI impact
        if (kpi.title === 'Patients in Care') {
          newChange = Math.max(8, Math.min(18, newChange));
          const variation = Math.floor(Math.random() * 3) - 1; // -1 to +1
          newValue = Math.max(20, Math.min(30, (typeof kpi.value === 'number' ? kpi.value : 24) + variation));
        } else if (kpi.title === 'Avg ED Wait') {
          newChange = Math.max(-25, Math.min(-15, newChange));
          // Keep time realistic
          const baseMinutes = 23;
          const baseSeconds = 0;
          const totalSeconds = baseMinutes * 60 + baseSeconds + Math.floor(Math.random() * 30) - 15;
          const newMinutes = Math.floor(totalSeconds / 60);
          const newSecs = totalSeconds % 60;
          newValue = `${newMinutes}:${newSecs.toString().padStart(2, '0')}`;
        } else if (kpi.title === 'Available Beds') {
          newChange = Math.max(2, Math.min(5, newChange));
          const variation = Math.floor(Math.random() * 5) - 2;
          newValue = Math.max(140, Math.min(170, (typeof kpi.value === 'number' ? kpi.value : 156) + variation));
        } else if (kpi.title === 'Service Resolution') {
          newChange = Math.max(1, Math.min(6, newChange));
          const variation = Math.floor(Math.random() * 3) - 1;
          newValue = Math.max(95, Math.min(99, (typeof kpi.value === 'number' ? kpi.value : 98) + variation));
        } else if (kpi.title === 'Patient Satisfaction') {
          newChange = Math.max(1, Math.min(4, newChange));
          const variation = (Math.random() * 0.2) - 0.1;
          newValue = Math.max(4.5, Math.min(4.8, (typeof kpi.value === 'number' ? kpi.value : 4.7) + variation));
          newValue = Math.round(newValue * 10) / 10;
        } else if (kpi.title === 'Critical Cases') {
          newChange = Math.max(-2, Math.min(2, newChange));
          const variation = Math.floor(Math.random() * 3) - 1;
          newValue = Math.max(2, Math.min(6, (typeof kpi.value === 'number' ? kpi.value : 4) + variation));
        }
        
        return { ...kpi, change: Math.round(newChange * 10) / 10, value: newValue };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const agents: AgentCardProps[] = [
    { name: 'Dr. Siti Nurhaliza', status: 'available' as const, callsHandled: 15, avgCallTime: '6:12', rating: 4.9, department: 'Emergency Medicine', type: 'human' as const },
    { name: 'Encik Rahman Ismail', status: 'busy' as const, callsHandled: 22, avgCallTime: '4:35', rating: 4.8, department: 'Cardiology', type: 'human' as const },
    { name: 'Puan Aminah Yusof', status: 'available' as const, callsHandled: 18, avgCallTime: '5:45', rating: 4.7, department: 'Radiology', type: 'human' as const },
    { name: 'Datuk Ahmad Rashid', status: 'away' as const, callsHandled: 12, avgCallTime: '7:20', rating: 4.9, department: 'Pharmacy', type: 'human' as const },
    { name: 'AI Triage Agent', status: 'available' as const, callsHandled: 89, avgCallTime: '0:45', rating: 4.9, department: 'Triage AI', type: 'ai' as const },
    { name: 'AI Cardio Agent', status: 'available' as const, callsHandled: 127, avgCallTime: '0:32', rating: 4.8, department: 'Cardiology AI', type: 'ai' as const },
    { name: 'AI Radiology Agent', status: 'available' as const, callsHandled: 156, avgCallTime: '0:28', rating: 4.9, department: 'Radiology AI', type: 'ai' as const },
    { name: 'AI Lab Agent', status: 'available' as const, callsHandled: 98, avgCallTime: '0:52', rating: 4.8, department: 'Laboratory AI', type: 'ai' as const }
  ];

  const queueItems = [
    { id: 1, customer: 'Patient #MY001247', waitTime: '0:45', priority: 'High', category: 'Emergency Intake' },
    { id: 2, customer: 'Patient #MY001248', waitTime: '1:23', priority: 'Medium', category: 'Cardiology' },
    { id: 3, customer: 'Patient #MY001249', waitTime: '2:01', priority: 'Low', category: 'Radiology Scheduling' },
    { id: 4, customer: 'Patient #MY001250', waitTime: '0:12', priority: 'High', category: 'Pharmacy Refill' }
  ];

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Healthcare Control Tower</h1>
            <p className="text-gray-500 text-sm">Real-time patient services monitoring and analytics</p>
          </div>
                    <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Current Time</p>
              <p className="text-sm font-medium text-gray-900">{currentTime?.toLocaleTimeString() || '--:--:--'}</p>
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
          {/* Live Clinical Activity Feed */}
          <div className="col-span-2 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">Live Clinical Activity Feed</h2>
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
                      <div className="w-4 h-4 bg-white border border-transparent bg-clip-padding rounded-full flex items-center justify-center"
                           style={{
                             backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #10b981, #059669)',
                             backgroundOrigin: 'border-box',
                             backgroundClip: 'padding-box, border-box'
                           }}>
                        <svg className="w-2.5 h-2.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
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
                    <div className="px-3 py-1 bg-white border border-amber-300 text-amber-600 text-xs font-medium rounded-full">
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
                  <div className="px-3 py-1 bg-white border border-red-300 text-red-600 text-xs font-medium rounded-full">
                    Review
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => setShowDocumentProcessor(true)}
                className="w-full text-left p-4 hover:bg-green-50/70 rounded-lg transition-colors group bg-green-50/60 shadow-sm hover:shadow-md border border-green-200 hover:border-green-300"
              >
                <div className="font-bold text-gray-900 group-hover:text-gray-700 text-lg">Clinical Processor</div>
                <div className="text-sm text-gray-500 mt-1">Process clinical documents (labs, imaging, prescriptions)</div>
                <div className="text-xs text-blue-600 mt-2">Medical Intelligence • Multi-format support • Real-time analysis</div>
              </button>
              
              <button className="w-full text-left p-4 hover:bg-red-50/70 rounded-lg transition-colors group bg-red-50/60 shadow-sm hover:shadow-md border border-red-200 hover:border-red-300">
                <div className="font-bold text-gray-900 group-hover:text-gray-700 text-lg">Emergency Override</div>
                <div className="text-sm text-gray-500 mt-1">Critical controls</div>
                <div className="text-xs text-blue-600 mt-2">System override • Manual intervention • Priority escalation</div>
              </button>
            </div>
          </div>
        </div>

        {/* Care Team Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Care Team Status — AI & Clinicians</h2>
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
              <button
                onClick={() => setShowAddAgentModal(true)}
                className="w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center text-lg font-light"
                title="Add Agent"
              >
                +
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {agents.map((agent, index) => (
              <AgentCard key={index} {...agent} />
            ))}
          </div>
        </div>

        {/* Health Command */}
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
                  <h3 className="font-semibold text-gray-900">Health Command</h3>
                  <div className="text-sm text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Online • Use @triage, @cardio, @lab, @rad, or @pharm
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* slot for controls */}
              </div>
            </div>
          </div>

          <div className="p-4">
            {/* Inline Medical Image Analysis */}
            <div className="mb-4">
              <HospitalImageAnalysis onAnalysisComplete={(analysis) => {
                const analysisMessage: Message = {
                  role: 'assistant',
                  content: analysis,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, analysisMessage]);
              }} />
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
              <h3 className="text-lg font-semibold text-gray-900">Add to Healthcare Services</h3>
              <button
                onClick={() => setShowAddAgentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-400" size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">Choose what you'd like to add to this patient service thread:</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleAgentSelection('person')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600" size={16} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Add Healthcare Staff</div>
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
              <h3 className="text-lg font-semibold text-gray-900">Healthcare AI Agent Management</h3>
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
                    { name: 'Triage AI', type: 'Emergency Intake', available: true },
                    { name: 'Cardiology AI', type: 'Cardiology', available: true },
                    { name: 'Radiology AI', type: 'Imaging', available: true },
                    { name: 'Lab AI', type: 'Laboratory', available: true },
                    { name: 'Pharmacy AI', type: 'Medication', available: true },
                    { name: 'Patient Analytics AI', type: 'Clinical Analytics', available: true }
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
                        <span className="text-gray-600">EHR (Hospital EMR)</span>
                        <span className="text-xs text-green-600 ml-auto">✓ Connected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">LIS (Lab Information System)</span>
                        <span className="text-xs text-green-600 ml-auto">✓ Validated</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-600">PACS (Imaging)</span>
                        <span className="text-xs text-green-600 ml-auto">✓ Accessed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                        <span className="text-gray-600">Wearables (LifeSignals / FaceHeart)</span>
                        <span className="text-xs text-green-600 ml-auto">✓ Streaming</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Detailed Analysis */}
                <div className="space-y-6">
                  <div className="bg-purple-50/30 rounded-lg p-4 border border-purple-100">
                    <h4 className="font-medium text-gray-900 mb-3">Patient Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Patient ID:</span>
                        <span className="font-mono text-gray-900">MY001248</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium text-gray-900">Ahmad Bin Abdullah</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Encounter Type:</span>
                        <span className="font-medium text-gray-900">ED — Chest Pain</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-gray-900">Zone B, Bed 12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Allergies:</span>
                        <span className="font-medium text-gray-900">NKDA</span>
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
                        <strong>Recommendation:</strong> CBC within normal ranges. Continue observation and proceed with Chest X-ray as scheduled. Alert if troponin &gt; threshold.
                      </div>
                      <div className="text-sm text-gray-700">
                        <strong>Risk Factors:</strong> No critical values detected. No immediate sepsis or anemia flags.
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/30 rounded-lg p-4 border border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-3">Processing History</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium text-gray-900">Order Received</div>
                          <div className="text-gray-600">15:23 - CBC ordered in EHR</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium text-gray-900">Sample Collected</div>
                          <div className="text-gray-600">15:29 - Specimen received in lab (LIS)</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium text-gray-900">Results Validated</div>
                          <div className="text-gray-600">15:36 - QC checks passed, no critical values</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium text-gray-900">Posted & Notified</div>
                          <div className="text-gray-600">15:37 - Results posted to EHR and clinician notified</div>
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
                  <div className="text-sm text-gray-400 mb-3">Clinical documents auto-processed</div>
                  <div className="text-3xl font-light text-gray-900 mb-2">82.4%</div>
                  <div className="text-xs text-green-600">+4.1% from last period</div>
                  <div className="mt-4 bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-900 rounded-full h-2" style={{ width: '82.4%' }}></div>
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Documents Processed</h3>
                  <div className="text-sm text-gray-400 mb-3">Total clinical docs in pipeline</div>
                  <div className="text-3xl font-light text-gray-900 mb-2">1,362</div>
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Completed: 1,048</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-600">In Progress: 214</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600">Exceptions: 100</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Average Processing Time</h3>
                  <div className="text-sm text-gray-400 mb-3">From receipt to structured output</div>
                  <div className="text-3xl font-light text-gray-900 mb-2">2m 12s</div>
                  <div className="text-xs text-green-600">-11% from last period</div>
                  <div className="mt-4 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 rounded-full h-2" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Exception Rate</h3>
                  <div className="text-sm text-gray-400 mb-3">Requires coder/clinician review</div>
                  <div className="text-3xl font-light text-gray-900 mb-2">17.3%</div>
                  <div className="text-xs text-green-600">-3.8% from last period</div>
                  <div className="mt-4 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 rounded-full h-2" style={{ width: '17.3%' }}></div>
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
                        { type: 'Lab Reports', count: 412, rate: 91, color: 'bg-blue-500' },
                        { type: 'Radiology Reports', count: 328, rate: 86, color: 'bg-green-500' },
                        { type: 'Prescriptions', count: 276, rate: 88, color: 'bg-purple-500' },
                        { type: 'Discharge Summaries', count: 193, rate: 74, color: 'bg-yellow-500' },
                        { type: 'Referrals / Consents', count: 153, rate: 69, color: 'bg-red-500' }
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
                        { type: 'OCR Failures', count: 64, percentage: 5.1, reason: 'Low-quality scans/handwriting (61%)', icon: '⚠️' },
                        { type: 'Clinical Validation Failures', count: 97, percentage: 8.0, reason: 'Missing identifiers or ranges (68%)', icon: '⚠️' },
                        { type: 'Routing Failures', count: 76, percentage: 6.2, reason: 'Incorrect department mapping (42%)', icon: '⚠️' }
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
                        <p className="text-sm text-blue-700 mb-3">Based on the current clinical pipeline analysis, here are the key bottlenecks and recommended optimizations:</p>
                        <ul className="space-y-2 text-sm text-blue-600">
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-500">●</span>
                            <div>
                              <strong>Patient ID verification failures (35%)</strong>
                              <div className="text-xs text-blue-500">Recommendation: Enhance MRN matching with fuzzy rules and barcode capture at intake; align with FHIR Patient resource.</div>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-500">●</span>
                            <div>
                              <strong>Radiology report sectioning errors (28%)</strong>
                              <div className="text-xs text-blue-500">Recommendation: Use radiology-specific parser and enforce sections (History/Technique/Findings/Impression).</div>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500">●</span>
                            <div>
                              <strong>Processing time spike during 9-11 AM</strong>
                              <div className="text-xs text-blue-500">Recommendation: Autoscale OCR workers and queue triage during morning draw window.</div>
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

      {/* Clinical Processor Modal */}
      {showDocumentProcessor && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Clinical Processor</h3>
                <p className="text-sm text-gray-500">Process labs, imaging reports, prescriptions, and clinical PDFs</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetDemo}
                  className="w-7 h-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
                  title="Reset Demo"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowDocumentProcessor(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <FaTimes className="text-gray-400" size={14} />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                <h3 className="text-base font-medium text-gray-900 mb-1">Clinical Processor</h3>
                <p className="text-xs text-gray-500 mb-3">Upload for structured extraction, medical coding, and validation</p>
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">Auto-detected: <span className="font-medium">{selectedFile ? (selectedFile.name.match(/xray|cxr|radiology|dicom/i) ? 'Radiology' : selectedFile.name.match(/cbc|lab|result|report/i) ? 'Lab Report' : selectedFile.name.match(/rx|prescription|med/i) ? 'Prescription' : 'General Clinical') : '—'}</span></div>
                  <div className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full">Models: <span className="font-medium">{selectedFile ? (selectedFile.name.match(/xray|cxr|radiology|dicom/i) ? 'Radiology Parser' : selectedFile.name.match(/cbc|lab|result|report/i) ? 'Lab Extractor' : selectedFile.name.match(/rx|prescription|med/i) ? 'Medication & SIG' : 'General Clinical') : '—'}</span></div>
                  <div className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full">Output: <span className="font-medium">FHIR JSON</span></div>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  {selectedFile ? (
                    <div className="flex items-center gap-2">
                      <div className="text-xs font-medium text-gray-900 truncate max-w-32">{selectedFile.name}</div>
                      <button 
                        onClick={() => setSelectedFile(null)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">No file selected</div>
                  )}
                  
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
                    className="w-6 h-6 bg-blue-50 border border-blue-200 text-blue-600 rounded-full hover:bg-blue-100 transition-all cursor-pointer flex items-center justify-center"
                  >
                    <span className="text-sm font-medium">+</span>
                  </label>
                  
                  {selectedFile && (
                    <button 
                      onClick={processDocument}
                      disabled={isProcessing}
                      className="w-6 h-6 bg-green-50 border border-green-200 text-green-600 rounded-full hover:bg-green-100 transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <div className="w-3 h-3 border border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                
                <p className="text-xs text-gray-400 mt-2">PDF, JPG, PNG, DOCX, DICOM, ECG, HL7 • PHI safe</p>
                {isProcessing && (
                  <div className="text-xs text-blue-600 mt-2 font-medium">
                    {processingStep || 'Processing...'}
                  </div>
                )}
                
                {/* Model Selection */}
                <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <label className="text-xs text-gray-600">Model</label>
                    <select className="w-full border rounded-md px-2 py-1 text-sm">
                      <option>Auto (Smart Detection)</option>
                      <option>General Clinical (LLM)</option>
                      <option>Radiology Report Parser</option>
                      <option>Lab Result Extractor</option>
                      <option>Medication & SIG Extractor</option>
                      <option>Discharge Summary Summarizer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Output</label>
                    <select className="w-full border rounded-md px-2 py-1 text-sm">
                      <option>FHIR JSON</option>
                      <option>HL7 v2 Segments</option>
                      <option>Structured JSON</option>
                      <option>Markdown Summary</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">PII Handling</label>
                    <select className="w-full border rounded-md px-2 py-1 text-sm">
                      <option>Redact</option>
                      <option>Pseudonymize</option>
                      <option>Keep (secured)</option>
                    </select>
                  </div>
                </div>

                {/* Processing Results */}
                {processingResults && (
                  <div className="mt-4 p-3 bg-green-50/30 rounded-xl border border-green-100">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm">Clinical Analysis Results</h4>
                    
                    {/* Document Type & Classification */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-white rounded-lg p-2 border border-gray-200">
                        <div className="text-xs text-gray-500">Document Type</div>
                        <div className="text-sm font-medium text-gray-900">{processingResults.documentType || 'Unknown'}</div>
                      </div>
                      <div className="bg-white rounded-lg p-2 border border-gray-200">
                        <div className="text-xs text-gray-500">Classification</div>
                        <div className="text-sm font-medium text-gray-900">{processingResults.classification || 'N/A'}</div>
                      </div>
                    </div>

                    {/* Patient Info */}
                    {processingResults.patientInfo && (
                      <div className="bg-white rounded-lg p-2 border border-gray-200 mb-3">
                        <div className="text-xs text-gray-500 mb-1">Patient Information</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><span className="text-gray-500">Name:</span> {processingResults.patientInfo.fullName || 'Not detected'}</div>
                          <div><span className="text-gray-500">ID:</span> {processingResults.patientInfo.patientId || 'Not detected'}</div>
                          <div><span className="text-gray-500">DOB:</span> {processingResults.patientInfo.dateOfBirth || 'Not detected'}</div>
                          <div><span className="text-gray-500">Gender:</span> {processingResults.patientInfo.gender || 'Not detected'}</div>
                        </div>
                      </div>
                    )}

                    {/* Medical Analysis */}
                    {processingResults.medicalAnalysis && (
                      <div className="bg-white rounded-lg p-2 border border-gray-200 mb-3">
                        <div className="text-xs text-gray-500 mb-1">Clinical Findings</div>
                        <div className="text-xs text-gray-700 max-h-20 overflow-y-auto">
                          {processingResults.medicalAnalysis.findings || 'No specific findings noted'}
                        </div>
                        {processingResults.medicalAnalysis.recommendations && processingResults.medicalAnalysis.recommendations.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-500">Recommendations:</div>
                            <div className="text-xs text-blue-700">
                              {processingResults.medicalAnalysis.recommendations.join(', ')}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Validation Status */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-white rounded-lg p-2 border border-gray-200">
                        <div className="text-xs text-gray-500">Risk Level</div>
                        <div className={`text-sm font-medium ${
                          processingResults.riskAssessment?.riskLevel === 'LOW' ? 'text-green-600' :
                          processingResults.riskAssessment?.riskLevel === 'MEDIUM' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {processingResults.riskAssessment?.riskLevel || 'Unknown'}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-2 border border-gray-200">
                        <div className="text-xs text-gray-500">Confidence</div>
                        <div className="text-sm font-medium text-gray-900">{processingResults.riskAssessment?.confidence || 0}%</div>
                      </div>
                    </div>

                    {/* Raw JSON Toggle */}
                    <details className="mb-3">
                      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">View Raw JSON</summary>
                      <div className="mt-2 bg-gray-50 rounded p-2 border">
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-32">
                          {JSON.stringify(processingResults, null, 2)}
                        </pre>
                      </div>
                    </details>

                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-green-600 text-white rounded-full text-xs hover:bg-green-700 transition-colors">
                        Approve & Route
                      </button>
                      <button className="px-3 py-1 text-gray-600 border border-gray-300 rounded-full text-xs hover:bg-gray-50 transition-colors">
                        Review Further
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-blue-50/20 rounded-xl border border-blue-100/50">
                  <div className="flex items-center justify-between mb-3">
                    <button 
                      onClick={() => setShowClinicalValidation(!showClinicalValidation)}
                      className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                    >
                      <svg 
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showClinicalValidation ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <h4 className="font-semibold text-gray-900">Clinical Validation Checks</h4>
                    </button>
                    <button 
                      onClick={() => setShowValidationSelector(true)}
                      className="text-blue-500 hover:text-blue-600 transition-colors text-lg font-light"
                    >
                      +
                    </button>
                  </div>
                  {showClinicalValidation && (
                    <div className="grid grid-cols-2 gap-3 text-sm animate-in slide-in-from-top-2 duration-200">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-gray-700">EHR Patient Match</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-gray-700">LIS Result Cross-check</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-gray-700">PACS Study Correlation</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-gray-700">Medication Interaction Screen</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-700">Allergy/Contraindication Check</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-700">Consent/Privacy Policy</span>
                    </label>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-green-50/30 rounded-xl border border-green-100">
                  <button 
                    onClick={() => setShowInternalValidation(!showInternalValidation)}
                    className="flex items-center gap-2 text-left mb-3 hover:text-green-600 transition-colors"
                  >
                    <svg 
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showInternalValidation ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <h4 className="font-semibold text-gray-900">Internal Validation Checks</h4>
                  </button>
                  {showInternalValidation && (
                    <div className="grid grid-cols-2 gap-3 text-sm animate-in slide-in-from-top-2 duration-200">
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
                  )}
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <button 
                    onClick={() => setShowProcessingPipeline(!showProcessingPipeline)}
                    className="flex items-center gap-2 text-left mb-2 hover:text-gray-700 transition-colors"
                  >
                    <svg 
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showProcessingPipeline ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <h4 className="font-semibold text-gray-900">Processing Pipeline</h4>
                  </button>
                  {showProcessingPipeline && (
                    <div className="space-y-2 text-sm text-gray-600 animate-in slide-in-from-top-2 duration-200">
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
                  )}
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
              <h4 className="font-medium text-gray-900 mb-3">Available Clinical Sources:</h4>
              
              {[
                { name: 'Hospital EHR (FHIR)', category: 'Clinical' },
                { name: 'Lab Information System (LIS)', category: 'Lab' },
                { name: 'PACS / VNA', category: 'Imaging' },
                { name: 'Pharmacy / eRx', category: 'Medication' },
                { name: 'Allergy & Alerts Registry', category: 'Safety' },
                { name: 'Vitals Stream (LifeSignals)', category: 'Wearables' },
                { name: 'FaceHeart Monitor', category: 'Wearables' },
                { name: 'Consent / Privacy Module', category: 'Governance' },
                { name: 'Local Clinical Guidelines', category: 'Knowledge' },
                { name: 'Public Health Notifications', category: 'Population' }
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