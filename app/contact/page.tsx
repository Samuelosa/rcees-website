import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";
import { site, images } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Regional Centre for Energy and Environmental Sustainability at UENR, Sunyani, Ghana.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch with the Centre."
        lead="For admissions queries, research collaboration, media enquiries or visits to the Centre, please use the form below or reach us directly by phone or email."
        image={images.contact}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="container-rcees py-24">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading eyebrow="Visit us" title="Where to find us." />
            <address className="mt-8 space-y-1 not-italic text-[1rem] leading-relaxed text-ink/80">
              {site.address.lines.map((l) => <p key={l}>{l}</p>)}
            </address>
            <div className="mt-8 space-y-2 text-[1rem] text-ink/80">
              {site.phones.map((p) => (
                <p key={p}><a href={`tel:${p.replace(/\s/g, "")}`}>{p}</a></p>
              ))}
              <p><a href={`mailto:${site.email}`}>{site.email}</a></p>
            </div>
            <div className="mt-10 overflow-hidden border border-rule">
              <iframe
                title="RCEES location map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-2.37%2C7.31%2C-2.31%2C7.36&layer=mapnik&marker=7.3349%2C-2.3359"
                className="h-[320px] w-full"
                loading="lazy"
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <SectionHeading eyebrow="Write to us" title="Send a message." />
            <p className="mt-4 text-sm text-muted">
              The form opens your email client pre-filled with your message — we reply within two working days.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
