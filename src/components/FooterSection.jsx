import React from 'react';

export default function FooterSection({ onNavigate }) {
  const footerLinks = [
    {
      label: 'Salon & Services',
      links: [
        { title: 'Haute Hair Artistry', action: 'services' },
        { title: 'Royal Parisian Balayage', action: 'services' },
        { title: 'Botanical Keratin Infusion', action: 'services' },
        { title: 'Artisan Beard Sculpting', action: 'services' },
      ],
    },
    {
      label: 'Smart Experience',
      links: [
        { title: 'Live Priority Queue', action: 'customer' },
        { title: 'Scan-to-Book QR Pass', action: 'qr' },
        { title: 'VIP Client Portal', action: 'customer' },
        { title: 'Staff Kiosk Access', action: 'staff' },
      ],
    },
    {
      label: 'Haute Maison',
      links: [
        { title: 'About Rose & Rogue', action: 'about' },
        { title: 'Master Stylists', action: 'stylists' },
        { title: 'Smart TV Lounge Board', action: 'tv' },
        { title: 'Analytics & Predictions', action: 'admin' },
      ],
    },
    {
      label: 'Connect & Social',
      links: [
        { title: 'Instagram', href: 'https://instagram.com' },
        { title: 'Facebook', href: 'https://facebook.com' },
        { title: 'YouTube', href: 'https://youtube.com' },
        { title: 'LinkedIn', href: 'https://linkedin.com' },
      ],
    },
  ];

  const handleLinkClick = (e, link) => {
    if (link.action && onNavigate) {
      e.preventDefault();
      onNavigate(link.action);
    }
  };

  return (
    <footer className="w-full bg-[#181413] border-t-2 border-[#C1785A]/40 text-[#FAF6F0] relative z-20 mt-16 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
      {/* Full-width Top Gold Foil Glow Line */}
      <div className="bg-gradient-to-r from-transparent via-[#C1785A] to-transparent absolute top-0 right-1/2 left-1/2 h-[2px] w-full md:w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[1px]" />

      <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center px-6 py-14 lg:py-20 overflow-hidden">
        {/* Ambient Dark Brown & Terracotta Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(50%_160px_at_50%_0%,rgba(193,120,90,0.25),transparent)] pointer-events-none" />

        <div className="grid w-full gap-10 xl:grid-cols-3 xl:gap-12 relative z-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C1785A] to-[#8C462C] flex items-center justify-center text-white shadow-md border border-[#E8D8CE]/30">
                <span className="font-serif font-extrabold text-xl leading-none">r</span>
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                  ROSE &amp; ROGUE
                </h2>
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#E5A88E] font-bold">
                  Haute Coiffure • Paris
                </span>
              </div>
            </div>

            <p className="text-[#E0D5CC] text-sm leading-relaxed max-w-sm font-normal">
              Luxury Parisian salon artistry with AI-powered smart queue management and automated WhatsApp priority passes.
            </p>

            <p className="text-[#B5A89E] text-xs pt-4 font-mono">
              © {new Date().getFullYear()} Rose &amp; Rogue Coiffure. All rights reserved.
            </p>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2">
            {footerLinks.map((section) => (
              <div key={section.label} className="space-y-3.5">
                <h3 className="text-xs uppercase font-extrabold tracking-[0.22em] text-[#E5A88E] drop-shadow-sm">
                  {section.label}
                </h3>
                <ul className="space-y-3 text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href || '#'}
                        onClick={(e) => handleLinkClick(e, link)}
                        target={link.href ? '_blank' : undefined}
                        rel={link.href ? 'noreferrer' : undefined}
                        className="text-[#EAE3DA] hover:text-white hover:translate-x-1 inline-flex items-center gap-2 font-medium transition-all duration-300 cursor-pointer"
                      >
                        <span>{link.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
