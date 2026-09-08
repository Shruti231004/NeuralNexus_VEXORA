'use client';

import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FacebookIcon, Sparkles, InstagramIcon, LinkedinIcon, YoutubeIcon, Scissors } from 'lucide-react';
import Link from 'next/link';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Salon & Services',
		links: [
			{ title: 'Haute Hair Artistry', href: '/book?service=srv-1' },
			{ title: 'Royal Parisian Balayage', href: '/book?service=srv-2' },
			{ title: 'Botanical Keratin Infusion', href: '/book?service=srv-3' },
			{ title: 'Artisan Beard Sculpting', href: '/book?service=srv-4' },
		],
	},
	{
		label: 'Smart Experience',
		links: [
			{ title: 'Live Priority Queue', href: '/queue/demo' },
			{ title: 'Scan-to-Book QR', href: '/scan' },
			{ title: 'VIP Customer Portal', href: '/auth/customer-login' },
			{ title: 'Staff Kiosk Login', href: '/auth/staff-login' },
		],
	},
	{
		label: 'Haute Maison',
		links: [
			{ title: 'About Rose & Rogue', href: '/#about' },
			{ title: 'Bespoke Stylists', href: '/#stylists' },
			{ title: 'Smart TV Lounge Board', href: '/tv' },
			{ title: 'Analytics & Predictions', href: '/analytics' },
		],
	},
	{
		label: 'Connect & Social',
		links: [
			{ title: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
			{ title: 'Facebook', href: 'https://facebook.com', icon: FacebookIcon },
			{ title: 'YouTube', href: 'https://youtube.com', icon: YoutubeIcon },
			{ title: 'LinkedIn', href: 'https://linkedin.com', icon: LinkedinIcon },
		],
	},
];

export function Footer() {
	return (
		<footer className="w-full bg-[#181413] border-t-2 border-[#C1785A]/40 text-[#FAF6F0] relative z-20 mt-16 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
			{/* Full-width Top Gold Foil Glow Line */}
			<div className="bg-gradient-to-r from-transparent via-[#C1785A] to-transparent absolute top-0 right-1/2 left-1/2 h-[2px] w-full md:w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[1px]" />

			<div className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center px-6 py-14 lg:py-20 overflow-hidden">
				{/* Ambient Dark Brown & Terracotta Radial Glow */}
				<div className="absolute inset-0 bg-[radial-gradient(50%_160px_at_50%_0%,rgba(193,120,90,0.25),transparent)] pointer-events-none" />

				<div className="grid w-full gap-10 xl:grid-cols-3 xl:gap-12 relative z-10">
					{/* Brand Column */}
					<AnimatedContainer className="space-y-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C1785A] to-[#8C462C] flex items-center justify-center text-[#FAF6F0] shadow-md border border-[#E8D8CE]/20">
								<Scissors className="w-5 h-5" />
							</div>
							<div>
								<h2 className="font-serif text-2xl font-bold tracking-tight text-[#FAF6F0]">
									ROSE &amp; ROGUE
								</h2>
								<span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C1785A]">
									Haute Coiffure • Paris
								</span>
							</div>
						</div>

						<p className="text-[#B5A99F] text-xs md:text-sm leading-relaxed max-w-sm">
							Luxury Parisian salon artistry with AI-powered smart queue management and automated WhatsApp priority passes.
						</p>

						<p className="text-[#8C7E76] text-xs pt-4 font-mono">
							© {new Date().getFullYear()} Rose &amp; Rogue Coiffure. All rights reserved.
						</p>
					</AnimatedContainer>

					{/* Link Columns */}
					<div className="grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2">
						{footerLinks.map((section, index) => (
							<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
								<div className="space-y-3">
									<h3 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#C1785A]">
										{section.label}
									</h3>
									<ul className="space-y-2.5 text-xs text-[#B5A99F]">
										{section.links.map((link) => (
											<li key={link.title}>
												<Link
													href={link.href}
													className="hover:text-[#FAF6F0] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-300"
												>
													{link.icon && <link.icon className="w-3.5 h-3.5 text-[#C1785A]" />}
													<span>{link.title}</span>
												</Link>
											</li>
										))}
									</ul>
								</div>
							</AnimatedContainer>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
