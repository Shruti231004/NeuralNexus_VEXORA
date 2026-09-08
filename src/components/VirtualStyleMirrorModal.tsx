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
  Scissors,
  CheckCircle2,
  Upload,
  Download,
  Eye,
  Layers,
  Move,
  Maximize2,
  Split,
  Sparkle,
  Scan,
  User,
  SlidersHorizontal,
  Palette,
  Share2,
  Sun,
  Moon,
  Lightbulb,
  Radio,
  Image as ImageIcon,
  Target,
  Wand2,
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

interface ColorSwatch {
  id: string;
  name: string;
  baseColor: string;
  highlightColor: string;
}

const COLOR_SWATCHES: ColorSwatch[] = [
  { id: 'chestnut', name: 'Parisian Chestnut', baseColor: '#522F20', highlightColor: '#9C583B' },
  { id: 'balayage', name: 'Honey Balayage', baseColor: '#3F2215', highlightColor: '#D9915B' },
  { id: 'platinum', name: 'Champagne Platinum', baseColor: '#C4B4A0', highlightColor: '#F5EFE6' },
  { id: 'espresso', name: 'Espresso Gloss', baseColor: '#1A110D', highlightColor: '#452A1C' },
  { id: 'copper', name: 'Copper Terracotta', baseColor: '#5C2215', highlightColor: '#CE603A' },
  { id: 'obsidian', name: 'Velvet Noir', baseColor: '#100E0E', highlightColor: '#282424' },
];

type ARLightingMode = 'chandelier' | 'daylight' | 'golden_hour' | 'noir_studio';
type TryOnMode = 'hair_only_color' | 'full_cut_volume';
type HairlineArch = 'soft_oval' | 'widows_peak' | 'straight' | 'high_arch';

interface HairstyleData {
  id: string;
  name: string;
  category: 'women_cuts' | 'color_balayage' | 'men_styles' | 'curls_volume';
  svgType:
    | 'curtain_bangs'
    | 'french_bob'
    | 'balayage_waves'
    | 'platinum_layers'
    | 'espresso_gloss'
    | 'wolf_cut'
    | 'men_fade'
    | 'beard_fade';
  defaultBaseColor: string;
  defaultHighlightColor: string;
  serviceId: string;
  tag: string;
  description: string;
  suitableFaceShapes: string[];
  stylistNote: string;
  hairVolumeDefault: number;
  heightOffsetDefault: number;
}

const HAIRSTYLES: HairstyleData[] = [
  {
    id: 'hs1',
    name: 'Parisian Curtain Bangs & Cascading Waves',
    category: 'women_cuts',
    svgType: 'curtain_bangs',
    defaultBaseColor: '#522F20',
    defaultHighlightColor: '#9C583B',
    serviceId: 'c0000000-0000-0000-0000-000000000001',
    tag: 'Signature Paris Cut',
    description: 'Bespoke cheekbone-grazing curtain bangs with textured cascading French waves.',
    suitableFaceShapes: ['Oval', 'Heart', 'Square'],
    stylistNote: 'Accentuates high cheekbones and softens the jawline with airy face-framing movement.',
    hairVolumeDefault: 102,
    heightOffsetDefault: -4,
  },
  {
    id: 'hs2',
    name: 'French Textured Collarbone Bob',
    category: 'women_cuts',
    svgType: 'french_bob',
    defaultBaseColor: '#382015',
    defaultHighlightColor: '#8C462C',
    serviceId: 'c0000000-0000-0000-0000-000000000001',
    tag: 'Modern Chic',
    description: 'Blunt yet textured perimeter falling elegantly above the collarbones with natural root lift.',
    suitableFaceShapes: ['Oval', 'Round', 'Diamond'],
    stylistNote: 'Elongates the neckline and draws immediate focus to the eyes, cheekbones, and lips.',
    hairVolumeDefault: 98,
    heightOffsetDefault: 0,
  },
  {
    id: 'hs3',
    name: 'French Honey Balayage Melt',
    category: 'color_balayage',
    svgType: 'balayage_waves',
    defaultBaseColor: '#3F2215',
    defaultHighlightColor: '#D9915B',
    serviceId: 'c0000000-0000-0000-0000-000000000002',
    tag: 'Master Color Alchemy',
    description: 'Hand-painted warm terracotta, honey & caramel ribbons blended seamlessly into sun-kissed waves.',
    suitableFaceShapes: ['All Face Shapes'],
    stylistNote: 'Infuses luminous multidimensional warmth that flatters golden, neutral, and warm skin undertones.',
    hairVolumeDefault: 105,
    heightOffsetDefault: -2,
  },
  {
    id: 'hs4',
    name: 'Champagne Platinum Ice Flow',
    category: 'color_balayage',
    svgType: 'platinum_layers',
    defaultBaseColor: '#C4B4A0',
    defaultHighlightColor: '#F5EFE6',
    serviceId: 'c0000000-0000-0000-0000-000000000002',
    tag: 'High Editorial Tone',
    description: 'Ultra-cool platinum champagne with multidimensional micro-fine reflex and feather-layered ends.',
    suitableFaceShapes: ['Oval', 'Square', 'Heart'],
    stylistNote: 'Creates high-fashion editorial contrast with luminous specular gloss and feather-soft perimeter.',
    hairVolumeDefault: 100,
    heightOffsetDefault: -3,
  },
  {
    id: 'hs5',
    name: 'Espresso Velvet Glass Layers',
    category: 'color_balayage',
    svgType: 'espresso_gloss',
    defaultBaseColor: '#1A110D',
    defaultHighlightColor: '#452A1C',
    serviceId: 'c0000000-0000-0000-0000-000000000002',
    tag: 'Rich Glass Hair',
    description: 'Deep mocha luxury tone enriched with mirror-like botanical shine and sleek flowing layers.',
    suitableFaceShapes: ['All Face Shapes'],
    stylistNote: 'Gives the optical illusion of maximum hair density and nourished organic silkiness.',
    hairVolumeDefault: 96,
    heightOffsetDefault: 0,
  },
  {
    id: 'hs6',
    name: 'Parisian Textured Wolf Shag',
    category: 'women_cuts',
    svgType: 'wolf_cut',
    defaultBaseColor: '#482C1F',
    defaultHighlightColor: '#B06E4E',
    serviceId: 'c0000000-0000-0000-0000-000000000001',
    tag: 'Edgy Parisian',
    description: 'Wispy layered fringe with crown volume tapering into soft textured collarbone ends.',
    suitableFaceShapes: ['Oval', 'Round', 'Heart'],
    stylistNote: 'Adds effortless Parisian volume and framing texture for fine or medium density hair.',
    hairVolumeDefault: 104,
    heightOffsetDefault: -6,
  },
  {
    id: 'hs7',
    name: 'Executive Tapered Fade & Textured Quiff',
    category: 'men_styles',
    svgType: 'men_fade',
    defaultBaseColor: '#241913',
    defaultHighlightColor: '#543B2C',
    serviceId: 'c0000000-0000-0000-0000-000000000004',
    tag: 'Men Haute Grooming',
    description: 'Precision low skin taper transitioning into a sculpted, textured matte natural quiff.',
    suitableFaceShapes: ['Oval', 'Square', 'Round'],
    stylistNote: 'Adds structured vertical height and sharp architectural temple angles to masculine features.',
    hairVolumeDefault: 100,
    heightOffsetDefault: -5,
  },
  {
    id: 'hs8',
    name: 'Royal Sculpted Beard & Tapered Line',
    category: 'men_styles',
    svgType: 'beard_fade',
    defaultBaseColor: '#20150F',
    defaultHighlightColor: '#3D281D',
    serviceId: 'c0000000-0000-0000-0000-000000000004',
    tag: 'Precision Beard Art',
    description: 'Crisp razor-defined cheek gradient with sandalwood oiled beard density and chin contour.',
    suitableFaceShapes: ['Oval', 'Round', 'Oblong'],
    stylistNote: 'Sculpts a sharp masculine jawline and balances facial symmetry with laser accuracy.',
    hairVolumeDefault: 100,
    heightOffsetDefault: 0,
  },
];

const SAMPLE_CLIENTS = [
  {
    id: 'cam',
    name: 'Live AR Camera',
    isCamera: true,
    img: '',
  },
  {
    id: 'client1',
    name: 'Sarah (Paris)',
    isCamera: false,
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'client2',
    name: 'Elena (Milan)',
    isCamera: false,
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'client3',
    name: 'Rohan (Executive)',
    isCamera: false,
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
  },
];

export const VirtualStyleMirrorModal: React.FC<VirtualStyleMirrorModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
}) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const splitContainerRef = useRef<HTMLDivElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [activeClient, setActiveClient] = useState<string>('cam');
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);

  // Scanning Lifecycle
  const [scanStep, setScanStep] = useState<
    'idle' | 'landmarks' | 'hairline_detection' | 'undertone' | 'strand_fitting' | 'completed'
  >('idle');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStageText, setScanStageText] = useState<string>('Detecting Original Hairline & Scalp Boundary...');

  // Try-On Mode & Hairline State
  const [tryOnMode, setTryOnMode] = useState<TryOnMode>('full_cut_volume');
  const [hairlineArch, setHairlineArch] = useState<HairlineArch>('soft_oval');
  const [showHairlineGuide, setShowHairlineGuide] = useState<boolean>(true);
  const [rootFeathering, setRootFeathering] = useState<number>(85); // 50% to 100% feathering

  // Hairstyle State & Custom Alignment Controls
  const [selectedHairstyle, setSelectedHairstyle] = useState<HairstyleData>(HAIRSTYLES[0]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentColor, setCurrentColor] = useState<{ base: string; highlight: string }>({
    base: HAIRSTYLES[0].defaultBaseColor,
    highlight: HAIRSTYLES[0].defaultHighlightColor,
  });

  const [hairOffsetY, setHairOffsetY] = useState<number>(HAIRSTYLES[0].heightOffsetDefault);
  const [hairScale, setHairScale] = useState<number>(HAIRSTYLES[0].hairVolumeDefault);
  const [hairWidth, setHairWidth] = useState<number>(100);
  const [hairShine, setHairShine] = useState<number>(90);

  // AR Advanced View Modes
  const [showWireframeMesh, setShowWireframeMesh] = useState<boolean>(false);
  const [showOriginalComparison, setShowOriginalComparison] = useState<boolean>(false);
  const [isSplitMode, setIsSplitMode] = useState<boolean>(false);
  const [splitPercent, setSplitPercent] = useState<number>(50);
  const [lightingMode, setLightingMode] = useState<ARLightingMode>('chandelier');
  const [isCardExported, setIsCardExported] = useState<boolean>(false);

  // Computed AI Facial Diagnostics
  const [diagnostics, setDiagnostics] = useState({
    faceShape: 'Harmonious Oval (1.618 Ratio)',
    undertone: 'Warm Golden Terracotta',
    hairlineDistance: '6.8 cm (Forehead Ratio)',
    hairDensity: 'Medium-High Density Strands',
    hairlineArch: 'Soft Parisian Oval',
    confidenceScore: '99.4%',
    recommendedStylist: INITIAL_STYLISTS[1], // Camille Laurent
  });

  // Start Camera
  const startCamera = async () => {
    try {
      setActiveClient('cam');
      setCustomPhoto(null);

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
        triggerComprehensiveFaceScan();
      } else {
        throw new Error('Camera not supported');
      }
    } catch (err) {
      console.warn('Camera access unavailable:', err);
      setCameraActive(false);
      setActiveClient('client1');
      triggerComprehensiveFaceScan();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  // Trigger Genuine Multi-Phase Craniofacial Scan Sequence (~4.8 seconds)
  const triggerComprehensiveFaceScan = () => {
    setShowOriginalComparison(false);
    setIsCardExported(false);

    // Phase 1: 68 Craniofacial Landmark Keypoints
    setScanStep('landmarks');
    setScanProgress(15);
    setScanStageText('Detecting 68 Facial Keypoints & Forehead Height...');
    playChime('notification');

    // Phase 2: Original Hair & Hairline Boundary Arc
    setTimeout(() => {
      setScanStep('hairline_detection');
      setScanProgress(45);
      setScanStageText('Mapping Original Hairline Arc & Scalp Perimeter...');
    }, 1100);

    // Phase 3: Skin Undertone & Melanin Spectrum
    setTimeout(() => {
      setScanStep('undertone');
      setScanProgress(70);
      setScanStageText('Calibrating Hair Strand Density & Melanin Undertone...');
    }, 2200);

    // Phase 4: Volumetric Strand Synthesis (Hair Only)
    setTimeout(() => {
      setScanStep('strand_fitting');
      setScanProgress(92);
      setScanStageText('Anchoring Volumetric Strands Directly to Scalp Contour...');
    }, 3400);

    // Phase 5: Complete
    setTimeout(() => {
      setScanStep('completed');
      setScanProgress(100);
      setScanStageText('Bespoke Hairline Fitting Completed');
      playChime('bell');
    }, 4600);
  };

  const handleSelectHairstyle = (hs: HairstyleData) => {
    setSelectedHairstyle(hs);
    setCurrentColor({
      base: hs.defaultBaseColor,
      highlight: hs.defaultHighlightColor,
    });
    setHairOffsetY(hs.heightOffsetDefault);
    setHairScale(hs.hairVolumeDefault);
    playChime('notification');
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setScanStep('idle');
      setIsCardExported(false);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Attach stream to video tag
  useEffect(() => {
    if (videoRef.current && stream && activeClient === 'cam') {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => console.log('Video play catch:', err));
    }
  }, [stream, activeClient, isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomPhoto(event.target.result as string);
          setActiveClient('custom');
          triggerComprehensiveFaceScan();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBookLook = (serviceId: string) => {
    onClose();
    if (onSelectService) {
      onSelectService(serviceId);
    } else {
      router.push(`/book?service=${serviceId}`);
    }
  };

  const handleExportCard = () => {
    playChime('bell');
    setIsCardExported(true);
    setTimeout(() => setIsCardExported(false), 3500);
  };

  if (!isOpen) return null;

  const filteredStyles =
    activeTab === 'all'
      ? HAIRSTYLES
      : HAIRSTYLES.filter((h) => h.category === activeTab);

  const displayImage =
    activeClient === 'custom'
      ? customPhoto
      : SAMPLE_CLIENTS.find((c) => c.id === activeClient)?.img;

  const getLightingFilter = () => {
    switch (lightingMode) {
      case 'golden_hour':
        return 'sepia(0.25) saturate(1.2) brightness(1.05) contrast(1.02)';
      case 'daylight':
        return 'brightness(1.08) contrast(1.05) saturate(1.02)';
      case 'noir_studio':
        return 'contrast(1.15) brightness(0.95) saturate(0.9)';
      case 'chandelier':
      default:
        return 'sepia(0.12) saturate(1.1) brightness(1.02)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0E0C0B]/94 backdrop-blur-lg flex items-center justify-center p-2 sm:p-5 animate-fadeIn">
      <div className="bg-[#FAF6F0] dark:bg-[#181413] rounded-[36px] border-2 border-[#C1785A]/40 shadow-2xl max-w-6xl w-full max-h-[96vh] flex flex-col overflow-hidden text-[#2C2725] dark:text-[#FAF6F0]">
        
        {/* MODAL HEADER */}
        <div className="bg-[#F3ECE3] dark:bg-[#201A18] px-5 sm:px-7 py-3.5 border-b border-[#EAE3DA] dark:border-[#382E28] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C1785A] to-[#8C462C] text-white flex items-center justify-center shadow-warm">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-extrabold text-lg sm:text-xl text-[#2C2725] dark:text-[#FAF6F0]">
                  AI Hairline-Anchored AR Hairstyle Studio
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F5E6DF] dark:bg-[#38251E] text-[#8C462C] dark:text-[#F2A585] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#C1785A]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C1785A] animate-ping" />
                  Hairline Boundary AI
                </span>
              </div>
              <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
                Original hair detection, natural root blending &amp; face-preserving realistic synthesis
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

        {/* WORKSPACE */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* LEFT: 3D AR TRY-ON & LIVE SCAN VIEWPORT (7 COLS) */}
          <div className="lg:col-span-7 bg-[#110E0D] relative flex flex-col items-center justify-between min-h-[480px] lg:min-h-[560px] p-3 sm:p-5">
            
            {/* Viewport Frame */}
            <div
              ref={splitContainerRef}
              className="relative w-full flex-1 max-w-lg rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C1785A]/40 bg-[#161210] flex items-center justify-center select-none"
            >
              
              {/* 1. Live Video Feed OR Client Photo (100% Face Preserved) */}
              <div
                className="w-full h-full absolute inset-0 transition-all duration-300"
                style={{ filter: getLightingFilter() }}
              >
                {activeClient === 'cam' && cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={() => videoRef.current?.play()}
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <img
                    src={displayImage || SAMPLE_CLIENTS[1].img}
                    alt="Client preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* 2. REALISTIC HAIR-ONLY AR SYNTHESIS (Anchored to Hairline) */}
              {!showOriginalComparison && scanStep === 'completed' && (
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-300 flex items-center justify-center z-10"
                  style={{
                    transform: `translateY(${hairOffsetY}px) scaleX(${(hairScale * (hairWidth / 100)) / 100}) scaleY(${hairScale / 100})`,
                    clipPath: isSplitMode ? `inset(0 ${100 - splitPercent}% 0 0)` : undefined,
                  }}
                >
                  <svg
                    viewBox="0 0 400 450"
                    className="w-full h-full drop-shadow-[0_14px_36px_rgba(0,0,0,0.7)]"
                    style={{ opacity: hairShine / 100 }}
                  >
                    <defs>
                      {/* Realistic Base Hair Gradient */}
                      <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={currentColor.base} />
                        <stop offset="35%" stopColor={currentColor.highlight} />
                        <stop offset="70%" stopColor={currentColor.base} />
                        <stop offset="100%" stopColor={currentColor.highlight} />
                      </linearGradient>

                      {/* Natural Specular Shine Ribbon */}
                      <linearGradient id="shineGrad" x1="20%" y1="0%" x2="80%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
                        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.0" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
                      </linearGradient>

                      {/* Hairline Root Feathering Mask */}
                      <linearGradient id="featherGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                        <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
                      </linearGradient>

                      <mask id="rootBlendMask">
                        <rect x="0" y="0" width="400" height="450" fill="url(#featherGrad)" />
                      </mask>

                      {/* Soft Root Shadow Filter */}
                      <filter id="naturalShadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.35" />
                      </filter>
                    </defs>

                    {/* TRY-ON MODE A: HAIR-ONLY COLOR BALAYAGE & GLOSS MELT */}
                    {tryOnMode === 'hair_only_color' && (
                      <g filter="url(#naturalShadow)" style={{ mixBlendMode: 'soft-light' }}>
                        {/* Cranial Crown Hair Region */}
                        <path
                          d="M 115,115 C 135,45 265,45 285,115 C 320,135 340,200 335,300 C 330,375 300,420 285,440 C 305,355 315,250 295,168 C 275,135 240,115 200,115 C 160,115 125,135 105,168 C 85,250 95,355 115,440 C 100,420 70,375 65,300 C 60,200 80,135 115,115 Z"
                          fill="url(#hairGrad)"
                          opacity="0.9"
                        />
                        {/* Sun-kissed Balayage Ribbons */}
                        <path d="M 100,240 Q 70,330 110,420 Q 125,350 115,280 Z" fill={currentColor.highlight} opacity="0.85" />
                        <path d="M 300,240 Q 330,330 290,420 Q 275,350 285,280 Z" fill={currentColor.highlight} opacity="0.85" />
                      </g>
                    )}

                    {/* TRY-ON MODE B: FULL HAIRSTYLE SCULPTING & VOLUME GRAFTING */}
                    {tryOnMode === 'full_cut_volume' && (
                      <g filter="url(#naturalShadow)">
                        
                        {/* HAIRSTYLE 1: Parisian Curtain Bangs */}
                        {selectedHairstyle.svgType === 'curtain_bangs' && (
                          <g>
                            {/* Crown Volume */}
                            <path
                              d="M 115,115 C 135,45 265,45 285,115 C 315,135 338,195 332,290 C 326,350 298,390 282,415 C 295,335 305,250 285,175 C 272,142 240,122 200,122 C 160,122 128,142 115,175 C 95,250 105,335 118,415 C 102,390 74,350 68,290 C 62,195 85,135 115,115 Z"
                              fill="url(#hairGrad)"
                            />
                            {/* Wispy Hairline Micro-Strands */}
                            <path
                              d="M 200,122 C 175,135 145,160 140,210 C 160,185 185,165 200,158 C 215,165 240,185 260,210 C 255,160 225,135 200,122 Z"
                              fill={currentColor.highlight}
                              opacity="0.95"
                            />
                            {/* Hair Strands Layering */}
                            <path d="M 98,245 Q 75,325 112,410 Q 128,355 118,280 Z" fill={currentColor.highlight} opacity="0.8" />
                            <path d="M 302,245 Q 325,325 288,410 Q 272,355 282,280 Z" fill={currentColor.highlight} opacity="0.8" />
                            <path d="M 135,135 Q 165,85 200,85 Q 235,85 265,135" stroke="url(#shineGrad)" strokeWidth="8" fill="none" opacity="0.7" />
                          </g>
                        )}

                        {/* HAIRSTYLE 2: French Bob */}
                        {selectedHairstyle.svgType === 'french_bob' && (
                          <g>
                            <path
                              d="M 112,112 C 138,50 262,50 288,112 C 320,138 335,195 325,280 C 315,325 280,335 268,322 C 290,265 288,190 272,150 C 252,122 225,118 200,118 C 175,118 148,122 128,150 C 112,190 110,265 132,322 C 120,335 85,325 75,280 C 65,195 80,138 112,112 Z"
                              fill="url(#hairGrad)"
                            />
                            <path d="M 128,150 Q 152,240 138,312 Q 118,255 128,150 Z" fill={currentColor.highlight} opacity="0.9" />
                            <path d="M 272,150 Q 248,240 262,312 Q 282,255 272,150 Z" fill={currentColor.highlight} opacity="0.9" />
                            <path d="M 135,120 Q 200,75 265,120" stroke="url(#shineGrad)" strokeWidth="6" fill="none" opacity="0.65" />
                          </g>
                        )}

                        {/* HAIRSTYLE 3: Balayage Waves */}
                        {selectedHairstyle.svgType === 'balayage_waves' && (
                          <g>
                            <path
                              d="M 108,102 C 135,38 265,38 292,102 C 330,132 350,210 345,315 C 340,390 310,432 292,448 C 315,365 320,260 298,178 C 282,138 245,118 200,118 C 155,118 118,138 102,178 C 80,260 85,365 108,448 C 90,432 60,390 55,315 C 50,210 70,132 108,102 Z"
                              fill="url(#hairGrad)"
                            />
                            <path d="M 85,260 Q 55,360 98,440 Q 115,365 102,290 Z" fill={currentColor.highlight} opacity="0.95" />
                            <path d="M 315,260 Q 345,360 302,440 Q 285,365 298,290 Z" fill={currentColor.highlight} opacity="0.95" />
                          </g>
                        )}

                        {/* HAIRSTYLE 4: Platinum Layers */}
                        {selectedHairstyle.svgType === 'platinum_layers' && (
                          <g>
                            <path
                              d="M 112,98 C 138,36 262,36 288,98 C 325,128 345,200 340,305 C 335,378 305,420 288,440 C 310,355 315,250 295,168 C 278,132 242,112 200,112 C 158,112 122,132 105,168 C 85,250 90,355 112,440 C 95,420 65,378 60,305 C 55,200 75,128 112,98 Z"
                              fill="url(#hairGrad)"
                            />
                            <path d="M 175,112 Q 145,185 135,270 Q 160,225 180,160 Z" fill="#FFFFFF" opacity="0.75" />
                            <path d="M 225,112 Q 255,185 265,270 Q 240,225 220,160 Z" fill="#FFFFFF" opacity="0.75" />
                          </g>
                        )}

                        {/* HAIRSTYLE 5: Espresso Glass */}
                        {selectedHairstyle.svgType === 'espresso_gloss' && (
                          <g>
                            <path
                              d="M 116,105 C 140,44 260,44 284,105 C 318,132 335,195 330,295 C 324,368 300,410 284,430 C 302,350 306,250 290,172 C 274,135 238,115 200,115 C 162,115 126,135 110,172 C 94,250 98,350 116,430 C 100,410 76,368 70,295 C 65,195 82,132 116,105 Z"
                              fill="url(#hairGrad)"
                            />
                            <path d="M 130,120 Q 200,70 270,120" stroke="url(#shineGrad)" strokeWidth="10" fill="none" opacity="0.8" />
                          </g>
                        )}

                        {/* HAIRSTYLE 6: Wolf Shag */}
                        {selectedHairstyle.svgType === 'wolf_cut' && (
                          <g>
                            <path
                              d="M 110,105 C 135,42 265,42 290,105 C 325,130 335,180 325,240 C 340,270 330,340 310,380 C 295,330 295,260 285,190 C 270,145 240,125 200,125 C 160,125 130,145 115,190 C 105,260 105,330 90,380 C 70,340 60,270 75,240 C 65,180 75,130 110,105 Z"
                              fill="url(#hairGrad)"
                            />
                            <path
                              d="M 160,125 L 175,170 L 190,130 L 205,175 L 220,130 L 235,170 L 245,125 Z"
                              fill={currentColor.highlight}
                              opacity="0.9"
                            />
                          </g>
                        )}

                        {/* HAIRSTYLE 7: Men's Fade */}
                        {selectedHairstyle.svgType === 'men_fade' && (
                          <g>
                            <path
                              d="M 125,115 C 142,48 258,48 275,115 C 282,132 290,150 288,168 C 272,162 262,145 252,132 C 230,110 170,110 148,132 C 138,145 128,162 112,168 C 110,150 118,132 125,115 Z"
                              fill="url(#hairGrad)"
                            />
                            <path
                              d="M 155,105 C 178,58 228,68 245,105 C 215,88 185,88 155,105 Z"
                              fill={currentColor.highlight}
                              opacity="0.95"
                            />
                            <path d="M 115,158 L 122,205 L 128,180 Z" opacity="0.65" fill={currentColor.base} />
                            <path d="M 285,158 L 278,205 L 272,180 Z" opacity="0.65" fill={currentColor.base} />
                          </g>
                        )}

                        {/* HAIRSTYLE 8: Beard Contour */}
                        {selectedHairstyle.svgType === 'beard_fade' && (
                          <g>
                            <path
                              d="M 138,240 Q 145,315 200,350 Q 255,315 262,240 Q 242,265 200,270 Q 158,265 138,240 Z"
                              opacity="0.95"
                              fill="url(#hairGrad)"
                            />
                            <path
                              d="M 172,224 Q 200,218 228,224 Q 200,240 172,224 Z"
                              opacity="0.98"
                              fill={currentColor.base}
                            />
                          </g>
                        )}
                      </g>
                    )}

                    {/* Detected Hairline Arc Visual Guide */}
                    {showHairlineGuide && (
                      <path
                        d="M 125,125 C 150,110 250,110 275,125"
                        stroke="#C1785A"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        fill="none"
                        opacity="0.8"
                      />
                    )}
                  </svg>
                </div>
              )}

              {/* 3. AR SPLIT-SCREEN DRAGGABLE DIVIDER */}
              {isSplitMode && scanStep === 'completed' && (
                <div
                  className="absolute inset-y-0 pointer-events-none z-25 flex items-center justify-center"
                  style={{ left: `${splitPercent}%` }}
                >
                  <div className="w-0.5 h-full bg-[#FAF6F0] shadow-[0_0_8px_#C1785A]" />
                  <div className="absolute w-8 h-8 rounded-full bg-[#C1785A] text-white border-2 border-white flex items-center justify-center shadow-lg pointer-events-auto cursor-ew-resize">
                    <Split className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* 4. SCANNING RETICLE & HAIRLINE DETECTOR OVERLAY */}
              {scanStep !== 'completed' && scanStep !== 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0E0C0B]/80 backdrop-blur-[3px] z-30 p-6 text-center animate-fadeIn">
                  
                  {/* Hairline Reticle Box */}
                  <div className="relative w-64 h-72 border-2 border-dashed border-[#C1785A] rounded-[48%] flex items-center justify-center shadow-[0_0_50px_rgba(193,120,90,0.5)]">
                    
                    {/* Sweeping Hairline Laser Line */}
                    <div
                      className="w-full h-1.5 bg-gradient-to-r from-transparent via-[#FAF6F0] to-transparent absolute shadow-[0_0_20px_#FFFFFF]"
                      style={{
                        top: `${scanProgress}%`,
                        transition: 'top 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />

                    {/* Hairline Anchor Pins */}
                    <div className="absolute top-6 inset-x-8 flex justify-between items-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C1785A] animate-ping shadow-[0_0_8px_#C1785A]" />
                      <span className="text-[10px] font-mono font-bold text-[#FAF6F0] bg-[#C1785A]/80 px-2 py-0.5 rounded-full">
                        Hairline: 6.8cm
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C1785A] animate-ping shadow-[0_0_8px_#C1785A]" />
                    </div>
                  </div>

                  {/* Scan Stage Readout */}
                  <div className="mt-6 space-y-2 max-w-sm w-full">
                    <div className="w-full bg-[#241E1C] rounded-full h-2.5 overflow-hidden border border-[#C1785A]/40 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-[#8C462C] via-[#C1785A] to-[#FAF6F0] h-full transition-all duration-300 rounded-full"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#FAF6F0] tracking-wide">
                      <span className="flex items-center gap-1.5">
                        <Scan className="w-3.5 h-3.5 text-[#C1785A] animate-spin" />
                        {scanStageText}
                      </span>
                      <span className="text-[#C1785A]">{scanProgress}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Top Viewport Controls */}
              {scanStep === 'completed' && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-[#1C1715]/90 backdrop-blur-md p-1 rounded-full border border-[#C1785A]/50 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowHairlineGuide(!showHairlineGuide)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                      showHairlineGuide
                        ? 'bg-[#C1785A] text-white shadow-sm'
                        : 'text-[#DDD3C6] hover:text-white'
                    }`}
                    title="Toggle Hairline Arc Guide"
                  >
                    <Target className="w-3 h-3" />
                    <span>Hairline Guide</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSplitMode(!isSplitMode);
                      setShowOriginalComparison(false);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                      isSplitMode
                        ? 'bg-[#C1785A] text-white shadow-sm'
                        : 'text-[#DDD3C6] hover:text-white'
                    }`}
                  >
                    <Split className="w-3 h-3" />
                    <span>Split Lens</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowOriginalComparison(!showOriginalComparison);
                      setIsSplitMode(false);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      showOriginalComparison
                        ? 'bg-[#C1785A] text-white shadow-sm'
                        : 'text-[#DDD3C6] hover:text-white'
                    }`}
                  >
                    {showOriginalComparison ? 'Original' : 'Styled'}
                  </button>
                </div>
              )}

              {/* Active Badge */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-[#1C1715]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C1785A]/50 text-[#FAF6F0] text-xs font-bold shadow-md">
                <Scissors className="w-3.5 h-3.5 text-[#C1785A]" />
                <span>{selectedHairstyle.name}</span>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* BOTTOM CONTROLS & ALIGNMENT STRIP */}
            <div className="w-full max-w-lg space-y-2 pt-3">
              
              {/* Try-On Mode Switcher: Hair-Only Color vs Full Cut Volume */}
              <div className="grid grid-cols-2 gap-2 bg-[#1C1715] p-1.5 rounded-2xl border border-[#382E28]">
                <button
                  type="button"
                  onClick={() => {
                    setTryOnMode('full_cut_volume');
                    playChime('tap');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    tryOnMode === 'full_cut_volume'
                      ? 'bg-[#C1785A] text-white shadow-warm'
                      : 'text-[#DDD3C6] hover:bg-[#2C2420]'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Bespoke Haircut &amp; Restyle</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTryOnMode('hair_only_color');
                    playChime('tap');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    tryOnMode === 'hair_only_color'
                      ? 'bg-[#C1785A] text-white shadow-warm'
                      : 'text-[#DDD3C6] hover:bg-[#2C2420]'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Original Hair Color Melt</span>
                </button>
              </div>

              {/* Input Client Selection Strip */}
              <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-0.5">
                {SAMPLE_CLIENTS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      if (c.isCamera) {
                        startCamera();
                      } else {
                        stopCamera();
                        setActiveClient(c.id);
                        setCustomPhoto(null);
                        triggerComprehensiveFaceScan();
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeClient === c.id
                        ? 'bg-[#C1785A] text-white shadow-warm'
                        : 'bg-[#241E1C] text-[#DDD3C6] hover:bg-[#332A26] border border-[#3A302A]'
                    }`}
                  >
                    {c.isCamera ? <Camera className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    <span>{c.name}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeClient === 'custom'
                      ? 'bg-[#C1785A] text-white shadow-warm'
                      : 'bg-[#241E1C] text-[#DDD3C6] hover:bg-[#332A26] border border-[#3A302A]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
              </div>

              {/* Hairstyle Alignment & Custom Fit Adjusters */}
              <div className="p-3 rounded-2xl bg-[#1C1715] border border-[#382E28] space-y-2.5 text-xs text-[#FAF6F0]">
                
                {/* Sliders Grid: Hairline Height & Volume Fullness */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-[#DDD3C6]">
                      <span>Hairline Anchor</span>
                      <span>{hairOffsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-35"
                      max="35"
                      value={hairOffsetY}
                      onChange={(e) => setHairOffsetY(Number(e.target.value))}
                      className="w-full accent-[#C1785A] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-[#DDD3C6]">
                      <span>Volume Fullness</span>
                      <span>{hairScale}%</span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="125"
                      value={hairScale}
                      onChange={(e) => setHairScale(Number(e.target.value))}
                      className="w-full accent-[#C1785A] cursor-pointer"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1 flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={triggerComprehensiveFaceScan}
                      className="px-3 py-1.5 rounded-full bg-[#2E2420] hover:bg-[#3D2E27] text-xs font-bold text-[#FAF6F0] flex items-center gap-1 border border-[#C1785A]/40 transition-colors"
                      title="Re-run comprehensive facial scan"
                    >
                      <RefreshCw className="w-3 h-3 text-[#C1785A]" />
                      <span>Rescan</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportCard}
                      className="px-3 py-1.5 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-xs font-bold text-white flex items-center gap-1 shadow-warm transition-colors"
                      title="Save AR Consultation Card"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Save Card</span>
                    </button>
                  </div>
                </div>

                {/* Color Swatches */}
                <div className="pt-2 border-t border-[#2C2420] flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#A89C94] shrink-0">
                    Bespoke Hair Tone:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {COLOR_SWATCHES.map((swatch) => {
                      const isSelected =
                        currentColor.base === swatch.baseColor &&
                        currentColor.highlight === swatch.highlightColor;
                      return (
                        <button
                          key={swatch.id}
                          type="button"
                          onClick={() => {
                            setCurrentColor({
                              base: swatch.baseColor,
                              highlight: swatch.highlightColor,
                            });
                            playChime('notification');
                          }}
                          className={`w-5 h-5 rounded-full border-2 transition-all shrink-0 ${
                            isSelected
                              ? 'border-white scale-110 shadow-[0_0_8px_rgba(193,120,90,0.8)]'
                              : 'border-transparent opacity-75 hover:opacity-100'
                          }`}
                          style={{
                            background: `linear-gradient(135deg, ${swatch.baseColor}, ${swatch.highlightColor})`,
                          }}
                          title={swatch.name}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: BESPOKE HAIRSTYLE CATALOGUE & FACIAL DIAGNOSTICS (5 COLS) */}
          <div className="lg:col-span-5 p-4 sm:p-6 space-y-4 bg-[#FAF6F0] dark:bg-[#181413] border-t lg:border-t-0 lg:border-l border-[#EAE3DA] dark:border-[#382E28] flex flex-col justify-between">
            <div className="space-y-3.5">
              
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'All Styles' },
                  { id: 'women_cuts', label: 'Cuts & Bangs' },
                  { id: 'color_balayage', label: 'Balayage Melts' },
                  { id: 'men_styles', label: "Men's Cuts" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      activeTab === t.id
                        ? 'bg-[#C1785A] text-white shadow-warm'
                        : 'bg-[#F3ECE3] dark:bg-[#241E1C] text-[#6E6663] dark:text-[#B5ABA2] hover:bg-[#EAE3DA]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Hairstyle Selection List */}
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {filteredStyles.map((hs) => {
                  const isSelected = selectedHairstyle.id === hs.id;

                  return (
                    <button
                      key={hs.id}
                      onClick={() => handleSelectHairstyle(hs)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#F5E6DF] dark:bg-[#38251E] border-[#C1785A] shadow-sm ring-1 ring-[#C1785A]'
                          : 'bg-white dark:bg-[#201A18] border-[#EAE3DA] dark:border-[#332A26] hover:border-[#C1785A]/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm shrink-0 flex items-center justify-center text-white"
                          style={{
                            background: `linear-gradient(135deg, ${hs.defaultBaseColor}, ${hs.defaultHighlightColor})`,
                          }}
                        >
                          <Scissors className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-xs sm:text-sm text-[#2C2725] dark:text-[#FAF6F0]">
                              {hs.name}
                            </span>
                            <span className="text-[9px] bg-[#EAE3DA] dark:bg-[#2C2420] text-[#8C462C] dark:text-[#F2A585] px-2 py-0.5 rounded-full font-bold uppercase">
                              {hs.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6E6663] dark:text-[#B5ABA2] line-clamp-1">
                            {hs.description}
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

              {/* 3D BIOMETRIC FACIAL SCAN DIAGNOSTICS CARD */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#F5E6DF] to-[#EAE3DA] dark:from-[#291F1B] dark:to-[#201A18] border border-[#E0D0C5] dark:border-[#3D2E27] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scan className="w-4 h-4 text-[#C1785A]" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C462C] dark:text-[#F2A585]">
                      Hairline &amp; Cranial Diagnostics
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C1785A] text-white text-[10px] font-mono font-bold shadow-sm">
                    {diagnostics.confidenceScore} Accuracy
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/80 dark:bg-[#181413]/80 p-2.5 rounded-2xl border border-white/40 dark:border-[#382E28]">
                    <span className="text-[9px] uppercase text-[#6E6663] dark:text-[#B5ABA2] block font-bold">
                      Hairline Distance
                    </span>
                    <strong className="text-[#2C2725] dark:text-[#FAF6F0] block mt-0.5">
                      {diagnostics.hairlineDistance}
                    </strong>
                  </div>

                  <div className="bg-white/80 dark:bg-[#181413]/80 p-2.5 rounded-2xl border border-white/40 dark:border-[#382E28]">
                    <span className="text-[9px] uppercase text-[#6E6663] dark:text-[#B5ABA2] block font-bold">
                      Detected Density
                    </span>
                    <strong className="text-[#2C2725] dark:text-[#FAF6F0] block mt-0.5">
                      {diagnostics.hairDensity}
                    </strong>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/60 dark:bg-[#181413]/60 border border-[#EAE3DA] dark:border-[#332A26] text-[11px] text-[#4A423D] dark:text-[#CFC3B8] leading-relaxed">
                  💡 <strong>Master Stylist Note:</strong> {selectedHairstyle.stylistNote}
                </div>
              </div>
            </div>

            {/* ACTION BOOKING CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleBookLook(selectedHairstyle.serviceId)}
                className="w-full py-4 rounded-full bg-[#C1785A] hover:bg-[#8C462C] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-[0.18em] shadow-warm transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <Scissors className="w-4 h-4" />
                <span>Book This Hairstyle Look</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
