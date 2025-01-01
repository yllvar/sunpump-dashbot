"use client"

import DashboardLayout from '@/components/DashboardLayout'
import { TokenCreationWizard } from '@/components/TokenCreationWizard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateTokenPage() {
  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Create New Token</CardTitle>
          <CardDescription>Launch your own TRC-20 token on the TRON network</CardDescription>
        </CardHeader>
        <CardContent>
          <TokenCreationWizard />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

