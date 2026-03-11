import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Blog & Insights",
    description: "Expert dental advice, treatment guides, and tips for a healthier, brighter smile from the TOOTHCARE team.",
};

const posts = [
    { slug: "prevent-cavities", title: "How to Prevent Cavities: The Complete Guide", excerpt: "Simple daily habits and professional treatments that keep cavities at bay for your whole family.", tag: "Preventive Care", date: "March 1, 2026", readTime: "5 min" },
    { slug: "teeth-whitening-safety", title: "Is Teeth Whitening Safe? What You Need to Know", excerpt: "Separating myths from facts about professional and at-home whitening options.", tag: "Cosmetic Dentistry", date: "February 18, 2026", readTime: "4 min" },
    { slug: "dental-implant-benefits", title: "5 Life-Changing Benefits of Dental Implants", excerpt: "Discover why implants are the gold standard for replacing missing teeth permanently.", tag: "Implants", date: "February 5, 2026", readTime: "6 min" },
    { slug: "emergency-dental-care", title: "What to Do in a Dental Emergency", excerpt: "Step-by-step guidance for knocked-out teeth, severe pain, and broken restorations.", tag: "Emergency", date: "January 20, 2026", readTime: "3 min" },
    { slug: "children-dental-hygiene", title: "Children's Dental Hygiene: Age-by-Age Guide", excerpt: "Everything parents need to know about caring for their child's teeth from infancy to teens.", tag: "Family Dentistry", date: "January 8, 2026", readTime: "7 min" },
];

export default function BlogPage() {
    return (
        <>
            <section className="pt-32 pb-16 bg-gradient-to-br from-[var(--brand)] to-[#163b73] text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-[var(--cta-orange)] font-semibold text-sm tracking-widest uppercase mb-3">From Our Blog</p>
                    <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold mb-4">Latest Insights</h1>
                    <p className="text-white/75 text-lg">Expert advice, treatment guides, and tips for a healthier smile.</p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <article key={post.slug} className="bg-white border border-[var(--border-light)] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="bg-gradient-to-br from-[var(--brand)]/10 to-[var(--accent-mint)]/10 h-48 flex items-center justify-center">
                                    <span className="text-5xl opacity-30">📝</span>
                                </div>
                                <div className="p-6">
                                    <span className="inline-block bg-[var(--accent-mint)]/20 text-[var(--brand)] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                                        {post.tag}
                                    </span>
                                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--text-dark)] mb-2 leading-snug">
                                        <Link href={`/blog/${post.slug}`} className="hover:text-[var(--brand)] transition-colors">
                                            {post.title}
                                        </Link>
                                    </h3>
                                    <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4">{post.excerpt}</p>
                                    <p className="text-xs text-[var(--text-muted)]">{post.date} · {post.readTime} read</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
