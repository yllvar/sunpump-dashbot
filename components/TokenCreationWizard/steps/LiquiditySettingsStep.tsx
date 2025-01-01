import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'

interface LiquiditySettingsStepProps {
  data: {
    initialLiquidity: number;
  };
  onChange: (data: Partial<{ initialLiquidity: number }>) => void;
}

export function LiquiditySettingsStep({ data, onChange }: LiquiditySettingsStepProps) {
  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Initial Liquidity</AlertTitle>
        <AlertDescription>
          You need to provide initial liquidity in TRX to enable trading of your token.
          This TRX will be paired with your tokens to create the initial trading pool.
        </AlertDescription>
      </Alert>

      <FormField
        name="initialLiquidity"
        render={() => (
          <FormItem>
            <FormLabel>Initial Liquidity (TRX)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                step={0.1}
                value={data.initialLiquidity}
                onChange={(e) => onChange({ initialLiquidity: parseFloat(e.target.value) })}
              />
            </FormControl>
            <FormDescription>
              The amount of TRX you want to provide as initial liquidity
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

