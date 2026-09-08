import React, { useState } from 'react';
import { SERVICES, STYLISTS } from '../services/store';

const HAIRSTYLES = [
  {
    id: 'skin-fade',
    name: 'Precision Skin Fade & Beard Contour',
    category: 'Male',
    preview: '💈',
    svgOverlay: 'beard-fade',
    recommendedService: 'precision-haircut-detox',
    recommendedStylist: 'marcus'
  },
  {
    id: 'balayage-waves',
    name: 'Dimensional Balayage & Silk Waves',
    category: 'Female',
    preview: '🎨',
    svgOverlay: 'balayage',
    recommendedService: 'color-glaze-tone',
    recommendedStylist: 'elena'
  },
  {
    id: 'steam-bob',
    name: 'Restorative Steam Bob & Detox Polish',
    category: 'Female',
    preview: '✨',
    svgOverlay: 'bob',
    recommendedService: 'holistic-scalp-steam',
    recommendedStylist: 'chloe'
  },
  {
    id: 'textured-crop',
    name: 'Textured Crop & Scalp Detox',
    category: 'Male',
    preview: '✂️',
    svgOverlay: 'crop',
    recommendedService: 'beard-texture-sculpt',
    recommendedStylist: 'marcus'
  }
];

const HAIR_COLORS = [
  { name: 'Natural Obsidian', hex: '#1e1831' },
  { name: 'Golden Balayage', hex: '#b88e56' },
  { name: 'Rose Gold Gloss', hex: '#db2379' },
  { name: 'Platinum Steel', hex: '#64748b' },
  { name: 'Warm Chestnut', hex: '#ae3115' }
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
        stylist: STYLISTS[0],
        service: SERVICES[3],
        reason: 'Matches Oval face structure with maximum shine and dimensional depth.'
      };
    } else if (hairTexture === 'Curly' || styleGoal === 'Modern Fade') {
      return {
        style: HAIRSTYLES[0],
        stylist: STYLISTS[1],
        service: SERVICES[2],
        reason: 'Perfect for sharp jawlines and low-maintenance texture control.'
      };
    } else {
      return {
        style: HAIRSTYLES[2],
        stylist: STYLISTS[2],
        service: SERVICES[1],
        reason: 'Ideal for scalp rejuvenation, moisture lock, and high stress relief.'
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
    <div className="bg-white border border-[#f2eaff] rounded-3xl p-6 md:p-8 shadow-xl max-w-5xl mx-auto w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f2eaff] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffd9e2] text-[#b50060] text-xs font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span>Aura AI Studio</span>
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#1e1831]">
            Virtual Style Try-On & AI Hair Matcher
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#594047]">
            Preview hairstyles, hair color glazes, and get personalized artisan recommendations before booking.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-[#594047] hover:text-[#1e1831] bg-[#f8f1ff] hover:bg-[#ede4ff] rounded-full transition-colors self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Try-On Canvas (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Face Preview Mirror Canvas */}
          <div className="relative w-full h-[360px] rounded-3xl bg-[#f8f1ff] border-2 border-[#e8ddff] overflow-hidden flex flex-col items-center justify-center shadow-inner group">
            
            {userPhoto ? (
              <img src={userPhoto} alt="User Face Try On" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-6 space-y-2">
                <div className="w-24 h-24 rounded-full bg-[#ede4ff] border-2 border-[#db2379]/40 flex items-center justify-center mx-auto text-[#b50060]">
                  <span className="material-symbols-outlined text-5xl">face</span>
                </div>
                <div className="font-headline text-base font-bold text-[#1e1831]">Face Mirror Canvas</div>
                <p className="text-xs text-[#594047] max-w-xs mx-auto">
                  Upload a photo or tap hairstyles below to preview cut & color overlays.
                </p>
              </div>
            )}

            {/* Selected Hairstyle Visual Tint Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none flex flex-col justify-end p-4">
              <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-[#e8ddff] shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedStyle.preview}</span>
                  <div>
                    <div className="text-xs font-bold text-[#1e1831]">{selectedStyle.name}</div>
                    <div className="text-[11px] font-medium" style={{ color: selectedColor.hex }}>
                      Color Tint: {selectedColor.name}
                    </div>
                  </div>
                </div>

                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: selectedColor.hex }}
                ></div>
              </div>
            </div>

            {/* Photo Upload Overlay Button */}
            <label className="absolute top-4 right-4 bg-white/90 hover:bg-white text-[#1e1831] text-xs font-bold px-3 py-1.5 rounded-full shadow-md cursor-pointer border border-[#e8ddff] flex items-center gap-1.5 transition-all">
              <span className="material-symbols-outlined text-sm text-[#b50060]">photo_camera</span>
              <span>{userPhoto ? 'Change Photo' : 'Upload Photo'}</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>

          </div>

          {/* Color Tint Palette Picker */}
          <div className="bg-[#f8f1ff] p-4 rounded-2xl border border-[#e8ddff] space-y-2">
            <div className="text-xs font-bold text-[#1e1831] uppercase tracking-wider flex items-center justify-between">
              <span>Select Hair Color Glaze Tint</span>
              <span className="text-[11px] text-[#b50060] font-semibold">{selectedColor.name}</span>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {HAIR_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    selectedColor.name === c.name
                      ? 'bg-white border-[#b50060] shadow-md ring-2 ring-[#b50060]'
                      : 'bg-white border-[#e8ddff] hover:bg-[#ede4ff]'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: c.hex }}></span>
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
            <div className="text-xs font-bold text-[#1e1831] uppercase tracking-wider">
              1. Tap Hairstyle to Try On
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              {HAIRSTYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    selectedStyle.id === style.id
                      ? 'bg-[#f8f1ff] border-[#b50060] ring-2 ring-[#b50060] shadow-md'
                      : 'bg-white border-[#e8ddff] hover:bg-[#f8f1ff]'
                  }`}
                >
                  <div className="text-2xl mb-1">{style.preview}</div>
                  <div>
                    <div className="text-xs font-bold text-[#1e1831] line-clamp-1">{style.name}</div>
                    <div className="text-[10px] text-[#594047]">{style.category} Collection</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Hair Matcher Questionnaire */}
          <div className="bg-[#f8f1ff] p-5 rounded-3xl border border-[#e8ddff] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#b50060] uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">psychology</span>
              <span>AI Personal Style Matcher</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#594047] mb-1">Face Shape</label>
                <select
                  value={faceShape}
                  onChange={(e) => setFaceShape(e.target.value)}
                  className="w-full bg-white border border-[#e1bec6] rounded-xl px-2.5 py-1.5 text-xs text-[#1e1831] focus:outline-none focus:border-[#b50060]"
                >
                  <option value="Oval">Oval</option>
                  <option value="Round">Round</option>
                  <option value="Square">Square</option>
                  <option value="Heart">Heart</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#594047] mb-1">Hair Texture</label>
                <select
                  value={hairTexture}
                  onChange={(e) => setHairTexture(e.target.value)}
                  className="w-full bg-white border border-[#e1bec6] rounded-xl px-2.5 py-1.5 text-xs text-[#1e1831] focus:outline-none focus:border-[#b50060]"
                >
                  <option value="Straight">Straight</option>
                  <option value="Wavy">Wavy</option>
                  <option value="Curly">Curly</option>
                  <option value="Coily">Coily</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#594047] mb-1">Style Goal</label>
                <select
                  value={styleGoal}
                  onChange={(e) => setStyleGoal(e.target.value)}
                  className="w-full bg-white border border-[#e1bec6] rounded-xl px-2.5 py-1.5 text-xs text-[#1e1831] focus:outline-none focus:border-[#b50060]"
                >
                  <option value="Volume & Shine">Volume & Shine</option>
                  <option value="Modern Fade">Modern Fade</option>
                  <option value="Scalp Detox">Scalp Detox</option>
                </select>
              </div>
            </div>

            {/* AI Recommendation Result Box */}
            <div className="bg-white p-4 rounded-2xl border border-[#b50060]/30 shadow-sm flex items-start gap-3">
              <img 
                src={recommendation.stylist.avatar} 
                alt={recommendation.stylist.name} 
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#b50060]/40 shrink-0" 
              />
              <div className="flex-1 text-xs">
                <div className="font-bold text-[#b50060] flex items-center gap-1">
                  <span>AI Recommended Ritual: {recommendation.service.name}</span>
                </div>
                <div className="text-[#1e1831] font-semibold mt-0.5">
                  Best Artisan Match: {recommendation.stylist.name} ({recommendation.stylist.role})
                </div>
                <p className="text-[11px] text-[#594047] mt-1">
                  "{recommendation.reason}"
                </p>
              </div>
            </div>

            {/* Book Recommended Look CTA */}
            <button
              type="button"
              onClick={() => {
                if (onSelectServiceAndBook) {
                  onSelectServiceAndBook(recommendation.service, recommendation.stylist);
                }
              }}
              className="w-full py-3 px-4 bg-[#b50060] hover:bg-[#8e004a] text-white font-headline font-bold text-xs rounded-full shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>Book Recommended Look (₹{recommendation.service.price})</span>
              <span className="material-symbols-outlined text-base">auto_awesome</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
