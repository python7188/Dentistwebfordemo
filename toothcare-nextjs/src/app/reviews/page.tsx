import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Patient Reviews",
    description: "Read what patients say about TOOTHCARE. 4.9/5 rating with 150+ reviews on Google.",
};

const reviews = [
    { quote: "I'd been afraid of dentists my entire life, but the team at TOOTHCARE made me feel completely at ease. My new smile has genuinely changed how I carry myself every day.", author: "Sarah M.", location: "Los Angeles, CA", rating: 5 },
    { quote: "From the front desk to the operating room, the experience was first-class. Dr. Chen's full-mouth work was painless, precise, and the results exceeded anything I imagined.", author: "James T.", location: "San Francisco, CA", rating: 5 },
    { quote: "My Invisalign journey with Dr. Rivera was fantastic. In just 10 months, I had the straight teeth I'd dreamed about for years. The staff is so supportive and warm.", author: "Priya K.", location: "San Diego, CA", rating: 5 },
    { quote: "I brought my whole family to TOOTHCARE and couldn't be happier. The kids love the friendly staff and I love knowing we're getting top-tier care.", author: "Michael R.", location: "Santa Monica, CA", rating: 5 },
    { quote: "After a dental emergency on a Saturday night, TOOTHCARE's 24/7 line saved me. They got me in first thing Sunday morning and fixed everything. Truly grateful.", author: "Lisa W.", location: "Pasadena, CA", rating: 5 },
    { quote: "The cosmetic work Dr. Patel did on my veneers is absolutely stunning. People keep complimenting my smile and I just feel so much more confident now.", author: "David K.", location: "Beverly Hills, CA", rating: 5 },
];

export default function ReviewsPage() {
    return (
        <>
            <section className="pt-32 pb-16 bg-gradient-to-br from-[var(--brand)] to-[#163b73] text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-[var(--cta-orange)] font-semibold text-sm tracking-widest uppercase mb-3">Patient Stories</p>
                    <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold mb-4">What Our Patients Say</h1>
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <span className="text-yellow-400 text-2xl">★★★★★</span>
                        <span className="text-white/90 text-lg font-semibold">4.9/5</span>
                        <span className="text-white/60">· 150+ Reviews on Google</span>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((r) => (
                            <div key={r.author} className="bg-[var(--bg-soft)] border border-[var(--border-light)] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                                <div className="text-yellow-400 text-lg mb-4">{"★".repeat(r.rating)}</div>
                                <blockquote className="text-[var(--text-dark)] text-base leading-relaxed mb-6 italic">
                                    &ldquo;{r.quote}&rdquo;
                                </blockquote>
                                <p className="font-semibold text-[var(--text-dark)] text-sm">{r.author}</p>
                                <p className="text-[var(--text-muted)] text-xs">{r.location}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Review Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Dentist",
                        name: "TOOTHCARE",
                        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "150" },
                        review: reviews.slice(0, 3).map((r) => ({
                            "@type": "Review",
                            author: { "@type": "Person", name: r.author },
                            reviewBody: r.quote,
                            reviewRating: { "@type": "Rating", ratingValue: r.rating },
                        })),
                    }),
                }}
            />
        </>
    );
}
