import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaHeartbeat, FaPaperPlane } from 'react-icons/fa';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface LifeSignalsVitalsProps {
  onClose: () => void;
}

const LifeSignalsVitals: React.FC<LifeSignalsVitalsProps> = ({ onClose }) => {
  // Markdown renderer function
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #f97316;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gm, '<span style="color: #f97316;">•</span> $1')
      .replace(/\n/g, '<br />');
  };
  const [heartRate, setHeartRate] = useState(72);
  const [heartRate2, setHeartRate2] = useState(75);
  const [spO2, setSpO2] = useState(98);
  const [respiratoryRate, setRespiratoryRate] = useState(19);
  const [bloodPressure, setBloodPressure] = useState({ systolic: 116, diastolic: 78 });
  const [bodyTemp, setBodyTemp] = useState(94.6);
  const [patientPosture, setPatientPosture] = useState<'sitting' | 'standing' | 'lying'>('sitting');
  const [ecgData, setEcgData] = useState<number[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to Vital Chat! You can ask questions like:\n\n• "@cardio what do you see in these vitals?"\n• "@triage is this patient stable?"\n• "@ambulance patient needs transport"\n• "@lab run blood work analysis"\n\nHow can I assist you today?', timestamp: '2:30 PM' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Generate follow-up agent responses
  const generateFollowUpAgentResponses = (originalMessage: string) => {
    const responses: { agent: string; message: string; delay: number }[] = [];

    // Check for @dispatch calls
    if (originalMessage.includes('@dispatch') && originalMessage.includes('@lab')) {
      responses.push({
        agent: '@dispatch',
        message: '@dispatch here - Received the request from @lab. Let me prepare the LifeSignals patch order... \n\nChecking inventory and patient location... Order being processed.',
        delay: 1000
      });
      responses.push({
        agent: '@dispatch',
        message: '@dispatch update - LifeSignals patch order confirmed! Dispatching via FedEx to patient address. Tracking number: FX789012345. ETA: 24-48 hours. @lab, your equipment request is handled!',
        delay: 4000
      });
    }

    // Check for @cardio calls from @triage
    if (originalMessage.includes('@triage') && originalMessage.includes('@cardio')) {
      responses.push({
        agent: '@triage',
        message: '@triage responding - Reviewing patient vitals and symptoms... Assessing priority level based on cardiac indicators.',
        delay: 1500
      });
      responses.push({
        agent: '@triage',
        message: '@triage assessment complete - This is Priority 2. Cardiac monitoring required but not immediately life-threatening. @cardio, please proceed with standard cardiac evaluation protocol.',
        delay: 3500
      });
    }

    // Check for @ambulance calls
    if (originalMessage.includes('@ambulance')) {
      responses.push({
        agent: '@ambulance',
        message: '@ambulance dispatch - Unit received alert. Checking nearest available ambulance... Preparing for potential transport.',
        delay: 2000
      });
      responses.push({
        agent: '@ambulance',
        message: '@ambulance ready - Unit 5 is on standby at 2-minute response time. Medical equipment checked and crew briefed. Standing by for transport order.',
        delay: 5000
      });
    }

    // Execute the responses with delays
    responses.forEach(response => {
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: response.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, response.delay);
    });
  };

  // Vital signs simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(prev => prev + (Math.random() - 0.5) * 4);
      setHeartRate2(prev => prev + (Math.random() - 0.5) * 3);
      setSpO2(prev => Math.max(90, Math.min(100, prev + (Math.random() - 0.5) * 2)));
      setRespiratoryRate(prev => Math.max(12, Math.min(25, prev + (Math.random() - 0.5) * 2)));
      setBloodPressure(prev => ({
        systolic: Math.max(90, Math.min(160, prev.systolic + (Math.random() - 0.5) * 6)),
        diastolic: Math.max(60, Math.min(100, prev.diastolic + (Math.random() - 0.5) * 4))
      }));
      setBodyTemp(prev => Math.max(94, Math.min(102, prev + (Math.random() - 0.5) * 0.4)));
      
      // Randomly change patient posture
      if (Math.random() < 0.1) {
        const postures: ('sitting' | 'standing' | 'lying')[] = ['sitting', 'standing', 'lying'];
        setPatientPosture(postures[Math.floor(Math.random() * postures.length)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ECG Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const scrollOffset = 0;

    // Proper ECG heartbeat function
    const generateECGPoint = (time: number) => {
      const beatsPerSecond = heartRate / 60;
      const beatTime = time * beatsPerSecond;
      const cycle = beatTime % 1; // 0 to 1 for each heartbeat
      
      let amplitude = 0;
      
      // Classic ECG pattern: mostly flat with sharp heartbeat spikes
      if (cycle >= 0.2 && cycle <= 0.25) {
        // Sharp QRS spike (main heartbeat) - very narrow and tall
        const spikePos = (cycle - 0.2) / 0.05; // 0 to 1 over the spike
        if (spikePos < 0.3) {
          // Q wave (small dip)
          amplitude = -0.2;
        } else if (spikePos < 0.7) {
          // R wave (tall spike)
          amplitude = 1.8;
        } else {
          // S wave (small dip)
          amplitude = -0.4;
        }
      } else if (cycle >= 0.05 && cycle <= 0.12) {
        // Small P wave
        amplitude = 0.15;
      } else if (cycle >= 0.35 && cycle <= 0.5) {
        // T wave
        amplitude = 0.25;
      } else {
        // Flat baseline (most of the time)
        amplitude = 0;
      }
      
      return amplitude;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid lines first (like real ECG monitors)
      ctx.strokeStyle = '#003300';
      ctx.lineWidth = 0.5;
      
      // Horizontal grid lines
      for (let y = 0; y < canvas.height; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Vertical grid lines
      for (let x = 0; x < canvas.width; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Draw ECG waveform
      ctx.strokeStyle = '#00ff41';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Draw continuous scrolling ECG waveform
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Draw ECG across full canvas width with continuous scrolling
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        // Calculate time for this pixel position - continuous scrolling
        const pixelTime = time + (x * 0.01);
        const ecgValue = generateECGPoint(pixelTime);
        const y = canvas.height / 2 - ecgValue * 50; // Better amplitude
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      
      time += 0.05; // Faster scroll to see continuous movement
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [heartRate, heartRate2]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setChatInput('');

    try {
      const medicalPrompt = `You are part of a collaborative medical AI team monitoring patient vitals in real-time. Current vital signs:
- Heart Rate: ${Math.round(heartRate)} BPM
- SpO2: ${Math.round(spO2)}%
- Blood Pressure: ${Math.round(bloodPressure.systolic)}/${Math.round(bloodPressure.diastolic)} mmHg
- Body Temperature: ${bodyTemp.toFixed(1)}°F
- Respiratory Rate: ${Math.round(respiratoryRate)} BPM
- Patient Posture: ${patientPosture}

COLLABORATIVE MEDICAL TEAM BEHAVIOR:
- Work as a team - hand off tasks to appropriate specialists
- If a request is outside your scope, call the right agent to help
- Confirm actions and provide status updates
- Be proactive and solution-oriented

AGENT ROLES & HANDOFFS:
- @cardio: Cardiac assessment, ECG analysis, heart conditions
- @triage: Emergency priority, patient routing, critical decisions
- @ambulance: Transport coordination, emergency dispatch
- @lab: Laboratory tests, but calls @dispatch for equipment/supplies
- @dispatch: Equipment ordering, supply management, logistics
- @radiology: Imaging orders and interpretation

MULTI-AGENT COLLABORATION:
When agents need to collaborate, respond as the FIRST agent only, then the system will automatically create follow-up agent responses.

EXAMPLE - @lab equipment request:
"@lab here - I'll handle the blood work for these vitals, but I need to get @dispatch for that LifeSignals patch equipment. 

@dispatch, can you please prepare an additional LifeSignals patch order for patient 12345's location? I'll need confirmation once you have the logistics ready.

Working on the lab analysis now..."

REALISTIC AGENT BEHAVIOR:
- Respond as ONE agent at a time
- Mention what you're preparing/working on
- Reference other agents but don't speak for them
- Use realistic medical workflows and timing
- Show work in progress, not instant completion

Query: ${chatInput}`;
      
      const response = await fetch('/api/openai-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: medicalPrompt
        })
      });

      if (response.ok) {
        // Handle response - try to get as text and parse the JSON
        const responseText = await response.text();
        console.log('Raw response text:', responseText);
        
        try {
          const parsed = JSON.parse(responseText);
          console.log('Parsed response:', parsed);
          
          let content = '';
          
          // Handle the complex response format we saw earlier
          if (parsed.output && parsed.output[0] && parsed.output[0].content && parsed.output[0].content[0] && parsed.output[0].content[0].text) {
            content = parsed.output[0].content[0].text;
            console.log('Found text in output path:', content);
          } else if (parsed.choices && parsed.choices[0] && parsed.choices[0].message && parsed.choices[0].message.content) {
            content = parsed.choices[0].message.content;
            console.log('Found text in choices path:', content);
          } else if (parsed.content) {
            content = parsed.content;
            console.log('Found text in content path:', content);
          } else {
            content = responseText;
            console.log('Using raw response text:', content);
          }
          
          console.log('Extracted content:', content);
          console.log('Content length:', content.length);
          
          if (!content || content.trim().length === 0) {
            console.error('No content extracted, full response:', parsed);
            content = 'Response received but could not extract content. Check console for details.';
          }
          
          setChatMessages(prev => [...prev, {
            role: 'assistant',
            content: content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);

          // Check if this message calls other agents and generate follow-up responses
          setTimeout(() => {
            generateFollowUpAgentResponses(content);
          }, 2000); // 2 second delay for realistic timing
        } catch (e) {
          console.error('JSON parsing error:', e);
          // If it's not JSON, use the raw text
          setChatMessages(prev => [...prev, {
            role: 'assistant',
            content: responseText || 'Sorry, there was an error processing your request.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(12px)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
             width: '2100px',
        height: '1100px',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(16px)',
        borderRadius: '8px',
        boxShadow: '0 0 40px rgba(59, 130, 246, 0.3), 0 0 80px rgba(147, 51, 234, 0.2), 0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'rgba(243, 244, 246, 0.9)',
          backdropFilter: 'blur(8px)',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(209, 213, 219, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))',
              backdropFilter: 'blur(4px)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.4), 0 0 30px rgba(147, 51, 234, 0.3)'
            }}>
              <FaHeartbeat size={18} style={{ color: 'white' }} />
            </div>
            <div>
              <h2 style={{ color: '#1f2937', fontSize: '20px', fontWeight: '600', margin: 0 }}>Patient Monitor - AKPIY</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>FDA Approved</span>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>Live Monitoring Active</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{
              padding: '6px 12px',
              backgroundColor: 'white',
              border: '1px solid #3b82f6',
              color: '#3b82f6',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer'
            }}>ALERTS</button>
            <button style={{
              padding: '6px 12px',
              backgroundColor: 'white',
              border: '1px solid #10b981',
              color: '#10b981',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer'
            }}>STABLE</button>
            <button style={{
              padding: '6px 12px',
              backgroundColor: 'white',
              border: '1px solid #3b82f6',
              color: '#3b82f6',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer'
            }}>TRENDS</button>
            <button style={{
              padding: '6px 12px',
              backgroundColor: 'white',
              border: '1px solid #ef4444',
              color: '#dc2626',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer'
            }}>STOP MONITORING</button>
            <button onClick={onClose} style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer'
            }}>
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* ECG and Vitals */}
        <div style={{ padding: '8px', paddingBottom: '0' }}>
          {/* ECG Display */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(4px)',
            borderRadius: '8px',
            padding: '8px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            marginBottom: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg style={{ width: '16px', height: '16px', stroke: 'black', strokeWidth: '2', fill: 'none' }} viewBox="0 0 24 24">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <span style={{ color: '#111827', fontWeight: '600', fontSize: '16px' }}>ECG Monitor</span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Lead II • Live Feed</div>
            </div>
            <div style={{ backgroundColor: 'black', borderRadius: '8px', padding: '8px', height: '128px' }}>
              <canvas 
                ref={canvasRef} 
                width={1000} 
                height={120}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>

          {/* Vital Signs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginBottom: '12px' }}>
            {/* Heart Rate */}
            <div style={{
              backgroundColor: '#000000',
              backdropFilter: 'blur(4px)',
              borderRadius: '12px',
              padding: '16px 8px',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
              minHeight: '110px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg style={{ width: '16px', height: '16px', stroke: 'white', strokeWidth: '2', fill: 'none' }} viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>Heart Rate</span>
              </div>
              <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '45px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>{Math.round(heartRate)}</div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>BPM</div>
              </div>
              {/* Status Line */}
              <div style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '60px',
                backgroundColor: heartRate >= 60 && heartRate <= 100 ? '#10b981' : '#ef4444',
                borderRadius: '2px'
              }}></div>
            </div>

            {/* SpO2 */}
            <div style={{
              backgroundColor: '#000000',
              backdropFilter: 'blur(4px)',
              borderRadius: '12px',
              padding: '16px 8px',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
              minHeight: '110px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg style={{ width: '16px', height: '16px', stroke: 'white', strokeWidth: '2', fill: 'none' }} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>SpO2</span>
              </div>
              <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '45px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>{Math.round(spO2)}</div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>%</div>
              </div>
              {/* Status Line */}
              <div style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '60px',
                backgroundColor: spO2 >= 95 ? '#10b981' : '#ef4444',
                borderRadius: '2px'
              }}></div>
            </div>

            {/* Blood Pressure */}
            <div style={{
              backgroundColor: '#000000',
              backdropFilter: 'blur(4px)',
              borderRadius: '12px',
              padding: '16px 8px',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
              minHeight: '110px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg style={{ width: '16px', height: '16px', stroke: 'white', strokeWidth: '2', fill: 'none' }} viewBox="0 0 24 24">
                  <path d="M12 2v20M2 12h20" />
                </svg>
                <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>Blood Pressure</span>
              </div>
              <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '45px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>{Math.round(bloodPressure.systolic)}/{Math.round(bloodPressure.diastolic)}</div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>mmHg</div>
              </div>
              {/* Status Line */}
              <div style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '60px',
                backgroundColor: bloodPressure.systolic <= 140 && bloodPressure.diastolic <= 90 ? '#10b981' : '#ef4444',
                borderRadius: '2px'
              }}></div>
            </div>

            {/* Temperature */}
            <div style={{
              backgroundColor: '#000000',
              backdropFilter: 'blur(4px)',
              borderRadius: '12px',
              padding: '16px 8px',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
              minHeight: '110px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg style={{ width: '16px', height: '16px', stroke: 'white', strokeWidth: '2', fill: 'none' }} viewBox="0 0 24 24">
                  <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
                </svg>
                <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>Temperature</span>
              </div>
              <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '45px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>{bodyTemp.toFixed(1)}</div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>°F</div>
              </div>
              {/* Status Line */}
              <div style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '60px',
                backgroundColor: bodyTemp >= 96.8 && bodyTemp <= 99.5 ? '#10b981' : '#ef4444',
                borderRadius: '2px'
              }}></div>
            </div>

            {/* Respiratory */}
            <div style={{
              backgroundColor: '#000000',
              backdropFilter: 'blur(4px)',
              borderRadius: '12px',
              padding: '16px 8px',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
              minHeight: '110px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg style={{ width: '16px', height: '16px', stroke: 'white', strokeWidth: '2', fill: 'none' }} viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>Respiratory</span>
              </div>
              <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '45px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>{Math.round(respiratoryRate)}</div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>BPM</div>
              </div>
              {/* Status Line */}
              <div style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '60px',
                backgroundColor: respiratoryRate >= 12 && respiratoryRate <= 20 ? '#10b981' : '#ef4444',
                borderRadius: '2px'
              }}></div>
            </div>

            {/* Patient Posture */}
            <div style={{
              backgroundColor: '#000000',
              backdropFilter: 'blur(4px)',
              borderRadius: '12px',
              padding: '16px 8px',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
              minHeight: '110px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg style={{ width: '16px', height: '16px', stroke: 'white', strokeWidth: '2', fill: 'none' }} viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>Patient Posture</span>
              </div>
              <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px', textTransform: 'capitalize' }}>{patientPosture}</div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>Position</div>
              </div>
              {/* Status Line - Always blue for posture */}
              <div style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '60px',
                backgroundColor: '#3b82f6',
                borderRadius: '2px'
              }}></div>
            </div>
          </div>

        </div>

        {/* Chat Section - FRAMED LIKE CARDS */}
        <div style={{ padding: '12px', paddingTop: '0' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            height: '650px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}>
          {/* Chat Header */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px 12px 0 0'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg style={{ width: '16px', height: '16px', stroke: 'black', strokeWidth: '2', fill: 'none' }} viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.436L3 21l2.436-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
                <h3 style={{ color: '#111827', fontWeight: '600', fontSize: '16px', margin: 0 }}>Vital Chat</h3>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>• Consult with specialists about patient vitals</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#6b7280', paddingLeft: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                  <span style={{ fontWeight: '500' }}>@cardio</span> - Cardiac specialist
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                  <span style={{ fontWeight: '500' }}>@triage</span> - Emergency assessment
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                  <span style={{ fontWeight: '500' }}>@ambulance</span> - Emergency dispatch
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                  <span style={{ fontWeight: '500' }}>@lab</span> - Laboratory analysis
                </div>
              </div>
            </div>
          </div>
          
          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px',
            paddingBottom: '60px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {chatMessages.map((message, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  backgroundColor: message.role === 'user' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(59, 130, 246, 0.08)',
                  backdropFilter: 'blur(8px)',
                  color: message.role === 'user' ? '#1f2937' : '#1e40af',
                  border: message.role === 'user' ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(59, 130, 246, 0.2)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  <div 
                    style={{ fontSize: '14px', margin: 0, whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                  />
                  {message.timestamp && (
                    <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px', margin: '4px 0 0 0' }}>{message.timestamp}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.04)',
                  backdropFilter: 'blur(8px)',
                  color: '#1e40af',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%', animation: 'bounce 1.4s ease-in-out infinite' }}></div>
                      <div style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%', animation: 'bounce 1.4s ease-in-out infinite', animationDelay: '0.16s' }}></div>
                      <div style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%', animation: 'bounce 1.4s ease-in-out infinite', animationDelay: '0.32s' }}></div>
                    </div>
                    <span style={{ fontSize: '14px' }}>Medical specialist responding...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area - ABSOLUTE BOTTOM WITH NO PADDING */}
          <div style={{
            position: 'absolute',
            bottom: '0px',
            left: '0px', 
            right: '0px',
            padding: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            borderRadius: '0 0 12px 12px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="@cardio what do you see? @ambulance dispatch needed?"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || loading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  opacity: (!chatInput.trim() || loading) ? 0.5 : 1
                }}
              >
                <FaPaperPlane size={12} />
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LifeSignalsVitals;