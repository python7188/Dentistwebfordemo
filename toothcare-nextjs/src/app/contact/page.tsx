import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Book your dental appointment at TOOTHCARE. Call, email, or fill out our quick form. Same-day appointments available.",
};

export default function ContactPage() {
    return (
        <>
            <section className="pt-32 pb-16 bg-gradient-to-br from-[var(--brand)] to-[#163b73] text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-[var(--cta-orange)] font-semibold text-sm tracking-widest uppercase mb-3">Get In Touch</p>
                    <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold mb-4">Book Your Appointment</h1>
                    <p className="text-white/75 text-lg">We&apos;d love to hear from you. Reach out by phone, email, or book online.</p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Booking Form */}
                        <div className="bg-[var(--bg-soft)] rounded-2xl p-8 border border-[var(--border-light)]">
                            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--text-dark)] mb-6">Request an Appointment</h2>
                            <form className="space-y-5">
                                <div>
                                    <label htmlFor="service" className="block text-sm font-semibold text-[var(--text-dark)] mb-1.5">Service Needed</label>
                                    <select id="service" name="service" className="w-full px-4 py-3 rounded-xl border border-[var(--border-light)] text-[var(--text-body)] bg-white focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent outline-none min-h-[44px]">
                                        <option value="">Select a service…</option>
                                        <option>Dental Implants</option>
                                        <option>Cosmetic Dentistry</option>
                                        <option>Orthodontics / Invisalign</option>
                                        <option>Root Canal / Restorative</option>
                                        <option>General Dentistry</option>
                                        <option>Emergency Dental</option>
                                        <option>General Consultation</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="date" className="block text-sm font-semibold text-[var(--text-dark)] mb-1.5">Preferred Date</label>
                                        <input id="date" type="date" className="w-full px-4 py-3 rounded-xl border border-[var(--border-light)] bg-white focus:ring-2 focus:ring-[var(--brand)] outline-none min-h-[44px]" />
                                    </div>
                                    <div>
                                        <label htmlFor="time" className="block text-sm font-semibold text-[var(--text-dark)] mb-1.5">Preferred Time</label>
                                        <input id="time" type="time" className="w-full px-4 py-3 rounded-xl border border-[var(--border-light)] bg-white focus:ring-2 focus:ring-[var(--brand)] outline-none min-h-[44px]" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-[var(--text-dark)] mb-1.5">Full Name *</label>
                                    <input id="name" type="text" required placeholder="e.g. Sarah Mitchell" className="w-full px-4 py-3 rounded-xl border border-[var(--border-light)] bg-white focus:ring-2 focus:ring-[var(--brand)] outline-none min-h-[44px]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold text-[var(--text-dark)] mb-1.5">Phone *</label>
                                        <input id="phone" type="tel" required placeholder="+1 555 555 5555" className="w-full px-4 py-3 rounded-xl border border-[var(--border-light)] bg-white focus:ring-2 focus:ring-[var(--brand)] outline-none min-h-[44px]" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-[var(--text-dark)] mb-1.5">Email *</label>
                                        <input id="email" type="email" required placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-[var(--border-light)] bg-white focus:ring-2 focus:ring-[var(--brand)] outline-none min-h-[44px]" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-semibold text-[var(--text-dark)] mb-1.5">Additional Notes</label>
                                    <textarea id="notes" rows={3} placeholder="Any specific concerns?" className="w-full px-4 py-3 rounded-xl border border-[var(--border-light)] bg-white focus:ring-2 focus:ring-[var(--brand)] outline-none resize-none" />
                                </div>
                                <button type="submit" className="w-full bg-[var(--cta-orange)] hover:bg-[var(--cta-orange-hover)] text-white py-4 rounded-xl font-bold text-base transition-colors min-h-[44px]">
                                    Confirm Appointment Request
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { icon: "📞", title: "Phone", info: "+1 (000) 000-0000", href: "tel:+10000000000", sub: "Mon–Sat" },
                                    { icon: "💬", title: "WhatsApp", info: "Chat with us", href: "https://wa.me/10000000000", sub: "Quick responses 24/7" },
                                    { icon: "✉️", title: "Email", info: "hello@toothcare.com", href: "mailto:hello@toothcare.com", sub: "Reply within 2 hrs" },
                                    { icon: "📍", title: "Visit", info: "123 Smile Avenue", href: "#map", sub: "Los Angeles, CA 90001" },
                                ].map((c) => (
                                    <a key={c.title} href={c.href} className="bg-[var(--bg-soft)] border border-[var(--border-light)] rounded-2xl p-6 hover:shadow-lg transition-shadow text-center block min-h-[44px]">
                                        <span className="text-3xl block mb-2">{c.icon}</span>
                                        <h3 className="font-semibold text-[var(--text-dark)] mb-1">{c.title}</h3>
                                        <p className="text-[var(--brand)] text-sm font-medium">{c.info}</p>
                                        <p className="text-[var(--text-muted)] text-xs mt-1">{c.sub}</p>
                                    </a>
                                ))}
                            </div>

                            {/* Hours */}
                            <div className="bg-[var(--bg-soft)] border border-[var(--border-light)] rounded-2xl p-6">
                                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-center mb-4">Clinic Hours</h3>
                                <table className="w-full text-sm">
                                    <tbody>
                                        {[
                                            ["Monday – Friday", "8:00 AM – 6:00 PM"],
                                            ["Saturday", "9:00 AM – 2:00 PM"],
                                            ["Sunday", "Closed"],
                                        ].map(([day, hours]) => (
                                            <tr key={day} className="border-b border-[var(--border-light)] last:border-0">
                                                <th className="py-3 text-left font-medium text-[var(--text-dark)]">{day}</th>
                                                <td className="py-3 text-right text-[var(--text-body)]">{hours}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <th className="py-3 text-left font-medium text-[var(--cta-orange)]">Emergency</th>
                                            <td className="py-3 text-right font-semibold text-[var(--cta-orange)]">24/7 Hotline</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Map Placeholder */}
                            <div id="map" className="bg-[var(--bg-muted)] rounded-2xl h-64 flex items-center justify-center text-[var(--text-muted)] text-sm">
                                📍 123 Smile Avenue, Suite 100, Los Angeles, CA 90001 ·{" "}
                                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] ml-1 hover:underline">
                                    Open in Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
