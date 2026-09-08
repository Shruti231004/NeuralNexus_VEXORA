'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Users,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  PieChart,
  BarChart3,
  Scissors,
  Award,
  Zap,
  ShieldCheck,
  RefreshCw,
  LayoutDashboard,
  Tv,
  QrCode,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { Appointment } from '@/lib/types';
import { subscribeToAppointments } from '@/lib/supabaseClient';
import { formatINR } from '@/lib/queueEngine';
import { INITIAL_SERVICES, INITIAL_STYLISTS } from '@/lib/mockData';
import { GoogleSecurityGate } from '@/components/GoogleSecurityGate';

export default function AnalyticsPredictionsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAppointments((list: Appointment[]) => {
      setAppointments(list);
    });
    return () => unsubscribe();
  }, []);

  // Hourly prediction vs actual traffic dataset
  const hourlyData = [
    { hour: '10 AM', actual: 4, predicted: 5, peak: false },
    { hour: '11 AM', actual: 6, predicted: 7, peak: false },
    { hour: '12 PM', actual: 8, predicted: 8, peak: false },
    { hour: '1 PM', actual: 5, predicted: 6, peak: false },
    { hour: '2 PM', actual: 4, predicted: 5, peak: false },
    { hour: '3 PM', actual: 7, predicted: 8, peak: false },
    { hour: '4 PM', actual: 11, predicted: 12, peak: true },
    { hour: '5 PM', actual: 14, predicted: 15, peak: true },
    { hour: '6 PM', actual: 16, predicted: 17, peak: true },
    { hour: '7 PM', actual: 12, predicted: 13, peak: true },
    { hour: '8 PM', actual: 6, predicted: 7, peak: false },
  ];

  // Category statistics and AI predictions
  const categoryStats = [
    {
      category: 'Cut & Style',
      count: 18,
      predictedCount: 22,
      percentage: 42,
      revenue: 43200,
      avgDuration: '45 min',
      color: '#C1785A', // Terracotta
      growth: '+14%',
    },
    {
      category: 'Color Services',
      count: 12,
      predictedCount: 15,
      percentage: 28,
      revenue: 81600,
      avgDuration: '90 min',
      color: '#8C462C', // Deep Rust
      growth: '+22%',
    },
    {
      category: 'Hair Treatments',
      count: 8,
      predictedCount: 10,
      percentage: 18,
      revenue: 28000,
      avgDuration: '60 min',
      color: '#C98A2C', // Warm Amber
      growth: '+8%',
    },
    {
      category: 'Grooming',
      count: 5,
      predictedCount: 7,
      percentage: 12,
      revenue: 9000,
      avgDuration: '40 min',
      color: '#5C5550', // Warm Mocha
      growth: '+18%',
    },
  ];

  const totalClients = categoryStats.reduce((acc, c) => acc + c.count, 0);
  const predictedTotal = categoryStats.reduce((acc, c) => acc + c.predictedCount, 0);
  const totalProjectedRev = categoryStats.reduce((acc, c) => acc + c.revenue, 0);

  // Stylist Chair Station Load Forecast
  const stylistWorkloads = [
    {
      name: 'Antoine Dubois',
      chair: 'Station #1',
      specialty: 'Editorial Cuts & Balayage',
      utilization: 94,
      servedToday: 9,
      queuePending: 3,
    },
    {
      name: 'Camille Laurent',
      chair: 'Station #2',
      specialty: 'Master Color & Blonde Alchemy',
      utilization: 88,
      servedToday: 6,
      queuePending: 2,
    },
    {
      name: 'Julien Moreau',
      chair: 'Station #3',
      specialty: 'Men Haute Precision Fade',
      utilization: 78,
      servedToday: 7,
      queuePending: 1,
    },
    {
      name: 'Élodie Fontaine',
      chair: 'Station #4',
      specialty: 'Caviar & Restorative Spa',
      utilization: 85,
      servedToday: 5,
      queuePending: 2,
    },
  ];

  return (
    <GoogleSecurityGate
      targetRole="staff"
      title="Predictive AI & Analytics Gate"
      subtitle="Google account authentication is required to access footfall forecasting, revenue analytics, and chair capacity metrics."
    >
      <div className="min-h-screen bg-[#FAF6F0] text-[#2C2725] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#EAE3DA] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6E6663] hover:text-[#2C2725] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kiosk Dashboard</span>
              </Link>
              <span className="text-[#DDD3C6]">/</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C462C]">
                Predictive Analytics
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C1785A] text-[#FAF6F0] flex items-center justify-center shadow-warm shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2C2725]">
                  Customer Traffic & Category Predictions
                </h1>
                <p className="text-xs sm:text-sm text-[#6E6663] mt-0.5">
                  AI-driven queue forecasting, peak hour modeling, and category revenue distribution.
                </p>
              </div>
            </div>
          </div>

          {/* Time Range Horizon Tabs */}
          <div className="flex items-center gap-2 bg-[#F3ECE3] p-1.5 rounded-full border border-[#EAE3DA] shadow-sm self-start md:self-auto">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                timeRange === 'today'
                  ? 'bg-[#C1785A] text-[#FAF6F0] shadow-warm'
                  : 'text-[#6E6663] hover:text-[#2C2725]'
              }`}
            >
              Today Forecast
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                timeRange === 'week'
                  ? 'bg-[#C1785A] text-[#FAF6F0] shadow-warm'
                  : 'text-[#6E6663] hover:text-[#2C2725]'
              }`}
            >
              7-Day Trend
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                timeRange === 'month'
                  ? 'bg-[#C1785A] text-[#FAF6F0] shadow-warm'
                  : 'text-[#6E6663] hover:text-[#2C2725]'
              }`}
            >
              30-Day Outlook
            </button>
          </div>
        </div>

        {/* 4 CORE PREDICTIVE KPI METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-[#F3ECE3] p-6 rounded-3xl border border-[#EAE3DA] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6663]">
                Total Customers
              </span>
              <span className="p-2 rounded-xl bg-[#F5E6DF] text-[#8C462C] shadow-sm">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2725]">
                {totalClients}
              </span>
              <span className="text-xs font-bold text-[#8C462C] flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +18% vs avg
              </span>
            </div>
            <p className="text-xs text-[#6E6663]">
              AI Forecast: <strong className="text-[#2C2725]">{predictedTotal} clients</strong> by 9 PM closing.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#F3ECE3] p-6 rounded-3xl border border-[#EAE3DA] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6663]">
                Peak Congestion Window
              </span>
              <span className="p-2 rounded-xl bg-[#FDF2E2] text-[#9E6517] shadow-sm">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#9E6517]">
                4 PM – 7:30 PM
              </span>
            </div>
            <p className="text-xs text-[#6E6663]">
              Chairs predicted at <strong className="text-[#9E6517]">96% capacity</strong>.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#F3ECE3] p-6 rounded-3xl border border-[#EAE3DA] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6663]">
                Top Category Demand
              </span>
              <span className="p-2 rounded-xl bg-[#F5E6DF] text-[#8C462C] shadow-sm">
                <Scissors className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C2725]">
                Cut & Style
              </span>
              <span className="text-xs font-bold text-[#8C462C]">42% share</span>
            </div>
            <p className="text-xs text-[#6E6663]">
              18 active & pre-booked sessions today.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#F3ECE3] p-6 rounded-3xl border border-[#EAE3DA] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6663]">
                Projected Day Revenue
              </span>
              <span className="p-2 rounded-xl bg-[#F5E6DF] text-[#8C462C] shadow-sm">
                <Award className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#C1785A]">
                {formatINR(totalProjectedRev)}
              </span>
            </div>
            <p className="text-xs text-[#6E6663]">
              Avg ticket size: <strong className="text-[#2C2725]">₹3,840</strong> per client.
            </p>
          </div>
        </div>

        {/* AI SMART QUEUE ADVISORY BANNER */}
        <div className="bg-[#FFF9F2] p-6 rounded-3xl border-2 border-[#C98A2C] shadow-warm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FDF2E2] border-2 border-[#C98A2C] flex items-center justify-center text-[#8C462C] shrink-0 shadow-sm">
              <Zap className="w-7 h-7 text-[#C1785A] animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#7A4500] bg-[#FCE9CC] px-3 py-0.5 rounded-full border border-[#ECC98A]">
                AI Queue Optimization Insight
              </span>
              <h3 className="font-serif font-bold text-lg text-[#2C2725]">
                High Color Processing Overlap Expected Between 4:30 PM & 6:00 PM
              </h3>
              <p className="text-xs sm:text-sm text-[#4A423D]">
                Camille Laurent has 2 Balayage sessions scheduled. Her station chair will be unoccupied for 35 minutes during developer setting. The system will automatically suggest 2 express walk-in haircuts to optimize revenue.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-full bg-[#C1785A] hover:bg-[#A86347] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider shadow-warm transition-all shrink-0"
          >
            Open Floor Kiosk
          </Link>
        </div>

        {/* GRAPH 1 & GRAPH 2 GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* GRAPH 1: HOURLY CUSTOMER VOLUME & PREDICTION CURVE */}
          <div className="lg:col-span-7 bg-[#F3ECE3] p-6 sm:p-8 rounded-3xl border border-[#EAE3DA] shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE3DA] pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#C1785A] font-bold">
                  Traffic Heatmap & Forecast
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#2C2725]">
                  Hourly Customer Volume
                </h2>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#C1785A]" />
                  <span className="text-[#2C2725]">Actual Customers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#E8D8CE] border border-[#C1785A]" />
                  <span className="text-[#6E6663]">AI Predicted</span>
                </div>
              </div>
            </div>

            {/* Custom Interactive SVG / Bar Visualization */}
            <div className="space-y-3 pt-2">
              <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 px-2 bg-[#FAF6F0] rounded-2xl border border-[#EAE3DA] relative">
                {/* Horizontal guide lines */}
                <div className="absolute inset-x-4 top-1/4 border-b border-dashed border-[#EAE3DA]" />
                <div className="absolute inset-x-4 top-2/4 border-b border-dashed border-[#EAE3DA]" />
                <div className="absolute inset-x-4 top-3/4 border-b border-dashed border-[#EAE3DA]" />

                {hourlyData.map((d, i) => {
                  const maxVal = 20;
                  const actualHeight = (d.actual / maxVal) * 100;
                  const predHeight = (d.predicted / maxVal) * 100;
                  const isHovered = hoveredHour === i;

                  return (
                    <div
                      key={d.hour}
                      onMouseEnter={() => setHoveredHour(i)}
                      onMouseLeave={() => setHoveredHour(null)}
                      className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                    >
                      {/* Tooltip on Hover */}
                      {isHovered && (
                        <div className="absolute -top-14 z-30 bg-[#2C2725] text-white p-2 rounded-xl shadow-xl text-[11px] whitespace-nowrap text-center pointer-events-none">
                          <p className="font-bold">{d.hour}</p>
                          <p className="text-[#E8D8CE]">Actual: {d.actual} • Pred: {d.predicted}</p>
                        </div>
                      )}

                      <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-full">
                        {/* Predicted Bar */}
                        <div
                          style={{ height: `${predHeight}%` }}
                          className="w-1/2 bg-[#E8D8CE] border border-[#C1785A]/40 rounded-t-md transition-all duration-500"
                        />
                        {/* Actual Bar */}
                        <div
                          style={{ height: `${actualHeight}%` }}
                          className={`w-1/2 rounded-t-md transition-all duration-500 ${
                            d.peak
                              ? 'bg-gradient-to-t from-[#8C462C] to-[#C1785A] shadow-md'
                              : 'bg-[#C1785A]'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-Axis Hour Labels */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#6E6663] px-2">
                {hourlyData.map((d) => (
                  <span key={d.hour} className={d.peak ? 'font-bold text-[#8C462C]' : ''}>
                    {d.hour}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#6E6663] pt-2 border-t border-[#EAE3DA]">
              <span>🔥 Peak traffic expected from 4:00 PM to 7:00 PM (16+ clients/hour)</span>
              <span className="font-bold text-[#2C2725]">Confidence: 94.2%</span>
            </div>
          </div>

          {/* GRAPH 2: CATEGORY BREAKDOWN & PROPORTION METRICS */}
          <div className="lg:col-span-5 bg-[#F3ECE3] p-6 sm:p-8 rounded-3xl border border-[#EAE3DA] shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-[#EAE3DA] pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#C1785A] font-bold">
                  Service Demographics
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#2C2725]">
                  Categories Breakdown
                </h2>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#EAE3DA] text-[#8C462C]">
                {categoryStats.length} Categories
              </span>
            </div>

            {/* Visual Proportion Horizontal Bars */}
            <div className="space-y-4">
              {categoryStats.map((cat) => (
                <div
                  key={cat.category}
                  className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EAE3DA] space-y-2.5 hover:border-[#C1785A] transition-colors shadow-sm"
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <h4 className="font-serif font-bold text-[#2C2725]">{cat.category}</h4>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-[#2C2725]">{cat.count} guests</span>
                      <span className="text-xs text-[#8C462C] font-bold ml-1.5">({cat.percentage}%)</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-[#EAE3DA] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6E6663] pt-1">
                    <span>Avg Service: <strong className="text-[#2C2725]">{cat.avgDuration}</strong></span>
                    <span className="font-mono font-bold text-[#C1785A]">{formatINR(cat.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Proportion Donut Summary */}
            <div className="p-4 rounded-2xl bg-[#F5E6DF] border border-[#E8D0C5] flex items-center justify-between text-xs text-[#8C462C] font-bold">
              <span>Online Pre-Booked: 64%</span>
              <span>•</span>
              <span>Lounge Walk-Ins: 36%</span>
            </div>
          </div>
        </div>

        {/* GRAPH 3: STYLIST CHAIR UTILIZATION & WORKLOAD MATRIX */}
        <div className="bg-[#F3ECE3] p-6 sm:p-8 rounded-3xl border border-[#EAE3DA] shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE3DA] pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C1785A] font-bold">
                Capacity Engine
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#2C2725]">
                Master Stylist Station Utilization Forecast
              </h2>
            </div>
            <span className="text-xs text-[#6E6663] font-semibold">
              Live capacity and queue throughput for today
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stylistWorkloads.map((st) => (
              <div
                key={st.name}
                className="bg-[#FAF6F0] p-5 rounded-3xl border border-[#EAE3DA] shadow-sm space-y-3 hover:border-[#C1785A] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase font-bold text-[#C1785A]">
                      {st.chair}
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#2C2725] mt-0.5">
                      {st.name}
                    </h4>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      st.utilization >= 90
                        ? 'bg-[#F5E6DF] text-[#8C462C] border border-[#E8D0C5]'
                        : 'bg-[#EAE3DC] text-[#4A423D] border border-[#D8CFC7]'
                    }`}
                  >
                    {st.utilization}% Load
                  </span>
                </div>

                <div className="space-y-1 text-xs text-[#6E6663]">
                  <p className="line-clamp-1">{st.specialty}</p>
                </div>

                {/* Utilization gauge bar */}
                <div className="w-full h-2 bg-[#EAE3DA] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C1785A] to-[#8C462C] rounded-full"
                    style={{ width: `${st.utilization}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#6E6663] pt-1">
                  <span>Served: <strong className="text-[#2C2725]">{st.servedToday}</strong></span>
                  <span>In Queue: <strong className="text-[#C1785A]">{st.queuePending}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GRAPH 4: CUSTOMER REVIEWS & STYLIST RATINGS LEADERBOARD */}
        <div className="bg-[#F3ECE3] p-6 sm:p-8 rounded-3xl border border-[#EAE3DA] shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE3DA] pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C1785A] font-bold">
                Quality & Artistry Index
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#2C2725]">
                Verified Customer Stylist Ratings & Compliments
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-[#FAF6F0] px-3.5 py-1.5 rounded-full border border-[#EAE3DA] text-xs font-bold text-[#8C462C]">
              <span>Salon Avg: 4.95 ★</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INITIAL_STYLISTS.map((stylist) => (
              <div
                key={stylist.id}
                className="bg-[#FAF6F0] p-5 rounded-3xl border border-[#EAE3DA] space-y-3.5 shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={stylist.avatar_url}
                    alt={stylist.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#C1785A] shadow-sm"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#2C2725]">{stylist.name}</h4>
                    <p className="text-xs text-[#6E6663]">{stylist.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs font-extrabold text-[#C98A2C]">★ {stylist.rating || 4.95}</span>
                      <span className="text-[11px] text-[#6E6663]">({stylist.reviews_count || 120})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EAE3DA] space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#6E6663] tracking-wider block">
                    Top Compliments:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {stylist.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 rounded-md bg-[#F3ECE3] text-[10px] font-semibold text-[#4A423D] border border-[#EAE3DA]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </GoogleSecurityGate>
  );
}
