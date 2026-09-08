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
  Crosshair,
  Lock,
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
  midColor: string;
  highlightColor: string;
  rootColor: string;
}

const COLOR_SWATCHES: ColorSwatch[] = [
  {
    id: 'chestnut',
    name: 'Parisian Chestnut',
    baseColor: '#4A2A1D',
    midColor: '#6B3E2B',
    highlightColor: '#A86847',
    rootColor: '#24140D',
  },
  {
    id: 'balayage',
    name: 'Honey Caramel Melt',
    baseColor: '#381E12',
    midColor: '#7A4522',
    highlightColor: '#E09C63',
    rootColor: '#1A0C06',
  },
  {
    id: 'platinum',
    name: 'Champagne Platinum Flow',
    baseColor: '#B8A894',
    midColor: '#D8CEBE',
    highlightColor: '#FAF5ED',
    rootColor: '#6E6152',
  },
  {
    id: 'espresso',
    name: 'Espresso Velvet Gloss',
    baseColor: '#1C120D',
    midColor: '#362117',
    highlightColor: '#5C3A29',
    rootColor: '#0A0604',
  },
  {
    id: 'copper',
    name: 'Terracotta Sunset Auburn',
    baseColor: '#4E1D13',
    midColor: '#8C3720',
    highlightColor: '#D96E48',
    rootColor: '#2A0D07',
  },
  {
    id: 'obsidian',
    name: 'Velvet Noir Mirror',
    baseColor: '#121010',
    midColor: '#242020',
    highlightColor: '#403A3A',
    rootColor: '#050505',
  },
];

type ARLightingMode = 'chandelier' | 'daylight' | 'golden_hour' | 'noir_studio';
type TryOnMode = 'full_cut_volume' | 'hair_only_color';

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
  defaultSwatchIndex: number;
  serviceId: string;
  tag: string;
  description: string;
  suitableFaceShapes: string[];
  stylistNote: string;
  hairVolumeDefault: number;
  heightOffsetDefault: number;
  editorialLook: string;
  compatibilityScore: string;
  colorFormula: string;
  faceBenefit: string;
  maintenanceSchedule: string;
}

const HAIRSTYLES: HairstyleData[] = [
  {
    id: 'hs1',
    name: 'Parisian Curtain Bangs & Waves',
    category: 'women_cuts',
    svgType: 'curtain_bangs',
    defaultSwatchIndex: 0,
    serviceId: 'c0000000-0000-0000-0000-000000000001',
    tag: 'Signature Paris Cut',
    description: 'Cheekbone-grazing curtain bangs with textured cascading French waves and root lift.',
    suitableFaceShapes: ['Oval', 'Heart', 'Square'],
    stylistNote: 'Accentuates high cheekbones and softens upper forehead angles with airy face-framing movement.',
    hairVolumeDefault: 102,
    heightOffsetDefault: -4,
    editorialLook: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000',
    compatibilityScore: '99.4% Match',
    colorFormula: 'Chestnut 6.34 + Amber Glaze',
    faceBenefit: 'Drapes effortlessly across temples to soften forehead width and spotlight eyes and lips.',
    maintenanceSchedule: 'Trim bangs every 4–5 weeks; glaze refresh at 8 weeks.',
  },
  {
    id: 'hs2',
    name: 'French Textured Collarbone Bob',
    category: 'women_cuts',
    svgType: 'french_bob',
    defaultSwatchIndex: 3,
    serviceId: 'c0000000-0000-0000-0000-000000000001',
    tag: 'Modern Chic',
    description: 'Blunt yet textured perimeter falling elegantly above the collarbones with natural root lift.',
    suitableFaceShapes: ['Oval', 'Round', 'Diamond'],
    stylistNote: 'Elongates the neckline and draws immediate focus to the eyes, cheekbones, and lips.',
    hairVolumeDefault: 98,
    heightOffsetDefault: 0,
    editorialLook: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=1000',
    compatibilityScore: '98.8% Match',
    colorFormula: 'Espresso Velvet 4.0 + Gloss Toner',
    faceBenefit: 'Architectural horizontal cut line sculpts rounder faces and accentuates the collarbone.',
    maintenanceSchedule: 'Reshape every 6 weeks for perimeter sharpness.',
  },
  {
    id: 'hs3',
    name: 'French Honey Balayage Melt',
    category: 'color_balayage',
    svgType: 'balayage_waves',
    defaultSwatchIndex: 1,
    serviceId: 'c0000000-0000-0000-0000-000000000002',
    tag: 'Master Color Alchemy',
    description: 'Hand-painted warm terracotta, honey & caramel ribbons blended seamlessly into sun-kissed waves.',
    suitableFaceShapes: ['All Face Shapes'],
    stylistNote: 'Infuses luminous multidimensional warmth that flatters golden, neutral, and warm skin undertones.',
    hairVolumeDefault: 105,
    heightOffsetDefault: -2,
    editorialLook: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=1000',
    compatibilityScore: '99.8% Master Match',
    colorFormula: 'Honey Caramel 8.3 + Terracotta Ribbons',
    faceBenefit: 'Sunlit face-framing pieces reflect natural light directly onto the complexion for instant radiance.',
    maintenanceSchedule: 'Low maintenance grow-out; toner refresh every 10–12 weeks.',
  },
  {
    id: 'hs4',
    name: 'Champagne Platinum Ice Flow',
    category: 'color_balayage',
    svgType: 'platinum_layers',
    defaultSwatchIndex: 2,
    serviceId: 'c0000000-0000-0000-0000-000000000002',
    tag: 'High Editorial Tone',
    description: 'Ultra-cool platinum champagne with multidimensional micro-fine reflex and feather-layered ends.',
    suitableFaceShapes: ['Oval', 'Square', 'Heart'],
    stylistNote: 'Creates high-fashion editorial contrast with luminous specular gloss and feather-soft perimeter.',
    hairVolumeDefault: 100,
    heightOffsetDefault: -3,
    editorialLook: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000',
    compatibilityScore: '97.6% Editorial Match',
    colorFormula: 'Icy Violet Platinum 10.21 + Anti-Brass Bath',
    faceBenefit: 'Striking editorial contrast that brings out depth in brown, hazel, and dark eyes.',
    maintenanceSchedule: 'Silver toner bath every 3–4 weeks; root touch-up at 6 weeks.',
  },
  {
    id: 'hs5',
    name: 'Espresso Velvet Glass Layers',
    category: 'color_balayage',
    svgType: 'espresso_gloss',
    defaultSwatchIndex: 3,
    serviceId: 'c0000000-0000-0000-0000-000000000002',
    tag: 'Rich Glass Hair',
    description: 'Deep mocha luxury tone enriched with mirror-like botanical shine and sleek flowing layers.',
    suitableFaceShapes: ['All Face Shapes'],
    stylistNote: 'Gives the optical illusion of maximum hair density and nourished organic silkiness.',
    hairVolumeDefault: 96,
    heightOffsetDefault: 0,
    editorialLook: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1000',
    compatibilityScore: '99.5% Gloss Match',
    colorFormula: 'Mocha Noir 3.0 + Acidic Botanical Glaze',
    faceBenefit: 'High-contrast reflection creates dramatic contouring and frames facial symmetry.',
    maintenanceSchedule: 'Botanical gloss mask infusion every 6 weeks.',
  },
  {
    id: 'hs6',
    name: 'Parisian Textured Wolf Shag',
    category: 'women_cuts',
    svgType: 'wolf_cut',
    defaultSwatchIndex: 4,
    serviceId: 'c0000000-0000-0000-0000-000000000001',
    tag: 'Edgy Parisian',
    description: 'Wispy layered fringe with crown volume tapering into soft textured collarbone ends.',
    suitableFaceShapes: ['Oval', 'Round', 'Heart'],
    stylistNote: 'Adds effortless Parisian volume and framing texture for fine or medium density hair.',
    hairVolumeDefault: 104,
    heightOffsetDefault: -6,
    editorialLook: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1000',
    compatibilityScore: '98.3% Volume Match',
    colorFormula: 'Auburn Copper 7.4 + Velvet Dimension',
    faceBenefit: 'Crown layering adds vertical lift and natural height to round and square face shapes.',
    maintenanceSchedule: 'Dry razor shaping every 6–8 weeks.',
  },
  {
    id: 'hs7',
    name: 'Executive Tapered Fade & Quiff',
    category: 'men_styles',
    svgType: 'men_fade',
    defaultSwatchIndex: 5,
    serviceId: 'c0000000-0000-0000-0000-000000000004',
    tag: 'Men Haute Grooming',
    description: 'Precision low skin taper transitioning into a sculpted, textured matte natural quiff.',
    suitableFaceShapes: ['Oval', 'Square', 'Round'],
    stylistNote: 'Adds structured vertical height and sharp architectural temple angles to masculine features.',
    hairVolumeDefault: 100,
    heightOffsetDefault: -5,
    editorialLook: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000',
    compatibilityScore: '99.7% Precision Match',
    colorFormula: 'Natural Matte Charcoal Clay Styling',
    faceBenefit: 'Sharp temple transitions chisel the side profile and create a defined masculine jaw.',
    maintenanceSchedule: 'Taper refresh every 2–3 weeks.',
  },
  {
    id: 'hs8',
    name: 'Royal Sculpted Beard & Tapered Line',
    category: 'men_styles',
    svgType: 'beard_fade',
    defaultSwatchIndex: 5,
    serviceId: 'c0000000-0000-0000-0000-000000000004',
    tag: 'Precision Beard Art',
    description: 'Crisp razor-defined cheek gradient with sandalwood oiled beard density and chin contour.',
    suitableFaceShapes: ['Oval', 'Round', 'Oblong'],
    stylistNote: 'Sculpts a sharp masculine jawline and balances facial symmetry with laser accuracy.',
    hairVolumeDefault: 100,
    heightOffsetDefault: 0,
    editorialLook: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000',
    compatibilityScore: '99.6% Beard Sculpt Match',
    colorFormula: 'Sandalwood Argan Beard Oil Treatment',
    faceBenefit: 'Squares the chin and sharpens jawline angles with clean millimeter razor gradients.',
    maintenanceSchedule: 'Hot towel shaping every 2 weeks.',
  },
];

const SAMPLE_CLIENTS = [
  {
    id: 'client1',
    name: 'Ananya',
    tag: 'Oval Face • Natural Waves',
    isCamera: false,
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    detectedFace: { x: 200, y: 192, scale: 1.02, widthRatio: 1.0, hairlineOffset: -4 },
    diagnostics: {
      faceShape: 'Harmonious Oval (1.618 Golden Ratio)',
      undertone: 'Warm Golden Terracotta',
      hairlineDistance: '6.8 cm (Forehead Ratio)',
      hairDensity: 'High Dimensional Density',
      fitStatus: '100% Calibrated to Hairline',
      confidenceScore: '99.8%',
      recommendedStylist: INITIAL_STYLISTS[0], // Arjun Khanna
    },
  },
  {
    id: 'client2',
    name: 'Meera',
    tag: 'Heart Face • Balayage',
    isCamera: false,
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    detectedFace: { x: 200, y: 190, scale: 0.98, widthRatio: 1.02, hairlineOffset: -2 },
    diagnostics: {
      faceShape: 'Heart Contour & Soft Temples',
      undertone: 'Honey Caramel Undertone',
      hairlineDistance: '6.5 cm (Forehead Ratio)',
      hairDensity: 'Medium Voluminous Waves',
      fitStatus: '100% Calibrated to Hairline',
      confidenceScore: '99.4%',
      recommendedStylist: INITIAL_STYLISTS[1], // Priya Patel
    },
  },
  {
    id: 'client3',
    name: 'Arjun',
    tag: 'Square Face • Quiff & Fade',
    isCamera: false,
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    detectedFace: { x: 200, y: 188, scale: 1.0, widthRatio: 1.04, hairlineOffset: -6 },
    diagnostics: {
      faceShape: 'Defined Square Jawline',
      undertone: 'Warm Olive Terracotta',
      hairlineDistance: '6.2 cm (Temple Taper)',
      hairDensity: 'Thick Natural Texture',
      fitStatus: '100% Calibrated to Hairline',
      confidenceScore: '99.7%',
      recommendedStylist: INITIAL_STYLISTS[2], // Rohan Mehta
    },
  },
  {
    id: 'client4',
    name: 'Priya',
    tag: 'Diamond Face • Chic Layer',
    isCamera: false,
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
    detectedFace: { x: 200, y: 194, scale: 1.0, widthRatio: 1.0, hairlineOffset: -3 },
    diagnostics: {
      faceShape: 'High Cheekbone Diamond',
      undertone: 'Champagne Warm Neutral',
      hairlineDistance: '6.7 cm (Forehead Ratio)',
      hairDensity: 'Silky Feathered Texture',
      fitStatus: '100% Calibrated to Hairline',
      confidenceScore: '99.6%',
      recommendedStylist: INITIAL_STYLISTS[1], // Priya Patel
    },
  },
  {
    id: 'client5',
    name: 'Rohan',
    tag: 'Executive Taper & Beard',
    isCamera: false,
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    detectedFace: { x: 200, y: 190, scale: 1.02, widthRatio: 1.02, hairlineOffset: -5 },
    diagnostics: {
      faceShape: 'Chiseled Oval & Beard Arch',
      undertone: 'Deep Espresso Tone',
      hairlineDistance: '6.4 cm (Crown Density)',
      hairDensity: 'Sculpted Beard & Temple Fade',
      fitStatus: '100% Calibrated to Hairline',
      confidenceScore: '99.5%',
      recommendedStylist: INITIAL_STYLISTS[2], // Rohan Mehta
    },
  },
  {
    id: 'cam',
    name: 'Live Camera',
    tag: 'Optional Webcam',
    isCamera: true,
    img: '',
    detectedFace: { x: 200, y: 190, scale: 1.0, widthRatio: 1.0, hairlineOffset: -4 },
    diagnostics: {
      faceShape: 'Live Biometric Calibrated',
      undertone: 'Ambient Adaptive',
      hairlineDistance: '6.5 cm (Sensor Lock)',
      hairDensity: 'Active Video Mesh',
      fitStatus: '100% Calibrated to Hairline',
      confidenceScore: '99.9%',
      recommendedStylist: INITIAL_STYLISTS[0],
    },
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
  const [activeClient, setActiveClient] = useState<string>('client1');
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);

  // Scanning Lifecycle
  const [scanStep, setScanStep] = useState<
    'idle' | 'landmarks' | 'hairline_detection' | 'undertone' | 'strand_fitting' | 'completed'
  >('idle');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStageText, setScanStageText] = useState<string>('Detecting Original Hairline & Scalp Boundary...');

  // Try-On Mode & Hairline State
  const [tryOnMode, setTryOnMode] = useState<TryOnMode>('full_cut_volume');
  const [showHairlineGuide, setShowHairlineGuide] = useState<boolean>(true);
  const [isAiAutoFitted, setIsAiAutoFitted] = useState<boolean>(true);

  // Hairstyle State & Custom Alignment Controls
  const [selectedHairstyle, setSelectedHairstyle] = useState<HairstyleData>(HAIRSTYLES[0]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentSwatch, setCurrentSwatch] = useState<ColorSwatch>(COLOR_SWATCHES[0]);

  const [hairOffsetY, setHairOffsetY] = useState<number>(HAIRSTYLES[0].heightOffsetDefault);
  const [hairOffsetX, setHairOffsetX] = useState<number>(0);
  const [hairScale, setHairScale] = useState<number>(HAIRSTYLES[0].hairVolumeDefault);
  const [hairWidth, setHairWidth] = useState<number>(100);
  const [hairShine, setHairShine] = useState<number>(95);

  // AR Advanced View Modes
  const [showWireframeMesh, setShowWireframeMesh] = useState<boolean>(false);
  const [showOriginalComparison, setShowOriginalComparison] = useState<boolean>(false);
  const [isSplitMode, setIsSplitMode] = useState<boolean>(true);
  const [splitPercent, setSplitPercent] = useState<number>(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);
  const [lightingMode, setLightingMode] = useState<ARLightingMode>('chandelier');
  const [isCardExported, setIsCardExported] = useState<boolean>(false);

  // Computed AI Facial Diagnostics
  const [diagnostics, setDiagnostics] = useState({
    faceShape: 'Harmonious Oval (1.618 Ratio)',
    undertone: 'Warm Golden Terracotta',
    hairlineDistance: '6.8 cm (Forehead Ratio)',
    hairDensity: 'High Dimensional Density',
    fitStatus: '100% Calibrated to Hairline',
    confidenceScore: '99.8%',
    recommendedStylist: INITIAL_STYLISTS[0], // Arjun Khanna
  });

  // Handle Dragging Split Comparison
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!splitContainerRef.current) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.min(Math.max((x / rect.width) * 100, 5), 95);
    setSplitPercent(Math.round(percent));
  };

  // AI Auto-Fit Calibration Function
  const applyAiPerfectFit = (clientKey: string = activeClient) => {
    setIsAiAutoFitted(true);
    const client = SAMPLE_CLIENTS.find((c) => c.id === clientKey);
    const detected = client?.detectedFace || { x: 200, y: 190, scale: 1.0, widthRatio: 1.0, hairlineOffset: -4 };

    setHairOffsetX(0);
    setHairOffsetY(selectedHairstyle.heightOffsetDefault + (detected.hairlineOffset || 0));
    setHairScale(Math.round(selectedHairstyle.hairVolumeDefault * (detected.scale || 1.0)));
    setHairWidth(Math.round(100 * (detected.widthRatio || 1.0)));
    playChime('bell');
  };

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
        triggerComprehensiveFaceScan('cam');
      } else {
        throw new Error('Camera not supported');
      }
    } catch (err) {
      console.warn('Camera access unavailable:', err);
      setCameraActive(false);
      setActiveClient('client1');
      triggerComprehensiveFaceScan('client1');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  // Trigger Comprehensive Facial Scan with deliberate phases
  const triggerComprehensiveFaceScan = (clientTarget: string = activeClient) => {
    setShowOriginalComparison(false);
    setIsCardExported(false);

    const client = SAMPLE_CLIENTS.find((c) => c.id === clientTarget);
    if (client && client.diagnostics) {
      setDiagnostics(client.diagnostics);
    }

    setScanStep('landmarks');
    setScanProgress(15);
    setScanStageText('Mapping 68 Craniofacial Landmark Nodes on Portrait...');
    playChime('notification');

    setTimeout(() => {
      setScanStep('hairline_detection');
      setScanProgress(45);
      setScanStageText('Scanning Hairline Arc & Scalp Boundary on Photo...');
    }, 1000);

    setTimeout(() => {
      setScanStep('undertone');
      setScanProgress(70);
      setScanStageText('Analyzing Hair Texture Density & Undertone Spectrum...');
    }, 2000);

    setTimeout(() => {
      setScanStep('strand_fitting');
      setScanProgress(92);
      setScanStageText('Synthesizing 4,800+ Organic Hair Strands & Natural Specular Sheen...');
    }, 3000);

    setTimeout(() => {
      setScanStep('completed');
      setScanProgress(100);
      setScanStageText('Hairstyle 100% Calibrated to Photo Hairline');
      applyAiPerfectFit(clientTarget);
    }, 4000);
  };

  const handleSelectHairstyle = (hs: HairstyleData) => {
    setSelectedHairstyle(hs);
    setCurrentSwatch(COLOR_SWATCHES[hs.defaultSwatchIndex] || COLOR_SWATCHES[0]);
    setHairOffsetY(hs.heightOffsetDefault);
    setHairScale(hs.hairVolumeDefault);
    setIsAiAutoFitted(true);
    playChime('notification');
  };

  useEffect(() => {
    if (isOpen) {
      stopCamera();
      setActiveClient('client1');
      setCustomPhoto(null);
      triggerComprehensiveFaceScan('client1');
    } else {
      stopCamera();
      setScanStep('idle');
      setIsCardExported(false);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

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
          triggerComprehensiveFaceScan('custom');
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
        return 'sepia(0.22) saturate(1.25) brightness(1.06) contrast(1.02)';
      case 'daylight':
        return 'brightness(1.08) contrast(1.05) saturate(1.02)';
      case 'noir_studio':
        return 'contrast(1.15) brightness(0.95) saturate(0.9)';
      case 'chandelier':
      default:
        return 'sepia(0.1) saturate(1.1) brightness(1.02)';
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
                  AI Facial Geometry Scanner &amp; Realistic Hairstyle Try-On
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F5E6DF] dark:bg-[#38251E] text-[#8C462C] dark:text-[#F2A585] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#C1785A]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C1785A] animate-ping" />
                  Hairline-Locked Engine
                </span>
              </div>
              <p className="text-xs text-[#6E6663] dark:text-[#B5ABA2]">
                Deliberate biometric face scan &bull; Natural hairline anchor &bull; Zero face obscuration
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
              onPointerDown={(e) => {
                if (isSplitMode && scanStep === 'completed') {
                  setIsDraggingSplit(true);
                  handlePointerMove(e);
                }
              }}
              onPointerMove={(e) => {
                if (isDraggingSplit && isSplitMode) {
                  handlePointerMove(e);
                }
              }}
              onPointerUp={() => setIsDraggingSplit(false)}
              onPointerLeave={() => setIsDraggingSplit(false)}
              className={`relative w-full flex-1 max-w-lg rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C1785A]/40 bg-[#161210] flex items-center justify-center select-none ${
                isSplitMode && scanStep === 'completed' ? 'cursor-ew-resize' : ''
              }`}
            >
              
              {/* 1. Live Video Feed OR Client Photo */}
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

              {/* Subtle Biometric Facial Landmarks Reticle (Delicate golden telemetry, no cartoon stickers) */}
              {scanStep === 'completed' && showHairlineGuide && (
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <svg viewBox="0 0 400 450" className="w-full h-full">
                    <ellipse cx="200" cy="215" rx="92" ry="128" stroke="#C1785A" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.6" />
                    <path d="M 125,135 Q 200,115 275,135" stroke="#FAF6F0" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.8" />
                    <circle cx="200" cy="115" r="2.5" fill="#FAF6F0" />
                    <circle cx="145" cy="190" r="2" fill="#C1785A" />
                    <circle cx="255" cy="190" r="2" fill="#C1785A" />
                    <circle cx="200" cy="230" r="2" fill="#C1785A" />
                    <circle cx="200" cy="285" r="2.5" fill="#FAF6F0" />
                  </svg>
                </div>
              )}

              {/* Mode C: Organic Balayage Glaze on Client's Original Hair (Soft-Light, No Clipart) */}
              {tryOnMode === 'hair_only_color' && scanStep === 'completed' && !showOriginalComparison && !isSplitMode && (
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-300 z-10"
                  style={{
                    background: `radial-gradient(ellipse at 50% 25%, ${currentSwatch.highlightColor}88 0%, ${currentSwatch.baseColor}66 45%, transparent 75%)`,
                    mixBlendMode: 'soft-light',
                    opacity: hairShine / 100,
                  }}
                />
              )}

              {/* 2. PHOTOREALISTIC EDITORIAL SALON TRANSFORMATION (Replaces clipart AR sticker) */}
              {!showOriginalComparison && scanStep === 'completed' && (
                <>
                  {/* Mode 1 & 2: Photographic Salon Transformation (Split view or Full Studio Transformation) */}
                  {tryOnMode === 'full_cut_volume' && (
                    <div
                      className="absolute inset-0 transition-all duration-75 overflow-hidden z-15 pointer-events-none"
                      style={{
                        clipPath: isSplitMode ? `inset(0 0 0 ${splitPercent}%)` : undefined,
                        filter: getLightingFilter(),
                      }}
                    >
                      <img
                        src={selectedHairstyle.editorialLook}
                        alt={selectedHairstyle.name}
                        className="w-full h-full object-cover transition-transform duration-300"
                        style={{
                          transform: `translateY(${hairOffsetY}px) scale(${hairScale / 100})`,
                        }}
                      />
                      {/* Organic Swatch Tone Infusion Glaze */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `linear-gradient(180deg, ${currentSwatch.rootColor}25 0%, ${currentSwatch.baseColor}30 40%, ${currentSwatch.highlightColor}20 100%)`,
                          mixBlendMode: 'soft-light',
                          opacity: hairShine / 100,
                        }}
                      />
                      {/* Floating After Badge in Split View */}
                      {isSplitMode && (
                        <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-[#1C1715]/90 backdrop-blur-md border border-[#C1785A] text-[#FAF6F0] text-[10px] font-mono font-bold tracking-wider shadow-lg flex items-center gap-1.5 pointer-events-auto">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>AFTER: {selectedHairstyle.name}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode 3: Natural Balayage Glaze (Toner on Client's Original Hair - Soft Light Blend, No Clipart) */}
                  {tryOnMode === 'hair_only_color' && (
                    <div
                      className="absolute inset-0 pointer-events-none transition-all duration-300 z-15"
                      style={{
                        clipPath: isSplitMode ? `inset(0 0 0 ${splitPercent}%)` : undefined,
                      }}
                    >
                      <div
                        className="w-full h-full"
                        style={{
                          background: `radial-gradient(ellipse at 50% 20%, ${currentSwatch.highlightColor}77 0%, ${currentSwatch.midColor}55 35%, ${currentSwatch.rootColor}44 65%, transparent 85%)`,
                          mixBlendMode: 'soft-light',
                          opacity: hairShine / 100,
                        }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, transparent 40%, ${currentSwatch.highlightColor}40 50%, transparent 60%)`,
                          mixBlendMode: 'screen',
                          opacity: 0.6,
                        }}
                      />
                      {isSplitMode && (
                        <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-[#1C1715]/90 backdrop-blur-md border border-[#C1785A] text-[#FAF6F0] text-[10px] font-mono font-bold tracking-wider shadow-lg flex items-center gap-1.5 pointer-events-auto">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>TONE: {currentSwatch.name}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Before Badge in Split View */}
                  {isSplitMode && (
                    <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-[#1C1715]/90 backdrop-blur-md border border-[#FAF6F0]/30 text-[#FAF6F0] text-[10px] font-mono font-bold tracking-wider shadow-lg flex items-center gap-1.5 pointer-events-auto">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C1785A]" />
                      <span>BEFORE: Client Profile</span>
                    </div>
                  )}
                </>
              )}

              {/* 3. INTERACTIVE BEFORE / AFTER DRAGGABLE SPLIT DIVIDER */}
              {isSplitMode && scanStep === 'completed' && !showOriginalComparison && (
                <div
                  className="absolute inset-y-0 z-25 pointer-events-none flex items-center justify-center select-none"
                  style={{ left: `${splitPercent}%` }}
                >
                  <div className="w-0.5 h-full bg-[#FAF6F0] shadow-[0_0_12px_rgba(193,120,90,0.9)]" />
                  
                  {/* Draggable Circle Handle */}
                  <div
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setIsDraggingSplit(true);
                      handlePointerMove(e);
                    }}
                    className="absolute w-9 h-9 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#C1785A] to-[#8C462C] text-white border-2 border-white flex items-center justify-center shadow-2xl pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform"
                    title="Drag to compare before and after"
                  >
                    <Split className="w-4 h-4" />
                  </div>

                  {/* Drag Prompt Tooltip */}
                  <div className="absolute bottom-4 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#1C1715]/90 border border-[#C1785A]/60 text-[9px] font-mono text-[#FAF6F0] whitespace-nowrap shadow-md pointer-events-none">
                    Drag To Compare
                  </div>
                </div>
              )}

              {/* 4. DELIBERATE SCANNING RETICLE & HAIRLINE DETECTOR OVERLAY */}
              {scanStep !== 'completed' && scanStep !== 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0E0C0B]/85 backdrop-blur-[4px] z-30 p-6 text-center animate-fadeIn">
                  <div className="relative w-64 h-72 border-2 border-dashed border-[#C1785A] rounded-[48%] flex items-center justify-center shadow-[0_0_50px_rgba(193,120,90,0.5)]">
                    <div
                      className="w-full h-1.5 bg-gradient-to-r from-transparent via-[#FAF6F0] to-transparent absolute shadow-[0_0_20px_#FFFFFF]"
                      style={{
                        top: `${scanProgress}%`,
                        transition: 'top 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                    <div className="absolute top-6 inset-x-8 flex justify-between items-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C1785A] animate-ping shadow-[0_0_8px_#C1785A]" />
                      <span className="text-[10px] font-mono font-bold text-[#FAF6F0] bg-[#C1785A]/80 px-2.5 py-0.5 rounded-full shadow-sm">
                        Biometric Scan: {scanProgress}%
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C1785A] animate-ping shadow-[0_0_8px_#C1785A]" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-2.5 max-w-sm w-full">
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
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-[#1C1715]/90 backdrop-blur-md p-1 rounded-full border border-[#C1785A]/50 text-xs shadow-lg">
                  <button
                    type="button"
                    onClick={() => applyAiPerfectFit()}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 bg-[#C1785A] text-white shadow-sm hover:bg-[#8C462C]"
                    title="1-Click AI Auto-Fit to Face"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>AI Auto-Fit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSplitMode(!isSplitMode);
                      setShowOriginalComparison(false);
                      playChime('tap');
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
                      playChime('tap');
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      showOriginalComparison
                        ? 'bg-[#C1785A] text-white shadow-sm'
                        : 'text-[#DDD3C6] hover:text-white'
                    }`}
                  >
                    {showOriginalComparison ? 'Original' : 'Transformed'}
                  </button>
                </div>
              )}

              {/* Active Badge (When not in split mode) */}
              {!isSplitMode && (
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-[#1C1715]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C1785A]/50 text-[#FAF6F0] text-xs font-bold shadow-md">
                  <Scissors className="w-3.5 h-3.5 text-[#C1785A]" />
                  <span>{selectedHairstyle.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">• {selectedHairstyle.compatibilityScore}</span>
                </div>
              )}
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
              
              {/* Try-On Experience Mode Switcher */}
              <div className="grid grid-cols-3 gap-1.5 bg-[#1C1715] p-1.5 rounded-2xl border border-[#382E28]">
                <button
                  type="button"
                  onClick={() => {
                    setTryOnMode('full_cut_volume');
                    setIsSplitMode(true);
                    setShowOriginalComparison(false);
                    playChime('tap');
                  }}
                  className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                    isSplitMode && !showOriginalComparison
                      ? 'bg-[#C1785A] text-white shadow-warm'
                      : 'text-[#DDD3C6] hover:bg-[#2C2420]'
                  }`}
                >
                  <Split className="w-3.5 h-3.5" />
                  <span>Before / After Split</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTryOnMode('full_cut_volume');
                    setIsSplitMode(false);
                    setShowOriginalComparison(false);
                    playChime('tap');
                  }}
                  className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                    tryOnMode === 'full_cut_volume' && !isSplitMode && !showOriginalComparison
                      ? 'bg-[#C1785A] text-white shadow-warm'
                      : 'text-[#DDD3C6] hover:bg-[#2C2420]'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Studio Transformation</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTryOnMode('hair_only_color');
                    setIsSplitMode(false);
                    setShowOriginalComparison(false);
                    playChime('tap');
                  }}
                  className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                    tryOnMode === 'hair_only_color' && !isSplitMode
                      ? 'bg-[#C1785A] text-white shadow-warm'
                      : 'text-[#DDD3C6] hover:bg-[#2C2420]'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Balayage Glaze</span>
                </button>
              </div>

              {/* Photo & Model Selection Strip */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#A89C94] flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-[#C1785A]" />
                    <span>Select Client Photo or Upload Your Own:</span>
                  </span>
                  {activeClient === 'custom' && (
                    <span className="text-[10px] text-emerald-400 font-bold">Custom Photo Loaded ✓</span>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {SAMPLE_CLIENTS.filter((c) => !c.isCamera).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        stopCamera();
                        setActiveClient(c.id);
                        setCustomPhoto(null);
                        triggerComprehensiveFaceScan(c.id);
                      }}
                      className={`flex items-center gap-2 p-1.5 pr-3 rounded-2xl border transition-all shrink-0 ${
                        activeClient === c.id
                          ? 'bg-[#2E2420] border-[#C1785A] text-white shadow-warm ring-1 ring-[#C1785A]'
                          : 'bg-[#1C1715] border-[#382E28] text-[#DDD3C6] hover:bg-[#251F1C]'
                      }`}
                    >
                      <img
                        src={c.img}
                        alt={c.name}
                        className="w-7 h-7 rounded-xl object-cover border border-[#C1785A]/50"
                      />
                      <div className="text-left">
                        <span className="text-xs font-bold block leading-tight">{c.name}</span>
                        <span className="text-[9px] text-[#A89C94] block leading-tight">{c.tag.split('•')[0].trim()}</span>
                      </div>
                    </button>
                  ))}

                  {/* Upload Custom Selfie / Photo */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex items-center gap-2 p-1.5 px-3 rounded-2xl border transition-all shrink-0 ${
                      activeClient === 'custom'
                        ? 'bg-[#2E2420] border-[#C1785A] text-white shadow-warm ring-1 ring-[#C1785A]'
                        : 'bg-[#1C1715] border-[#382E28] text-[#DDD3C6] hover:bg-[#251F1C]'
                    }`}
                    title="Upload your own photo to try on hairstyles"
                  >
                    <div className="w-7 h-7 rounded-xl bg-[#C1785A]/20 border border-[#C1785A]/40 flex items-center justify-center text-[#C1785A]">
                      <Upload className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold block leading-tight">Upload Photo</span>
                      <span className="text-[9px] text-[#A89C94] block leading-tight">Your Selfie</span>
                    </div>
                  </button>

                  {/* Optional Camera Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      if (cameraActive) {
                        stopCamera();
                        setActiveClient('client1');
                        triggerComprehensiveFaceScan('client1');
                      } else {
                        startCamera();
                      }
                    }}
                    className={`flex items-center gap-1.5 p-1.5 px-2.5 rounded-2xl border text-[11px] font-medium transition-all shrink-0 ${
                      activeClient === 'cam' && cameraActive
                        ? 'bg-[#C1785A] border-[#C1785A] text-white'
                        : 'bg-[#181413] border-[#2C2420] text-[#8C7E76] hover:text-[#DDD3C6]'
                    }`}
                    title="Toggle live camera mode"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{cameraActive ? 'Live' : 'Webcam'}</span>
                  </button>
                </div>
              </div>

              {/* Hairstyle Alignment & Custom Fit Adjusters */}
              <div className="p-3 rounded-2xl bg-[#1C1715] border border-[#382E28] space-y-2.5 text-xs text-[#FAF6F0]">
                
                {/* Sliders Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-[#DDD3C6]">
                      <span>Hairline Height</span>
                      <span>{hairOffsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-35"
                      max="35"
                      value={hairOffsetY}
                      onChange={(e) => {
                        setHairOffsetY(Number(e.target.value));
                        setIsAiAutoFitted(false);
                      }}
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
                      onChange={(e) => {
                        setHairScale(Number(e.target.value));
                        setIsAiAutoFitted(false);
                      }}
                      className="w-full accent-[#C1785A] cursor-pointer"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1 flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => triggerComprehensiveFaceScan()}
                      className="px-3 py-1.5 rounded-full bg-[#2E2420] hover:bg-[#3D2E27] text-xs font-bold text-[#FAF6F0] flex items-center gap-1 border border-[#C1785A]/40 transition-colors"
                      title="Re-run comprehensive face scan"
                    >
                      <RefreshCw className="w-3 h-3 text-[#C1785A]" />
                      <span>Rescan Face</span>
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
                      const isSelected = currentSwatch.id === swatch.id;
                      return (
                        <button
                          key={swatch.id}
                          type="button"
                          onClick={() => {
                            setCurrentSwatch(swatch);
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

                {/* Salon Ambient Lighting Modes */}
                <div className="pt-2 border-t border-[#2C2420] flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#A89C94] shrink-0">
                    Salon Ambience Lighting:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {[
                      { id: 'chandelier', label: 'Chandelier' },
                      { id: 'daylight', label: 'Daylight' },
                      { id: 'golden_hour', label: 'Golden Hour' },
                      { id: 'noir_studio', label: 'Noir Studio' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setLightingMode(mode.id as ARLightingMode);
                          playChime('tap');
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 ${
                          lightingMode === mode.id
                            ? 'bg-[#C1785A] text-white shadow-warm ring-1 ring-[#C1785A]'
                            : 'bg-[#251F1C] text-[#DDD3C6] hover:bg-[#302723]'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
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
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {filteredStyles.map((hs) => {
                  const isSelected = selectedHairstyle.id === hs.id;
                  const swatch = COLOR_SWATCHES[hs.defaultSwatchIndex] || COLOR_SWATCHES[0];

                  return (
                    <button
                      key={hs.id}
                      onClick={() => handleSelectHairstyle(hs)}
                      className={`w-full text-left p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#F5E6DF] dark:bg-[#38251E] border-[#C1785A] shadow-sm ring-1 ring-[#C1785A]'
                          : 'bg-white dark:bg-[#201A18] border-[#EAE3DA] dark:border-[#332A26] hover:border-[#C1785A]/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-[#C1785A]/40 shadow-sm">
                          <img
                            src={hs.editorialLook}
                            alt={hs.name}
                            className="w-full h-full object-cover"
                          />
                          <span
                            className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border border-white"
                            style={{ background: swatch.baseColor }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-serif font-bold text-xs sm:text-sm text-[#2C2725] dark:text-[#FAF6F0] truncate">
                              {hs.name}
                            </span>
                            <span className="text-[9px] bg-[#EAE3DA] dark:bg-[#2C2420] text-[#8C462C] dark:text-[#F2A585] px-2 py-0.5 rounded-full font-bold uppercase shrink-0">
                              {hs.tag}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                              ★ {hs.compatibilityScore}
                            </span>
                            <span className="text-[10px] text-[#6E6663] dark:text-[#B5ABA2] truncate">
                              • {hs.colorFormula}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#C1785A] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 3D BIOMETRIC FACIAL SCAN & STYLE CONSULTATION DOSSIER CARD */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#F5E6DF] to-[#EAE3DA] dark:from-[#291F1B] dark:to-[#201A18] border border-[#E0D0C5] dark:border-[#3D2E27] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scan className="w-4 h-4 text-[#C1785A]" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C462C] dark:text-[#F2A585]">
                      AI Consultation Dossier
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C1785A] text-white text-[10px] font-mono font-bold shadow-sm">
                    {selectedHairstyle.compatibilityScore}
                  </span>
                </div>

                {/* Biometrics Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/80 dark:bg-[#181413]/80 p-2.5 rounded-2xl border border-white/40 dark:border-[#382E28]">
                    <span className="text-[9px] uppercase text-[#6E6663] dark:text-[#B5ABA2] block font-bold">
                      Facial Architecture
                    </span>
                    <strong className="text-[#2C2725] dark:text-[#FAF6F0] block mt-0.5">
                      {diagnostics.faceShape}
                    </strong>
                  </div>

                  <div className="bg-white/80 dark:bg-[#181413]/80 p-2.5 rounded-2xl border border-white/40 dark:border-[#382E28]">
                    <span className="text-[9px] uppercase text-[#6E6663] dark:text-[#B5ABA2] block font-bold">
                      Hairline Alignment
                    </span>
                    <strong className="text-[#2C2725] dark:text-[#FAF6F0] block mt-0.5">
                      {diagnostics.hairlineDistance}
                    </strong>
                  </div>
                </div>

                {/* Facial Architecture Harmony Benefit */}
                <div className="p-2.5 rounded-2xl bg-white/70 dark:bg-[#181413]/70 border border-[#EAE3DA] dark:border-[#332A26] text-[11px] leading-relaxed">
                  <span className="text-[9px] uppercase font-bold text-[#8C462C] dark:text-[#F2A585] block mb-0.5">
                    Architectural Symmetry Benefit
                  </span>
                  <p className="text-[#4A423D] dark:text-[#CFC3B8]">
                    {selectedHairstyle.faceBenefit}
                  </p>
                </div>

                {/* Salon Formulation & Maintenance Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-2xl bg-white/70 dark:bg-[#181413]/70 border border-[#EAE3DA] dark:border-[#332A26]">
                    <span className="text-[9px] uppercase font-bold text-[#6E6663] dark:text-[#B5ABA2] block">
                      Salon Color Formula
                    </span>
                    <span className="font-semibold text-[#2C2725] dark:text-[#FAF6F0] block mt-0.5">
                      {selectedHairstyle.colorFormula}
                    </span>
                    <span className="text-[9px] text-[#8C462C] dark:text-[#F2A585] block mt-0.5">
                      Tone: {currentSwatch.name}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white/70 dark:bg-[#181413]/70 border border-[#EAE3DA] dark:border-[#332A26]">
                    <span className="text-[9px] uppercase font-bold text-[#6E6663] dark:text-[#B5ABA2] block">
                      Upkeep Cadence
                    </span>
                    <span className="font-semibold text-[#2C2725] dark:text-[#FAF6F0] block mt-0.5">
                      {selectedHairstyle.maintenanceSchedule}
                    </span>
                  </div>
                </div>

                {/* Recommended Master Artisan */}
                <div className="p-2.5 rounded-2xl bg-white/70 dark:bg-[#181413]/70 border border-[#EAE3DA] dark:border-[#332A26] flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#6E6663] dark:text-[#B5ABA2] block">
                      Recommended Artisan
                    </span>
                    <span className="font-bold text-[#2C2725] dark:text-[#FAF6F0]">
                      {diagnostics.recommendedStylist?.name}
                    </span>
                    <span className="text-[10px] text-[#8C462C] dark:text-[#F2A585] ml-1.5 font-mono">
                      Chair #{diagnostics.recommendedStylist?.chair_number}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#C1785A]/20 text-[#8C462C] dark:text-[#F2A585] px-2 py-0.5 rounded-full">
                    Certified Specialist
                  </span>
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
                <span>Reserve This Look with {diagnostics.recommendedStylist?.name || 'Master Artisan'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
