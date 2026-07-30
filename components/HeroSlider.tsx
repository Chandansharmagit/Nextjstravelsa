"use client";

import Image from 'next/image';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaMagic, FaChevronLeft, FaChevronRight, FaPlay, FaPause } from 'react-icons/fa';


const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=90',
        tag: 'Himalayan Adventures',
        headline: 'Touch the Roof',
        headlineAccent: 'of the World.',
        sub: 'Trek through the breathtaking Everest region with expert local guides.',
        cta: 'Explore Himalayan Tours',
        ctaLink: '/tours',
        badge: '🏔️  8,849m above sea level',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1611516491426-03025e6043c8?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tag: 'Cultural Immersion',
        headline: 'Where Ancient',
        headlineAccent: 'Meets Alive.',
        sub: 'Uncover the mystical temples, festivals, and living heritage of Nepal.',
        cta: 'Discover Cultural Tours',
        ctaLink: '/tours',
        badge: '🛕  3,000+ years of history',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=90',
        tag: 'Luxury Escapes',
        headline: 'Serenity Beyond',
        headlineAccent: 'Imagination.',
        sub: 'Curated luxury lodges, private treks, and bespoke journeys designed for you.',
        cta: 'View Luxury Packages',
        ctaLink: '/destinations',
        badge: '✨  Bespoke & private',
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1511215579272-6192432f83bc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tag: 'Wildlife Safaris',
        headline: 'Into the Heart',
        headlineAccent: 'of the Wild.',
        sub: 'Encounter one-horned rhinos and Bengal tigers in Chitwan National Park.',
        cta: 'Book a Safari',
        ctaLink: '/tours',
        badge: '🐅  Home of the Royal Bengal Tiger',
    },
    {
        id: 5,
        image: 'https://plus.unsplash.com/premium_photo-1771517088930-37cc4fda6447?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tag: 'Wildlife Safaris',
        headline: 'Into the Heart',
        headlineAccent: 'of the Wild.',
        sub: 'Encounter one-horned rhinos and Bengal tigers in Chitwan National Park.',
        cta: 'Book a Safari',
        ctaLink: '/tours',
        badge: '🐅  Home of the Royal Bengal Tiger',
    },
];

const SLIDE_DURATION = 6000;

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [query, setQuery] = useState('');
    const [isAiEnabled, setIsAiEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const progressRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    const next = useCallback(() => {
        setCurrent(prev => (prev + 1) % slides.length);
        setProgress(0);
    }, []);

    const prev = useCallback(() => {
        setCurrent(prev => (prev - 1 + slides.length) % slides.length);
        setProgress(0);
    }, []);

    const goTo = useCallback((i: number) => {
        setCurrent(i);
        setProgress(0);
    }, []);

    // Auto-play timer
    useEffect(() => {
        if (isPaused) return;
        timerRef.current = setTimeout(next, SLIDE_DURATION);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [current, isPaused, next]);

    // Progress bar
    useEffect(() => {
        if (isPaused) return;
        setProgress(0);
        const start = Date.now();
        progressRef.current = setInterval(() => {
            const elapsed = Date.now() - start;
            setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100));
        }, 30);
        return () => { if (progressRef.current) clearInterval(progressRef.current); };
    }, [current, isPaused]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setIsLoading(true);
        router.push(`/search?query=${encodeURIComponent(query)}${isAiEnabled ? '&smart=true' : ''}`);
    };

    const slide = slides[current];

    return (
        <div
            className="relative w-full h-[calc(100vh-126px)] overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* ─── Background Slides ─── */}
            <AnimatePresence mode="sync">
                <motion.div
                    key={slide.id}
                    initial={{ scale: 1.08, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.96, opacity: 0 }}
                    transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                    className="absolute inset-0 w-full h-full"
                >
                    <Image
                        src={slide.image}
                        alt={slide.headline}
                        fill
                        className="object-cover"
                        priority={current === 0}
                        quality={90}
                        sizes="100vw"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Multi-layer gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 z-10" />

            {/* ─── Content ─── */}
            <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto w-full pt-12 md:pt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`content-${slide.id}`}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="w-full"
                    >
                        {/* ─ Badge ─ */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15, duration: 0.6 }}
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] font-outfit px-6 py-2.5 rounded-full mb-4"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                            {slide.tag}
                        </motion.div>

                        {/* ─ Headline ─ */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.75 }}
                            className="text-4xl md:text-6xl xl:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-1 font-outfit"
                        >
                            {slide.headline}
                        </motion.h1>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.75 }}
                            className="text-4xl md:text-6xl xl:text-8xl font-normal italic leading-[0.85] tracking-tighter mb-4 font-playfair text-white/90"
                        >
                            {slide.headlineAccent}
                        </motion.h1>

                        {/* ─ Sub ─ */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45, duration: 0.65 }}
                            className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed mb-4 drop-shadow-lg"
                        >
                            {slide.sub}
                        </motion.p>

                        {/* ─ Fact Badge ─ */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.55, duration: 0.6 }}
                            className="inline-block bg-white/5 backdrop-blur-sm border border-white/10 text-white/50 text-[10px] uppercase tracking-[0.2em] px-5 py-2 rounded-full mb-6 font-black font-outfit"
                        >
                            {slide.badge}
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* ─── Search Bar with Category Tabs ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
                    className="w-full max-w-3xl mx-auto"
                >
                    {/* Search Category Tabs */}
                    <div className="flex justify-center md:justify-start gap-2 mb-2 px-2">
                        {['All Expeditions', 'Mountain Treks', 'Helicopter Tours', 'Cultural Safaris'].map((tab, idx) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    if (idx === 1) setQuery('Trek');
                                    else if (idx === 2) setQuery('Helicopter');
                                    else if (idx === 3) setQuery('Cultural');
                                    else setQuery('');
                                }}
                                className={`px-4 py-2 rounded-t-2xl text-[11px] font-black uppercase tracking-wider font-outfit transition-all ${
                                    (idx === 0 && !query) || (idx === 1 && query === 'Trek') || (idx === 2 && query === 'Helicopter') || (idx === 3 && query === 'Cultural')
                                        ? 'bg-white/20 text-white backdrop-blur-xl border-t border-x border-white/30'
                                        : 'bg-black/20 text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className={`
                        w-full bg-white/10 backdrop-blur-[30px] rounded-3xl md:rounded-[32px] p-2 md:pl-8 
                        shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/20
                        flex flex-col md:flex-row items-center gap-2 md:gap-4 transition-all duration-500 
                        ${isAiEnabled ? 'ring-4 ring-blue-400/30 border-blue-400/50' : ''}
                    `}>
                        <div className="w-full flex-1 flex items-center gap-4 md:border-r border-white/10 px-4 md:px-0 md:pr-6 py-3 md:py-0">
                            {isAiEnabled ? (
                                <FaMagic className="text-blue-400 text-xl animate-pulse shrink-0" />
                            ) : (
                                <FaMapMarkerAlt className="text-amber-400 text-xl shrink-0" />
                            )}
                            <div className="flex flex-col items-start w-full">
                                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-outfit mb-0.5">
                                    {isAiEnabled ? 'AI Smart Intelligence' : 'Destination / Experience'}
                                </span>
                                <input
                                    type="text"
                                    placeholder={isAiEnabled ? 'Describe your dream sanctuary…' : 'Search Everest, Annapurna, Chitwan…'}
                                    className="w-full bg-transparent outline-none text-white placeholder-white/40 font-bold text-lg"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch(e as any)}
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>
                        <div className="flex w-full md:w-auto items-center gap-3 px-2 pb-2 md:pb-0 md:pr-2">
                            <button
                                onClick={() => setIsAiEnabled(!isAiEnabled)}
                                title="Toggle AI Smart Search"
                                className={`p-4 rounded-[20px] transition-all duration-300 shrink-0 ${isAiEnabled ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                            >
                                <FaMagic size={18} />
                            </button>
                            <button
                                onClick={handleSearch}
                                className={`
                                    flex-1 md:flex-none h-14 md:px-10 rounded-[20px] font-black text-[13px] uppercase tracking-widest font-outfit
                                    transition-all duration-500 shadow-xl flex items-center justify-center gap-3
                                    ${isAiEnabled 
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/40' 
                                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:scale-[1.02] shadow-amber-400/20'
                                    }
                                `}
                            >
                                {isLoading ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <FaSearch size={14} />}
                                <span>Find Journeys</span>
                            </button>
                        </div>
                    </div>

                    {/* Popular Tags */}
                    <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-white/80 font-medium px-1">
                        <span className="text-white/40 font-bold uppercase tracking-wider text-[10px]">Trending:</span>
                        {['Everest Base Camp', 'Annapurna Circuit', 'Pokhara Helicopter', 'Chitwan Safari', 'Mustang Kingdom'].map(tag => (
                            <button
                                key={tag}
                                onClick={() => router.push(`/search?query=${encodeURIComponent(tag)}`)}
                                className="hover:text-amber-300 transition-colors underline underline-offset-2 decoration-white/20 hover:decoration-amber-400 text-xs font-semibold"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ─── Progress Lines ─── */}
            <div className="absolute bottom-0 left-0 right-0 z-30 flex">
                {slides.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => goTo(i)}
                        className="flex-1 h-1 bg-white/20 relative overflow-hidden transition-all"
                    >
                        {i === current && (
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-orange-400"
                                style={{ width: `${progress}%` }}
                                transition={{ ease: 'linear' }}
                            />
                        )}
                        {i < current && (
                            <div className="absolute inset-0 bg-white/60" />
                        )}
                    </button>
                ))}
            </div>

            {/* ─── Navigation + Controls ─── */}
            <div className="absolute right-6 md:right-12 bottom-12 z-30 flex items-center gap-3">
                {/* Slide Counter */}
                <div className="text-white/70 text-xs font-black tracking-widest font-outfit px-3 py-1.5 rounded-full bg-slate-950/60 border border-white/20">
                    <span className="text-amber-400 text-sm font-bold">{String(current + 1).padStart(2, '0')}</span>
                    {' / '}
                    <span>{String(slides.length).padStart(2, '0')}</span>
                </div>

                {/* Play/Pause */}
                <button
                    onClick={() => setIsPaused(p => !p)}
                    className="w-10 h-10 rounded-full bg-slate-950/60 hover:bg-slate-900 border border-white/20 text-white flex items-center justify-center transition-all duration-300 shadow-md"
                    title={isPaused ? "Play Autoplay" : "Pause Autoplay"}
                >
                    {isPaused ? <FaPlay size={10} /> : <FaPause size={10} />}
                </button>

                {/* Prev / Next */}
                <button
                    onClick={prev}
                    className="w-11 h-11 rounded-full bg-slate-950/60 hover:bg-amber-400 hover:text-slate-950 border border-white/20 text-white flex items-center justify-center transition-all duration-300 shadow-md"
                    title="Previous Slide"
                >
                    <FaChevronLeft size={13} />
                </button>
                <button
                    onClick={next}
                    className="w-11 h-11 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center transition-all duration-300 shadow-lg shadow-amber-400/30 hover:scale-105"
                    title="Next Slide"
                >
                    <FaChevronRight size={13} />
                </button>
            </div>

            {/* ─── Sleek Clean Slide Indicators (No blur container) ─── */}
            <div className="hidden xl:flex absolute right-12 top-1/2 -translate-y-1/2 z-30 flex-col gap-2.5">
                {slides.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => goTo(i)}
                        className={`transition-all duration-300 ${
                            i === current
                                ? 'w-3 h-10 bg-amber-400 rounded-full shadow-lg shadow-amber-400/40'
                                : 'w-3 h-3 bg-white/40 hover:bg-white/80 rounded-full'
                        }`}
                        title={s.tag}
                    />
                ))}
            </div>
        </div>
    );
}
