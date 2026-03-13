import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "About Our Clinic",
    description: "Learn about TOOTHCARE's world-class dental specialists, modern technology, and patient-first philosophy.",
};

export default function AboutPage() {
    return (
        <>
            <section className="pt-32 pb-16 bg-gradient-to-br from-[var(--brand)] to-[#163b73] text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-[var(--cta-orange)] font-semibold text-sm tracking-widest uppercase mb-3">About TOOTHCARE</p>
                    <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold mb-4">Where Precision Meets Compassion</h1>
                    <p className="text-white/75 text-lg">A premium dental hospital built around your comfort, safety, and smile.</p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Mission */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                        <div>
                            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--text-dark)] mb-6">Our Philosophy</h2>
                            <p className="text-[var(--text-body)] leading-relaxed mb-4">
                                At TOOTHCARE, we believe every patient deserves dental care that&apos;s not just clinically excellent, but also deeply human. Our practice is built on three pillars: cutting-edge technology, genuine empathy, and a relentless commitment to your comfort.
                            </p>
                            <p className="text-[var(--text-body)] leading-relaxed">
                                From the moment you walk through our doors, you&apos;ll notice the difference — warm lighting, calming music, and a team that listens. We don&apos;t rush. We explain. We care. That&apos;s the TOOTHCARE promise.
                            </p>
                        </div>
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                            <Image src="/images/Ergonomic Treatment Suites.jpeg" alt="Modern TOOTHCARE dental clinic interior" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" loading="lazy" />
                        </div>
                    </div>

                    {/* Technology */}
                    <div className="text-center mb-12">
                        <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--text-dark)] mb-4">Precision Dental Equipment</h2>
                        <p className="text-[var(--text-muted)] max-w-2xl mx-auto">State-of-the-art technology for faster, safer, and more comfortable treatments.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { img: "/images/3D Cone Beam Scanner.jpeg", title: "3D Cone Beam Scanner", desc: "High-resolution 3D imaging for precise diagnostics and implant planning." },
                            { img: "/images/Laser Dentistry System.jpeg", title: "Laser Dentistry", desc: "Minimally invasive soft tissue procedures with faster healing times." },
                            { img: "/images/Ergonomic Treatment Suites.jpeg", title: "Ergonomic Suites", desc: "Climate-controlled rooms with memory-foam chairs and ambient lighting." },
                        ].map((eq) => (
                            <div key={eq.title} className="bg-[var(--bg-soft)] rounded-2xl overflow-hidden border border-[var(--border-light)]">
                                <div className="relative aspect-video overflow-hidden">
                                    <Image src={eq.img} alt={eq.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />
                                </div>
                                <div className="p-6">
                                    <h3 className="font-semibold text-[var(--text-dark)] mb-2">{eq.title}</h3>
                                    <p className="text-sm text-[var(--text-muted)]">{eq.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
