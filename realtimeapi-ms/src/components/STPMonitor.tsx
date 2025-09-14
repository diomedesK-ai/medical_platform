"use client";
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';

const STPMonitor: React.FC = () => {
  const [stpData, setStpData] = useState({
    overallRate: 78.5,
    documentsProcessed: 1245,
    avgProcessingTime: '2m 45s',
    exceptionRate: 21.5,
    pipeline: {
      received: { count: 1345, percentage: 100 },
      extracted: { count: 1247, percentage: 92.7 },
      validated: { count: 1139, percentage: 84.8 },
      routed: { count: 1029, percentage: 76.5 }
    }
  });

  const [documentTypes, setDocumentTypes] = useState([
    { type: 'Payroll', count: 356, rate: 85, color: 'bg-blue-500' },
    { type: 'Bank Statement', count: 289, rate: 72, color: 'bg-green-500' },
    { type: 'Misc', count: 178, rate: 91, color: 'bg-purple-500' },
    { type: 'Utility Bill', count: 245, rate: 76, color: 'bg-yellow-500' },
    { type: 'Loan Agreement', count: 177, rate: 65, color: 'bg-red-500' }
  ]);

  const [failures, setFailures] = useState([
    { type: 'Extraction Failures', count: 98, percentage: 8.3, reason: 'Poor image quality (65%)' },
    { type: 'Validation Failures', count: 108, percentage: 9.1, reason: 'Missing required fields (72%)' },
    { type: 'Routing Failures', count: 78, percentage: 7.4, reason: 'Policy violations (58%)' }
  ]);

  // Live data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStpData(prev => ({
        ...prev,
        overallRate: Math.max(75, Math.min(85, prev.overallRate + (Math.random() - 0.5) * 2)),
        documentsProcessed: prev.documentsProcessed + Math.floor(Math.random() * 3),
        pipeline: {
          received: { count: prev.pipeline.received.count + Math.floor(Math.random() * 3), percentage: 100 },
          extracted: { ...prev.pipeline.extracted, count: prev.pipeline.extracted.count + Math.floor(Math.random() * 2) },
          validated: { ...prev.pipeline.validated, count: prev.pipeline.validated.count + Math.floor(Math.random() * 2) },
          routed: { ...prev.pipeline.routed, count: prev.pipeline.routed.count + Math.floor(Math.random() * 2) }
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.close()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaArrowLeft className="text-gray-600" size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">STP Monitor</h1>
            <p className="text-sm text-gray-600">Visualize document processing pipeline and performance</p>
          </div>
          <div className="ml-auto">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Overall STP Rate</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light text-gray-900">{stpData.overallRate.toFixed(1)}%</span>
              <span className="text-sm text-gray-500">Documents automatically processed</span>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-black rounded-full h-2 transition-all duration-500" 
                style={{ width: `${stpData.overallRate}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Documents Processed</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light text-gray-900">{stpData.documentsProcessed.toLocaleString()}</span>
              <span className="text-sm text-green-600">Documents in the pipeline</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-green-600">Completed: 98</span>
              <span className="text-yellow-600">In Progress: 34</span>
              <span className="text-red-600">Failed: 12</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Average Processing Time</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light text-gray-900">{stpData.avgProcessingTime}</span>
              <span className="text-sm text-gray-500">Average time to complete</span>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 rounded-full h-2" style={{ width: '65%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Exception Rate</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light text-gray-900">{stpData.exceptionRate.toFixed(1)}%</span>
              <span className="text-sm text-gray-500">Documents requiring manual review</span>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 rounded-full h-2" style={{ width: `${stpData.exceptionRate}%` }}></div>
            </div>
          </div>
        </div>

        {/* Processing Pipeline */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Processing Pipeline</h2>
          <p className="text-sm text-gray-600 mb-6">Document flow through the STP process</p>
          
          <div className="grid grid-cols-4 gap-8">
            {[
              { name: 'Received', icon: FaCheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
              { name: 'Extracted', icon: FaCheckCircle, color: 'text-purple-600', bg: 'bg-purple-100' },
              { name: 'Validated', icon: FaClock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
              { name: 'Routed', icon: FaCheckCircle, color: 'text-green-600', bg: 'bg-green-100' }
            ].map((step, index) => {
              const pipelineKey = step.name.toLowerCase() as keyof typeof stpData.pipeline;
              const data = stpData.pipeline[pipelineKey];
              
              return (
                <div key={step.name} className="text-center">
                  <div className={`w-16 h-16 ${step.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <step.icon className={step.color} size={24} />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{step.name}</h3>
                  <p className="text-2xl font-light text-gray-900 mb-1">{data.percentage.toFixed(1)}%</p>
                  <p className="text-sm text-gray-500">{data.count.toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Document Type Breakdown */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">STP Rate by Document Type</h2>
            <p className="text-sm text-gray-600 mb-6">Success rate across different document categories</p>
            
            <div className="space-y-4">
              {documentTypes.map((doc) => (
                <div key={doc.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 ${doc.color} rounded`}></div>
                    <span className="text-sm font-medium text-gray-900">{doc.type}</span>
                    <span className="text-sm text-gray-500">{doc.count} documents</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{doc.rate}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Failure Analysis */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Drop-off Analysis</h2>
            
            <div className="space-y-4">
              {failures.map((failure, index) => (
                <div key={failure.type} className="border-l-4 border-yellow-400 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FaExclamationTriangle className="text-yellow-500" size={14} />
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

            {/* LLM Insights Section */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-3">AI-powered Analysis of Processing Bottlenecks</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Processing Optimization</h4>
                  <p className="text-blue-700">Based on the current pipeline analysis, here are the key bottlenecks and recommended optimizations:</p>
                  <ul className="list-disc list-inside text-blue-600 mt-2 space-y-1">
                    <li>Loan Application validation failures (58%)</li>
                    <li>Recommendation: Add specific extraction rules for 3 new formats from local banks.</li>
                    <li>Bank Statement extraction issues (28%)</li>
                    <li>Recommendation: Add specific extraction rules for 3 new formats from local banks.</li>
                    <li>Processing time spike during 2-4 PM</li>
                    <li>Recommendation: Adjust resource allocation to handle the afternoon submission peak.</li>
                  </ul>
                </div>
                
                <div className="border-t border-blue-200 pt-3">
                  <h4 className="font-medium text-blue-800 mb-1">Flow Optimization</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-blue-600 mb-1">Current Flow</p>
                      <div className="space-y-1 text-xs text-blue-700">
                        <div>1. Document receipt and classification</div>
                        <div>2. OCR data extraction</div>
                        <div>3. Field validation against rules</div>
                        <div>4. Manual review for exceptions</div>
                        <div>5. Routing to downstream systems</div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 mb-1">Optimized Flow</p>
                      <div className="space-y-1 text-xs text-blue-700">
                        <div>Current Processing State:</div>
                        <div>• Document receipt and classification</div>
                        <div>• OCR and intelligent extraction</div>
                        <div>• Field validation against rules</div>
                        <div>• Manual review for exceptions</div>
                        <div>• Routing to downstream systems</div>
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
  );
};

export default STPMonitor;
