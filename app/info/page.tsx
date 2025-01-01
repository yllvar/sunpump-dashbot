"use client"

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TokenHolders from "@/components/TokenHolders"
import TokenLookup from "@/components/TokenLookup"
import TokenTransactions from "@/components/TokenTransactions"
import { TokenLaunchTracker } from "@/components/TokenLaunchTracker"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

export default function InfoPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Unhandled error:', error);
      setError('An unexpected error occurred. Please try again later.');
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  const logError = (componentName: string, error: any) => {
    console.error(`Error in ${componentName}:`, error);
    setError(`Failed to load ${componentName}. Please try again later.`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Token Info</CardTitle>
            <CardDescription>Get detailed information about TRON tokens</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Tabs defaultValue="lookup" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="lookup">Token Lookup</TabsTrigger>
                <TabsTrigger value="holders">Token Holders</TabsTrigger>
                <TabsTrigger value="transactions">Token Transactions</TabsTrigger>
                <TabsTrigger value="launches">Token Launches</TabsTrigger>
              </TabsList>
              <TabsContent value="lookup">
                <ErrorBoundary onError={(error) => logError('Token Lookup', error)}>
                  <TokenLookup />
                </ErrorBoundary>
              </TabsContent>
              <TabsContent value="holders">
                <ErrorBoundary onError={(error) => logError('Token Holders', error)}>
                  <TokenHolders />
                </ErrorBoundary>
              </TabsContent>
              <TabsContent value="transactions">
                <ErrorBoundary onError={(error) => logError('Token Transactions', error)}>
                  <TokenTransactions />
                </ErrorBoundary>
              </TabsContent>
              <TabsContent value="launches">
                <ErrorBoundary onError={(error) => logError('Token Launch Tracker', error)}>
                  <TokenLaunchTracker />
                </ErrorBoundary>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError: (error: Error) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError(error);
    console.error("Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>There was an error loading this component. Please try again later.</AlertDescription>
      </Alert>;
    }

    return this.props.children;
  }
}

