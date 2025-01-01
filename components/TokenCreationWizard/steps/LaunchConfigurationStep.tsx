import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'

interface LaunchConfigurationStepProps {
  data: {
    launchImmediately: boolean;
  };
  onChange: (data: Partial<{ launchImmediately: boolean }>) => void;
}

export function LaunchConfigurationStep({ data, onChange }: LaunchConfigurationStepProps) {
  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Launch Configuration</AlertTitle>
        <AlertDescription>
          You can choose to launch your token immediately after creation or do it manually later.
          Launching makes your token available for trading on the DEX.
        </AlertDescription>
      </Alert>

      <FormField
        name="launchImmediately"
        render={() => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Launch Immediately</FormLabel>
              <FormDescription>
                Automatically launch your token on the DEX after creation
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={data.launchImmediately}
                onCheckedChange={(checked) => onChange({ launchImmediately: checked })}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}

