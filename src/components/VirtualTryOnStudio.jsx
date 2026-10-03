import React, { useState } from 'react';
import { SERVICES, STYLISTS } from '../services/store';

const HAIRSTYLES = [
  {
    id: 'skin-fade',
    name: 'Precision Skin Fade & Beard Contour',
    category: 'Male',
    preview: '💈',
    svgOverlay: 'beard-fade',
    recommendedServiceId: 'srv-4',
    recommendedStylistId: 'st-4'
  },
  {
    id: 'balayage-waves',
    name: 'Dimensional Balayage & Silk Waves',
    category: 'Female',
    preview: '🎨',
    svgOverlay: 'balayage',
    recommendedServiceId: 'srv-2',
    recommendedStylistId: 'st-2'
  },
  {
    id: 'steam-bob',
    name: 'Restorative Steam Bob & Polish',
    category: 'Female',
    preview: '✨',
    svgOverlay: 'bob',
    recommendedServiceId: 'srv-3',
    recommendedStylistId: 'st-3'
  },
  {
    id: 'textured-crop',
    name: 'Textured Crop & Scalp Detox',
    category: 'Male',
    preview: '✂️',
    svgOverlay: 'crop',
    recommendedServiceId: 'srv-1',
    recommendedStylistId: 'st-1'
  }
];

const HAIR_COLORS = [
  { name: 'Natural Obsidian', hex: '#1C1817' },
  { name: 'Parisian Balayage Gold', hex: '#C5A059' },
  { name: 'Terracotta Rose Gloss', hex: '#C1785A' },
  { name: 'Platinum Champagne', hex: '#E2C792' },
  { name: 'Warm Chestnut Mahogany', hex: '#8C462C' }
];

export default function VirtualTryOnStudio({ onSelectServiceAndBook, onClose }) {
  const [selectedStyle, setSelectedStyle] = useState(HAIRSTYLES[0]);
  const [selectedColor, setSelectedColor] = useState(HAIR_COLORS[1]);
  const [faceShape, setFaceShape] = useState('Oval');
  const [hairTexture, setHairTexture] = useState('Wavy');
  const [styleGoal, setStyleGoal] = useState('Volume & Shine');
  const [userPhoto, setUserPhoto] = useState(null);

  // AI Recommendation Logic
  const getAIRecommendation = () => {
    if (faceShape === 'Oval' || styleGoal === 'Volume & Shine') {
      return {
        style: HAIRSTYLES[1],
        stylist: STYLISTS[1] || STYLISTS[0],
        service: SERVICES[1] || SERVICES[0],
        reason: 'Harmonizes with Oval face symmetry for maximum dimensional gloss and movement.'
      };
    } else if (hairTexture === 'Curly' || styleGoal === 'Modern Fade') {
      return {
        style: HAIRSTYLES[0],
        stylist: STYLISTS[3] || STYLISTS[0],
        service: SERVICES[3] || SERVICES[0],
        reason: 'Optimal for jawline definition, moisture retention, and zero-maintenance texture control.'
      };
    } else {
      return {
        style: HAIRSTYLES[2],
        stylist: STYLISTS[2] || STYLISTS[0],
        service: SERVICES[2] || SERVICES[0],
        reason: 'Ideal for deep scalp hydration, cuticle alignment, and stress-relieving botanical steam.'
      };
    }
  };

  const recommendation = getAIRecommendation();

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUserPhoto(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF6F0] border border-[#EAE3DA] rounded-3xl p-6 sm:p-8 shadow-2xl max-w-5xl w-full space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto my-auto text-[#2C2725]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3DA] pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0DCCF] text-[#C1785A] text-[11px] font-bold uppercase tracking-[0.08em] mb-1">
              <span>📷 Virtual Studio Mirror</span>
              <span>✦ Rose & Rogue AI</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C2725]">
              Virtual Camera Style Try-On & AI Hair Matcher
            </h2>
            <p className="text-xs sm:text-sm text-[#8A8078]">
              Upload your photo or use virtual camera preview to test cut overlays, color glaze tints, and receive artisan recommendations.
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#F3EAE0] hover:bg-[#EAE3DA] border border-[#EAE3DA] text-[#2C2725] font-bold text-lg flex items-center justify-center transition-colors self-start sm:self-auto"
            >
              ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Try-On Mirror Canvas (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Virtual Camera Mirror Frame */}
            <div className="relative w-full h-[380px] rounded-3xl bg-[#1F1B18] border-2 border-[#EAE3DA] overflow-hidden flex flex-col items-center justify-center shadow-warm-lg group">
              
              {userPhoto ? (
                <img src={userPhoto} alt="Virtual Camera Mirror" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-24 h-24 rounded-full bg-[#2C2725] border-2 border-[#C1785A] flex items-center justify-center mx-auto text-[#C1785A] text-4xl shadow-inner">
                    📷
                  </div>
                  <div className="font-serif text-lg font-extrabold text-[#FAF6F0]">Virtual Mirror Active</div>
                  <p className="text-xs text-[#8A8078] max-w-xs mx-auto">
                    Upload your portrait photo or tap hairstyles below to preview cut & color glaze overlays in real time.
                  </p>
                </div>
              )}

              {/* Hairstyle & Color Glaze Overlay Bar */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none flex flex-col justify-end p-4">
                <div className="bg-[#FAF6F0]/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#EAE3DA] shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedStyle.preview}</span>
                    <div>
                      <div className="text-xs font-extrabold text-[#2C2725]">{selectedStyle.name}</div>
                      <div className="text-[11px] font-bold" style={{ color: selectedColor.hex }}>
                        Glaze Tint: {selectedColor.name}
                      </div>
                    </div>
                  </div>

                  <div 
                    className="w-7 h-7 rounded-full border-2 border-white shadow-md shrink-0"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                </div>
              </div>

              {/* Photo Upload Overlay Button */}
              <label className="absolute top-4 right-4 bg-[#FAF6F0] hover:bg-[#F3EAE0] text-[#2C2725] text-xs font-bold px-4 py-2 rounded-full shadow-md cursor-pointer border border-[#EAE3DA] flex items-center gap-2 transition-all">
                <span>📷</span>
                <span>{userPhoto ? 'Change Photo' : 'Upload Photo'}</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>

            </div>

            {/* Hair Color Glaze Tint Picker */}
            <div className="bg-[#F3EAE0] p-4 rounded-2xl border border-[#EAE3DA] space-y-2">
              <div className="text-xs font-bold text-[#C1785A] uppercase tracking-[0.08em] flex items-center justify-between">
                <span>Select Hair Color Glaze Tint</span>
                <span className="text-[11px] text-[#2C2725] font-bold">{selectedColor.name}</span>
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {HAIR_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                      selectedColor.name === c.name
                        ? 'bg-[#C1785A] text-[#FAF6F0] border-[#C1785A] shadow-sm'
                        : 'bg-[#FAF6F0] text-[#2C2725] border-[#EAE3DA] hover:bg-[#EFE6DA]'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Style Selector & AI Matcher Quiz (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Hairstyle Selection Grid */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#C1785A] uppercase tracking-[0.08em]">
                1. Tap Hairstyle to Overlay
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {HAIRSTYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      selectedStyle.id === style.id
                        ? 'bg-[#F0DCCF] border-[#C1785A] text-[#2C2725] shadow-sm font-bold'
                        : 'bg-[#FAF6F0] border-[#EAE3DA] hover:bg-[#F3EAE0] text-[#2C2725]'
                    }`}
                  >
                    <div className="text-2xl mb-1">{style.preview}</div>
                    <div>
                      <div className="text-xs font-extrabold text-[#2C2725] line-clamp-1">{style.name}</div>
                      <div className="text-[10px] text-[#8A8078]">{style.category} Collection</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Personal Style Matcher Questionnaire */}
            <div className="bg-[#F3EAE0] p-5 rounded-3xl border border-[#EAE3DA] space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C1785A] uppercase tracking-[0.08em]">
                <span>🧠 AI Personal Face & Hair Matcher</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#8A8078] mb-1">Face Shape</label>
                  <select
                    value={faceShape}
                    onChange={(e) => setFaceShape(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#EAE3DA] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
                  >
                    <option value="Oval">Oval</option>
                    <option value="Square">Square</option>
                    <option value="Round">Round</option>
                    <option value="Heart">Heart</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8A8078] mb-1">Hair Texture</label>
                  <select
                    value={hairTexture}
                    onChange={(e) => setHairTexture(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#EAE3DA] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
                  >
                    <option value="Wavy">Wavy</option>
                    <option value="Straight">Straight</option>
                    <option value="Curly">Curly</option>
                    <option value="Coily">Coily</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8A8078] mb-1">Style Goal</label>
                  <select
                    value={styleGoal}
                    onChange={(e) => setStyleGoal(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#EAE3DA] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#2C2725] focus:outline-none focus:border-[#C1785A]"
                  >
                    <option value="Volume & Shine">Volume & Shine</option>
                    <option value="Modern Fade">Modern Fade</option>
                    <option value="Scalp Steam">Scalp Steam</option>
                  </select>
                </div>
              </div>

              {/* AI Recommendation Result Card */}
              <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EAE3DA] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#C1785A] tracking-[0.08em]">
                    ✦ RECOMMENDED MATCH
                  </span>
                  <span className="text-xs font-bold text-[#2C2725]">
                    ₹{recommendation.service?.price || 1800}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif text-lg font-extrabold text-[#2C2725]">
                    {recommendation.service?.name || 'Signature Hair Artistry'}
                  </h4>
                  <p className="text-xs text-[#8A8078] mt-1 leading-relaxed">
                    {recommendation.reason}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EAE3DA] text-xs">
                  <span className="text-[#8A8078]">Lead Stylist: <strong className="text-[#2C2725]">{recommendation.stylist?.name || 'Master Artisan'}</strong></span>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectServiceAndBook) {
                        onSelectServiceAndBook(recommendation.service);
                      }
                      if (onClose) onClose();
                    }}
                    className="py-2 px-4 rounded-full bg-[#C1785A] hover:bg-[#A8613F] text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.08em] shadow-sm transition-all"
                  >
                    Book Recommended (₹99) →
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
