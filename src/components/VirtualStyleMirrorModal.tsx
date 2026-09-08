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
  ChevronRight,
  Smile,
  Palette,
  Scissors,
  CheckCircle2,
  CameraOff,
  Upload,
  Download,
  RotateCcw,
  Sparkle,
} from 'lucide-react';
import { INITIAL_SERVICES, INITIAL_STYLISTS } from '@/lib/mockData';
import { formatINR } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { playChime } from '@/lib/soundEffects';

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
  cssFilter: string;
  serviceId: string;
  tag: string;
  description: string;
  accent: string;
}

const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'p1',
    name: 'French Balayage Melt',
    category: 'hair_color',
    color: '#D48464',
    cssFilter: 'sepia(0.35) saturate(1.4) hue-rotate(-10deg) contrast(1.05)',
    serviceId: 'c0000000-0000-0000-0000-000000000002',
    tag: 'Signature Paris Look',
    description: 'Subtle sun-kissed honey and rose-terracotta hand-painted ribbons.',
    accent: 'from-[#D48464] to-[#8C462C]',
  },
  {
    id: 'p2',
    name: 'Platinum Ice Blonde',
    category: 'hair_color',
    color: '#E8DED1',
    cssFilter: 'brightness(1.15) contrast(1.1) saturate(0.85) hue-rotate(180deg)',
    serviceId: 'c0000000-0000-0000-0000-000000000002',
    tag: 'Editorial High Tone',
    description: 'Ultra-clean cool champagne blonde with high-gloss reflex.',
    accent: 'from-[#F5EFE6] to-[#D5C7B5]',
  },
  {
    id: 'p3',
    name: 'Espresso Velvet Brunette',
    category: 'hair_color',
    color: '#382319',
    cssFilter: 'contrast(1.2) brightness(0.92) saturate(1.2)',
    serviceId: 'c0000000-0000-0000-0000-000000000002',
    tag: 'Rich Radiance',
    description: 'Deep multidimensional dark mocha with glass-hair finish.',
    accent: 'from-[#4D3224] to-[#1C120C]',
  },
  {
    id: 'p4',
    name: 'Parisian Curtain Bangs & Layers',
    category: 'haircut',
    color: '#C1785A',
    cssFilter: 'contrast(1.08) saturate(1.15)',
    serviceId: 'c0000000-0000-0000-0000-000000000001',
    tag: 'Face Framing',
    description: 'Cheekbone-grazing soft French bangs that accentuate jawline contour.',
    accent: 'from-[#C1785A] to-[#8C462C]',
  },
  {
    id: 'p5',
    name: 'French Textured Bob',
    category: 'haircut',
    color: '#8C462C',
    cssFilter: 'contrast(1.12) brightness(1.02)',
    serviceId: 'c0000000-0000-0000-0000-000000000001',
    tag: 'Modern Classic',
    description: 'Effortless collarbone length blunt cut with interior movement.',
    accent: 'from-[#8C462C] to-[#5C2B19]',
  },
  {
    id: 'p6',
    name: 'Rose & Rogue Crimson Lip Tint',
    category: 'lip_tint',
    color: '#A31D3A',
    cssFilter: 'saturate(1.3) contrast(1.08)',
    serviceId: 'c0000000-0000-0000-0000-000000000005',
    tag: 'Haute Glam',
    description: 'Velvet matte rose-wine tint with hydrating satin perimeter.',
    accent: 'from-[#A31D3A] to-[#630E21]',
  },
  {
    id: 'p7',
    name: 'Caviar Botanical Glow Filter',
    category: 'glow',
    color: '#F2A585',
    cssFilter: 'brightness(1.12) saturate(1.25) contrast(1.05)',
    serviceId: 'c0000000-0000-0000-0000-000000000003',
    tag: 'Restorative Care',
    description: 'Instant micro-mist radiance and anti-fatigue studio illumination.',
    accent: 'from-[#FFE8D6] to-[#F2A585]',
  },
];

const SAMPLE_MODELS = [
  {
    id: 'm1',
    name: 'Live Webcam',
    img: '',
    isCamera: true,
  },
  {
    id: 'm2',
    name: 'Model Camille',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    isCamera: false,
  },
  {
    id: 'm3',
    name: 'Model Chloe',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
    isCamera: false,
  },
  {
    id: 'm4',
    name: 'Model Julien (Men)',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    isCamera: false,
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string>('m1');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Filter & Try-On States
  const [activePreset, setActivePreset] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterIntensity, setFilterIntensity] = useState<number>(80);
  const [isAnalyzingFace, setIsAnalyzingFace] = useState<boolean>(false);
  const [snapshotCaptured, setSnapshotCaptured] = useState<string | null>(null);

  // Simulated AI Diagnostics
  const [detectedMetrics, setDetectedMetrics] = useState({
    faceShape: 'Oval-Diamond Harmonious',
    undertone: 'Warm Parisian Gold',
    hairTexture: 'Fine to Medium Wave',
    bestMatchScore: '98.4%',
    recommendedService: INITIAL_SERVICES[1],
    recommendedStylist: INITIAL_STYLISTS[1],
  });

  // Start Camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      setActiveModel('m1');
      setUploadedImage(null);

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        setStream(mediaStream);
        setCameraActive(true);
        runAiDiagnostics();
      } else {
        throw new Error('getUserMedia not supported in this browser.');
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. You can select a sample model or upload your photo below.'
          : 'Camera device unavailable. Using high-resolution model simulation.'
      );
      setCameraActive(false);
      setActiveModel('m2'); // Fallback to sample model
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

  // Wire stream to video element on change
  useEffect(() => {
    if (isOpen && activeModel === 'm1') {
      startCamera();
    } else if (!isOpen) {
      stopCamera();
      setSnapshotCaptured(null);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  useEffect(() => {
    if (videoRef.current && stream && activeModel === 'm1') {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => console.log('Video play error:', err));
    }
  }, [stream, activeModel, isOpen]);

  const runAiDiagnostics = () => {
    setIsAnalyzingFace(true);
    playChime('notification');
    setTimeout(() => {
      setIsAnalyzingFace(false);
    }, 1500);
  };

  const handleCaptureSnapshot = () => {
    playChime('bell');

    if (activeModel === 'm1' && videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.filter = activePreset.cssFilter;
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
        const dataUrl = canvas.toDataURL('image/png');
        setSnapshotCaptured(dataUrl);
      }
    } else {
      const currentImg = uploadedImage || (SAMPLE_MODELS.find((m) => m.id === activeModel)?.img) || SAMPLE_MODELS[1].img;
      setSnapshotCaptured(currentImg);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
          setActiveModel('upload');
          runAiDiagnostics();
        }
      };
      reader.readAsDataURL(file);
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

  const currentDisplayImage =
    activeModel === 'upload'
      ? uploadedImage
      : SAMPLE_MODELS.find((m) => m.id === activeModel)?.img;

  return (
    <div className="fixed inset-0 z-50 bg-[#141110]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
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

        {/* MODAL WORKSPACE */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* LEFT: LIVE AR WEBCAM / PHOTO VIEWPORT (7 COLS) */}
          <div className="lg:col-span-7 bg-[#110E0D] relative flex flex-col items-center justify-between min-h-[420px] lg:min-h-[500px] p-4 sm:p-5">
            {/* Viewport Frame */}
            <div className="relative w-full flex-1 max-w-lg rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C1785A]/40 bg-[#1C1715] flex items-center justify-center">
              {/* 1. Live Video Stream */}
              {activeModel === 'm1' && cameraActive ? (
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={() => videoRef.current?.play()}
                    className="w-full h-full object-cover transform -scale-x-100 transition-all duration-300"
                    style={{
                      filter: activePreset.cssFilter,
                    }}
                  />

                  {/* Soft Color Wash Accent */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-all duration-300 mix-blend-soft-light"
                    style={{
                      backgroundColor: activePreset.color,
                      opacity: (filterIntensity / 100) * 0.6,
                    }}
                  />
                </div>
              ) : (
                /* 2. Photo / Model Simulator Viewport */
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                  <img
                    src={currentDisplayImage || SAMPLE_MODELS[1].img}
                    alt="Active Preview"
                    className="w-full h-full object-cover transition-all duration-300"
                    style={{
                      filter: activePreset.cssFilter,
                    }}
                  />

                  {/* Soft Color Wash Accent */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-all duration-300 mix-blend-soft-light"
                    style={{
                      backgroundColor: activePreset.color,
                      opacity: (filterIntensity / 100) * 0.6,
                    }}
                  />
                </div>
              )}

              {/* Facial Scanner Reticle Animation */}
              {isAnalyzingFace && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px] z-20">
                  <div className="w-48 h-64 border-2 border-dashed border-[#C1785A] rounded-[48%] animate-pulse relative flex items-center justify-center shadow-[0_0_30px_rgba(193,120,90,0.5)]">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#C1785A] to-transparent absolute animate-bounce" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#FAF6F0] font-bold mt-4 bg-[#2C2725]/90 px-4 py-1.5 rounded-full border border-[#C1785A]">
                    Scanning Face Shape &amp; Undertone...
                  </span>
                </div>
              )}

              {/* Live AR Active Badge */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-[#1C1715]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C1785A]/50 text-[#FAF6F0] text-[11px] font-bold shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#C1785A] animate-ping" />
                <span>Look: {activePreset.name}</span>
              </div>

              {/* Snapshot Thumbnail Preview if taken */}
              {snapshotCaptured && (
                <div className="absolute bottom-3 right-3 z-20 bg-[#1C1715]/90 p-1.5 rounded-2xl border border-[#C1785A] shadow-xl animate-fadeIn flex items-center gap-2">
                  <img
                    src={snapshotCaptured}
                    alt="Captured look"
                    className="w-12 h-12 rounded-xl object-cover border border-[#C1785A]/60"
                  />
                  <div className="pr-2 text-left">
                    <span className="text-[10px] text-emerald-400 font-bold block">✓ Look Saved</span>
                    <a
                      href={snapshotCaptured}
                      download="rose-and-rogue-style.png"
                      className="text-[10px] text-[#FAF6F0] hover:text-[#C1785A] underline font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Download
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden canvas for capture & file input for upload */}
            <canvas ref={canvasRef} className="hidden" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Viewport Control Bar & Input Source Switcher */}
            <div className="w-full max-w-lg space-y-3 pt-3">
              {/* Model / Camera Source Switcher */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                {SAMPLE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      if (m.isCamera) {
                        startCamera();
                      } else {
                        stopCamera();
                        setActiveModel(m.id);
                        setUploadedImage(null);
                        runAiDiagnostics();
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeModel === m.id
                        ? 'bg-[#C1785A] text-white shadow-warm'
                        : 'bg-[#241E1C] text-[#DDD3C6] hover:bg-[#332A26] border border-[#3A302A]'
                    }`}
                  >
                    {m.isCamera ? <Camera className="w-3.5 h-3.5" /> : <Smile className="w-3.5 h-3.5" />}
                    <span>{m.name}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeModel === 'upload'
                      ? 'bg-[#C1785A] text-white shadow-warm'
                      : 'bg-[#241E1C] text-[#DDD3C6] hover:bg-[#332A26] border border-[#3A302A]'
                  }`}
                  title="Upload your own selfie to try on"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
              </div>

              {/* Action Buttons & Intensity Slider */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={runAiDiagnostics}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#241E1C] hover:bg-[#332A26] border border-[#C1785A]/40 text-[#FAF6F0] text-xs font-bold transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C1785A]" />
                    <span>Re-Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCaptureSnapshot}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-white text-xs font-bold transition-all shadow-warm"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Capture Look</span>
                  </button>
                </div>

                {/* Intensity Slider */}
                <div className="flex items-center gap-2 bg-[#241E1C] px-3 py-1.5 rounded-full border border-[#382E28]">
                  <Sliders className="w-3.5 h-3.5 text-[#C1785A]" />
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={filterIntensity}
                    onChange={(e) => setFilterIntensity(Number(e.target.value))}
                    className="w-16 sm:w-20 accent-[#C1785A] cursor-pointer"
                    title="Filter Intensity"
                  />
                  <span className="text-[10px] font-mono text-[#FAF6F0] font-bold">
                    {filterIntensity}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: STYLE PRESET SELECTOR & AI RECOMMENDATION CARD (5 COLS) */}
          <div className="lg:col-span-5 p-5 sm:p-6 space-y-4 bg-[#FAF6F0] dark:bg-[#181413] border-t lg:border-t-0 lg:border-l border-[#EAE3DA] dark:border-[#382E28] flex flex-col justify-between">
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

                  return (
                    <button
                      key={preset.id}
                      onClick={() => setActivePreset(preset)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#F5E6DF] dark:bg-[#38251E] border-[#C1785A] shadow-sm ring-1 ring-[#C1785A]'
                          : 'bg-white dark:bg-[#201A18] border-[#EAE3DA] dark:border-[#332A26] hover:border-[#C1785A]/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm shrink-0 flex items-center justify-center text-white"
                          style={{ backgroundColor: preset.color }}
                        >
                          <Sparkle className="w-4 h-4 opacity-80" />
                        </div>
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
                  💡 <strong>Stylist Note:</strong> Your facial geometry harmonizes with French Balayage and face-framing layers. Assigned colorist lead: <strong>{detectedMetrics.recommendedStylist.name}</strong>.
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
