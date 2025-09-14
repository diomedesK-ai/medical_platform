"use client";
import React, { useState, useEffect } from 'react';
import { 
  FaHeartbeat,
  FaAmbulance,
  FaUserMd,
  FaHospital,
  FaPills,
  FaCalendarCheck,
  FaStethoscope,
  FaFirstAid,
  FaPhone,
  FaWhatsapp,
  FaSearch,
  FaFilter,
  FaEye,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaMapMarkerAlt,
  FaIdCard,
  FaFileAlt,
  FaChartLine,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaPlay,
  FaPause,
  FaUserCircle
} from 'react-icons/fa';

// Health service types
interface HealthService {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedWaitTime: string;
  availableSlots: number;
}

interface Patient {
  id: string;
  name: string;
  icNumber: string;
  age: number;
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  address: string;
  medicalHistory: string[];
  currentCondition: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  assignedDoctor: string;
  appointmentDate: string;
  status: 'waiting' | 'in-consultation' | 'treatment' | 'discharged' | 'admitted';
  vitals: {
    bloodPressure: string;
    temperature: string;
    heartRate: string;
    oxygenSaturation: string;
  };
  lastVisit: string;
}

interface HealthStats {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
}

// Mock health services
const HEALTH_SERVICES: HealthService[] = [
  {
    id: 'emergency',
    name: 'Emergency Services',
    description: 'Critical care and emergency medical services',
    icon: <FaAmbulance />,
    color: 'bg-red-500',
    urgencyLevel: 'critical',
    estimatedWaitTime: 'Immediate',
    availableSlots: 24
  },
  {
    id: 'general',
    name: 'General Consultation',
    description: 'Primary healthcare and general medical consultation',
    icon: <FaUserMd />,
    color: 'bg-blue-500',
    urgencyLevel: 'low',
    estimatedWaitTime: '30-45 min',
    availableSlots: 12
  },
  {
    id: 'specialist',
    name: 'Specialist Care',
    description: 'Specialized medical services and treatments',
    icon: <FaStethoscope />,
    color: 'bg-purple-500',
    urgencyLevel: 'medium',
    estimatedWaitTime: '1-2 hours',
    availableSlots: 8
  },
  {
    id: 'preventive',
    name: 'Preventive Care',
    description: 'Health screenings, vaccinations, and check-ups',
    icon: <FaFirstAid />,
    color: 'bg-green-500',
    urgencyLevel: 'low',
    estimatedWaitTime: '15-30 min',
    availableSlots: 20
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy Services',
    description: 'Medication dispensing and pharmaceutical care',
    icon: <FaPills />,
    color: 'bg-orange-500',
    urgencyLevel: 'low',
    estimatedWaitTime: '10-15 min',
    availableSlots: 30
  },
  {
    id: 'mental',
    name: 'Mental Health',
    description: 'Psychological support and mental health services',
    icon: <FaHeartbeat />,
    color: 'bg-pink-500',
    urgencyLevel: 'medium',
    estimatedWaitTime: '45-60 min',
    availableSlots: 6
  }
];

// Mock patient data
const MOCK_PATIENTS: Patient[] = [
  {
    id: 'P001',
    name: 'Ahmad bin Rahman',
    icNumber: '800101-01-1234',
    age: 44,
    gender: 'Male',
    phone: '+60-12-345-6789',
    email: 'ahmad.rahman@email.com',
    address: 'Jalan Sultan Ismail, Kuala Lumpur',
    medicalHistory: ['Diabetes', 'Hypertension'],
    currentCondition: 'Chest pain and shortness of breath',
    urgencyLevel: 'high',
    assignedDoctor: 'Dr. Siti Aminah',
    appointmentDate: '2024-01-15 14:30',
    status: 'in-consultation',
    vitals: {
      bloodPressure: '150/95',
      temperature: '37.2°C',
      heartRate: '88 bpm',
      oxygenSaturation: '96%'
    },
    lastVisit: '2024-01-10'
  },
  {
    id: 'P002',
    name: 'Lim Mei Ling',
    icNumber: '850315-08-5678',
    age: 39,
    gender: 'Female',
    phone: '+60-11-987-6543',
    email: 'lim.meiling@email.com',
    address: 'Taman Tun Dr Ismail, Kuala Lumpur',
    medicalHistory: ['Asthma'],
    currentCondition: 'Routine check-up and vaccination',
    urgencyLevel: 'low',
    assignedDoctor: 'Dr. Kumar Selvam',
    appointmentDate: '2024-01-15 15:00',
    status: 'waiting',
    vitals: {
      bloodPressure: '120/80',
      temperature: '36.8°C',
      heartRate: '72 bpm',
      oxygenSaturation: '98%'
    },
    lastVisit: '2024-01-05'
  },
  {
    id: 'P003',
    name: 'Fatimah binti Hassan',
    icNumber: '750620-14-9012',
    age: 49,
    gender: 'Female',
    phone: '+60-13-456-7890',
    email: 'fatimah.hassan@email.com',
    address: 'Bangsar, Kuala Lumpur',
    medicalHistory: ['Heart Disease', 'High Cholesterol'],
    currentCondition: 'Cardiac consultation and medication review',
    urgencyLevel: 'medium',
    assignedDoctor: 'Dr. Raj Patel',
    appointmentDate: '2024-01-15 16:00',
    status: 'treatment',
    vitals: {
      bloodPressure: '140/90',
      temperature: '36.5°C',
      heartRate: '78 bpm',
      oxygenSaturation: '97%'
    },
    lastVisit: '2023-12-20'
  }
];

const HealthPortalInterface: React.FC = () => {
  const [selectedService, setSelectedService] = useState<HealthService | null>(null);
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter patients based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.icNumber.includes(searchTerm) ||
        patient.currentCondition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.assignedDoctor.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'in-consultation': return 'bg-blue-100 text-blue-800';
      case 'treatment': return 'bg-purple-100 text-purple-800';
      case 'discharged': return 'bg-green-100 text-green-800';
      case 'admitted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Health statistics
  const healthStats: HealthStats[] = [
    {
      title: 'Active Patients',
      value: patients.filter(p => ['waiting', 'in-consultation', 'treatment'].includes(p.status)).length,
      change: 8,
      icon: <FaUsers size={14} />,
      color: 'text-blue-600'
    },
    {
      title: 'Critical Cases',
      value: patients.filter(p => p.urgencyLevel === 'critical').length,
      change: -12,
      icon: <FaExclamationTriangle size={14} />,
      color: 'text-red-600'
    },
    {
      title: 'Available Beds',
      value: 156,
      change: 3,
      icon: <FaHospital size={14} />,
      color: 'text-green-600'
    },
    {
      title: 'Avg Wait Time',
      value: '23',
      change: -15,
      icon: <FaClock size={14} />,
      color: 'text-orange-600',
      suffix: ' min'
    },
    {
      title: 'Patient Satisfaction',
      value: 4.8,
      change: 5,
      icon: <FaHeartbeat size={14} />,
      color: 'text-pink-600',
      suffix: '/5'
    },
    {
      title: 'Staff on Duty',
      value: 89,
      change: 2,
      icon: <FaUserMd size={14} />,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Portal</h1>
            <p className="text-gray-600 text-sm">Integrated Healthcare Management System</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Current Time</p>
              <p className="text-sm font-medium text-gray-900">{currentTime.toLocaleTimeString()}</p>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">System Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Health Statistics */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {healthStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center relative border-2 ${stat.color.replace('text-', 'border-')}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.change > 0 ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <div>
                <h3 className="text-gray-500 text-xs font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl font-light text-gray-900">{stat.value}{stat.suffix}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Health Services */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Health Services</h2>
            <a
              href="https://hcs.faceheart.com/react/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <FaHeartbeat size={14} />
              Real Time Vitals
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {HEALTH_SERVICES.slice(0, 4).map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`cursor-pointer p-4 rounded-lg border transition-all hover:shadow-sm ${
                  selectedService?.id === service.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{service.name}</h3>
                    <p className="text-xs text-gray-500">{service.estimatedWaitTime}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{service.availableSlots} available</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    service.urgencyLevel === 'critical' ? 'bg-red-100 text-red-800' :
                    service.urgencyLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                    service.urgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {service.urgencyLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional Services */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaStethoscope className="text-blue-500" size={16} />
                  <h4 className="font-medium text-gray-900 text-sm">Continuous Monitoring</h4>
                </div>
                <p className="text-xs text-gray-600 mb-2">Lifesignals patch monitoring system</p>
                <span className="text-xs text-green-600 font-medium">24/7 Active</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaAmbulance className="text-red-500" size={16} />
                  <h4 className="font-medium text-gray-900 text-sm">Emergency Response</h4>
                </div>
                <p className="text-xs text-gray-600 mb-2">Rapid response command center</p>
                <span className="text-xs text-red-600 font-medium">Emergency Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search patients by name, IC number, condition, or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2">
              <FaFilter size={14} />
              Filter
            </button>
            <button className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2">
              <FaCalendarCheck size={14} />
              Schedule
            </button>
          </div>
        </div>

        {/* Patient Queue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Patient Queue</h2>
              <span className="text-sm text-gray-500">
                {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => {
                  setSelectedPatient(patient);
                  setShowPatientModal(true);
                }}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <FaIdCard size={12} />
                          {patient.icNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaUserCircle size={12} />
                          {patient.age} years, {patient.gender}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaPhone size={12} />
                          {patient.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Current Condition</p>
                      <p className="text-sm font-medium text-gray-900 max-w-48 truncate">
                        {patient.currentCondition}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Assigned Doctor</p>
                      <p className="text-sm font-medium text-gray-900">{patient.assignedDoctor}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Urgency</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(patient.urgencyLevel)}`}>
                        {patient.urgencyLevel.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                        {patient.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredPatients.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? `No patients match "${searchTerm}". Try adjusting your search.`
                  : 'No patients in queue.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Patient Detail Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h2>
                    <p className="text-gray-600">{selectedPatient.icNumber}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(selectedPatient.urgencyLevel)}`}>
                        {selectedPatient.urgencyLevel.toUpperCase()} PRIORITY
                      </span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPatient.status)}`}>
                        {selectedPatient.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Patient Basic Info */}
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Age & Gender</label>
                    <p className="text-gray-900">{selectedPatient.age} years, {selectedPatient.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedPatient.email}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900">{selectedPatient.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Assigned Doctor</label>
                    <p className="text-gray-900">{selectedPatient.assignedDoctor}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Appointment</label>
                    <p className="text-gray-900">{selectedPatient.appointmentDate}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Visit</label>
                    <p className="text-gray-900">{selectedPatient.lastVisit}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Condition</label>
                    <p className="text-gray-900">{selectedPatient.currentCondition}</p>
                  </div>
                </div>
              </div>
              
              {/* Medical History */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Medical History</label>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.medicalHistory.map((condition, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Vital Signs */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-3 block">Current Vital Signs</label>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <FaHeartbeat className="text-blue-500 mx-auto mb-2" size={20} />
                    <p className="text-sm text-gray-600">Blood Pressure</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedPatient.vitals.bloodPressure}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <FaStethoscope className="text-red-500 mx-auto mb-2" size={20} />
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedPatient.vitals.temperature}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <FaHeartbeat className="text-green-500 mx-auto mb-2" size={20} />
                    <p className="text-sm text-gray-600">Heart Rate</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedPatient.vitals.heartRate}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <FaFirstAid className="text-purple-500 mx-auto mb-2" size={20} />
                    <p className="text-sm text-gray-600">Oxygen Sat.</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedPatient.vitals.oxygenSaturation}</p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <FaPhone size={16} />
                  Call Patient
                </button>
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <FaWhatsapp size={16} />
                  WhatsApp
                </button>
                <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <FaFileAlt size={16} />
                  Medical Records
                </button>
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <FaCalendarCheck size={16} />
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthPortalInterface;
