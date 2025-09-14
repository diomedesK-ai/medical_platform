"use client";
import React, { useState } from 'react';
import { FaTimes, FaPlus, FaCheck } from 'react-icons/fa';

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
      content: '**Welcome to Citizen AI Assistant!**\\n\\nUse AI agent commands:\\n• @health - Healthcare services and medical support\\n• @tax - Tax filing and financial assistance\\n• @edu - Education grants and scholarships\\n• @housing - Housing loans and property services\\n• @legal - Legal aid and documentation\\n• @welfare - Social welfare and benefits\\n\\nHow can I help you with government services today?',
      timestamp: '2:30 PM',
      agentName: 'AI Assistant'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(AI_AGENTS[0]);
  const [loading, setLoading] = useState(false);

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
    if (!newMessage.trim() || loading) return;
    
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
    
    try {
      setTimeout(() => {
        let responseContent = '';
        
        // Enhanced doctor search and appointment booking
        if (currentInput.toLowerCase().includes('find doctor') || currentInput.toLowerCase().includes('doctor for')) {
          const input = currentInput.toLowerCase();
          let specialty = 'general practitioner';
          let language = 'English';
          let location = 'Kuala Lumpur';
          
          // Extract specialty
          if (input.includes('arm') || input.includes('injury') || input.includes('orthopedic')) specialty = 'Orthopedic Specialist';
          if (input.includes('heart') || input.includes('cardiac')) specialty = 'Cardiologist';
          if (input.includes('eye') || input.includes('vision')) specialty = 'Ophthalmologist';
          if (input.includes('skin') || input.includes('dermatology')) specialty = 'Dermatologist';
          
          // Extract language
          if (input.includes('chinese') || input.includes('mandarin')) language = 'Chinese/Mandarin';
          if (input.includes('malay') || input.includes('bahasa')) language = 'Bahasa Malaysia';
          if (input.includes('hokkien')) language = 'Hokkien';
          if (input.includes('cantonese')) language = 'Cantonese';
          if (input.includes('tamil')) language = 'Tamil';
          
          // Extract location
          if (input.includes('klcc') || input.includes('city centre')) location = 'KLCC area';
          if (input.includes('orchard') || input.includes('orchard road')) location = 'Orchard Road area';
          if (input.includes('bangsar')) location = 'Bangsar area';
          if (input.includes('mont kiara')) location = 'Mont Kiara area';
          
          responseContent = `**Found Doctors Near You**

**${specialty}** speaking **${language}** in **${location}**:

• **Dr. Ahmad Rahman** - Gleneagles Hospital
  Languages: ${language}, English
  Available: Tomorrow 2:00 PM
  Rating: ⭐⭐⭐⭐⭐ (4.8/5)

• **Dr. Sarah Lim** - Prince Court Medical Centre
  Languages: ${language}, English
  Available: Today 4:30 PM
  Rating: ⭐⭐⭐⭐⭐ (4.9/5)

• **Dr. Raj Patel** - Pantai Hospital
  Languages: ${language}, English
  Available: Monday 10:00 AM
  Rating: ⭐⭐⭐⭐ (4.6/5)

Would you like me to **book an appointment** with any of these doctors? Just say "book with Dr. [Name]" and I'll help you schedule it!`;
          
        } else if (currentInput.toLowerCase().includes('book appointment') || currentInput.toLowerCase().includes('book with dr')) {
          const input = currentInput.toLowerCase();
          let doctorName = 'Dr. Ahmad Rahman';
          
          if (input.includes('sarah') || input.includes('lim')) doctorName = 'Dr. Sarah Lim';
          if (input.includes('raj') || input.includes('patel')) doctorName = 'Dr. Raj Patel';
          
          responseContent = `**Booking Appointment with ${doctorName}**

✅ **Appointment Confirmed**

📅 **Date**: Tomorrow, March 15th
🕐 **Time**: 2:00 PM
🏥 **Location**: Gleneagles Hospital KLCC
💰 **Consultation Fee**: RM 180

**What to bring:**
• IC/Passport
• Insurance card
• Previous medical records (if any)

**Appointment Details:**
• Consultation room: 3A-15
• Parking: Level B2
• Check-in: 30 minutes early

📱 **Reminder**: You'll receive SMS confirmation and reminder 24 hours before your appointment.

Need to reschedule or have questions? Just let me know!`;
          
        } else if (currentInput.toLowerCase().includes('@health')) {
          responseContent = `I'm your Healthcare AI assistant. I can help you with:
• **Find doctors** by specialty, language & location
• **Book appointments** instantly
• Health monitoring via FaceHeart
• Insurance claims
• Emergency services

Try: "Find a doctor for arm injury who speaks Chinese near KLCC" or "Book appointment with Dr. Sarah"`;
          
        } else if (currentInput.toLowerCase().includes('@tax')) {
          responseContent = `I'm your Tax & Finance AI assistant. I can help you with:
• Income tax filing
• Tax refunds
• Financial planning
• Government benefits

What tax or financial matter can I assist with?`;
          
        } else if (currentInput.toLowerCase().includes('@edu')) {
          responseContent = `I'm your Education AI assistant. I can help you with:
• Scholarship applications
• Education grants
• School enrollment
• Student loans

What educational service do you need?`;
          
        } else if (currentInput.toLowerCase().includes('@housing')) {
          responseContent = `I'm your Housing AI assistant. I can help you with:
• Housing loans
• Property registration
• Rental assistance
• Housing schemes

What housing service can I help with?`;
          
        } else if (currentInput.toLowerCase().includes('@legal')) {
          responseContent = `I'm your Legal AI assistant. I can help you with:
• Legal documentation
• Court procedures
• Legal aid applications
• Notarization

What legal matter do you need help with?`;
          
        } else if (currentInput.toLowerCase().includes('@welfare')) {
          responseContent = `I'm your Social Welfare AI assistant. I can help you with:
• Social benefits
• Disability assistance
• Senior citizen programs
• Child welfare

What welfare service do you need?`;
          
        } else {
          responseContent = `I understand you need help with: "${currentInput}"

I can assist you with various government services. Try using these commands:
• @health - Healthcare services
• @tax - Tax and finance
• @edu - Education services
• @housing - Housing assistance
• @legal - Legal services
• @welfare - Social welfare

Which service would you like to explore?`;
        }
        
        const agentResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          content: responseContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentName: 'AI Assistant'
        };
        
        setMessages(prev => [...prev, agentResponse]);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
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

  const renderMarkdown = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
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
              <div key={doc.id} className="flex-shrink-0 w-52 p-2 bg-gray-50/50 border border-gray-100 rounded-lg hover:shadow-sm transition-all cursor-pointer">
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
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-2 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                placeholder="Ask about services, policies, procedures..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newMessage.trim() && !loading) {
                    handleSendMessage();
                  }
                }}
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Send
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
                <div className="group relative p-5 bg-gradient-to-br from-white to-gray-50/30 border border-gray-100 rounded-2xl hover:shadow-xl hover:shadow-rose-500/20 hover:border-rose-200/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                     onClick={addHealthcareService}>
                  <div className="relative">
                    <h4 className="font-semibold text-gray-900 text-base mb-2">FaceHeart Integration</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Connect your FaceHeart device for continuous health monitoring, heart rate tracking, and AI-powered health insights.
                    </p>
                    <a 
                      href="https://hcs.faceheart.com/react/index.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mb-4 transition-colors"
                    >
                      Visit FaceHeart Portal →
                    </a>
                  </div>
                </div>

                <div className="group relative p-5 bg-gradient-to-br from-white to-gray-50/30 border border-gray-100 rounded-2xl hover:shadow-xl hover:shadow-blue-500/20 hover:border-blue-200/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                     onClick={addHealthcareService}>
                  <div className="relative">
                    <h4 className="font-semibold text-gray-900 text-base mb-2">LifeSignals Patch</h4>
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mb-3 transition-all border bg-blue-50/50 text-blue-600 border-blue-100/50 group-hover:bg-blue-100/60 group-hover:text-blue-700 group-hover:border-blue-200/60">
                      Wireless ECG & Vital Signs
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Order LifeSignals wireless biosensor patches for multi-parameter monitoring including 2-channel ECG and vital signs.
                    </p>
                    <a 
                      href="https://www.lifesignals.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mb-4 transition-colors"
                    >
                      Visit LifeSignals →
                    </a>
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span>2-channel ECG monitoring</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span>Wireless vital signs tracking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span>Disposable & cost-effective patches</span>
                      </div>
                    </div>
                  </div>
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
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mb-3 bg-gray-100 text-gray-700">
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
    </div>
  );
};

export default CitizenServicesInterface;
