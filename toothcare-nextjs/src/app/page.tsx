import Image from "next/image";
import Link from "next/link";
import GlobalBookingCTA from "@/components/GlobalBookingCTA";

const services = [
  { icon: "🦷", title: "Dental Implants", desc: "Permanent titanium root replacement topped with a custom porcelain crown.", img: "/images/dental implant.jpeg", href: "/services#implants" },
  { icon: "✨", title: "Cosmetic Dentistry", desc: "Veneers, bonding, and whitening designed to perfect your smile.", img: "/images/Cosmetic Dentistry.jpeg", href: "/services#cosmetic" },
  { icon: "😁", title: "Orthodontics", desc: "Clear aligners and braces for a straighter, more confident smile.", img: "/images/Orthodontics.jpeg", href: "/services#orthodontics" },
  { icon: "🔧", title: "Restorative Care", desc: "Crowns, bridges, and fillings to restore damaged teeth.", img: "/images/Restorative Care.jpeg", href: "/services#restorative" },
  { icon: "🩺", title: "General Dentistry", desc: "Checkups, cleanings, and preventive care for the whole family.", img: "/images/General Dentistry.jpeg", href: "/services#general" },
  { icon: "🚨", title: "Emergency Dental", desc: "24/7 urgent care for dental emergencies and acute pain.", img: "/images/Emergency Dental.jpeg", href: "/services#emergency" },
];

const doctors = [
  { name: "Dr. Sarah Chen", specialty: "Prosthodontics & Implants", img: "/images/doctor-1.png", creds: "DDS, FACP · NYU College of Dentistry" },
  { name: "Dr. Marcus Rivera", specialty: "Orthodontics & Invisalign", img: "/images/doctor-2.png", creds: "DMD, MS · Columbia University" },
  { name: "Dr. Ananya Patel", specialty: "Cosmetic & General Dentistry", img: "/images/doctor-3.png", creds: "DDS · UCLA School of Dentistry" },
];

const testimonials = [
  { quote: "The team at TOOTHCARE made me feel completely at ease. My new smile has genuinely changed how I carry myself.", author: "Sarah M.", location: "Los Angeles, CA" },
  { quote: "From the front desk to the operating room, the experience was first-class. Dr. Chen's work exceeded anything I imagined.", author: "James T.", location: "San Francisco, CA" },
  { quote: "My Invisalign journey with Dr. Rivera was fantastic. In just 10 months, I had the straight teeth I'd always dreamed about.", author: "Priya K.", location: "San Diego, CA" },
];

const stats = [
  { value: "10,000+", label: "Smiles Transformed" },
  { value: "25+", label: "Years of Excellence" },
  { value: "50+", label: "Expert Specialists" },
  { value: "98%", label: "Patient Satisfaction" },
];

export default function Home() {
  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/HOME PAGE.png"
            alt="Modern dental clinic with advanced equipment and warm lighting"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand)]/90 via-[var(--brand)]/70 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 lg:py-0">
          <div className="max-w-2xl">
            <p className="text-[var(--accent-mint)] font-semibold text-sm tracking-widest uppercase mb-4">
              Premium Dental Care
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your Smile Deserves{" "}
              <em className="not-italic text-[var(--cta-orange)]">
                World-Class Care
              </em>
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              Precision dentistry in a calming environment. From routine cleanings
              to complete smile transformations — experience dental care
              reimagined.
            </p>
            <div className="flex flex-wrap gap-4">
              <GlobalBookingCTA
                className="bg-[var(--cta-orange)] hover:bg-[var(--cta-orange-hover)] text-white px-8 py-4 rounded-full font-semibold text-base transition-all hover:scale-105 shadow-xl min-h-[44px]"
              >
                Book Your Visit
              </GlobalBookingCTA>
              <a
                href="tel:+10000000000"
                className="border-2 border-white/40 hover:border-white text-white px-8 py-4 rounded-full font-semibold text-base transition-all hover:bg-white/10 min-h-[44px]"
              >
                📞 Call 24/7
              </a>
            </div>
            {/* Trust Ribbon */}
            <div className="flex items-center gap-4 mt-10 flex-wrap">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                <span className="text-yellow-400 text-lg">★★★★★</span>
                <span className="text-white/90 text-sm font-medium">
                  4.9/5 on Google
                </span>
              </div>
              <span className="text-white/60 text-sm">
                150+ Happy Patients
              </span>
              <span className="text-white/60 text-sm">
                🏥 ADA Certified
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Services Section ─── */}
      <section id="services" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[var(--accent-mint-dark)] font-semibold text-sm tracking-widest uppercase mb-3">
              What We Offer
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--text-dark)] mb-4">
              Our Services
            </h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
              Comprehensive dental care delivered with precision, compassion, and
              a commitment to your comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <Link
                key={svc.title}
                href={svc.href}
                className="group bg-white border border-[var(--border-light)] rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-muted)]">
                  <Image
                    src={svc.img}
                    alt={svc.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-xl">
                    {svc.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--text-dark)] mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us / Stats ─── */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--brand)] to-[#163b73] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[var(--cta-orange)] font-semibold text-sm tracking-widest uppercase mb-3">
            Why Choose TOOTHCARE
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold mb-12">
            Trusted by Thousands of Happy Patients
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="p-6">
                <span className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-[var(--cta-orange)] block mb-2">
                  {stat.value}
                </span>
                <span className="text-white/80 text-sm font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🛡️", title: "Safety First", desc: "Hospital-grade sterilization and HIPAA-compliant protocols keep you protected." },
              { icon: "🔬", title: "Modern Technology", desc: "3D imaging, laser dentistry, and AI-guided procedures for precision results." },
              { icon: "💙", title: "Pain-Free Comfort", desc: "Sedation options, calming environments, and a team trained in patient empathy." },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 text-left hover:bg-white/10 transition-colors"
              >
                <span className="text-3xl mb-4 block">{feature.icon}</span>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Doctors Section ─── */}
      <section className="py-20 lg:py-28 bg-[var(--bg-soft)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[var(--accent-mint-dark)] font-semibold text-sm tracking-widest uppercase mb-3">
              Meet Our Specialists
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--text-dark)] mb-4">
              Expert Dentists, Exceptional Care
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doc) => (
              <div
                key={doc.name}
                className="bg-white rounded-2xl overflow-hidden border border-[var(--border-light)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className="relative aspect-[3/3.5] overflow-hidden bg-gradient-to-br from-[var(--bg-muted)] to-[#f8f6f3]">
                  <Image
                    src={doc.img}
                    alt={`${doc.name} — ${doc.specialty}`}
                    fill
                    className="object-cover hover:scale-[1.03] transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-[family-name:var(--font-display)] text-xl font-semibold mb-1">
                    {doc.name}
                  </h4>
                  <p className="text-[var(--accent-mint-dark)] text-sm font-semibold uppercase tracking-wide mb-2">
                    {doc.specialty}
                  </p>
                  <p className="text-[var(--text-muted)] text-xs mb-4">
                    {doc.creds}
                  </p>
                  <Link
                    href="/contact"
                    className="inline-block bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors min-h-[44px]"
                  >
                    Book with {doc.name.split(" ")[1]}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[var(--accent-mint-dark)] font-semibold text-sm tracking-widest uppercase mb-3">
              Patient Stories
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--text-dark)]">
              What Our Patients Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="bg-[var(--bg-soft)] border border-[var(--border-light)] rounded-2xl p-8"
              >
                <div className="text-yellow-400 text-lg mb-4">★★★★★</div>
                <blockquote className="text-[var(--text-dark)] text-base leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <p className="font-semibold text-[var(--text-dark)] text-sm">
                  {t.author}
                </p>
                <p className="text-[var(--text-muted)] text-xs">{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Strip ─── */}
      <section className="py-16 bg-gradient-to-r from-[var(--cta-orange)] to-[#ff6b3d] text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold mb-4">
            Ready for Your Perfect Smile?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Your journey to confidence, comfort, and a stunning smile starts
            with one simple step.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <GlobalBookingCTA
              className="bg-white text-[var(--cta-orange)] px-8 py-4 rounded-full font-bold text-base hover:shadow-xl hover:scale-105 transition-all min-h-[44px]"
            >
              Book Appointment
            </GlobalBookingCTA>
            <a
              href="tel:+10000000000"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-base hover:bg-white/10 transition-all min-h-[44px]"
            >
              📞 Call Us Now
            </a>
          </div>
        </div>
      </section>

      {/* ─── Schema Markup ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dentist",
            name: "TOOTHCARE Premium Dental Hospital",
            description: "Premium dental hospital offering world-class dental implants, cosmetic dentistry, orthodontics, and emergency care.",
            url: "https://dentistwebfordemo.vercel.app",
            telephone: "+10000000000",
            address: {
              "@type": "PostalAddress",
              streetAddress: "123 Smile Avenue, Suite 100",
              addressLocality: "Los Angeles",
              addressRegion: "CA",
              postalCode: "90001",
              addressCountry: "US",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 34.0522,
              longitude: -118.2437,
            },
            openingHoursSpecification: [
              { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
              { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "14:00" },
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "150",
            },
          }),
        }}
      />
    </>
  );
}
