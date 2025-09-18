"use client";
import React, { useRef, useState } from 'react';
import { FaChevronDown, FaPlay, FaTimes } from 'react-icons/fa';
import Image from 'next/image';

interface HospitalImageAnalysisProps {
  onAnalysisComplete?: (analysis: string) => void;
}

export default function HospitalImageAnalysis({ onAnalysisComplete }: HospitalImageAnalysisProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const defaultPrompt = 'Describe medically this image without interpretation. List what you observe: anatomical structures visible, contrast patterns, densities, shapes, sizes, and locations. Use medical terminology to describe the visual elements present.';

  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Handle bold text
        const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-orange-300">$1</strong>');
        
        // Handle bullet points
        if (line.trim().startsWith('- ')) {
          return (
            <div key={index} className="flex items-start gap-2 mb-1">
              <span className="text-orange-300 mt-1">•</span>
              <span dangerouslySetInnerHTML={{ __html: boldText.replace('- ', '') }} />
            </div>
          );
        }
        
        // Regular lines
        if (line.trim()) {
          return (
            <div key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: boldText }} />
          );
        }
        
        return <div key={index} className="h-2" />; // Empty line spacing
      });
  };
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imageUrl) return;
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: defaultPrompt, image: imageUrl, stream: true })
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setOutput(data?.output_text || 'No output.');
      } else {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let finalOutput = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) {
            finalOutput += chunk;
            setOutput(prev => prev + chunk);
          }
        }
        // Auto-pass analysis to chat when complete
        if (finalOutput && onAnalysisComplete) {
          onAnalysisComplete(`**🔬 Medical Image Analysis Results:**\n\n${finalOutput}\n\n**What would you like me to do with these findings?** (Try: "@rad order an MRI" or "@cardio assess cardiac risk")`);
        }
      }
    } catch (e: any) {
      setOutput('Error: ' + (e?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-gray-900">Medical Image Analysis</div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <FaChevronDown 
            size={12} 
            style={{ 
              transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.2s ease'
            }} 
          />
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-2">Input Image</div>
              <div
                className="relative h-56 bg-gray-950/90 rounded-xl flex items-center justify-center overflow-hidden border cursor-pointer"
                style={{
                  boxShadow:
                    '0 0 20px rgba(99,102,241,0.25), 0 0 40px rgba(168,85,247,0.2)'
                }}
                onClick={() => fileRef.current?.click()}
              >
                <div className="pointer-events-none absolute inset-0 rounded-xl"
                     style={{
                       background:
                         'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(168,85,247,0.2))',
                       mixBlendMode: 'overlay'
                     }}
                />
                {imageUrl ? (
                  <Image 
                    src={imageUrl} 
                    alt="Medical image for analysis" 
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="text-gray-300 text-xs">Upload a medical image (PNG/JPG/GIF)</div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
              
              {/* Control buttons - only show when image is present */}
              {imageUrl && (
                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={analyze}
                    disabled={loading}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-40"
                    title="Analyze Image"
                  >
                    <FaPlay size={10} />
                  </button>
                  <button
                    onClick={() => setImageUrl(null)}
                    className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                    title="Remove Image"
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-2">Analysis Results</div>
              <div
                className="relative h-56 bg-gray-950/90 rounded-xl border"
                style={{
                  boxShadow: '0 0 20px rgba(99,102,241,0.25), 0 0 40px rgba(168,85,247,0.2)'
                }}
              >
                <div className="pointer-events-none absolute inset-0 rounded-xl"
                     style={{
                       background:
                         'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(168,85,247,0.2))',
                       mixBlendMode: 'overlay'
                     }}
                />
                <div className="relative z-10 h-full p-3 overflow-y-auto text-xs text-white leading-relaxed">
                  {output ? (
                    <div className="space-y-1">
                      {renderMarkdown(output)}
                    </div>
                  ) : (
                    <div className="text-gray-300 text-xs">No analysis yet. Upload an image and click the play button.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


