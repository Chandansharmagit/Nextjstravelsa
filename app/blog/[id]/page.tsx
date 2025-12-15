"use client";

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaClock, FaArrowLeft, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const articles = [
    {
        id: "1",
        title: "Top 10 Hidden Gems in Kathmandu Valley",
        category: "Culture",
        date: "Dec 10, 2025",
        author: "Sarah Anderson",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2600&auto=format&fit=crop",
        excerpt: "Explore the ancient alleyways and secret temples that most tourists miss when visiting Nepal's capital.",
        content: `
# Discovering Kathmandu's Hidden Treasures

When most travelers visit Kathmandu, they stick to the well-trodden path of Durbar Square, Swayambhunath, and Boudhanath. While these iconic sites are absolutely worth visiting, the real magic of Nepal's capital lies in its hidden corners and secret spots that only locals know about.

## 1. The Secret Garden Cafe

Tucked away behind Thamel's busy streets, this peaceful oasis offers a respite from the chaos. Surrounded by blooming flowers and ancient architecture, it's the perfect spot for a morning coffee.

## 2. Patan's Hidden Courtyards

While Patan Durbar Square gets all the attention, the surrounding neighborhood hides dozens of small courtyards with intricate wood carvings and 17th-century architecture.

## 3. The Artisan Workshops of Thimi

Just a short ride from Kathmandu, Thimi is home to traditional pottery workshops where families have been creating beautiful terracotta works for generations.

## 4. Dakshinkali Temple Trail

This lesser-known hiking trail takes you through peaceful forests to a powerful Hindu temple, where you'll find more local worshippers than tourists.

## 5. The Museum of Nepalese Art

Often overlooked by visitors, this small museum houses an incredible collection of traditional Nepalese paintings and sculptures.

## Final Thoughts

The beauty of Kathmandu lies not just in its famous monuments, but in the everyday moments and hidden spaces that reveal the true character of this ancient city. Take time to wander, get lost, and discover your own hidden gems.
        `
    },
    {
        id: "2",
        title: "The Ultimate Packing List for Everest Base Camp",
        category: "Trekking",
        date: "Nov 28, 2025",
        author: "Michael Chen",
        readTime: "12 min read",
        image: "https://images.unsplash.com/photo-1545562083-c583d014b261?q=80&w=2670&auto=format&fit=crop",
        excerpt: "Don't get caught unaware. Here is everything you need to survive and thrive on the world's most famous trek.",
        content: `
# The Complete Everest Base Camp Packing Guide

Trekking to Everest Base Camp is a dream for many adventurers. At 5,364 meters (17,598 feet), proper preparation is crucial for both safety and comfort. Here's your comprehensive packing list.

## Essential Clothing

### Base Layers
- Merino wool or synthetic thermal underwear (tops and bottoms)
- Moisture-wicking t-shirts (3-4)
- Long-sleeve base layer shirts (2)

### Insulation Layers
- Fleece jacket or pullover
- Down jacket (crucial for high altitude)
- Insulated pants for camp

### Outer Layers
- Waterproof and windproof jacket (Gore-Tex recommended)
- Waterproof pants
- Trekking pants (2 pairs)

## Footwear & Accessories
- Well-broken-in trekking boots
- Camp shoes or sandals
- Warm socks (4-5 pairs)
- Liner socks
- Gaiters

## Technical Gear
- Sleeping bag rated to -20°C
- Trekking poles
- Headlamp with extra batteries
- Sunglasses with UV protection
- Water bottles or hydration system

## Health & Hygiene
- First aid kit
- Altitude sickness medication
- Water purification tablets
- Sunscreen (SPF 50+)
- Lip balm with SPF
- Toiletries
- Hand sanitizer
- Wet wipes

## Electronics
- Camera with extra batteries
- Phone and portable charger
- Power adapter
- Headphones

## Documents & Money
- Passport and visa
- Travel insurance documents
- Permits (TIMS card, Sagarmatha National Park permit)
- Cash (Nepali Rupees)
- Credit cards

## Pro Tips

1. **Test Everything**: Never bring new, untested gear on this trek
2. **Pack Light**: You'll be carrying this for 12-14 days
3. **Layer Wisely**: Temperature varies dramatically throughout the day
4. **Bring Cash**: ATMs are scarce beyond Namche Bazaar

Remember, you can buy or rent most equipment in Kathmandu or Namche Bazaar if you forget something. However, having the right gear from the start ensures maximum comfort and safety on your journey to the roof of the world.
        `
    },
    {
        id: "3",
        title: "Why Bhutan Should Be Your Next Spiritual Retreat",
        category: "Wellness",
        date: "Dec 05, 2025",
        author: "Priya Sharma",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1578559318534-1100df88d04a?q=80&w=2681&auto=format&fit=crop",
        excerpt: "Discover the serenity of the Thunder Dragon Kingdom and find inner peace in its monasteries.",
        content: `
# Finding Peace in the Land of the Thunder Dragon

In a world that never stops moving, Bhutan offers something rare: intentional slowness, preserved culture, and genuine spiritual depth. This tiny Himalayan kingdom measures progress not by GDP, but by Gross National Happiness.

## The Philosophy of Gross National Happiness

Unlike anywhere else in the world, Bhutan's government officially prioritizes the well-being and happiness of its citizens over economic growth. This philosophy permeates every aspect of Bhutanese life, creating an atmosphere perfect for spiritual reflection.

## Tiger's Nest Monastery: A Spiritual Pilgrimage

Perched on a cliff 3,000 feet above the Paro Valley, the Taktsang Monastery (Tiger's Nest) is more than just a photo opportunity. The challenging hike to reach it becomes a meditation in itself, with each step bringing you closer to both the monastery and inner peace.

## Meditation Retreats in Remote Dzongs

Many monasteries and dzongs (fortress-monasteries) offer meditation retreats for visitors. These range from day-long introductions to week-long immersive experiences led by Buddhist monks.

### What to Expect:
- Early morning prayer sessions
- Guided meditation instruction
- Simple vegetarian meals
- Silence and reflection time
- Teachings on Buddhist philosophy

## The Practice of Mindfulness in Daily Life

In Bhutan, spirituality isn't confined to monasteries. You'll see prayer flags fluttering in the wind, prayer wheels spun by passersby, and daily rituals that remind people to stay present and grateful.

## Hot Stone Baths: Traditional Wellness

After days of trekking and meditation, indulge in a traditional hot stone bath. Heated river stones warm the water while medicinal herbs infuse their healing properties—a perfect blend of physical relaxation and spiritual cleansing.

## When to Visit

The best times for a spiritual retreat in Bhutan are:
- **Spring (March-May)**: Blooming rhododendrons and clear skies
- **Fall (September-November)**: Perfect weather and festival season

## Final Reflections

Bhutan isn't just a destination; it's a state of mind. Whether you're seeking answers to life's big questions or simply looking to disconnect from the modern world's chaos, this kingdom offers a sanctuary for the soul.
        `
    }
];

export default function ArticlePage() {
    const params = useParams();
    const article = articles.find(a => a.id === params.id);

    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Article Not Found</h1>
                    <Link href="/blog" className="text-primary font-bold hover:underline">
                        ← Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="bg-white">
            {/* Hero Image */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Back Button */}
                <Link href="/blog" className="absolute top-8 left-8 z-20">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition">
                        <FaArrowLeft />
                        <span>Back to Blog</span>
                    </button>
                </Link>

                {/* Article Header */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                    <div className="container mx-auto max-w-4xl">
                        <span className="inline-block px-4 py-1 bg-primary text-white text-sm font-bold rounded-full mb-4">
                            {article.category}
                        </span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-bold text-white mb-6"
                        >
                            {article.title}
                        </motion.h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            <span className="flex items-center gap-2">
                                <FaUser />
                                {article.author}
                            </span>
                            <span className="flex items-center gap-2">
                                <FaCalendarAlt />
                                {article.date}
                            </span>
                            <span className="flex items-center gap-2">
                                <FaClock />
                                {article.readTime}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-3xl">
                    <article className="prose prose-lg max-w-none">
                        <div
                            className="text-gray-700 leading-relaxed space-y-6"
                            dangerouslySetInnerHTML={{
                                __html: article.content
                                    .split('\n')
                                    .map(line => {
                                        if (line.startsWith('# ')) return `<h1 class="text-4xl font-bold text-gray-900 mt-8 mb-4">${line.slice(2)}</h1>`;
                                        if (line.startsWith('## ')) return `<h2 class="text-3xl font-bold text-gray-800 mt-8 mb-4">${line.slice(3)}</h2>`;
                                        if (line.startsWith('### ')) return `<h3 class="text-2xl font-bold text-gray-800 mt-6 mb-3">${line.slice(4)}</h3>`;
                                        if (line.startsWith('- ')) return `<li class="ml-6">${line.slice(2)}</li>`;
                                        if (line.trim() === '') return '<br/>';
                                        return `<p class="text-lg leading-relaxed">${line}</p>`;
                                    })
                                    .join('')
                            }}
                        />
                    </article>

                    {/* Social Share */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Share this article</h3>
                        <div className="flex gap-4">
                            <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                                <FaFacebook size={20} />
                            </button>
                            <button className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition">
                                <FaTwitter size={20} />
                            </button>
                            <button className="p-3 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition">
                                <FaLinkedin size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Author Bio */}
                    <div className="mt-12 p-8 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {article.author.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-800">{article.author}</h4>
                                <p className="text-gray-600">Travel Writer & Photographer</p>
                            </div>
                        </div>
                        <p className="text-gray-600">
                            Passionate about discovering hidden gems and sharing authentic travel experiences from the Himalayas and beyond.
                        </p>
                    </div>

                    {/* Related Articles */}
                    <div className="mt-16">
                        <h3 className="text-3xl font-bold text-gray-800 mb-8">Related Articles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {articles.filter(a => a.id !== article.id).slice(0, 2).map((relatedArticle) => (
                                <Link key={relatedArticle.id} href={`/blog/${relatedArticle.id}`}>
                                    <div className="group cursor-pointer">
                                        <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                                            <Image
                                                src={relatedArticle.image}
                                                alt={relatedArticle.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <span className="text-sm text-primary font-bold">{relatedArticle.category}</span>
                                        <h4 className="text-xl font-bold text-gray-800 mt-2 group-hover:text-primary transition-colors">
                                            {relatedArticle.title}
                                        </h4>
                                        <p className="text-gray-600 mt-2 line-clamp-2">{relatedArticle.excerpt}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
