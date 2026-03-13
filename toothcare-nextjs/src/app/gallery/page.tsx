import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Smile Gallery",
    description: "See real before and after dental transformations at TOOTHCARE. Smile makeovers, implants, and cosmetic results.",
};

const cases = [
    { title: "Complete Smile Makeover — Veneers", img: "/images/Cosmetic Dentistry.jpeg" },
    { title: "Dental Implant Restoration", img: "/images/dental implant.jpeg" },
    { title: "Invisalign Alignment", img: "/images/Orthodontics.jpeg" },
    { title: "Professional Teeth Whitening", img: "/images/blog-smile.png" },
    { title: "Full Mouth Rehabilitation", img: "/images/Restorative Care.jpeg" },
    { title: "Emergency Repair & Crown", img: "/images/Emergency Dental.jpeg" },
];

export default function GalleryPage() {
    return (
        <>
            <section className="pt-32 pb-16 bg-gradient-to-br from-[var(--brand)] to-[#163b73] text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-[var(--cta-orange)] font-semibold text-sm tracking-widest uppercase mb-3">Real Results</p>
                    <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold mb-4">Smile Gallery</h1>
                    <p className="text-white/75 text-lg">See the transformations our patients love. Every smile tells a story.</p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cases.map((c) => (
                            <figure key={c.title} className="bg-white rounded-2xl overflow-hidden border border-[var(--border-light)] shadow-sm hover:shadow-xl transition-shadow">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <Image src={c.img} alt={c.title} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" loading="lazy" />
                                </div>
                                <figcaption className="p-4 text-center">
                                    <p className="font-semibold text-[var(--text-dark)] text-sm">{c.title}</p>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
