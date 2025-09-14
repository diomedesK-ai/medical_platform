"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPlus, FaCheck, FaPhone, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from 'react-icons/fa';

interface CitizenProfile {
  name: string;
  icNumber: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  occupation: string;
  monthlyIncome: string;
  maritalStatus: string;
  nationality: string;
  religion: string;
  bloodType: string;
  chronicConditions: string[];
  insuranceNumber: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface Agent {
  id: string;
  name: string;
  specialty: string;
  status: 'online' | 'busy' | 'offline';
}

interface Message {
  id: string;
  sender: 'citizen' | 'agent';
  content: string;
  timestamp: string;
  agentName?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'processed' | 'processing' | 'failed';
  extractedData?: any;
}


const AVAILABLE_SERVICES: Service[] = [
  { id: 'health_monitoring', name: 'Health Monitoring', category: 'Healthcare', description: 'Real-time health tracking' },
  { id: 'tax_filing', name: 'Tax Filing', category: 'Finance', description: 'Online tax submission' },
  { id: 'education_grants', name: 'Education Grants', category: 'Education', description: 'Scholarship applications' },
  { id: 'housing_loans', name: 'Housing Loans', category: 'Housing', description: 'Home financing assistance' },
  { id: 'business_license', name: 'Business License', category: 'Business', description: 'Business registration' },
  { id: 'social_benefits', name: 'Social Benefits', category: 'Welfare', description: 'Social assistance programs' },
  { id: 'legal_aid', name: 'Legal Aid', category: 'Legal', description: 'Legal consultation services' },
  { id: 'employment_services', name: 'Employment', category: 'Career', description: 'Job placement assistance' },
  { id: 'senior_care', name: 'Senior Care', category: 'Healthcare', description: 'Elderly care services' },
  { id: 'child_benefits', name: 'Child Benefits', category: 'Family', description: 'Child support programs' }
];

const AI_AGENTS: Agent[] = [
  { id: 'health', name: 'Health AI', specialty: 'Healthcare Services', status: 'online' },
  { id: 'finance', name: 'Finance AI', specialty: 'Tax & Finance', status: 'online' },
  { id: 'education', name: 'Education AI', specialty: 'Education Grants', status: 'online' },
  { id: 'housing', name: 'Housing AI', specialty: 'Housing Services', status: 'online' },
  { id: 'legal', name: 'Legal AI', specialty: 'Legal Affairs', status: 'online' },
  { id: 'welfare', name: 'Welfare AI', specialty: 'Social Welfare', status: 'online' }
];


const CitizenServicesInterface: React.FC = () => {
  const [showAddService, setShowAddService] = useState(false);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [showDocumentScanner, setShowDocumentScanner] = useState(false);
  const [showHealthcareOptions, setShowHealthcareOptions] = useState(false);
  const [showAgentSkills, setShowAgentSkills] = useState(false);
  const [selectedAgentForSkills, setSelectedAgentForSkills] = useState<Agent | null>(null);
  const [documentSearchQuery, setDocumentSearchQuery] = useState('');
  const [myServices, setMyServices] = useState<Service[]>([
    AVAILABLE_SERVICES[1], // Tax Filing
    AVAILABLE_SERVICES[2]  // Education Grants
  ]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'agent',
      content: '**@health** - Book medical appointments, check health records, prescription refills\\n**@tax** - File taxes, check refund status, download forms\\n**@education** - Apply for scholarships, check exam results, course enrollment\\n**@housing** - Housing loans, property tax, rental assistance\\n**@legal** - Legal aid, document verification, court schedules\\n**@welfare** - Social assistance, disability support, senior care\\n\\n**Type @[agent] + your request** or upload documents for processing.',
      timestamp: '9:15 AM',
      agentName: 'Government AI Assistant'
    },
    {
      id: '2',
      sender: 'citizen',
      content: '@health book appointment with cardiologist in KLCC, prefer Mandarin speaking doctor',
      timestamp: '9:17 AM'
    },
    {
      id: '3',
      sender: 'agent',
      content: '**Appointment Booked Successfully! 🏥**\\n\\n**Doctor:** Dr. Lim Wei Ming (Cardiologist)\\n**Language:** Mandarin & English\\n**Location:** Suria KLCC Medical Centre\\n**Date:** Tomorrow, 2:30 PM\\n**Reference:** APT-2024-HC-001234\\n\\n**What to bring:**\\n• MyKad\\n• Previous medical records\\n• Insurance card\\n\\n**Parking:** Level B2 validated for 3 hours\\n\\nAppointment reminder sent to your phone. Need to reschedule or have questions?',
      timestamp: '9:18 AM',
      agentName: 'Health AI'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(AI_AGENTS[0]);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [showDocumentDetails, setShowDocumentDetails] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  
  // Call functionality states
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTranscript, setCallTranscript] = useState<string>('');
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // WebRTC refs
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  // Enhanced citizen profile
  const citizenProfile: CitizenProfile = {
    name: 'Ahmad Bin Abdullah',
    icNumber: '800101-01-1234',
    phone: '+60-12-345-6789',
    email: 'ahmad.abdullah@email.com',
    address: 'No. 15, Jalan Sultan Ismail, 50250 Kuala Lumpur',
    emergencyContact: '+60-12-987-6543',
    occupation: 'Software Engineer',
    monthlyIncome: 'RM 8,500',
    maritalStatus: 'Married',
    nationality: 'Malaysian',
    religion: 'Islam',
    bloodType: 'A+',
    chronicConditions: ['Hypertension', 'Diabetes Type 2'],
    insuranceNumber: 'GHS-2024-001234'
  };

  // Mock documents data
  const myDocuments: Document[] = [
    {
      id: 'doc1',
      name: 'IC Copy - Front & Back',
      type: 'Identity Card',
      uploadDate: '2024-01-15',
      status: 'processed',
      extractedData: { 
        name: 'Ahmad Bin Abdullah', 
        ic: '800101-01-1234', 
        address: 'No. 15, Jalan Sultan Ismail, 50250 Kuala Lumpur',
        nationality: 'Malaysian',
        religion: 'Islam',
        birthDate: '01/01/1980'
      }
    },
    {
      id: 'doc2',
      name: 'Salary Statement - December 2024',
      type: 'Income Document',
      uploadDate: '2024-01-10',
      status: 'processed',
      extractedData: { 
        employer: 'Tech Solutions Sdn Bhd', 
        salary: 'RM 8,500', 
        period: 'December 2024',
        position: 'Software Engineer',
        employeeId: 'TS-2024-001',
        taxDeduction: 'RM 850'
      }
    },
    {
      id: 'doc3',
      name: 'Medical Certificate - Health Checkup',
      type: 'Health Document',
      uploadDate: '2024-01-08',
      status: 'processed',
      extractedData: {
        patientName: 'Ahmad Bin Abdullah',
        doctorName: 'Dr. Siti Nurhaliza',
        hospital: 'Kuala Lumpur General Hospital',
        checkupDate: '05/01/2024',
        bloodPressure: '120/80',
        bloodType: 'A+',
        conditions: 'Hypertension, Diabetes Type 2'
      }
    },
    {
      id: 'doc4',
      name: 'Bank Statement - December 2024',
      type: 'Financial Document',
      uploadDate: '2024-01-05',
      status: 'processed',
      extractedData: {
        accountHolder: 'Ahmad Bin Abdullah',
        accountNumber: '****-****-1234',
        bank: 'Maybank Berhad',
        balance: 'RM 25,750',
        lastTransaction: '31/12/2024',
        accountType: 'Savings Account'
      }
    },
    {
      id: 'doc5',
      name: 'Property Assessment - 2024',
      type: 'Property Document',
      uploadDate: '2024-01-03',
      status: 'processed',
      extractedData: {
        propertyOwner: 'Ahmad Bin Abdullah',
        propertyAddress: 'No. 15, Jalan Sultan Ismail, 50250 Kuala Lumpur',
        propertyType: 'Residential - Condominium',
        assessedValue: 'RM 580,000',
        yearBuilt: '2010',
        area: '1,200 sq ft'
      }
    }
  ];

  const handleSendMessage = async () => {
    if (!newMessage.trim() || loading || isStreaming) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'citizen',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = newMessage;
    setNewMessage('');
    setLoading(true);
    setIsStreaming(true);
    setStreamingMessage('');
    
    try {
      // Call the chat API with streaming
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are a helpful AI Assistant for MALAYSIAN CITIZENS using the Government Services Portal. You help citizens navigate government services with ease and confidence.

CITIZEN-FOCUSED ASSISTANCE:
- **Simple Language**: Explain complex government processes in easy-to-understand terms
- **Step-by-Step Guidance**: Break down applications and procedures into clear, manageable steps
- **Personal Support**: Address individual citizen concerns with empathy and patience
- **Quick Solutions**: Provide immediate answers and direct citizens to the right services
- **Accessibility**: Help citizens with disabilities, elderly, and those with language barriers
- **Cost Information**: Always mention fees, payment methods, and any financial assistance available

MALAYSIA GOVERNMENT SERVICES EXPERTISE:
🏥 HEALTHCARE: MySejahtera, hospital appointments, specialist referrals, health insurance claims, medical certificates, vaccination records, mental health services, elderly care, disability support
📚 EDUCATION: School enrollment, university applications, scholarships (JPA, MARA, state scholarships), student loans (PTPTN), skills training programs, adult education, special needs education
🏠 HOUSING: PR1MA homes, affordable housing schemes, housing loans, property registration, rental assistance, squatter settlement programs, low-cost housing applications
💰 FINANCE & TAX: Income tax filing (e-Filing), tax refunds, GST/SST matters, EPF withdrawals, SOCSO benefits, financial assistance programs (BR1M/STR), business licenses, SME support
⚖️ LEGAL: Court procedures, legal aid, marriage/divorce certificates, birth/death certificates, name changes, citizenship applications, visa matters, consumer protection
👥 WELFARE: Zakat assistance, JKM welfare aid, disability benefits, senior citizen support, child welfare services, domestic violence support, refugee assistance
🚗 TRANSPORTATION: Driving licenses, vehicle registration, road tax, public transport, parking permits, traffic summons, accident reports

CITIZEN COMMUNICATION STYLE:
- **Warm & Friendly**: Use encouraging language like "I'm here to help!" and "Let me guide you through this"
- **Malaysian Context**: Use RM currency, local place names, and respectful terms (Encik, Puan, Datuk when appropriate)
- **Clear Instructions**: Provide exact forms needed, office locations, and operating hours
- **Practical Tips**: Include parking information, what to bring, best times to visit
- **Multiple Options**: Always offer online, phone, and in-person alternatives
- **Reassurance**: Acknowledge citizen concerns and provide confidence in the process
- **Follow-up Support**: Ask "Do you need help with anything else?" and offer additional assistance

SPECIAL CAPABILITIES:
- Handle multilingual requests (English, Bahasa Malaysia, Chinese, Tamil)
- Provide location-specific information (different states, districts)
- Understand cultural and religious considerations
- Offer digital and physical service options
- Help with urgent/emergency situations

Remember: You are here to serve Malaysian citizens with patience and care. Whether someone needs help finding the right office or navigating complex applications, treat every citizen with respect and provide the support they deserve. Make government services accessible and stress-free for everyone! 🇲🇾`
            },
            {
              role: 'user',
              content: currentInput
            }
          ],
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let fullResponse = '';
      
      // Add streaming message placeholder
      const streamingMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: streamingMessageId,
        sender: 'agent',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentName: 'AI Assistant'
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                fullResponse += content;
                setStreamingMessage(fullResponse);
                
                // Update the streaming message in real-time
                setMessages(prev => prev.map(msg => 
                  msg.id === streamingMessageId 
                    ? { ...msg, content: fullResponse }
                    : msg
                ));
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      setLoading(false);
      setIsStreaming(false);
      setStreamingMessage('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
      setIsStreaming(false);
      setStreamingMessage('');
      
      // Fallback to local responses for demo
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: generateFallbackResponse(currentInput),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentName: 'AI Assistant'
      };
      
      setMessages(prev => [...prev, agentResponse]);
    }
  };

  const generateFallbackResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Handle common government service requests
    if (lowerInput.includes('door') || lowerInput.includes('where') || lowerInput.includes('location')) {
      return `**Finding Your Way Around Government Offices**

For **"where is the door?"** or location queries:
• **Main entrance**: Usually facing the main road with clear signage
• **Information counter**: Look for "Kaunter Pertanyaan" or "Information" 
• **Service counters**: Different departments have numbered counters
• **Disabled access**: Ramps and lifts available at all government buildings

**Need specific directions?** Tell me:
• Which government office you're visiting
• What service you need
• Your current location

I can provide detailed directions and the exact counter/department you need! 🏛️`;
    }
    
    if (lowerInput.includes('birth certificate') || lowerInput.includes('sijil kelahiran')) {
      return `**Birth Certificate Application (Sijil Kelahiran)**

**For Malaysian-born children:**
• **Where**: JPN (Jabatan Pendaftaran Negara) office
• **When**: Within 42 days of birth (free), after 42 days (RM 10 fee)
• **Documents needed**: Hospital birth report, parents' IC, marriage certificate

**Online application**: MyJPN portal
**Processing time**: Same day (if complete documents)
**Urgent cases**: Express service available (additional fee)

**Need help with:**
• Late registration procedures
• Replacement certificates  
• Name corrections
• Adoption certificates

What specific help do you need with birth certificates? 📋`;
    }
    
    if (lowerInput.includes('passport') || lowerInput.includes('pasport')) {
      return `**Malaysian Passport Services**

**New Passport Application:**
• **Adults (18+)**: RM 200 (5 years), RM 300 (10 years)
• **Children**: RM 100 (2 years), RM 150 (5 years)
• **Processing**: 7-10 working days

**Required Documents:**
• Birth certificate + IC
• Completed application form (IMM.12)
• Recent passport photos (2 copies)

**Online Services:**
• **Appointment booking**: MyOnline Passport
• **Status checking**: Track application progress
• **Renewal reminders**: 6 months before expiry

**Urgent Travel?** Premium service available (1-2 days, additional RM 200)

Need help with renewal, replacement, or name changes? 🛂`;
    }
    
    // Default comprehensive response
    return `**I'm here to help with your government service needs!**

You asked: "*${input}*"

**I can assist you with:**
• **Healthcare**: Appointments, MySejahtera, insurance claims
• **Documentation**: IC, passport, birth/death certificates  
• **Housing**: PR1MA, affordable housing, property matters
• **Finance**: Tax filing, EPF, SOCSO, business licenses
• **Education**: School enrollment, scholarships, student loans
• **Legal**: Court procedures, legal aid, marriage certificates
• **Welfare**: Social assistance, disability support, senior care

**Quick Help:**
• **Urgent matters**: Tell me "urgent" + your issue
• **Specific location**: Include your state/district
• **Language preference**: I can help in English, Bahasa Malaysia, Chinese, Tamil

**What specific government service do you need help with?** I'll provide step-by-step guidance! 🏛️✨`;
  };

  const addServiceToMyServices = (service: Service) => {
    if (service.id === 'health_monitoring') {
      // Show healthcare-specific options instead of directly adding
      setShowAddService(false);
      setShowHealthcareOptions(true);
    } else {
      if (!myServices.find(s => s.id === service.id)) {
        setMyServices([...myServices, service]);
      }
      setShowAddService(false);
    }
  };

  const addHealthcareService = () => {
    const healthcareService = AVAILABLE_SERVICES.find(s => s.id === 'health_monitoring');
    if (healthcareService && !myServices.find(s => s.id === healthcareService.id)) {
      setMyServices([...myServices, healthcareService]);
    }
    setShowHealthcareOptions(false);
  };

  const showAgentSkillsModal = (agent: Agent) => {
    setSelectedAgentForSkills(agent);
    setShowAgentSkills(true);
  };

  const showDocumentDetailsModal = (document: Document) => {
    setSelectedDocument(document);
    setShowDocumentDetails(true);
  };

  // Citizen-focused prompt for Realtime API
  const citizenPrompt = `You are a helpful AI Assistant for MALAYSIAN CITIZENS calling the Government Services Hotline. You help citizens with government services using a warm, friendly voice.

CITIZEN CALL SUPPORT:
- Speak clearly and at a comfortable pace for citizens of all ages
- Use simple language and explain processes step-by-step  
- Be patient and understanding with citizen concerns
- Provide specific information: office locations, forms needed, fees, operating hours
- Offer multiple options: online, phone, or in-person services
- Use Malaysian context: RM currency, local place names, respectful terms (Encik, Puan)

SERVICES TO HELP WITH:
🏥 Healthcare: MySejahtera, hospital appointments, specialist referrals, health insurance claims, medical certificates
💰 Finance: Income tax filing (e-Filing), EPF withdrawals, SOCSO benefits, business licenses, financial assistance
📚 Education: School enrollment, university applications, scholarships (JPA, MARA), student loans (PTPTN)
🏠 Housing: PR1MA homes, affordable housing schemes, housing loans, property registration, rental assistance
⚖️ Legal: Court procedures, legal aid, marriage/divorce certificates, birth/death certificates, citizenship applications
👥 Welfare: Zakat assistance, JKM welfare aid, disability benefits, senior citizen support, child welfare services

Remember: You are speaking to Malaysian citizens who need government service help. Be warm, encouraging, and make them feel supported! Always ask follow-up questions to ensure they get complete assistance. 🇲🇾`;

  // Handle Realtime API events
  const handleRealtimeEvent = (event: any) => {
    console.log('📨 Citizen Services received event:', event.type, event);
    
    switch (event.type) {
      case 'response.audio_transcript.delta':
        setCallTranscript(prev => prev + event.delta);
        break;
        
      case 'session.created':
        setIsSessionReady(true);
        break;
        
      case 'response.function_call_arguments.done':
        console.log('🔧 Citizen Services function call detected:', event.name, event.arguments);
        break;
        
      default:
        break;
    }
  };

  // Call functionality
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
          prompt: citizenPrompt
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
      }, 1000);

    } catch (error) {
      console.error('Error starting call:', error);
      setIsCallActive(false);
    }
  };

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
    setCallDuration(0);
    setCallTranscript('');
  };

  const toggleMute = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  const renderMarkdown = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Citizen Services</h1>
            <p className="text-gray-500 text-sm">Your personalized government services portal</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPhoneModal(true)}
              className="flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-green-600 hover:text-green-700 hover:bg-green-50 border border-green-200 hover:border-green-300"
              title="Call Government Services"
            >
              <FaPhone size={14} className="mr-2" />
              Call Support
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: My Details */}
      <div className="p-3 border-b border-gray-200">
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-3">My Details</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {citizenProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900">{citizenProfile.name}</h3>
              <p className="text-gray-500 text-xs">{citizenProfile.occupation}</p>
              <p className="text-gray-400 text-xs">{citizenProfile.icNumber}</p>
            </div>
            <div className="grid grid-cols-4 gap-3 text-xs flex-1">
              <div>
                <p className="text-gray-500 mb-1">Monthly Income</p>
                <p className="font-medium text-gray-900">{citizenProfile.monthlyIncome}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Blood Type</p>
                <p className="font-medium text-gray-900">{citizenProfile.bloodType}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Insurance</p>
                <p className="font-medium text-gray-900">{citizenProfile.insuranceNumber}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Status</p>
                <p className="font-medium text-green-600">Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: My Documents */}
      <div className="p-3 border-b border-gray-200">
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">My Documents ({myDocuments.length})</h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={documentSearchQuery}
                onChange={(e) => setDocumentSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
              />
              <button
                onClick={() => setShowDocumentScanner(true)}
                className="w-5 h-5 bg-white border border-gray-300 text-gray-500 rounded-full flex items-center justify-center hover:border-gray-400 hover:text-gray-600 transition-colors"
                title="Scan Document"
              >
                <FaPlus size={8} />
              </button>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {myDocuments
              .filter(doc => 
                documentSearchQuery === '' || 
                doc.name.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
                doc.type.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
                (doc.extractedData && JSON.stringify(doc.extractedData).toLowerCase().includes(documentSearchQuery.toLowerCase()))
              )
              .map((doc) => (
              <div 
                key={doc.id} 
                onClick={() => showDocumentDetailsModal(doc)}
                className="flex-shrink-0 w-52 p-2 bg-gray-50/50 border border-gray-100 rounded-lg hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-xs truncate">{doc.name}</h4>
                    <p className="text-xs text-gray-600">{doc.type} • {doc.uploadDate}</p>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center ml-2 flex-shrink-0">
                    <FaCheck className="text-green-600" size={8} />
                  </div>
                </div>
                {doc.extractedData && (
                  <div className="space-y-1">
                    {Object.entries(doc.extractedData).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-gray-500 capitalize truncate">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-gray-700 font-medium ml-2 truncate">{String(value)}</span>
                      </div>
                    ))}
                    {Object.entries(doc.extractedData).length > 3 && (
                      <p className="text-xs text-gray-400 mt-1">+{Object.entries(doc.extractedData).length - 3} more fields</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: My Services */}
      <div className="p-3 border-b border-gray-200">
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">My Services ({myServices.length})</h2>
            <button
              onClick={() => setShowAddService(true)}
              className="w-5 h-5 bg-white border border-gray-300 text-gray-500 rounded-full flex items-center justify-center hover:border-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaPlus size={8} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {myServices.map((service) => (
              <div
                key={service.id}
                className="flex-shrink-0 w-48 p-2 bg-gray-50/50 border border-gray-100 rounded-lg hover:shadow-sm transition-all cursor-pointer"
              >
                <h4 className="font-medium text-gray-900 text-xs">{service.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{service.category}</p>
                <p className="text-xs text-gray-500 mt-1">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: My Agents */}
      <div className="p-3 border-b border-gray-200">
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">My Agents ({AI_AGENTS.length})</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {AI_AGENTS.map((agent) => (
              <div
                key={agent.id}
                className="flex-shrink-0 w-40 flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all bg-gray-50/50 border border-gray-100 hover:bg-gray-50"
              >
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-xs">AI</span>
                </div>
                <div 
                  className="flex-1 min-w-0"
                  onClick={() => setSelectedAgent(agent)}
                >
                  <p className="font-medium text-gray-900 text-xs truncate">{agent.name}</p>
                  <p className="text-xs text-gray-500 truncate">{agent.specialty}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showAgentSkillsModal(agent);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Skills
                </button>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: My Chat */}
      <div className="flex-1 p-3 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-900">Citizen AI Assistant</h2>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            
            {/* Available Agents Row */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-white border border-transparent bg-clip-padding flex items-center justify-center relative"
                     style={{
                       backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #dc2626, #ef4444)',
                       backgroundOrigin: 'border-box',
                       backgroundClip: 'padding-box, border-box'
                     }}>
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
                  <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-white"></div>
                </div>
                <span className="text-xs font-medium text-gray-600">Tax</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-white border border-transparent bg-clip-padding flex items-center justify-center relative"
                     style={{
                       backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #f59e0b, #fbbf24)',
                       backgroundOrigin: 'border-box',
                       backgroundClip: 'padding-box, border-box'
                     }}>
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
                  <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-white"></div>
                </div>
                <span className="text-xs font-medium text-gray-600">Housing</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-white border border-transparent bg-clip-padding flex items-center justify-center relative"
                     style={{
                       backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #7c3aed, #8b5cf6)',
                       backgroundOrigin: 'border-box',
                       backgroundClip: 'padding-box, border-box'
                     }}>
                  <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-white"></div>
                </div>
                <span className="text-xs font-medium text-gray-600">Legal</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-white border border-transparent bg-clip-padding flex items-center justify-center relative"
                     style={{
                       backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #ec4899, #f472b6)',
                       backgroundOrigin: 'border-box',
                       backgroundClip: 'padding-box, border-box'
                     }}>
                  <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-white"></div>
                </div>
                <span className="text-xs font-medium text-gray-600">Welfare</span>
              </div>
              
              {/* Add Agent Button */}
              <button
                onClick={() => setShowAddAgentModal(true)}
                className="w-4 h-4 rounded-full bg-white border border-gray-300 hover:border-blue-400 flex items-center justify-center transition-colors hover:bg-blue-50"
                title="Add Government Agent"
              >
                <span className="text-gray-400 hover:text-blue-600 text-xs font-bold">+</span>
              </button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((message, index) => (
              <div key={message.id || index} className={`flex ${message.sender === 'citizen' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-lg p-2 rounded-lg text-sm ${
                  message.sender === 'citizen' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.sender === 'citizen' ? (
                    <p className="text-white text-xs">{message.content}</p>
                  ) : (
                    <div className="text-gray-900">
                      <div 
                        className="text-xs whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                      />
                    </div>
                  )}
                  <p className={`text-xs mt-1 ${message.sender === 'citizen' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {(loading || isStreaming) && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-2 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-xs text-gray-600 ml-2">
                      {isStreaming ? 'AI is typing...' : 'Processing...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask anything: 'where is the door?', 'birth certificate', 'passport renewal', 'housing loan'..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newMessage.trim() && !loading && !isStreaming) {
                    handleSendMessage();
                  }
                }}
                disabled={loading || isStreaming}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || isStreaming || !newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isStreaming ? 'Streaming...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Healthcare Options Modal */}
      {showHealthcareOptions && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto border border-gray-100/50">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Healthcare Services</h3>
                <p className="text-sm text-gray-500">Choose your healthcare options</p>
              </div>
              <button
                onClick={() => setShowHealthcareOptions(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-all duration-200 hover:scale-105"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Complete Healthcare Package</h4>
                  <p className="text-sm text-gray-600">Add all healthcare services to your citizen portal</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* FaceHeart Integration */}
                  <div className="p-3 bg-gradient-to-br from-white to-gray-50/30 border border-gray-100 rounded-lg">
                    <h4 className="font-semibold text-gray-900 text-xs mb-1">FaceHeart Integration</h4>
                    <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium mb-2 bg-rose-50/50 text-rose-600 border border-rose-100/50">
                      Real-time Monitoring
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      Continuous health monitoring and AI insights.
                    </p>
                    <a 
                      href="https://hcs.faceheart.com/react/index.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Visit Portal →
                    </a>
                  </div>

                  {/* LifeSignals Patch */}
                  <div className="p-3 bg-gradient-to-br from-white to-gray-50/30 border border-gray-100 rounded-lg">
                    <h4 className="font-semibold text-gray-900 text-xs mb-1">LifeSignals Patch</h4>
                    <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium mb-2 bg-blue-50/50 text-blue-600 border border-blue-100/50">
                      ECG & Vital Signs
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      Wireless biosensor patches for ECG monitoring.
                    </p>
                    <a 
                      href="https://www.lifesignals.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Visit LifeSignals →
                    </a>
                  </div>

                  {/* Book Appointment */}
                  <div className="p-3 bg-gradient-to-br from-white to-gray-50/30 border border-gray-100 rounded-lg">
                    <h4 className="font-semibold text-gray-900 text-xs mb-1">Book Appointment</h4>
                    <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium mb-2 bg-green-50/50 text-green-600 border border-green-100/50">
                      Schedule Now
                    </div>
                    <p className="text-xs text-gray-600">
                      Schedule medical consultations instantly.
                    </p>
                  </div>

                  {/* Find Doctor */}
                  <div className="p-3 bg-gradient-to-br from-white to-gray-50/30 border border-gray-100 rounded-lg">
                    <h4 className="font-semibold text-gray-900 text-xs mb-1">Find Doctor</h4>
                    <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium mb-2 bg-purple-50/50 text-purple-600 border border-purple-100/50">
                      Search & Filter
                    </div>
                    <p className="text-xs text-gray-600">
                      Search doctors by specialty and location.
                    </p>
                  </div>

                  {/* Health Records */}
                  <div className="p-3 bg-gradient-to-br from-white to-gray-50/30 border border-gray-100 rounded-lg">
                    <h4 className="font-semibold text-gray-900 text-xs mb-1">Health Records</h4>
                    <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium mb-2 bg-indigo-50/50 text-indigo-600 border border-indigo-100/50">
                      Digital Access
                    </div>
                    <p className="text-xs text-gray-600">
                      Access your complete medical history.
                    </p>
                  </div>

                  {/* Emergency Services */}
                  <div className="p-3 bg-gradient-to-br from-white to-gray-50/30 border border-gray-100 rounded-lg">
                    <h4 className="font-semibold text-gray-900 text-xs mb-1">Emergency Services</h4>
                    <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium mb-2 bg-red-50/50 text-red-600 border border-red-100/50">
                      24/7 Support
                    </div>
                    <p className="text-xs text-gray-600">
                      Quick access to emergency medical services.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
                  <button 
                    onClick={addHealthcareService}
                    className="px-6 py-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 text-blue-700 hover:text-blue-800 text-sm rounded-full font-medium transition-all border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                  >
                    Add Healthcare Package
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto border border-gray-100/50">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Add New Service</h3>
                <p className="text-sm text-gray-500">Choose from available government services</p>
              </div>
              <button
                onClick={() => setShowAddService(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-all duration-200 hover:scale-105"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {AVAILABLE_SERVICES.filter(service => !myServices.find(s => s.id === service.id)).map((service) => (
                  <div
                    key={service.id}
                    onClick={() => addServiceToMyServices(service)}
                    className="group relative p-5 bg-gradient-to-br from-white to-gray-50/30 border border-gray-100 rounded-2xl hover:shadow-xl hover:shadow-blue-500/20 hover:border-blue-200/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                  >
                    <div className="relative">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">{service.name}</h4>
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mb-3 transition-all border ${
                        service.category === 'Healthcare' ? 'bg-rose-50/30 text-rose-500 border-rose-200/40 group-hover:bg-rose-50/50 group-hover:text-rose-600 group-hover:border-rose-300/50 group-hover:shadow-rose-100/20 group-hover:shadow-sm' :
                        service.category === 'Finance' ? 'bg-emerald-50/30 text-emerald-500 border-emerald-200/40 group-hover:bg-emerald-50/50 group-hover:text-emerald-600 group-hover:border-emerald-300/50 group-hover:shadow-emerald-100/20 group-hover:shadow-sm' :
                        service.category === 'Education' ? 'bg-amber-50/30 text-amber-500 border-amber-200/40 group-hover:bg-amber-50/50 group-hover:text-amber-600 group-hover:border-amber-300/50 group-hover:shadow-amber-100/20 group-hover:shadow-sm' :
                        service.category === 'Housing' ? 'bg-violet-50/30 text-violet-500 border-violet-200/40 group-hover:bg-violet-50/50 group-hover:text-violet-600 group-hover:border-violet-300/50 group-hover:shadow-violet-100/20 group-hover:shadow-sm' :
                        service.category === 'Business' ? 'bg-cyan-50/30 text-cyan-500 border-cyan-200/40 group-hover:bg-cyan-50/50 group-hover:text-cyan-600 group-hover:border-cyan-300/50 group-hover:shadow-cyan-100/20 group-hover:shadow-sm' :
                        service.category === 'Welfare' ? 'bg-pink-50/30 text-pink-500 border-pink-200/40 group-hover:bg-pink-50/50 group-hover:text-pink-600 group-hover:border-pink-300/50 group-hover:shadow-pink-100/20 group-hover:shadow-sm' :
                        service.category === 'Legal' ? 'bg-indigo-50/30 text-indigo-500 border-indigo-200/40 group-hover:bg-indigo-50/50 group-hover:text-indigo-600 group-hover:border-indigo-300/50 group-hover:shadow-indigo-100/20 group-hover:shadow-sm' :
                        service.category === 'Career' ? 'bg-teal-50/30 text-teal-500 border-teal-200/40 group-hover:bg-teal-50/50 group-hover:text-teal-600 group-hover:border-teal-300/50 group-hover:shadow-teal-100/20 group-hover:shadow-sm' :
                        service.category === 'Family' ? 'bg-orange-50/30 text-orange-500 border-orange-200/40 group-hover:bg-orange-50/50 group-hover:text-orange-600 group-hover:border-orange-300/50 group-hover:shadow-orange-100/20 group-hover:shadow-sm' :
                        'bg-slate-50/30 text-slate-500 border-slate-200/40 group-hover:bg-slate-50/50 group-hover:text-slate-600 group-hover:border-slate-300/50 group-hover:shadow-slate-100/20 group-hover:shadow-sm'
                      }`}>
                        {service.category}
                      </div>
                      <p className="text-xs text-gray-600">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Skills Modal */}
      {showAgentSkills && selectedAgentForSkills && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto border border-gray-100/50">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedAgentForSkills.name} Skills</h3>
                <p className="text-sm text-gray-500">{selectedAgentForSkills.specialty}</p>
              </div>
              <button
                onClick={() => setShowAgentSkills(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-all duration-200 hover:scale-105"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {selectedAgentForSkills.id === 'health' && (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Book Medical Appointment</h4>
                      <p className="text-xs text-gray-600">Schedule consultations with doctors and specialists</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Find Doctor</h4>
                      <p className="text-xs text-gray-600">Search for doctors by specialty, language and location</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Health Records Access</h4>
                      <p className="text-xs text-gray-600">View and manage your medical history</p>
                    </div>
                  </>
                )}
                {selectedAgentForSkills.id !== 'health' && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">Skills for {selectedAgentForSkills.name} coming soon...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      {showDocumentDetails && selectedDocument && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto border border-gray-100/50">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedDocument.name}</h3>
                <p className="text-sm text-gray-500">{selectedDocument.type} • {selectedDocument.uploadDate}</p>
              </div>
              <button
                onClick={() => setShowDocumentDetails(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-all duration-200 hover:scale-105"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Extracted Information</h4>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                    <FaCheck className="text-green-600" size={10} />
                  </div>
                  <span className="text-sm text-green-600 font-medium">Processed</span>
                </div>
              </div>
              
              {selectedDocument.extractedData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedDocument.extractedData).map(([key, value]) => (
                    <div key={key} className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                      <div className="flex flex-col">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <span className="text-sm font-medium text-gray-900">
                          {String(value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Document ID: {selectedDocument.id}</span>
                  <span>Status: {selectedDocument.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Agent Modal */}
      {showAddAgentModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 border border-gray-100/50">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <h3 className="text-xl font-semibold text-gray-900">Add Government Agent</h3>
              <button
                onClick={() => setShowAddAgentModal(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-all duration-200 hover:scale-105"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Add Government Agents</h4>
                <p className="text-sm text-gray-600">Expand your service access with specialized agents</p>
              </div>
              
              <div className="space-y-3">
                <div className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">IM</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-0.5">Immigration Services</h4>
                        <p className="text-xs text-gray-500">Passport • Visa • Citizenship</p>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 bg-white border border-blue-200 text-blue-600 text-xs font-medium rounded-full hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group-hover:shadow-sm">
                      Add Agent
                    </button>
                  </div>
                </div>
                
                <div className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-green-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">TR</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-0.5">Transport Services</h4>
                        <p className="text-xs text-gray-500">License • Registration • Road Tax</p>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 bg-white border border-green-200 text-green-600 text-xs font-medium rounded-full hover:bg-green-50 hover:border-green-300 transition-all duration-200 group-hover:shadow-sm">
                      Add Agent
                    </button>
                  </div>
                </div>
                
                <div className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-purple-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">BZ</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-0.5">Business Services</h4>
                        <p className="text-xs text-gray-500">Registration • Permits • Licenses</p>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 bg-white border border-purple-200 text-purple-600 text-xs font-medium rounded-full hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 group-hover:shadow-sm">
                      Add Agent
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowAddAgentModal(false)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Call Modal */}
      {showPhoneModal && (
        <div className="fixed top-20 right-6 z-50">
          <div className="backdrop-blur-xl rounded-2xl p-5 w-64 shadow-xl border border-white/20 relative"
            style={{
              background: 'rgba(255,255,255,0.95)'
            }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <FaPhone className="text-white" size={12} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">Government Services</h3>
                  <p className="text-xs text-gray-500">Citizen Support</p>
                </div>
              </div>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <FaTimes size={12} />
              </button>
            </div>
            
            {!isCallActive ? (
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-4">
                  Connect with an AI / Human Specialist for personalized assistance.
                </p>
                <button
                  onClick={startCall}
                  className="w-10 h-10 bg-white border border-transparent bg-clip-padding rounded-full transition-all duration-200 flex items-center justify-center mx-auto hover:scale-105 shadow-lg hover:shadow-xl text-green-600"
                  style={{
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #10b981, #059669)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box'
                  }}
                  title="Start Call"
                >
                  <FaPhone size={14} />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <div className="font-medium text-green-600">Connected</div>
                    <div className="text-gray-500">{Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}</div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={toggleMute}
                      className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center ${
                        isMuted ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {isMuted ? <FaMicrophoneSlash size={12} /> : <FaMicrophone size={12} />}
                    </button>
                    <button
                      onClick={endCall}
                      className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                    >
                      <FaPhoneSlash size={12} />
                    </button>
                  </div>
                </div>
                
                {callTranscript && (
                  <div className="bg-gray-50 rounded-lg p-2 max-h-24 overflow-y-auto">
                    <div className="text-xs text-gray-600 mb-1">Live Transcript</div>
                    <div className="text-xs">{callTranscript}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenServicesInterface;
