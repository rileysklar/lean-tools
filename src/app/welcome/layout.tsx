import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Welcome - Manufacturing Efficiency Tracking System',
  description: 'Track and optimize production efficiency in real-time. Log machine cycles, identify bottlenecks, measure cycle times, and dynamically adjust production standards.'
}

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
