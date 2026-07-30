'use client'

import { useEffect, useState } from 'react'
import {
  Activity,
  Cpu,
  Database,
  Globe,
  ShieldCheck,
  Signal,
  Server,
  Wifi,
} from 'lucide-react'
import { StatCard } from '@/components/stat-card'
import { cn } from '@/lib/utils'

interface ServiceStatus {
  name: string
  description: string
  status: 'operational' | 'degraded' | 'down'
  uptime: string
  latencyMs: number
  icon: typeof Server
}

const SERVICES: ServiceStatus[] = [
  {
    name: 'Event Ingestion API',
    description: 'Receives and validates incoming activity events',
    status: 'operational',
    uptime: '99.98%',
    latencyMs: 42,
    icon: Server,
  },
  {
    name: 'WebSocket Gateway',
    description: 'Streams real-time events to connected clients',
    status: 'operational',
    uptime: '99.95%',
    latencyMs: 18,
    icon: Wifi,
  },
  {
    name: 'Primary Database',
    description: 'Persists activity history and audit logs',
    status: 'operational',
    uptime: '99.99%',
    latencyMs: 7,
    icon: Database,
  },
  {
    name: 'Anomaly Engine',
    description: 'Scores events and raises security alerts',
    status: 'degraded',
    uptime: '99.42%',
    latencyMs: 210,
    icon: ShieldCheck,
  },
  {
    name: 'Notification Service',
    description: 'Delivers alerts via email, SMS, and push',
    status: 'operational',
    uptime: '99.91%',
    latencyMs: 63,
    icon: Signal,
  },
  {
    name: 'Edge CDN',
    description: 'Serves the dashboard and static assets globally',
    status: 'operational',
    uptime: '100%',
    latencyMs: 12,
    icon: Globe,
  },
]

const STATUS_STYLES: Record<
  ServiceStatus['status'],
  { dot: string; label: string; text: string }
> = {
  operational: {
    dot: 'bg-success',
    label: 'Operational',
    text: 'text-success',
  },
  degraded: {
    dot: 'bg-warning',
    label: 'Degraded',
    text: 'text-warning-foreground',
  },
  down: { dot: 'bg-destructive', label: 'Outage', text: 'text-destructive' },
}

function useLiveMetric(base: number, variance: number, interval = 2500) {
  const [value, setValue] = useState(base)
  useEffect(() => {
    const id = setInterval(() => {
      const next = base + (Math.random() - 0.5) * 2 * variance
      setValue(Math.max(0, Math.round(next)))
    }, interval)
    return () => clearInterval(id)
  }, [base, variance, interval])
  return value
}

export function MonitoringView() {
  const eventsPerMin = useLiveMetric(1240, 180)
  const cpu = useLiveMetric(38, 10)
  const activeConnections = useLiveMetric(3120, 220)

  const operational = SERVICES.filter((s) => s.status === 'operational').length
  const allHealthy = operational === SERVICES.length

  return (
    <div className="space-y-6">
      {/* Overall status banner */}
      <div
        className={cn(
          'flex flex-col gap-3 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between',
          allHealthy
            ? 'border-success/30 bg-success/10'
            : 'border-warning/40 bg-warning/10',
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'flex size-10 items-center justify-center rounded-full',
              allHealthy
                ? 'bg-success/20 text-success'
                : 'bg-warning/25 text-warning-foreground',
            )}
          >
            <Activity className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {allHealthy
                ? 'All systems operational'
                : 'Partial service degradation'}
            </p>
            <p className="text-xs text-muted-foreground">
              {operational} of {SERVICES.length} services healthy · updated just
              now
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 self-start rounded-full bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground sm:self-auto">
          <span className="size-2 animate-pulse rounded-full bg-success" />
          Live monitoring
        </span>
      </div>

      {/* Live metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Events / min"
          value={eventsPerMin.toLocaleString()}
          icon={Activity}
          hint="ingestion throughput"
          accent="primary"
        />
        <StatCard
          label="Active connections"
          value={activeConnections.toLocaleString()}
          icon={Wifi}
          hint="live socket clients"
          accent="success"
        />
        <StatCard
          label="Avg CPU load"
          value={`${cpu}%`}
          icon={Cpu}
          hint="across ingestion nodes"
          accent={cpu > 75 ? 'warning' : 'primary'}
        />
      </div>

      {/* Services */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-card-foreground">
            Service health
          </h2>
          <p className="text-xs text-muted-foreground">
            Real-time status of core monitoring infrastructure
          </p>
        </div>
        <ul className="divide-y divide-border">
          {SERVICES.map((service) => {
            const Icon = service.icon
            const styles = STATUS_STYLES[service.status]
            return (
              <li
                key={service.name}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-card-foreground">
                      {service.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 pl-12 sm:pl-0">
                  <div className="text-right">
                    <p className="text-xs font-medium text-card-foreground">
                      {service.uptime}
                    </p>
                    <p className="text-[11px] text-muted-foreground">uptime</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-card-foreground">
                      {service.latencyMs}ms
                    </p>
                    <p className="text-[11px] text-muted-foreground">latency</p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex w-28 items-center justify-end gap-2 text-xs font-medium whitespace-nowrap',
                      styles.text,
                    )}
                  >
                    <span
                      className={cn(
                        'size-2 rounded-full',
                        styles.dot,
                        service.status !== 'down' && 'animate-pulse',
                      )}
                    />
                    {styles.label}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
