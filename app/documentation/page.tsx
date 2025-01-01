"use client"

import DashboardLayout from '@/components/DashboardLayout'
import { TokenLaunchDocumentation } from '@/components/TokenLaunchDocumentation'
import { SunpumpLaunchDocumentation } from '@/components/SunpumpLaunchDocumentation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DocumentationPage() {
  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Token Launch Documentation</CardTitle>
          <CardDescription>Learn about creating and launching tokens on the TRON network</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sunpump">
            <TabsList>
              <TabsTrigger value="sunpump">Sunpump Launchpad</TabsTrigger>
              <TabsTrigger value="general">General Information</TabsTrigger>
            </TabsList>
            <TabsContent value="sunpump">
              <SunpumpLaunchDocumentation />
            </TabsContent>
            <TabsContent value="general">
              <TokenLaunchDocumentation />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

