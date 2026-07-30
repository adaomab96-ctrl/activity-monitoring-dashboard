'use client'

import { useState } from 'react'
import { Bell, Mail, MessageSquare, ShieldAlert, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ToggleSetting {
  id: string
  label: string
  description: string
  icon: typeof Bell
  defaultOn: boolean
}

const NOTIFICATION_SETTINGS: ToggleSetting[] = [
  {
    id: 'email',
    label: 'Email notifications',
    description: 'Receive a daily digest and critical alerts by email',
    icon: Mail,
    defaultOn: true,
  },
  {
    id: 'push',
    label: 'Push notifications',
    description: 'Get real-time push alerts in the browser and mobile app',
    icon: Smartphone,
    defaultOn: true,
  },
  {
    id: 'sms',
    label: 'SMS alerts',
    description: 'Text message alerts for security-critical events only',
    icon: MessageSquare,
    defaultOn: false,
  },
  {
    id: 'security',
    label: 'Security alerts',
    description: 'Always notify me when a critical security event is detected',
    icon: ShieldAlert,
    defaultOn: true,
  },
]

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none',
        on ? 'bg-primary' : 'bg-input',
      )}
    >
      <span
        className={cn(
          'inline-block size-5 transform rounded-full bg-background shadow transition-transform',
          on ? 'translate-x-5.5' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

export function SettingsView() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      NOTIFICATION_SETTINGS.map((s) => [s.id, s.defaultOn]),
    ),
  )
  const [profile, setProfile] = useState({
    name: 'Jordan Avery',
    email: 'jordan.avery@pulse.io',
    workspace: 'Acme Security Ops',
  })
  const [frequency, setFrequency] = useState('realtime')
  const [saved, setSaved] = useState(false)

  const setToggle = (id: string, v: boolean) => {
    setToggles((prev) => ({ ...prev, [id]: v }))
    setSaved(false)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Profile */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-card-foreground">
            Profile
          </h2>
          <p className="text-xs text-muted-foreground">
            Your account details and workspace
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-card-foreground">
              Full name
            </span>
            <input
              value={profile.name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, name: e.target.value }))
              }
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-card-foreground">
              Email address
            </span>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((p) => ({ ...p, email: e.target.value }))
              }
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-card-foreground">
              Workspace
            </span>
            <input
              value={profile.workspace}
              onChange={(e) =>
                setProfile((p) => ({ ...p, workspace: e.target.value }))
              }
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
        </div>
      </section>

      {/* Notification settings */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-card-foreground">
            Notification settings
          </h2>
          <p className="text-xs text-muted-foreground">
            Choose how and when you want to be notified
          </p>
        </div>
        <ul className="divide-y divide-border">
          {NOTIFICATION_SETTINGS.map((setting) => {
            const Icon = setting.icon
            return (
              <li
                key={setting.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-card-foreground">
                      {setting.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <Toggle
                  on={toggles[setting.id]}
                  onChange={(v) => setToggle(setting.id, v)}
                  label={setting.label}
                />
              </li>
            )
          })}
        </ul>

        <div className="border-t border-border px-5 py-4">
          <p className="mb-2 text-sm font-medium text-card-foreground">
            Alert frequency
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'realtime', label: 'Real-time' },
              { id: 'hourly', label: 'Hourly digest' },
              { id: 'daily', label: 'Daily digest' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setFrequency(option.id)
                  setSaved(false)
                }}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                  frequency === option.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm font-medium text-success">
            Settings saved
          </span>
        )}
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  )
}
