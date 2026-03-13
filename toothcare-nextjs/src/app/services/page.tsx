import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Our Services",
    description: "Explore TOOTHCARE's comprehensive dental services including implants, cosmetic dentistry, Invisalign, root canal, emergency care, and family dentistry.",
};

const services = [
    {
        id: "implants", icon: "🦷", title: "Dental Implants", img: "/images/dental implant.jpeg",
        overview: "A permanent titanium root replacement topped with a custom porcelain crown that looks and feels like a natural tooth.",
        benefits: ["Restores chewing and speech", "Prevents bone loss", "Lasts a lifetime with care", "No adhesives needed"],
        steps: ["Initial consultation & 3D scan", "Implant placement surgery", "Healing period (3-6 months)", "Custom crown attachment"],
        recovery: "Most patients return to normal activities within 1-2 days. Full integration takes 3-6 months.",
        cost: "Starting from $3,000 per implant. Financing options available."
    },
    {
        id: "cosmetic", icon: "✨", title: "Cosmetic Dentistry", img: "/images/Cosmetic Dentistry.jpeg",
        overview: "Veneers, bonding, and professional whitening designed to create a brighter, more even, magazine-ready smile.",
        benefits: ["Dramatically whiter teeth", "Even, symmetrical smile", "Minimal tooth reduction", "Same-day bonding options"],
        steps: ["Smile design consultation", "Digital preview of results", "Tooth preparation", "Custom restoration placement"],
        recovery: "Most cosmetic procedures have little to no downtime.",
        cost: "Varies by treatment. Whitening from $299, veneers from $1,200."
    },
    {
        id: "orthodontics", icon: "😁", title: "Invisalign & Orthodontics", img: "/images/Orthodontics.jpeg",
        overview: "Clear aligners and modern braces for straighter teeth without traditional metal brackets.",
        benefits: ["Nearly invisible treatment", "Removable for eating", "Fewer office visits", "Predictable digital results"],
        steps: ["3D scan & treatment plan", "Custom aligner fabrication", "Bi-weekly aligner changes", "Retainer fitting"],
        recovery: "No recovery needed. Mild discomfort for 1-2 days with each new aligner.",
        cost: "Invisalign from $3,500. Payment plans available."
    },
    {
        id: "restorative", icon: "🔧", title: "Root Canal & Restorative", img: "/images/Restorative Care.jpeg",
        overview: "Crowns, bridges, root canals, and fillings to restore damaged or infected teeth and prevent extraction.",
        benefits: ["Save your natural tooth", "Eliminate pain and infection", "Modern painless techniques", "Long-lasting restorations"],
        steps: ["Diagnosis & X-rays", "Numbing & access", "Cleaning & shaping", "Filling & crown placement"],
        recovery: "Mild tenderness for 2-3 days. Over-the-counter pain relief is usually sufficient.",
        cost: "Root canal from $700. Crowns from $900."
    },
    {
        id: "emergency", icon: "🚨", title: "Emergency Dentistry", img: "/images/Emergency Dental.jpeg",
        overview: "24/7 urgent care for broken teeth, severe toothaches, knocked-out teeth, and dental trauma.",
        benefits: ["Same-day appointments", "24/7 phone hotline", "Pain management priority", "Walk-ins welcome"],
        steps: ["Call our emergency line", "Immediate assessment", "Pain relief & stabilization", "Treatment plan & follow-up"],
        recovery: "Depends on the emergency. Our team provides clear aftercare instructions.",
        cost: "Emergency exam from $150. Treatment costs vary."
    },
    {
        id: "general", icon: "🩺", title: "Family & General Dentistry", img: "/images/General Dentistry.jpeg",
        overview: "Routine checkups, professional cleanings, fluoride treatments, and preventive care for the whole family.",
        benefits: ["Catch problems early", "Professional deep cleaning", "Children & adult care", "Insurance accepted"],
        steps: ["Comprehensive exam", "Digital X-rays", "Professional cleaning", "Treatment plan if needed"],
        recovery: "No downtime. Resume normal activities immediately.",
        cost: "Checkup & cleaning from $199. Most insurance accepted."
    },
];

export default function ServicesPage() {
    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-[var(--brand)] to-[#163b73] text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-[var(--cta-orange)] font-semibold text-sm tracking-widest uppercase mb-3">Our Expertise</p>
                    <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold mb-4">Comprehensive Dental Services</h1>
                    <p className="text-white/75 text-lg max-w-2xl mx-auto">From preventive care to complex restorations — everything your smile needs under one roof.</p>
                </div>
            </section>

            {/* Services */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6 space-y-24">
                    {services.map((svc, i) => (
                        <article key={svc.id} id={svc.id} className="scroll-mt-28">
                            <div className={`grid lg:grid-cols-2 gap-12 items-start ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                                <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                                    <Image src={svc.img} alt={svc.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" loading="lazy" />
                                </div>
                                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-3xl">{svc.icon}</span>
                                        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-[var(--text-dark)]">{svc.title}</h2>
                                    </div>
                                    <p className="text-[var(--text-body)] text-base leading-relaxed mb-6">{svc.overview}</p>

                                    <h3 className="font-semibold text-[var(--text-dark)] mb-2">Key Benefits</h3>
                                    <ul className="grid grid-cols-2 gap-2 mb-6">
                                        {svc.benefits.map((b) => (
                                            <li key={b} className="flex items-start gap-2 text-sm text-[var(--text-body)]">
                                                <span className="text-[var(--accent-mint-dark)] mt-0.5">✓</span> {b}
                                            </li>
                                        ))}
                                    </ul>

                                    <h3 className="font-semibold text-[var(--text-dark)] mb-2">Procedure Steps</h3>
                                    <ol className="space-y-2 mb-6">
                                        {svc.steps.map((step, j) => (
                                            <li key={j} className="flex items-start gap-3 text-sm text-[var(--text-body)]">
                                                <span className="w-6 h-6 bg-[var(--brand)] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">{j + 1}</span>
                                                {step}
                                            </li>
                                        ))}
                                    </ol>

                                    <div className="bg-[var(--bg-soft)] rounded-xl p-4 mb-4">
                                        <p className="text-sm"><strong>Recovery:</strong> {svc.recovery}</p>
                                    </div>
                                    <div className="bg-[var(--bg-soft)] rounded-xl p-4 mb-6">
                                        <p className="text-sm"><strong>Cost Guidance:</strong> {svc.cost}</p>
                                    </div>

                                    <Link href="/contact" className="inline-block bg-[var(--cta-orange)] hover:bg-[var(--cta-orange-hover)] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors min-h-[44px]">
                                        Book {svc.title} Consultation
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}
