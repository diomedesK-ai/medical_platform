"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPlus, FaCheck, FaPhone, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaRobot } from 'react-icons/fa';
import LifeSignalsVitals from './LifeSignalsVitals';

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
  skills?: string[];
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

interface Appointment {
  id: string;
  title: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'procedure' | 'lab' | 'imaging';
  bookedByAgent?: string; // AI agent that booked this appointment
  duration?: string;
  notes?: string;
  preparation?: string[];
  priority?: 'routine' | 'urgent' | 'emergency';
}


const AVAILABLE_SERVICES: Service[] = [
  { id: 'health_monitoring', name: 'Health Monitoring', category: 'Healthcare', description: 'Real-time health tracking' },
  { id: 'lab_results', name: 'Lab Results', category: 'Healthcare', description: 'View and understand lab reports' },
  { id: 'radiology', name: 'Imaging & Radiology', category: 'Healthcare', description: 'X-rays, CT, MRI reports' },
  { id: 'pharmacy', name: 'Medications & Refills', category: 'Healthcare', description: 'Prescriptions, interactions, refills' },
  { id: 'appointments', name: 'Appointments', category: 'Healthcare', description: 'Book and manage visits' },
  { id: 'discharge', name: 'Discharge & Care Plans', category: 'Healthcare', description: 'Summaries and follow-ups' }
];

const AI_AGENTS: Agent[] = [
  { 
    id: 'triage', 
    name: 'Triage AI', 
    specialty: 'Intake & Routing', 
    status: 'online',
    skills: ['Patient Assessment', 'Symptom Analysis', 'Priority Classification', 'Department Routing', 'Emergency Detection', 'Vital Signs Interpretation']
  },
  { 
    id: 'cardio', 
    name: 'Cardiology AI', 
    specialty: 'Cardiology Support', 
    status: 'online',
    skills: ['ECG Analysis', 'Heart Rate Monitoring', 'Blood Pressure Assessment', 'Cardiac Risk Evaluation', 'Medication Recommendations', 'Lifestyle Counseling']
  },
  { 
    id: 'lab', 
    name: 'Lab AI', 
    specialty: 'Lab Orders & Results', 
    status: 'online',
    skills: ['Test Ordering', 'Result Interpretation', 'Reference Range Analysis', 'Trend Monitoring', 'Critical Value Alerts', 'Sample Collection Guidance']
  },
  { 
    id: 'rad', 
    name: 'Radiology AI', 
    specialty: 'Imaging Reports', 
    status: 'online',
    skills: ['Image Analysis', 'Anomaly Detection', 'Report Generation', 'Comparison Studies', 'Measurement Tools', 'Protocol Recommendations']
  },
  { 
    id: 'pharm', 
    name: 'Pharmacy AI', 
    specialty: 'Meds & Interactions', 
    status: 'online',
    skills: ['Drug Interactions', 'Dosage Calculations', 'Allergy Screening', 'Generic Alternatives', 'Side Effect Monitoring', 'Medication History Review']
  },
  { 
    id: 'care', 
    name: 'Care Plan AI', 
    specialty: 'Discharge & Follow-up', 
    status: 'online',
    skills: ['Discharge Planning', 'Follow-up Scheduling', 'Care Coordination', 'Recovery Monitoring', 'Patient Education', 'Referral Management']
  }
];

const AVAILABLE_HEALTHCARE_AGENTS: Agent[] = [
  { 
    id: 'neuro', 
    name: 'Neurology AI', 
    specialty: 'Neurological Assessment', 
    status: 'online',
    skills: ['Neurological Exams', 'Brain Imaging Analysis', 'Seizure Management', 'Stroke Assessment', 'Memory Testing', 'Motor Function Evaluation']
  },
  { 
    id: 'ortho', 
    name: 'Orthopedics AI', 
    specialty: 'Bone & Joint Care', 
    status: 'online',
    skills: ['Fracture Analysis', 'Joint Assessment', 'Movement Evaluation', 'Pain Management', 'Recovery Planning', 'Physical Therapy Guidance']
  },
  { 
    id: 'derm', 
    name: 'Dermatology AI', 
    specialty: 'Skin & Wound Care', 
    status: 'online',
    skills: ['Skin Lesion Analysis', 'Wound Assessment', 'Rash Diagnosis', 'Treatment Recommendations', 'Preventive Care', 'Cosmetic Consultation']
  },
  { 
    id: 'endo', 
    name: 'Endocrinology AI', 
    specialty: 'Hormone & Metabolism', 
    status: 'online',
    skills: ['Diabetes Management', 'Thyroid Assessment', 'Hormone Level Analysis', 'Metabolic Disorders', 'Nutrition Planning', 'Blood Sugar Monitoring']
  },
  { 
    id: 'psych', 
    name: 'Psychiatry AI', 
    specialty: 'Mental Health Support', 
    status: 'online',
    skills: ['Mental Health Screening', 'Mood Assessment', 'Anxiety Management', 'Therapy Recommendations', 'Medication Monitoring', 'Crisis Support']
  }
];

const CitizenServicesInterface: React.FC = () => {
  const [showAddService, setShowAddService] = useState(false);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [showDocumentScanner, setShowDocumentScanner] = useState(false);
  const [showHealthcareOptions, setShowHealthcareOptions] = useState(false);
  const [appointmentSearchQuery, setAppointmentSearchQuery] = useState('');
  const [showAgentSkills, setShowAgentSkills] = useState(false);
  const [selectedAgentForSkills, setSelectedAgentForSkills] = useState<Agent | null>(null);
  const [showEmbeddedPortal, setShowEmbeddedPortal] = useState(false);
  const [showLifeSignalsVitals, setShowLifeSignalsVitals] = useState(false);
  const [documentSearchQuery, setDocumentSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode for patient view
  
  // Generate follow-up agent responses for Patient Concierge
  const generateFollowUpAgentResponses = (originalMessage: string) => {
    const responses: { agent: string; message: string; delay: number }[] = [];

    // Check for @dispatch calls (equipment/delivery)
    if (originalMessage.includes('@dispatch')) {
      responses.push({
        agent: '@dispatch',
        message: '@dispatch here - Hello Ahmad! I received your equipment request. Let me check our delivery system and your address details... Processing now.',
        delay: 1800
      });
      responses.push({
        agent: '@dispatch',
        message: '@dispatch update - Great news Ahmad! Your LifeSignals patch has been dispatched via Pos Malaysia. Tracking: PM789012345. Expected delivery tomorrow 9AM-5PM. You\'ll get an SMS when it\'s out for delivery!',
        delay: 4800
      });
    }

    // Check for @cardio calls (heart-related)
    if (originalMessage.includes('@cardio')) {
      responses.push({
        agent: '@cardio',
        message: '@cardio here - Hello Ahmad! Let me review your heart test results and explain them in simple terms... Checking your ECG and cardiac history.',
        delay: 2200
      });
      responses.push({
        agent: '@cardio',
        message: '@cardio results - Good news Ahmad! Your ECG shows a normal, healthy heart rhythm. No concerning findings. Continue your current medications and schedule a follow-up in 3 months. Any chest pain or shortness of breath, contact us immediately.',
        delay: 5500
      });
    }

    // Check for @lab calls (test results)
    if (originalMessage.includes('@lab')) {
      responses.push({
        agent: '@lab',
        message: '@lab here - Hello Ahmad! Let me pull up your recent lab results and explain what they mean for your health... Reviewing your blood work now.',
        delay: 1600
      });
      responses.push({
        agent: '@lab',
        message: '@lab results - Your blood tests look good, Ahmad! Cholesterol levels are within normal range, blood sugar is stable. Keep up with your current diet and medications. Next lab work scheduled in 6 months.',
        delay: 4200
      });
    }

    // Check for @pharmacy calls (medications)
    if (originalMessage.includes('@pharmacy')) {
      responses.push({
        agent: '@pharmacy',
        message: '@pharmacy here - Hello Ahmad! Let me check your medication status and refill schedule... Reviewing your prescription history.',
        delay: 1400
      });
      responses.push({
        agent: '@pharmacy',
        message: '@pharmacy update - Your medications are ready for pickup, Ahmad! Metformin refill available at Pharmacy Guardian, Lot 10. Bring your IC. Any questions about dosing, just call us!',
        delay: 3800
      });
    }

    // Execute the responses with delays
    responses.forEach(response => {
      setTimeout(() => {
        const agentResponse: Message = {
          id: (Date.now() + Math.random()).toString(),
          sender: 'agent',
          content: response.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentName: response.agent
        };
        setMessages(prev => [...prev, agentResponse]);
      }, response.delay);
    });
  };
  
  const [myServices, setMyServices] = useState<Service[]>([
    AVAILABLE_SERVICES[1], // Lab Results
    AVAILABLE_SERVICES[2]  // Imaging & Radiology
  ]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'agent',
      content: '**@triage** - Intake, prioritization, routing\\n**@cardio** - Cardiology queries, ECG, chest pain\\n**@lab** - Lab orders, results, ranges\\n**@rad** - Imaging orders and reads\\n**@pharm** - Med reconciliation, interactions, refills\\n\\n**Type @[agent] + your request** or upload documents for processing.',
      timestamp: '9:15 AM',
      agentName: 'Healthcare AI Assistant'
    },
    {
      id: '2',
      sender: 'citizen',
      content: '@cardio book appointment with cardiologist in KLCC, prefer Mandarin speaking doctor',
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
        bloodType: 'A+',
        birthDate: '01/01/1980'
      }
    },
    {
      id: 'doc2',
      name: 'CBC Result — 2024-01-10',
      type: 'Lab Report',
      uploadDate: '2024-01-10',
      status: 'processed',
      extractedData: { 
        WBC: '6.2 x10^9/L',
        RBC: '4.7 x10^12/L',
        HGB: '14.1 g/dL',
        HCT: '42%',
        Platelets: '250 x10^9/L',
        Notes: 'Within reference ranges'
      }
    },
    {
      id: 'doc3',
      name: 'Radiology Report — Chest X-ray',
      type: 'Imaging Report',
      uploadDate: '2024-01-08',
      status: 'processed',
      extractedData: {
        study: 'CXR PA/AP',
        findings: 'No focal consolidation. Cardiomediastinal silhouette normal.',
        impression: 'No acute cardiopulmonary process.',
        radiologist: 'Dr. A. Rahman'
      }
    },
    {
      id: 'doc4',
      name: 'Prescription — Metformin 500mg',
      type: 'Medication',
      uploadDate: '2024-01-05',
      status: 'processed',
      extractedData: {
        medication: 'Metformin 500mg',
        sig: '1 tablet twice daily with meals',
        start: '2024-01-05',
        refills: 2,
        interactions: 'None detected'
      }
    },
    {
      id: 'doc5',
      name: 'Discharge Summary — 2023-12-28',
      type: 'Discharge',
      uploadDate: '2024-01-03',
      status: 'processed',
      extractedData: {
        diagnosis: 'Hypertension; Type 2 Diabetes',
        followUp: 'Cardiology in 2 weeks',
        plan: 'Continue meds; lifestyle modification'
      }
    },
    {
      id: 'doc6',
      name: 'ECG Report — Resting 12-Lead',
      type: 'Cardiac Test',
      uploadDate: '2024-01-18',
      status: 'processed',
      extractedData: {
        rhythm: 'Normal Sinus Rhythm',
        rate: '72 bpm',
        interpretation: 'Normal ECG',
        cardiologist: 'Dr. Sarah Wong'
      }
    },
    {
      id: 'doc7',
      name: 'Vaccination Record — Hepatitis B',
      type: 'Immunization',
      uploadDate: '2024-01-22',
      status: 'processed',
      extractedData: {
        vaccine: 'Hepatitis B',
        series: 'Complete (3 doses)',
        lastDose: '2023-11-15',
        immunity: 'Protected'
      }
    },
    {
      id: 'doc8',
      name: 'Insurance Claim — Consultation',
      type: 'Insurance',
      uploadDate: '2024-01-25',
      status: 'processing',
      extractedData: {
        claimNumber: 'CLM-2024-001567',
        amount: 'RM 150.00',
        status: 'Under Review',
        provider: 'Great Eastern'
      }
    },
    {
      id: 'doc9',
      name: 'Lipid Profile — Cholesterol Test',
      type: 'Lab Report',
      uploadDate: '2024-01-20',
      status: 'processed',
      extractedData: {
        totalCholesterol: '185 mg/dL',
        ldl: '110 mg/dL',
        hdl: '55 mg/dL',
        triglycerides: '120 mg/dL',
        status: 'Within normal limits'
      }
    },
    {
      id: 'doc10',
      name: 'Physical Therapy Report',
      type: 'Therapy Report',
      uploadDate: '2024-01-28',
      status: 'processed',
      extractedData: {
        condition: 'Lower Back Pain',
        sessions: '8 sessions completed',
        progress: 'Significant improvement',
        therapist: 'Ahmad Physiotherapy Center'
      }
    }
  ];

  const myAppointments: Appointment[] = [
    {
      id: 'apt1',
      title: 'Cardiology Follow-up',
      doctor: 'Dr. Sarah Wong',
      department: 'Cardiology',
      date: '2024-02-15',
      time: '10:30 AM',
      location: 'Hospital Kuala Lumpur - Level 3, Room 302',
      status: 'upcoming',
      type: 'follow-up',
      bookedByAgent: 'Cardiology AI',
      duration: '45 minutes',
      notes: 'Follow-up for hypertension management',
      preparation: ['Bring previous ECG results', 'Fast for 12 hours before visit', 'List current medications'],
      priority: 'routine'
    },
    {
      id: 'apt2',
      title: 'Blood Test - Lipid Profile',
      doctor: 'Lab Technician',
      department: 'Laboratory',
      date: '2024-02-12',
      time: '8:00 AM',
      location: 'Hospital Kuala Lumpur - Level 1, Lab Wing',
      status: 'upcoming',
      type: 'lab',
      bookedByAgent: 'Lab AI',
      duration: '15 minutes',
      notes: 'Routine cholesterol screening',
      preparation: ['Fast for 12 hours', 'Bring IC and referral letter', 'Wear short sleeves'],
      priority: 'routine'
    },
    {
      id: 'apt3',
      title: 'Physical Therapy Session',
      doctor: 'Ahmad Physiotherapy',
      department: 'Rehabilitation',
      date: '2024-02-10',
      time: '2:00 PM',
      location: 'Physiotherapy Center - Room B',
      status: 'upcoming',
      type: 'procedure',
      duration: '60 minutes',
      notes: 'Lower back pain rehabilitation - Session 3/8',
      preparation: ['Wear comfortable exercise clothes', 'Bring water bottle', 'Complete pain assessment form'],
      priority: 'routine'
    },
    {
      id: 'apt4',
      title: 'General Check-up',
      doctor: 'Dr. Rahman Abdullah',
      department: 'Family Medicine',
      date: '2024-01-28',
      time: '11:00 AM',
      location: 'Clinic Prima - Consultation Room 1',
      status: 'completed',
      type: 'consultation',
      bookedByAgent: 'Triage AI',
      duration: '30 minutes',
      notes: 'Annual health screening completed',
      priority: 'routine'
    },
    {
      id: 'apt5',
      title: 'Chest X-Ray Follow-up',
      doctor: 'Dr. Michael Chen',
      department: 'Radiology',
      date: '2024-02-20',
      time: '3:30 PM',
      location: 'Hospital Kuala Lumpur - Imaging Department',
      status: 'upcoming',
      type: 'imaging',
      bookedByAgent: 'Radiology AI',
      duration: '20 minutes',
      notes: 'Follow-up imaging for previous chest concerns',
      preparation: ['Remove all jewelry and metal objects', 'Arrive 15 minutes early', 'Bring previous X-ray films'],
      priority: 'routine'
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
              content: `You are a PATIENT CONCIERGE working with a collaborative medical team. Help patients navigate healthcare services by coordinating with specialist agents when needed.

COLLABORATIVE PATIENT SUPPORT:
- Work with medical team agents to get patients the best care
- Hand off complex requests to appropriate specialists  
- Always include specialist responses in the same message
- Be proactive in coordinating patient needs

AGENT COLLABORATION FOR PATIENTS:
- @triage - Help assess symptoms, determine urgency, route to right care
- @cardio - Heart-related concerns, ECG results, cardiac follow-up
- @lab - Lab test results, blood work questions, specimen collection
- @radiology - Imaging appointments, scan prep, report explanations
- @pharmacy - Medication questions, refills, drug interactions
- @dispatch - Equipment delivery, supply requests, logistics

MANDATORY COLLABORATIVE RESPONSES - ALWAYS include agent responses:
When patients need specialist help, provide BOTH the request AND the response:

EXAMPLE: "Let me connect you with @cardio about your heart test.

@cardio, can you explain Ahmad's ECG results in simple terms?

@cardio here - Hello Ahmad! Your ECG is normal, no heart problems detected. Continue your medications and see us in 3 months."

MALAYSIAN HEALTHCARE SERVICES EXPERTISE:
🏥 PRIMARY CARE: General practitioners, family medicine, preventive care, health screenings, vaccinations, wellness checks
🫀 CARDIOLOGY: Heart health, ECG analysis, blood pressure monitoring, cardiac risk assessment, chest pain evaluation
🧪 LABORATORY: Blood tests, urine analysis, lipid profiles, diabetes monitoring, liver function tests, kidney function tests
📡 RADIOLOGY: X-rays, CT scans, MRI, ultrasound, mammography, bone density scans, imaging reports
💊 PHARMACY: Medication management, drug interactions, prescription refills, generic alternatives, side effect monitoring
🩺 SPECIALIST CARE: Referrals to specialists, appointment booking, follow-up care, treatment plans, second opinions
🧠 MENTAL HEALTH: Counseling services, psychiatric care, stress management, anxiety treatment, depression support
🏥 EMERGENCY: Urgent care, emergency room visits, ambulance services, after-hours care, medical emergencies

PATIENT COMMUNICATION STYLE:
- **Compassionate & Professional**: Use caring language like "I understand your concern" and "Let me help you with your health needs"
- **Malaysian Healthcare Context**: Reference local hospitals, clinics, and healthcare providers with respectful terms (Dr., Encik, Puan)
- **Clear Medical Guidance**: Provide specific instructions for appointments, tests, medications, and follow-up care
- **Health Tips**: Include preparation instructions, what to bring to appointments, best times for tests
- **Multiple Care Options**: Offer online consultations, clinic visits, and emergency alternatives
- **Medical Reassurance**: Address health anxieties with empathy and provide confidence in treatment plans
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
      
      // Generate follow-up agent responses after delay
      if (streamingMessage.trim()) {
        setTimeout(() => {
          generateFollowUpAgentResponses(streamingMessage);
        }, 2000);
      }
      
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
    
    // Handle common healthcare service requests
    if (lowerInput.includes('door') || lowerInput.includes('where') || lowerInput.includes('location')) {
      return `**Finding Your Way Around Healthcare Facilities**

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

  // Patient-focused prompt for Realtime API
  const citizenPrompt = `You are a PATIENT CONCIERGE for Malaysian Healthcare Services working with a collaborative medical team. Provide safe, practical support for patients and coordinate with specialist agents when needed.

COLLABORATIVE PATIENT SUPPORT:
- Work with medical team agents to get patients the best care
- Hand off complex requests to appropriate specialists
- Provide updates and confirmations from other agents
- Be proactive in coordinating patient needs

AGENT COLLABORATION FOR PATIENTS:
- @triage - Help assess symptoms, determine urgency, route to right care
- @cardio - Heart-related concerns, ECG results, cardiac follow-up
- @lab - Lab test results, blood work questions, specimen collection
- @radiology - Imaging appointments, scan prep, report explanations  
- @pharmacy - Medication questions, refills, drug interactions
- @dispatch - Equipment delivery, supply requests, logistics

MULTI-AGENT PATIENT SUPPORT:
When patients need specialist help, coordinate with agents but respond as the PATIENT CONCIERGE first. Specialists will respond in separate messages.

EXAMPLE - Patient asking about test results:
"Let me connect you with @cardio to review your heart test results in simple terms, Ahmad.

@cardio, can you please explain Ahmad's recent ECG findings in patient-friendly language?

I'm pulling up your test results now and will make sure you understand everything clearly."

EXAMPLE - Patient asking about equipment delivery:
"I'll have @dispatch check on your LifeSignals patch delivery status right away.

@dispatch, can you provide current tracking information for Ahmad's equipment order?

While they check that, let me review your account to see what we have on file..."

PATIENT-FOCUSED APPROACH:
- Always address the patient by name (Ahmad)
- Coordinate with specialists but respond as concierge first
- Show you're actively working on their request
- Use simple, caring language
- Specialists will follow up in separate messages

PATIENT-FOCUSED COMMUNICATION:
- Use clear, simple language and empathetic tone
- Provide specific, actionable steps and realistic timelines
- Offer multiple options: online, phone, in-person visits
- Escalate urgent symptoms appropriately with @triage

START:
"Hello Ahmad, this is your Patient Concierge. I work with our medical team to help with all your healthcare needs. How can we assist you today?"`;

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
    <div className={`flex flex-col h-full overflow-hidden ${
      isDarkMode ? 'bg-gray-100' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`border-b px-6 py-4 ${
        isDarkMode 
          ? 'bg-black border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Patient Care Concierge</h1>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>Your personalized healthcare portal</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1 rounded transition-colors hover:bg-gray-700/50"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <svg className="w-3 h-3" fill="#666" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="#666" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setShowPhoneModal(true)}
              className={`flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-green-100 text-green-800 border border-green-500 hover:bg-green-200' 
                  : 'text-green-600 hover:text-green-700 hover:bg-green-50 border border-green-200 hover:border-green-300'
              }`}
              title="Call Healthcare Services"
            >
              <FaPhone size={14} className="mr-2" />
              Call Support
            </button>
          </div>
        </div>
      </div>

      {/* Patient Profile */}
      <div className={`p-3 border-b ${
        isDarkMode ? 'border-gray-300' : 'border-gray-200'
      }`}>
        <div className={`rounded-lg p-3 shadow-sm border ${
          isDarkMode 
            ? 'bg-gray-200 border-gray-300' 
            : 'bg-white border-gray-100'
        }`}>
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
      <div className={`p-3 border-b ${
        isDarkMode ? 'border-gray-300' : 'border-gray-200'
      }`}>
        <div className={`rounded-lg p-3 shadow-sm border ${
          isDarkMode 
            ? 'bg-gray-200 border-gray-300' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-base font-semibold ${
              isDarkMode ? 'text-gray-800' : 'text-gray-900'
            }`}>My Data ({myDocuments.length})</h2>
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
          <div className="grid grid-cols-4 gap-2 max-h-24 overflow-y-auto">
            {myDocuments
              .filter(doc => 
                documentSearchQuery === '' || 
                doc.name.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
                doc.type.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
                (doc.extractedData && JSON.stringify(doc.extractedData).toLowerCase().includes(documentSearchQuery.toLowerCase()))
              )
              .slice(0, 8)
              .map((doc) => (
              <div 
                key={doc.id} 
                onClick={() => showDocumentDetailsModal(doc)}
                className={`p-2 border rounded-lg hover:shadow-sm transition-all cursor-pointer min-h-[80px] flex flex-col ${
                  isDarkMode 
                    ? 'bg-blue-50 border-blue-200 hover:border-blue-300' 
                    : 'bg-gray-50/50 border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-1 flex-1">
                  <div className="flex-1 min-w-0 pr-1">
                    <h4 className={`font-bold text-xs leading-tight mb-0.5 ${
                      isDarkMode ? 'text-gray-800' : 'text-gray-900'
                    }`} style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                      {doc.name}
                    </h4>
                    <p className={`text-xs leading-tight ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{doc.type}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-0.5"></div>
                </div>
                <p className={`text-xs mt-auto ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{doc.uploadDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: My Services */}
      <div className={`p-3 border-b ${
        isDarkMode ? 'border-gray-300' : 'border-gray-200'
      }`}>
        <div className={`rounded-lg p-3 shadow-sm border ${
          isDarkMode 
            ? 'bg-gray-200 border-gray-300' 
            : 'bg-white border-gray-100'
        }`}>
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
                className={`flex-shrink-0 w-48 p-2 border rounded-lg hover:shadow-sm transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-blue-50 border-blue-200 hover:border-blue-300' 
                    : 'bg-gray-50/50 border-gray-100'
                }`}
              >
                <h4 className={`font-medium text-xs ${
                  isDarkMode ? 'text-gray-800' : 'text-gray-900'
                }`}>{service.name}</h4>
                <p className={`text-xs mt-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{service.category}</p>
                <p className={`text-xs mt-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: My Appointments */}
      <div className="p-3 border-b border-gray-200">
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">My Appointments ({myAppointments.length})</h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={appointmentSearchQuery}
                onChange={(e) => setAppointmentSearchQuery(e.target.value)}
                placeholder="Search appointments..."
                className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
              />
              <button
                className="w-5 h-5 bg-white border border-gray-300 text-gray-500 rounded-full flex items-center justify-center hover:border-gray-400 hover:text-gray-600 transition-colors"
                title="Book Appointment"
              >
                <FaPlus size={8} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 max-h-20 overflow-y-auto">
            {myAppointments
              .filter(appointment => 
                appointment.title.toLowerCase().includes(appointmentSearchQuery.toLowerCase()) ||
                appointment.doctor.toLowerCase().includes(appointmentSearchQuery.toLowerCase()) ||
                appointment.department.toLowerCase().includes(appointmentSearchQuery.toLowerCase())
              )
              .slice(0, 6)
              .map((appointment) => (
              <div
                key={appointment.id}
                className={`p-3 border rounded-lg cursor-pointer hover:shadow-md transition-all ${
                  isDarkMode 
                    ? 'bg-blue-50 border-blue-200 hover:border-blue-300' 
                    : 'bg-gradient-to-br from-white to-gray-50/30 border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm truncate pr-1 ${
                      isDarkMode ? 'text-gray-800' : 'text-gray-900'
                    }`}>{appointment.title}</h4>
                    {appointment.bookedByAgent && (
                      <div className="flex items-center gap-1 mt-1">
                        <FaRobot className="text-blue-500" size={10} />
                        <span className="text-xs text-blue-600 font-medium">Booked by {appointment.bookedByAgent}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {appointment.priority === 'urgent' && (
                      <div className="w-2 h-2 rounded-full bg-orange-500" title="Urgent"></div>
                    )}
                    <div className={`w-2 h-2 rounded-full ${
                      appointment.status === 'upcoming' ? 'bg-blue-500' :
                      appointment.status === 'completed' ? 'bg-green-500' :
                      'bg-gray-400'
                    }`}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className={`text-xs truncate ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{appointment.doctor} • {appointment.department}</p>
                  {appointment.duration && (
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Duration: {appointment.duration}</p>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>{appointment.date}</span>
                    <span className={`${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{appointment.time}</span>
                  </div>
                  {appointment.notes && (
                    <p className={`text-xs italic truncate ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>"{appointment.notes}"</p>
                  )}
                </div>
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
            <button
              onClick={() => setShowAddAgentModal(true)}
              className="w-5 h-5 bg-white border border-gray-300 text-gray-500 rounded-full flex items-center justify-center hover:border-gray-400 hover:text-gray-600 transition-colors"
              title="Add Agent"
            >
              <FaPlus size={8} />
            </button>
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
              <h2 className="text-base font-semibold text-gray-900">Patient Concierge</h2>
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
                title="Add Healthcare Agent"
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
                placeholder="Ask anything: '@cardio chest pain', 'lab results', 'book appointment', 'medication refill'..."
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
                    <button 
                      onClick={() => setShowEmbeddedPortal(true)}
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Visit Portal →
                    </button>
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
                    <button 
                      onClick={() => setShowLifeSignalsVitals(true)}
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View Live Vitals →
                    </button>
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
                {selectedAgentForSkills.id !== 'health' && selectedAgentForSkills.skills && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {selectedAgentForSkills.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 text-center">
                        This AI agent specializes in {selectedAgentForSkills.specialty.toLowerCase()} and can assist with the above capabilities.
                      </p>
                    </div>
                  </div>
                )}
                {selectedAgentForSkills.id !== 'health' && !selectedAgentForSkills.skills && (
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
              <h3 className="text-xl font-semibold text-gray-900">Add Healthcare Agent</h3>
              <button
                onClick={() => setShowAddAgentModal(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-all duration-200 hover:scale-105"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Add Healthcare Agents</h4>
                <p className="text-sm text-gray-600">Expand your service access with specialized agents</p>
              </div>
              
              <div className="space-y-3">
                {AVAILABLE_HEALTHCARE_AGENTS.map((agent, index) => {
                  const colors = [
                    { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', text: 'text-blue-600', hover: 'hover:border-blue-200 hover:bg-blue-50 hover:border-blue-300' },
                    { bg: 'from-green-50 to-green-100', border: 'border-green-200', text: 'text-green-600', hover: 'hover:border-green-200 hover:bg-green-50 hover:border-green-300' },
                    { bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', text: 'text-purple-600', hover: 'hover:border-purple-200 hover:bg-purple-50 hover:border-purple-300' },
                    { bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', text: 'text-orange-600', hover: 'hover:border-orange-200 hover:bg-orange-50 hover:border-orange-300' },
                    { bg: 'from-pink-50 to-pink-100', border: 'border-pink-200', text: 'text-pink-600', hover: 'hover:border-pink-200 hover:bg-pink-50 hover:border-pink-300' }
                  ];
                  const color = colors[index % colors.length];
                  const initials = agent.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                  
                  return (
                    <div key={agent.id} className={`group p-4 bg-white border border-gray-100 rounded-2xl ${color.hover} hover:shadow-sm transition-all duration-200`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.bg} ${color.border} flex items-center justify-center`}>
                            <span className={`${color.text} font-semibold text-sm`}>{initials}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm mb-0.5">{agent.name}</h4>
                            <p className="text-xs text-gray-500">{agent.specialty}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            // Add the agent logic here if needed
                            console.log(`Adding agent: ${agent.name}`);
                          }}
                          className={`px-4 py-1.5 bg-white border ${color.border} ${color.text} text-xs font-medium rounded-full ${color.hover} transition-all duration-200 group-hover:shadow-sm`}
                        >
                          Add Agent
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                  <h3 className="font-medium text-gray-900 text-sm">Healthcare Services</h3>
                  <p className="text-xs text-gray-500">Patient Support</p>
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

      {/* Document Scanner Modal */}
      {showDocumentScanner && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto border border-gray-100/50">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Document Intelligence</h3>
                <p className="text-sm text-gray-500">Upload medical documents for AI analysis and processing</p>
              </div>
              <button
                onClick={() => setShowDocumentScanner(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-all duration-200 hover:scale-105"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50/30">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Medical Document Analysis</h3>
                <p className="text-sm text-gray-500 mb-4">Upload lab reports, prescriptions, imaging results, or medical records</p>
                
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                  className="hidden"
                  id="document-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log('Document selected:', file.name);
                      // Here you would process the document using the same API as the hospital view
                      // For now, just close the modal and show a success message
                      setShowDocumentScanner(false);
                      // You could add the document to myDocuments array here
                    }
                  }}
                />
                
                <label
                  htmlFor="document-upload"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Choose Document
                </label>
                
                <div className="mt-4 text-xs text-gray-400">
                  Supports: PDF, JPG, PNG, GIF • Max size: 10MB
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">AI Processing Features</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Extract key medical information and values</li>
                      <li>• Identify document type and format</li>
                      <li>• Detect abnormal results and flag concerns</li>
                      <li>• Generate structured summaries</li>
                      <li>• Store securely in your health records</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Portal Modal */}
      {showEmbeddedPortal && (
        <div className="fixed inset-0 backdrop-blur-lg bg-white/10 flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h3 className="text-xl font-semibold text-gray-900">FaceHeart Health Portal</h3>
              <button
                onClick={() => setShowEmbeddedPortal(false)}
                className="p-2 hover:bg-white/30 rounded-full transition-all duration-200 text-gray-600 hover:text-gray-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 text-center">
              <div 
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40"
                style={{
                  boxShadow: '0 0 25px rgba(59, 130, 246, 0.5), 0 0 50px rgba(147, 51, 234, 0.4)'
                }}
              >
                <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Vision Based Vitals</h3>
                <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  FDA Approved
                </div>
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed">
                For optimal performance and security, the FaceHeart portal will open in a dedicated window with full camera and monitoring capabilities.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const popup = window.open(
                      'https://hcs.faceheart.com/react/index.html', 
                      'FaceHeartPortal',
                      'width=1200,height=800,left=100,top=100,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,location=no,status=no'
                    );
                    if (popup) popup.focus();
                    setShowEmbeddedPortal(false);
                  }}
                  className="w-full px-6 py-3 bg-white text-gray-800 rounded-full relative overflow-hidden font-medium transform hover:scale-[1.02] transition-all duration-200"
                  style={{
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(147, 51, 234, 0.3), 0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <span className="relative z-10">Launch Portal</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 hover:opacity-15 transition-opacity duration-200"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LifeSignals Vitals Modal */}
      {showLifeSignalsVitals && (
        <LifeSignalsVitals onClose={() => setShowLifeSignalsVitals(false)} />
      )}
    </div>
  );
};

export default CitizenServicesInterface;
