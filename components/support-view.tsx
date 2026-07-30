'use client'

import { useState } from 'react'
import {
  BookOpen,
  ChevronDown,
  LifeBuoy,
  Mail,
  MessageSquare,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    q: 'How does real-time event streaming work?',
    a: 'Events are pushed to your dashboard over a persistent WebSocket connection the moment they are ingested. No refresh is required — new activity appears at the top of the feed automatically.',
  },
  {
    q: 'What counts as a critical security alert?',
    a: 'Any event scored above the risk threshold by the Anomaly Engine, such as repeated failed logins, unauthorized access attempts, or unusual access patterns. These always trigger a notification if security alerts are enabled.',
  },
  {
    q: 'How long is activity history retained?',
    a: 'Activity history is retained for 90 days on the standard plan and up to 2 years on enterprise plans. You can export records at any time from the Activity History page.',
  },
  {
    q: 'Can I integrate Pulse with my own systems?',
    a: 'Yes. Pulse exposes a REST API for ingestion and a WebSocket gateway for streaming. Reach out to the support team for API keys and integration documentation.',
  },
]

const RESOURCES = [
  {
    label: 'Documentation',
    description: 'Guides, API reference, and integration walkthroughs',
    icon: BookOpen,
  },
  {
    label: 'Live chat',
    description: 'Chat with our support team, typically replies in minutes',
    icon: MessageSquare,
  },
  {
    label: 'Email support',
    description: 'support@pulse.io · responses within 24 hours',
    icon: Mail,
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-card-foreground">{q}</span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
          {a}
        </p>
      )}
    </li>
  )
}

export function SupportView() {
  const [form, setForm] = useState({ subject: '', category: 'general', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Contact form */}
        <section className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-card-foreground">
              Contact support
            </h2>
            <p className="text-xs text-muted-foreground">
              Describe your issue and our team will get back to you
            </p>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
                <Send className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  Request submitted
                </p>
                <p className="text-xs text-muted-foreground">
                  We&apos;ve received your message and will reply to your email
                  shortly.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false)
                  setForm({ subject: '', category: 'general', message: '' })
                }}
              >
                Submit another request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-card-foreground">
                  Subject
                </span>
                <input
                  required
                  value={form.subject}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subject: e.target.value }))
                  }
                  placeholder="Brief summary of your issue"
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-card-foreground">
                  Category
                </span>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="general">General question</option>
                  <option value="billing">Billing</option>
                  <option value="technical">Technical issue</option>
                  <option value="security">Security concern</option>
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-card-foreground">
                  Message
                </span>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  rows={5}
                  placeholder="Provide as much detail as possible..."
                  className="resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>

              <div className="flex justify-end">
                <Button type="submit">
                  <Send className="size-4" aria-hidden="true" />
                  Send request
                </Button>
              </div>
            </form>
          )}
        </section>

        {/* FAQ */}
        <section className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-card-foreground">
              Frequently asked questions
            </h2>
            <p className="text-xs text-muted-foreground">
              Quick answers to common questions
            </p>
          </div>
          <ul className="divide-y divide-border">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </ul>
        </section>
      </div>

      {/* Resources */}
      <div className="space-y-6">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LifeBuoy className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-card-foreground">
                Need help?
              </p>
              <p className="text-xs text-muted-foreground">
                Reach us through any channel below
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {RESOURCES.map((resource) => {
              const Icon = resource.icon
              return (
                <li key={resource.label}>
                  <button
                    type="button"
                    className="flex w-full items-start gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-card-foreground">
                        {resource.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {resource.description}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="rounded-xl border border-success/30 bg-success/10 p-5">
          <div className="flex items-center gap-2">
            <span className="size-2 animate-pulse rounded-full bg-success" />
            <p className="text-sm font-medium text-foreground">
              All systems operational
            </p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            View the full status of monitoring services on the Monitoring page.
          </p>
        </section>
      </div>
    </div>
  )
}
