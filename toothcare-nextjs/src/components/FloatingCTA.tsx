"use client";

import Link from "next/link";

export default function FloatingCTA() {
    return (
        <div className="fixed bottom-6 right-6 z-40 lg:hidden flex flex-col gap-3">
            <a
                href="tel:+10000000000"
                className="w-14 h-14 bg-[var(--brand)] text-white rounded-full flex items-center justify-center shadow-xl text-xl hover:scale-110 transition-transform"
                aria-label="Call us"
            >
                📞
            </a>
            <Link
                href="/contact"
                className="w-14 h-14 bg-[var(--cta-orange)] text-white rounded-full flex items-center justify-center shadow-xl text-xl hover:scale-110 transition-transform"
                aria-label="Book appointment"
            >
                📅
            </Link>
        </div>
    );
}
