import Link from "next/link";

const footerLinks = {
    quickLinks: [
        { label: "Our Services", href: "/services" },
        { label: "Meet the Doctors", href: "/about" },
        { label: "Smile Gallery", href: "/gallery" },
        { label: "Patient Reviews", href: "/reviews" },
        { label: "Blog & Insights", href: "/blog" },
        { label: "Contact Us", href: "/contact" },
    ],
    services: [
        { label: "Dental Implants", href: "/services#implants" },
        { label: "Cosmetic Dentistry", href: "/services#cosmetic" },
        { label: "Invisalign", href: "/services#orthodontics" },
        { label: "Root Canal", href: "/services#restorative" },
        { label: "Emergency Dentistry", href: "/services#emergency" },
        { label: "Family Dentistry", href: "/services#general" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-[var(--brand)] text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="inline-block mb-4" aria-label="TOOTHCARE home">
                            <span className="text-2xl font-bold font-[family-name:var(--font-display)]">
                                TOOTH<span className="text-[var(--cta-orange)]">CARE</span>
                            </span>
                        </Link>
                        <p className="text-white/70 text-sm leading-relaxed mb-6">
                            Premium dental care meets luxury comfort. Your smile deserves the
                            best — from routine cleanings to complete smile makeovers.
                        </p>
                        <div className="flex gap-3">
                            {["Facebook", "Instagram", "Twitter", "YouTube"].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    aria-label={social}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm hover:bg-[var(--cta-orange)] transition-colors min-w-[44px] min-h-[44px]"
                                >
                                    {social[0]}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-[family-name:var(--font-display)] text-lg font-semibold mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5">
                            {footerLinks.quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/70 hover:text-[var(--cta-orange)] transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-[family-name:var(--font-display)] text-lg font-semibold mb-4">
                            Services
                        </h4>
                        <ul className="space-y-2.5">
                            {footerLinks.services.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/70 hover:text-[var(--cta-orange)] transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Hours */}
                    <div>
                        <h4 className="font-[family-name:var(--font-display)] text-lg font-semibold mb-4">
                            Contact
                        </h4>
                        <address className="not-italic text-white/70 text-sm space-y-3">
                            <p>📍 123 Smile Avenue, Suite 100<br />Los Angeles, CA 90001</p>
                            <p>
                                <a href="tel:+10000000000" className="hover:text-[var(--cta-orange)] transition-colors">
                                    📞 +1 (000) 000-0000
                                </a>
                            </p>
                            <p>
                                <a href="mailto:hello@toothcare.com" className="hover:text-[var(--cta-orange)] transition-colors">
                                    ✉️ hello@toothcare.com
                                </a>
                            </p>
                        </address>
                        <div className="mt-4 text-sm text-white/60">
                            <p>Mon–Fri: 8 AM – 6 PM</p>
                            <p>Saturday: 9 AM – 2 PM</p>
                            <p className="text-[var(--cta-orange)] font-semibold">Emergency: 24/7</p>
                        </div>
                    </div>
                </div>

                <hr className="my-10 border-white/10" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
                    <p>© {new Date().getFullYear()} TOOTHCARE. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Accessibility</a>
                        <a href="#" className="hover:text-white transition-colors">HIPAA Notice</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
