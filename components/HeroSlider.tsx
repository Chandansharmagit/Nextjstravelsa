"use client";

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
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2000&q=90',
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
        image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=2000&q=90',
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
            className="relative w-full h-[100vh] overflow-hidden"
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
                    style={{
                        backgroundImage: `url('${slide.image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </AnimatePresence>

            {/* Multi-layer gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 z-10" />

            {/* ─── Content ─── */}
            <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-6 md:px-12 xl:px-20 max-w-[1100px] mx-auto w-full">
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
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-[0.25em] px-5 py-2 rounded-full mb-6"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                            {slide.tag}
                        </motion.div>

                        {/* ─ Headline ─ */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.75 }}
                            className="text-4xl md:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight mb-1"
                            style={{ fontFamily: 'var(--font-playfair), serif' }}
                        >
                            {slide.headline}
                        </motion.h1>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.75 }}
                            className="text-4xl md:text-5xl xl:text-6xl font-black leading-tight tracking-tight mb-5"
                            style={{
                                fontFamily: 'var(--font-playfair), serif',
                                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {slide.headlineAccent}
                        </motion.h1>

                        {/* ─ Sub ─ */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45, duration: 0.65 }}
                            className="text-base md:text-lg text-white/75 font-medium max-w-xl mx-auto leading-relaxed mb-3"
                        >
                            {slide.sub}
                        </motion.p>

                        {/* ─ Fact Badge ─ */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.55, duration: 0.6 }}
                            className="inline-block bg-white/5 border border-white/10 text-white/60 text-xs px-4 py-1.5 rounded-full mb-4 font-medium"
                        >
                            {slide.badge}
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* ─── Search Bar ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
                    className="w-full max-w-2xl mx-auto"
                >
                    <div className={`w-full bg-white/95 backdrop-blur-2xl rounded-2xl md:rounded-[2rem] p-2 md:pl-6 shadow-2xl flex flex-col md:flex-row items-center gap-2 md:gap-4 transition-all duration-300 ${isAiEnabled ? 'ring-4 ring-purple-400/60' : ''}`}>
                        <div className="w-full flex-1 flex items-center gap-3 md:border-r border-gray-200 px-4 md:px-0 md:pr-4 py-2 md:py-0">
                            {isAiEnabled ? (
                                <FaMagic className="text-purple-500 text-xl animate-pulse shrink-0" />
                            ) : (
                                <FaMapMarkerAlt className="text-orange-500 text-xl shrink-0" />
                            )}
                            <div className="flex flex-col items-start w-full">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {isAiEnabled ? 'AI Smart Search' : 'Destination'}
                                </span>
                                <input
                                    type="text"
                                    placeholder={isAiEnabled ? 'Describe your dream trip…' : 'Where are you going?'}
                                    className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-semibold text-sm md:text-base"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch(e as any)}
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>
                        <div className="flex w-full md:w-auto items-center gap-2 px-2 pb-2 md:pb-0">
                            <button
                                onClick={() => setIsAiEnabled(!isAiEnabled)}
                                title="Toggle AI"
                                className={`p-3 rounded-full transition-colors shrink-0 ${isAiEnabled ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                            >
                                <FaMagic />
                            </button>
                            <button
                                onClick={handleSearch}
                                className={`flex-1 md:flex-none ${isAiEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded-xl md:rounded-2xl p-3 md:p-4 md:px-8 font-black text-sm md:text-base transition-all duration-300 shadow-xl flex items-center justify-center gap-2`}
                            >
                                {isLoading ? <span className="animate-spin inline-block">⌛</span> : <FaSearch />}
                                <span>Search</span>
                            </button>
                        </div>
                    </div>

                    {/* Popular Tags */}
                    <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-white/70 font-medium px-1">
                        <span className="text-white/40">Popular:</span>
                        {['Pokhara', 'Everest', 'Chitwan', 'Mustang', 'Bhutan'].map(tag => (
                            <button
                                key={tag}
                                onClick={() => router.push(`/search?query=${tag}`)}
                                className="hover:text-orange-400 transition-colors underline underline-offset-2 decoration-white/20 hover:decoration-orange-400"
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
            <div className="absolute right-6 md:right-10 bottom-10 z-30 flex items-center gap-3">
                {/* Slide Counter */}
                <div className="text-white/50 text-xs font-bold tracking-widest">
                    <span className="text-white text-sm">{String(current + 1).padStart(2, '0')}</span>
                    {' / '}
                    {String(slides.length).padStart(2, '0')}
                </div>

                {/* Play/Pause */}
                <button
                    onClick={() => setIsPaused(p => !p)}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all backdrop-blur-md"
                >
                    {isPaused ? <FaPlay size={10} /> : <FaPause size={10} />}
                </button>

                {/* Prev / Next */}
                <button
                    onClick={prev}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-orange-500 border border-white/20 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md"
                >
                    <FaChevronLeft size={12} />
                </button>
                <button
                    onClick={next}
                    className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-all duration-300 shadow-lg shadow-orange-500/30"
                >
                    <FaChevronRight size={12} />
                </button>
            </div>

            {/* ─── Side Slide Thumbs (desktop) ─── */}
            <div className="hidden xl:flex absolute right-10 top-1/2 -translate-y-1/2 z-30 flex-col gap-3">
                {slides.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => goTo(i)}
                        className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${i === current ? 'border-orange-400 scale-110 shadow-lg shadow-orange-400/30' : 'border-white/20 opacity-50 hover:opacity-75'}`}
                    >
                        <img
                            src={s.image}
                            alt={s.tag}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
