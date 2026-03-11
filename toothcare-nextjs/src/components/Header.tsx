"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Smile Gallery", href: "/gallery" },
    { label: "Reviews", href: "/reviews" },
    { label: "Contact", href: "/contact" },
];

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-md py-3"
                    : "bg-transparent py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-1 group" aria-label="TOOTHCARE home">
                    <span
                        className={`text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight transition-colors ${scrolled ? "text-[var(--brand)]" : "text-white"
                            }`}
                    >
                        TOOTH
                        <span className="text-[var(--cta-orange)]">CARE</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-[var(--cta-orange)] ${scrolled ? "text-[var(--text-dark)]" : "text-white"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTAs */}
                <div className="hidden lg:flex items-center gap-3">
                    <a
                        href="tel:+10000000000"
                        className={`text-sm font-semibold flex items-center gap-2 transition-colors ${scrolled ? "text-[var(--brand)]" : "text-white"
                            }`}
                    >
                        📞 Call Now
                    </a>
                    <Link
                        href="/contact"
                        className="bg-[var(--cta-orange)] hover:bg-[var(--cta-orange-hover)] text-white px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-lg min-h-[44px] flex items-center"
                    >
                        Book Appointment
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="lg:hidden flex flex-col gap-1.5 p-2 min-w-[44px] min-h-[44px] items-center justify-center"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                >
                    <span
                        className={`block w-6 h-0.5 transition-all ${scrolled ? "bg-[var(--text-dark)]" : "bg-white"
                            } ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
                    />
                    <span
                        className={`block w-6 h-0.5 transition-all ${scrolled ? "bg-[var(--text-dark)]" : "bg-white"
                            } ${mobileOpen ? "opacity-0" : ""}`}
                    />
                    <span
                        className={`block w-6 h-0.5 transition-all ${scrolled ? "bg-[var(--text-dark)]" : "bg-white"
                            } ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
                    />
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl transition-all duration-300 overflow-hidden ${mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <nav className="flex flex-col p-6 gap-1" aria-label="Mobile navigation">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-[var(--text-dark)] font-medium py-3 px-4 rounded-lg hover:bg-[var(--bg-muted)] transition-colors text-base min-h-[44px] flex items-center"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <hr className="my-3 border-[var(--border-light)]" />
                    <a
                        href="tel:+10000000000"
                        className="text-[var(--brand)] font-semibold py-3 px-4 text-base min-h-[44px] flex items-center gap-2"
                    >
                        📞 Call Now
                    </a>
                    <Link
                        href="/contact"
                        onClick={() => setMobileOpen(false)}
                        className="bg-[var(--cta-orange)] text-white text-center py-4 rounded-xl font-semibold text-base min-h-[44px]"
                    >
                        Book Appointment
                    </Link>
                </nav>
            </div>
        </header>
    );
}
