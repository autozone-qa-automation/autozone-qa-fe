/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import type { FeatureItem } from './FeaturesList'
import { FeaturesList } from './FeaturesList'

export function Features() {
  const myFeatures: FeatureItem[] = [
    {
      id: 'F1.',
      name: 'Checkout Flow',
      description: 'End-to-end checkout process including cart validation and payment',
      testCount: 12,
      tags: ['regression', 'smoke'],
      status: 'Active',
      priority: 'High',
    },
    {
      id: 'F2.',
      name: 'Order Confirmation',
      description: 'Order confirmation emails, status page, and receipt generation',
      testCount: 8,
      tags: ['regression'],
      status: 'Active',
      priority: 'Medium',
    },
    {
      id: 'F3.',
      name: 'Payment Gateway',
      description: 'Stripe integration, payment processing, and refund handling',
      testCount: 15,
      tags: ['regression', 'e2e'],
      status: 'Active',
      priority: 'High',
    },
    {
      id: 'F4.',
      name: 'Order History',
      description: 'User order history, filtering, and re-order functionality',
      testCount: 6,
      tags: ['smoke'],
      status: 'Draft',
      priority: 'Low',
    },
    {
      id: 'F5.',
      name: 'Cart Management',
      description: 'Cart CRUD operations, quantity updates, and persistence',
      testCount: 9,
      tags: ['regression'],
      status: 'Active',
      priority: 'Medium',
    },
  ]

  return (
    <div>
      <TitleHeader
        title="Order Management"
        metaDetails={['5 features', '42 test cases', '94% coverage']}
        breadcrumbs={[
          { title: 'Releases', href: '/releases' },
          { title: 'Q2 2026 Regression', href: '#' },
          { title: 'Order Management', href: '#' },
          { title: 'Features', href: '#' },
        ]}
        actionComponent={
          <Button
            leftSection={<IconPlus size={16} stroke={2.5} />}
            color="orange.6"
            radius="md"
            size="md"
            fw={600}
            onClick={() => {}}
          >
            Add Feature
          </Button>
        }
      />

      <FeaturesList data={myFeatures} onViewClick={() => {}} onEditClick={() => {}} />
    </div>
  )
}
