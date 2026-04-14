"use client";
import { useState, type FormEvent } from "react";
import { site } from "@/lib/constants";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const topic = String(data.get("topic") || "General enquiry");
    const message = String(data.get("message") || "");
    const body = `From: ${name} <${email}>\nTopic: ${topic}\n\n${message}`;
    const href = `mailto:${site.email}?subject=${encodeURIComponent(`[Website] ${topic}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full name" name="name" required />
        <Field label="Email address" name="email" type="email" required />
      </div>
      <Field label="Topic" name="topic" />
      <div>
        <label className="block text-xs uppercase tracking-wider text-muted">Message</label>
        <textarea
          name="message"
          required
          rows={6}
          className="mt-2 w-full border border-rule bg-paper px-4 py-3 text-[0.95rem] text-ink focus:border-forest focus:outline-none"
        />
      </div>
      <button type="submit" className="btn-primary">
        {sent ? "Opening your email…" : "Send message"}
      </button>
      <p className="text-xs text-muted">
        Or email us directly at <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full border border-rule bg-paper px-4 py-3 text-[0.95rem] text-ink focus:border-forest focus:outline-none"
      />
    </div>
  );
}
