/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Anchor, Breadcrumbs, Flex, Stack, Text, Title } from '@mantine/core'
import React from 'react'

interface BreadcrumbItem {
  title: string
  href: string
}

interface TitleHeaderProps {
  breadcrumbs: BreadcrumbItem[]
  title: string
  metaDetails: string[] // <-- New prop, an array of strings
  // ReactNode allows you to pass buttons, menus, icons, or even nothing!
  actionComponent?: React.ReactNode
}

export function TitleHeader({
  breadcrumbs,
  title,
  metaDetails, // <-- Using the new prop
  actionComponent,
}: TitleHeaderProps) {
  const breadcrumbElements = breadcrumbs.map((item, index) => (
    <Anchor href={item.href} key={index} c="dimmed" size="xs">
      {item.title}
    </Anchor>
  ))

  return (
    <Flex justify="space-between" align="flex-end" pb="md">
      <Stack gap="xs">
        <Breadcrumbs separator="›" separatorMargin="xs">
          {breadcrumbElements}
        </Breadcrumbs>

        <Title order={1} size="h2" fw={900} c="dark.8">
          {title}
        </Title>

        {/* This line is updated to use the new prop and the dot separator */}
        <Text c="dimmed" size="sm" fw={500}>
          {metaDetails.join(' · ')}
        </Text>
      </Stack>

      {/* This will only render if you pass something into actionComponent */}
      {actionComponent}
    </Flex>
  )
}
