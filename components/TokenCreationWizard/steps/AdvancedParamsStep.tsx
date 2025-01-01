import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'

export function AdvancedParamsStep() {
  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Advanced Parameters</AlertTitle>
        <AlertDescription>
          The Sunpump launchpad automatically configures optimal parameters for your token.
          This includes:
          <ul className="list-disc list-inside mt-2">
            <li>Token decimals (18)</li>
            <li>Initial supply</li>
            <li>Trading fees</li>
            <li>Anti-bot measures</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}

