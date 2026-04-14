import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { site } from "@/lib/constants";

export function TopBar() {
  return (
    <div className="hidden bg-forest-900 text-paper/90 md:block">
      <div className="container-rcees flex h-10 items-center justify-between text-xs">
        <div className="flex items-center gap-6">
          <a href={`tel:${site.phones[0].replace(/\s/g, "")}`} className="flex items-center gap-2 text-paper/80 no-underline hover:text-paper">
            <Phone className="h-3.5 w-3.5" />
            {site.phones[0]}
          </a>
          <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-paper/80 no-underline hover:text-paper">
            <Mail className="h-3.5 w-3.5" />
            {site.email}
          </a>
        </div>
        <nav className="flex items-center gap-5 text-paper/80">
          <Link href="/projects" className="no-underline hover:text-paper">Projects</Link>
          <Link href="/academics/short-courses" className="no-underline hover:text-paper">Short courses</Link>
          <Link href="/about/team" className="no-underline hover:text-paper">Staff</Link>
          <a href={site.helpDesk} className="no-underline hover:text-paper">Help desk</a>
          <span className="pl-5 border-l border-paper/20 text-paper/60">EN / FR / ES</span>
        </nav>
      </div>
    </div>
  );
}
