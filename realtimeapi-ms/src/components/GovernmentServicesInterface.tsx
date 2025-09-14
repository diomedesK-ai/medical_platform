"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  FaUser, 
  FaChartLine, 
  FaShieldAlt, 
  FaHeartbeat,
  FaGraduationCap,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaWhatsapp,
  FaSpinner,
  FaArrowLeft,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaPaperPlane,
  FaUniversity,
  FaRobot,
  FaCircle,
  FaTimes,
  FaPlay,
  FaCog,
  FaHistory,
  FaSearch,
  FaTag,
  FaGavel,
  FaPassport,
  FaHeart,
  FaBuilding,
  FaIdCard,
  FaFileAlt,
  FaAmbulance,
  FaUserGraduate,
  FaHome
} from 'react-icons/fa';

// Government service segment data types
interface GovernmentSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    ageRange: { min: number; max: number };
    incomeRange: { min: number; max: number };
    dependents: { min: number; max: number };
    urgencyLevel: { min: number; max: number };
    serviceType: string[];
    region: string[];
  };
  color: string;
  priority: number;
}

// Citizen data types
interface Citizen {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  monthlyIncome: number;
  dependents: number;
  urgencyLevel: number;
  serviceType: string[];
  region: string;
  status: 'active' | 'pending' | 'processing' | 'completed';
  lastContact: string;
  assignedAgent: string;
  registrationDate: string;
}

// Mock government service segments for Malaysia
const GOVERNMENT_SEGMENTS: GovernmentSegment[] = [
  {
    id: 'healthcare',
    name: 'Healthcare Services',
    description: 'Medical care, health insurance, emergency services',
    criteria: {
      ageRange: { min: 0, max: 100 },
      incomeRange: { min: 0, max: 200000 },
      dependents: { min: 0, max: 10 },
      urgencyLevel: { min: 1, max: 10 },
      serviceType: ['health', 'medical', 'emergency'],
      region: ['Kuala Lumpur', 'Selangor', 'Johor', 'Penang', 'Sabah', 'Sarawak']
    },
    color: 'bg-red-500',
    priority: 1
  },
  {
    id: 'education',
    name: 'Education Services',
    description: 'Schools, universities, scholarships, student aid',
    criteria: {
      ageRange: { min: 5, max: 35 },
      incomeRange: { min: 0, max: 100000 },
      dependents: { min: 0, max: 5 },
      urgencyLevel: { min: 1, max: 8 },
      serviceType: ['education', 'scholarship', 'school'],
      region: ['Kuala Lumpur', 'Selangor', 'Johor', 'Penang', 'Sabah', 'Sarawak']
    },
    color: 'bg-blue-500',
    priority: 2
  },
  {
    id: 'social',
    name: 'Social Welfare',
    description: 'Financial aid, housing assistance, disability support',
    criteria: {
      ageRange: { min: 18, max: 80 },
      incomeRange: { min: 0, max: 50000 },
      dependents: { min: 0, max: 8 },
      urgencyLevel: { min: 5, max: 10 },
      serviceType: ['welfare', 'housing', 'disability'],
      region: ['Kuala Lumpur', 'Selangor', 'Johor', 'Penang', 'Sabah', 'Sarawak']
    },
    color: 'bg-green-500',
    priority: 3
  },
  {
    id: 'legal',
    name: 'Legal Services',
    description: 'Court proceedings, legal aid, documentation',
    criteria: {
      ageRange: { min: 18, max: 100 },
      incomeRange: { min: 0, max: 150000 },
      dependents: { min: 0, max: 10 },
      urgencyLevel: { min: 1, max: 9 },
      serviceType: ['legal', 'court', 'documentation'],
      region: ['Kuala Lumpur', 'Selangor', 'Johor', 'Penang', 'Sabah', 'Sarawak']
    },
    color: 'bg-purple-500',
    priority: 4
  }
];

// Mock citizen data
const MOCK_CITIZENS: Citizen[] = [
  {
    id: 'C001',
    name: 'Ahmad bin Abdullah',
    email: 'ahmad.abdullah@email.com',
    phone: '+60-12-345-6789',
    age: 35,
    monthlyIncome: 4500,
    dependents: 2,
    urgencyLevel: 7,
    serviceType: ['health', 'education'],
    region: 'Kuala Lumpur',
    status: 'pending',
    lastContact: '2024-01-15',
    assignedAgent: 'Dr. Siti Nurhaliza',
    registrationDate: '2024-01-10'
  },
  {
    id: 'C002',
    name: 'Lim Wei Ming',
    email: 'lim.weiming@email.com',
    phone: '+60-11-987-6543',
    age: 28,
    monthlyIncome: 3200,
    dependents: 1,
    urgencyLevel: 5,
    serviceType: ['education', 'scholarship'],
    region: 'Selangor',
    status: 'active',
    lastContact: '2024-01-14',
    assignedAgent: 'Encik Rahman Ismail',
    registrationDate: '2024-01-08'
  },
  {
    id: 'C003',
    name: 'Fatimah binti Hassan',
    email: 'fatimah.hassan@email.com',
    phone: '+60-13-456-7890',
    age: 42,
    monthlyIncome: 2800,
    dependents: 3,
    urgencyLevel: 9,
    serviceType: ['welfare', 'housing'],
    region: 'Johor',
    status: 'processing',
    lastContact: '2024-01-16',
    assignedAgent: 'Puan Aminah Yusof',
    registrationDate: '2024-01-05'
  }
];

const GovernmentServicesInterface: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<GovernmentSegment | null>(null);
  const [citizens, setCitizens] = useState<Citizen[]>(MOCK_CITIZENS);
  const [filteredCitizens, setFilteredCitizens] = useState<Citizen[]>(MOCK_CITIZENS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [showCitizenModal, setShowCitizenModal] = useState(false);

  // Filter citizens based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCitizens(citizens);
    } else {
      const filtered = citizens.filter(citizen =>
        citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        citizen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        citizen.serviceType.some(service => 
          service.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredCitizens(filtered);
    }
  }, [searchTerm, citizens]);

  // Segment citizens based on criteria
  const segmentCitizens = (segment: GovernmentSegment): Citizen[] => {
    return citizens.filter(citizen => {
      const { criteria } = segment;
      return (
        citizen.age >= criteria.ageRange.min &&
        citizen.age <= criteria.ageRange.max &&
        citizen.monthlyIncome >= criteria.incomeRange.min &&
        citizen.monthlyIncome <= criteria.incomeRange.max &&
        citizen.dependents >= criteria.dependents.min &&
        citizen.dependents <= criteria.dependents.max &&
        citizen.urgencyLevel >= criteria.urgencyLevel.min &&
        citizen.urgencyLevel <= criteria.urgencyLevel.max &&
        criteria.serviceType.some(service => 
          citizen.serviceType.includes(service)
        ) &&
        criteria.region.includes(citizen.region)
      );
    });
  };

  const handleSegmentSelect = (segment: GovernmentSegment) => {
    setSelectedSegment(segment);
    const segmentedCitizens = segmentCitizens(segment);
    setFilteredCitizens(segmentedCitizens);
  };

  const resetFilters = () => {
    setSelectedSegment(null);
    setFilteredCitizens(citizens);
    setSearchTerm('');
  };

  const getServiceIcon = (serviceType: string[]) => {
    if (serviceType.includes('health') || serviceType.includes('medical')) return <FaHeartbeat className="text-red-500" />;
    if (serviceType.includes('education') || serviceType.includes('scholarship')) return <FaGraduationCap className="text-blue-500" />;
    if (serviceType.includes('welfare') || serviceType.includes('housing')) return <FaHome className="text-green-500" />;
    if (serviceType.includes('legal') || serviceType.includes('court')) return <FaGavel className="text-purple-500" />;
    return <FaBuilding className="text-gray-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (level: number) => {
    if (level >= 8) return 'bg-red-500';
    if (level >= 6) return 'bg-orange-500';
    if (level >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Government Command Center</h1>
            <p className="text-gray-600 text-sm">AI-Powered Citizen Services Operations</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Total Citizens</p>
              <p className="text-lg font-semibold text-gray-900">{citizens.length.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Active Cases</p>
              <p className="text-lg font-semibold text-green-600">
                {citizens.filter(c => c.status === 'active' || c.status === 'processing').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Command Center Overview */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* AI Agent KPIs */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Agent Performance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cases Resolved Today</span>
                <span className="text-lg font-semibold text-green-600">247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Response Time</span>
                <span className="text-lg font-semibold text-blue-600">1.2s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-lg font-semibold text-green-600">96.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active AI Agents</span>
                <span className="text-lg font-semibold text-gray-900">12</span>
              </div>
            </div>
          </div>

          {/* Service Map */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Distribution Map</h2>
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center relative">
              <div className="text-center">
                <div className="w-32 h-24 bg-gray-200 rounded mb-2 mx-auto flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Malaysia Map</span>
                </div>
                <p className="text-xs text-gray-500">Real-time service coverage</p>
              </div>
              {/* Service indicators */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">KL: 89 active</span>
              </div>
              <div className="absolute top-8 right-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Selangor: 64 active</span>
              </div>
              <div className="absolute bottom-6 left-8 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Johor: 42 active</span>
              </div>
            </div>
          </div>

          {/* STP Processing Monitor */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">STP Processing Monitor</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded border-l-4 border-green-500">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Health Registration</p>
                    <span className="text-lg font-bold text-green-600">2,847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">Processing Rate: 98.2%</p>
                    <span className="text-xs text-green-600 font-medium">+127 today</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Education Grants</p>
                    <span className="text-lg font-bold text-blue-600">1,923</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">Processing Rate: 94.5%</p>
                    <span className="text-xs text-blue-600 font-medium">+89 today</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded border-l-4 border-orange-500">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Social Welfare</p>
                    <span className="text-lg font-bold text-orange-600">4,561</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">Processing Rate: 96.8%</p>
                    <span className="text-xs text-orange-600 font-medium">+203 today</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Overall STP Rate</span>
                <span className="text-2xl font-bold text-gray-900">96.5%</span>
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
                placeholder="Search citizens by name, email, or service type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2">
              <FaSearch size={14} />
              Search
            </button>
          </div>
        </div>

        {/* STP Processing Dashboard */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">STP Processing Dashboard</h2>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Overall STP Rate</p>
                  <p className="text-lg font-semibold text-green-600">98.5%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Documents Processed</p>
                  <p className="text-lg font-semibold text-blue-600">1,245</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Avg Processing Time</p>
                  <p className="text-lg font-semibold text-orange-600">2m 45s</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Processing Pipeline */}
          <div className="p-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Processing Pipeline</h3>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Received</h4>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-xs text-gray-500">1,245 docs</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Extracted</h4>
                <p className="text-2xl font-bold text-gray-900">93.7%</p>
                <p className="text-xs text-gray-500">1,167 docs</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Validated</h4>
                <p className="text-2xl font-bold text-gray-900">84.8%</p>
                <p className="text-xs text-gray-500">1,056 docs</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Routed</h4>
                <p className="text-2xl font-bold text-gray-900">78.6%</p>
                <p className="text-xs text-gray-500">980 docs</p>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredCitizens.map((citizen) => (
              <div
                key={citizen.id}
                onClick={() => {
                  setSelectedCitizen(citizen);
                  setShowCitizenModal(true);
                }}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {citizen.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{citizen.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <FaIdCard size={12} />
                          {citizen.id}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaEnvelope size={12} />
                          {citizen.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaPhone size={12} />
                          {citizen.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        {getServiceIcon(citizen.serviceType)}
                        <span className="text-sm font-medium text-gray-900">
                          {citizen.serviceType.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Urgency:</span>
                        <div className={`w-3 h-3 ${getUrgencyColor(citizen.urgencyLevel)} rounded-full`}></div>
                        <span className="text-xs font-medium">{citizen.urgencyLevel}/10</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(citizen.status)}`}>
                        {citizen.status.charAt(0).toUpperCase() + citizen.status.slice(1)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Agent: {citizen.assignedAgent}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredCitizens.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No citizens found</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? `No citizens match "${searchTerm}". Try adjusting your search.`
                  : selectedSegment 
                    ? `No citizens match the selected segment criteria.`
                    : 'No citizens available.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Citizen Detail Modal */}
      {showCitizenModal && selectedCitizen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium text-lg">
                    {selectedCitizen.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedCitizen.name}</h2>
                    <p className="text-gray-600">{selectedCitizen.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCitizenModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Citizen Details */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Citizen ID</label>
                    <p className="text-gray-900">{selectedCitizen.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{selectedCitizen.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Age</label>
                    <p className="text-gray-900">{selectedCitizen.age} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Region</label>
                    <p className="text-gray-900">{selectedCitizen.region}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Monthly Income</label>
                    <p className="text-gray-900">RM {selectedCitizen.monthlyIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dependents</label>
                    <p className="text-gray-900">{selectedCitizen.dependents}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Urgency Level</label>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 ${getUrgencyColor(selectedCitizen.urgencyLevel)} rounded-full`}></div>
                      <span className="text-gray-900">{selectedCitizen.urgencyLevel}/10</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Assigned Agent</label>
                    <p className="text-gray-900">{selectedCitizen.assignedAgent}</p>
                  </div>
                </div>
              </div>
              
              {/* Service Types */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Service Types</label>
                <div className="flex flex-wrap gap-2">
                  {selectedCitizen.serviceType.map((service, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Status and Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(selectedCitizen.status)}`}>
                    {selectedCitizen.status.charAt(0).toUpperCase() + selectedCitizen.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Registration Date</label>
                  <p className="text-gray-900">{selectedCitizen.registrationDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Contact</label>
                  <p className="text-gray-900">{selectedCitizen.lastContact}</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <FaPhone size={16} />
                  Contact Citizen
                </button>
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <FaWhatsapp size={16} />
                  Send WhatsApp
                </button>
                <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <FaFileAlt size={16} />
                  Update Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernmentServicesInterface;
