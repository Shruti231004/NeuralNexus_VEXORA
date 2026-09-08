'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  X,
  Sparkles,
  RefreshCw,
  Check,
  Zap,
  Sliders,
  Maximize2,
  Minimize2,
  ChevronRight,
  Smile,
  Palette,
  Scissors,
  CheckCircle2,
  Eye,
  CameraOff,
} from 'lucide-react';
import { INITIAL_SERVICES, INITIAL_STYLISTS } from '@/lib/mockData';
import { formatINR } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface VirtualStyleMirrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService?: (serviceId: string) => void;
}

interface StylePreset {
  id: string;
  name: string;
  category: 'hair_color' | 'haircut' | 'lip_tint' | 'glow';
  color: string;
  intensity: number;
  serviceId: string;
  tag: string;
  description: string;
}

const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'p1',
    name: 'French Balayage Melt',
    category: 'hair_color',
    color: 'rgba(212, 132, 100, 0.45)',
    intensity: 75,
    serviceId: 'c0000000-0000-0000-0000-000000000002',
    tag: 'Signature Paris Look',
    description: 'Subtle sun-kissed honey and rose-terracotta hand-painted ribbons.',
  },
  {
    id: 'p2',
    name: 'Platinum Ice Blonde',
    category: 'hair_color',
    color: 'rgba(240, 230, 220, 0.55)',
    intensity: 80,
    serviceId: 'c0000000-0000-0000-0000-000000000002',
    tag: 'Editorial High Tone',
    description: 'Ultra-clean cool champagne blonde with high-gloss reflex.',
  },
  {
    id: 'p3',
    name: 'Espresso Velvet Brunette',
    category: 'hair_color',
    color: 'rgba(56, 35, 25, 0.6)',
    intensity: 70,
    serviceId: 'c0000000-0000-0000-0000-000000000002',
    tag: 'Rich Radiance',
    description: 'Deep multidimensional dark mocha with glass-hair finish.',
  },
  {
    id: 'p4',
    name: 'Parisian Curtain Bangs & Layers',
    category: 'haircut',
    color: 'rgba(193, 120, 90, 0.3)',
    intensity: 60,
    serviceId: 'c0000000-0000-0000-0000-000000000001',
    tag: 'Face Framing',
    description: 'Cheekbone-grazing soft French bangs that accentuate jawline contour.',
  },
  {
    id: 'p5',
    name: 'French Textured Bob',
    category: 'haircut',
    color: 'rgba(140, 70, 44, 0.35)',
    intensity: 65,
    serviceId: 'c0000000-0000-0000-0000-000000000001',
    tag: 'Modern Classic',
    description: 'Effortless collarbone length blunt cut with interior movement.',
  },
  {
    id: 'p6',
    name: 'Rose & Rogue Crimson Lip Tint',
    category: 'lip_tint',
    color: 'rgba(163, 29, 58, 0.45)',
    intensity: 70,
    serviceId: 'c0000000-0000-0000-0000-000000000005',
    tag: 'Haute Glam',
    description: 'Velvet matte rose-wine tint with hydrating satin perimeter.',
  },
  {
    id: 'p7',
    name: 'Caviar Botanical Glow Filter',
    category: 'glow',
    color: 'rgba(255, 235, 200, 0.35)',
    intensity: 50,
    serviceId: 'c0000000-0000-0000-0000-000000000003',
    tag: 'Restorative Care',
    description: 'Instant micro-mist radiance and anti-fatigue studio illumination.',
  },
];

export const VirtualStyleMirrorModal: React.FC<VirtualStyleMirrorModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
}) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Filter & Try-On States
  const [activePreset, setActivePreset] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterIntensity, setFilterIntensity] = useState<number>(75);
  const [isAnalyzingFace, setIsAnalyzingFace] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [snapshotTaken, setSnapshotTaken] = useState<string | null>(null);

  // Simulated AI Diagnostics based on detected face landmarks
  const [detectedMetrics, setDetectedMetrics] = useState({
    faceShape: 'Oval-Diamond Harmonious',
    undertone: 'Warm Parisian Gold',
    hairTexture: 'Fine to Medium Wave',
    bestMatchScore: '98.4%',
    recommendedService: INITIAL_SERVICES[1], // Balayage
    recommendedStylist: INITIAL_STYLISTS[1], // Camille Laurent
  });

  // Start Camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
      runAiDiagnostics();
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Camera access was denied or not available. Running in Demo Simulation Mode.');
      setCameraActive(false);
      runAiDiagnostics();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setSnapshotTaken(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const runAiDiagnostics = () => {
    setIsAnalyzingFace(true);
    setTimeout(() => {
      setIsAnalyzingFace(false);
      setAnalysisComplete(true);
    }, 1800);
  };

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
        const dataUrl = canvas.toDataURL('image/png');
        setSnapshotTaken(dataUrl);
      }
    } else {
      // Fallback demo snapshot
      setSnapshotTaken('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800');
    }
  };

  const handleBookSelectedLook = (serviceId: string) => {
    onClose();
    if (onSelectService) {
      onSelectService(serviceId);
    } else {
      router.push(`/book?service=${serviceId}`);
    }
  };

  if (!isOpen) return null;

  const filteredPresets =
    activeCategory === 'all'
      ? STYLE_PRESETS
      : STYLE_PRESETS.filter((p) => p.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 bg-[#141110]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FAF6F0] dark:bg-[#181413] rounded-[36px] border-2 border-[#C1785A]/40 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden text-[#2C2725] dark:text-[#FAF6F0]">
        {/* TOP LUXURY HEADER */}
        <div className="bg-[#F3ECE3] dark:bg-[#201A18] px-6 py-4 border-b border-[#EAE3DA] dark:border-[#382E28] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C1785A] text-white flex items-center justify-center shadow-warm">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-extrabold text-lg sm:text-xl text-[#2C2725] dark:text-[#FAF6F0]">
                  Virtual Style &amp; Face Mirror
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F5E6DF] dark:bg-[#38251E] text-[#8C462C] dark:text-[#F2A585] text-[10px] font-mono font-bold uppercase tracking-wider animate-pulse">
                  ● AR Live Engine
                </span>
              </div>
              <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
                Real-time facial geometry detection, balayage simulation &amp; bespoke recommendations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6E6663] dark:text-[#B5ABA2] hover:bg-[#EAE3DA] dark:hover:bg-[#2C2420] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL WORKSPACE (2-COLUMN GRID) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* LEFT: LIVE AR WEBCAM VIEWPORT (7 COLS) */}
          <div className="lg:col-span-7 bg-[#110E0D] relative flex flex-col items-center justify-center min-h-[380px] lg:min-h-[480px] overflow-hidden p-4">
            {/* Live Video Feed */}
            {cameraActive ? (
              <div className="relative w-full h-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C1785A]/30">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />

                {/* AR Color & Glow Simulation Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-300 mix-blend-color"
                  style={{
                    backgroundColor: activePreset.color,
                    opacity: filterIntensity / 100,
                  }}
                />

                {/* Soft Vignette & Glow Aura */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(193,120,90,0.35)]" />

                {/* Facial Scanner Reticle Animation */}
                {isAnalyzingFace && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <div className="w-48 h-64 border-2 border-dashed border-[#C1785A] rounded-[48%] animate-pulse relative flex items-center justify-center">
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#C1785A] to-transparent absolute animate-bounce" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#FAF6F0] font-bold mt-4 bg-[#2C2725]/80 px-4 py-1.5 rounded-full border border-[#C1785A]">
                      Analyzing Face Shape &amp; Skin Undertone...
                    </span>
                  </div>
                )}

                {/* Live AR Active Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#1C1715]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C1785A]/40 text-[#FAF6F0] text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#C1785A] animate-ping" />
                  <span>Filtered: {activePreset.name}</span>
                </div>
              </div>
            ) : (
              /* Fallback Simulation Viewport */
              <div className="relative w-full h-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C1785A]/30 bg-[#241E1C] flex flex-col items-center justify-center text-center p-6">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
                  alt="Simulated Model"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.85]"
                />
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-300 mix-blend-color"
                  style={{
                    backgroundColor: activePreset.color,
                    opacity: filterIntensity / 100,
                  }}
                />
                <div className="relative z-10 bg-[#1C1715]/85 backdrop-blur-md p-4 rounded-2xl border border-[#C1785A]/40 max-w-xs space-y-2 text-[#FAF6F0]">
                  <CameraOff className="w-6 h-6 text-[#C1785A] mx-auto" />
                  <p className="text-xs font-semibold">
                    {cameraError || 'Simulation Mode Active'}
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-1.5 rounded-full bg-[#C1785A] text-white text-[11px] font-bold uppercase tracking-wider shadow-warm"
                  >
                    Allow Camera Feed
                  </button>
                </div>
              </div>
            )}

            {/* Hidden canvas for photo capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Control Bar */}
            <div className="w-full flex items-center justify-between gap-3 pt-3 max-w-lg">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={runAiDiagnostics}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#241E1C] hover:bg-[#332A26] border border-[#C1785A]/40 text-[#FAF6F0] text-xs font-bold transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C1785A]" />
                  <span>Re-Scan Face</span>
                </button>

                <button
                  type="button"
                  onClick={takeSnapshot}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#241E1C] hover:bg-[#332A26] border border-[#C1785A]/40 text-[#FAF6F0] text-xs font-bold transition-all shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                  <span>Snap Look</span>
                </button>
              </div>

              {/* Intensity Slider */}
              <div className="flex items-center gap-2 bg-[#241E1C] px-3 py-1.5 rounded-full border border-[#382E28]">
                <Sliders className="w-3.5 h-3.5 text-[#C1785A]" />
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={filterIntensity}
                  onChange={(e) => setFilterIntensity(Number(e.target.value))}
                  className="w-20 accent-[#C1785A] cursor-pointer"
                  title="Filter Intensity"
                />
                <span className="text-[10px] font-mono text-[#FAF6F0] font-bold">
                  {filterIntensity}%
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: STYLE PRESET SELECTOR & AI RECOMMENDATION CARD (5 COLS) */}
          <div className="lg:col-span-5 p-5 sm:p-6 space-y-5 bg-[#FAF6F0] dark:bg-[#181413] border-t lg:border-t-0 lg:border-l border-[#EAE3DA] dark:border-[#382E28] flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'All Styles' },
                  { id: 'hair_color', label: 'Hair Color' },
                  { id: 'haircut', label: 'Haircuts' },
                  { id: 'lip_tint', label: 'Lips & Tint' },
                  { id: 'glow', label: 'Luxe Glow' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      activeCategory === tab.id
                        ? 'bg-[#C1785A] text-white shadow-warm'
                        : 'bg-[#F3ECE3] dark:bg-[#241E1C] text-[#6E6663] dark:text-[#B5ABA2] hover:bg-[#EAE3DA]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Style Presets List */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {filteredPresets.map((preset) => {
                  const isSelected = activePreset.id === preset.id;
                  const matchingService = INITIAL_SERVICES.find((s) => s.id === preset.serviceId);

                  return (
                    <button
                      key={preset.id}
                      onClick={() => setActivePreset(preset)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#F5E6DF] dark:bg-[#38251E] border-[#C1785A] shadow-sm'
                          : 'bg-white dark:bg-[#201A18] border-[#EAE3DA] dark:border-[#332A26] hover:border-[#C1785A]/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-full border-2 border-white shadow-sm shrink-0"
                          style={{ backgroundColor: preset.color.replace(/0\.\d+/, '0.9') }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-xs sm:text-sm text-[#2C2725] dark:text-[#FAF6F0]">
                              {preset.name}
                            </span>
                            <span className="text-[9px] bg-[#EAE3DA] dark:bg-[#2C2420] text-[#8C462C] dark:text-[#F2A585] px-2 py-0.5 rounded-full font-bold uppercase">
                              {preset.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6E6663] dark:text-[#B5ABA2] line-clamp-1">
                            {preset.description}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#C1785A] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* AI FACE DIAGNOSTICS & ARTISAN MATCH */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F5E6DF] to-[#EAE3DA] dark:from-[#291F1B] dark:to-[#201A18] border border-[#E0D0C5] dark:border-[#3D2E27] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C1785A]" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C462C] dark:text-[#F2A585]">
                      AI Face &amp; Tone Diagnostics
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#C1785A] text-white text-[10px] font-mono font-bold">
                    {detectedMetrics.bestMatchScore} Match
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/70 dark:bg-[#181413]/70 p-2 rounded-xl border border-white/40 dark:border-[#382E28]">
                    <span className="text-[9px] uppercase text-[#6E6663] dark:text-[#B5ABA2] block font-bold">
                      Detected Geometry
                    </span>
                    <strong className="text-[#2C2725] dark:text-[#FAF6F0]">
                      {detectedMetrics.faceShape}
                    </strong>
                  </div>

                  <div className="bg-white/70 dark:bg-[#181413]/70 p-2 rounded-xl border border-white/40 dark:border-[#382E28]">
                    <span className="text-[9px] uppercase text-[#6E6663] dark:text-[#B5ABA2] block font-bold">
                      Skin Undertone
                    </span>
                    <strong className="text-[#2C2725] dark:text-[#FAF6F0]">
                      {detectedMetrics.undertone}
                    </strong>
                  </div>
                </div>

                <div className="text-[11px] text-[#4A423D] dark:text-[#CFC3B8] leading-relaxed">
                  💡 <strong>Stylist Note:</strong> Your facial structure harmonizes with warm Balayage and face-framing curtain layers. Recommended lead colorist: <strong>{detectedMetrics.recommendedStylist.name}</strong>.
                </div>
              </div>
            </div>

            {/* ACTION CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleBookSelectedLook(activePreset.serviceId)}
                className="w-full py-3.5 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-[0.18em] shadow-warm transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <Scissors className="w-4 h-4" />
                <span>Book This {activePreset.name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
