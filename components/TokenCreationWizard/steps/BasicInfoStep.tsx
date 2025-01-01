import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface BasicInfoStepProps {
  data: {
    name: string;
    symbol: string;
  };
  onChange: (data: Partial<{ name: string; symbol: string }>) => void;
}

export function BasicInfoStep({ data, onChange }: BasicInfoStepProps) {
  return (
    <div className="space-y-4">
      <FormField
        name="name"
        render={() => (
          <FormItem>
            <FormLabel>Token Name</FormLabel>
            <FormControl>
              <Input
                placeholder="My Token"
                value={data.name}
                onChange={(e) => onChange({ name: e.target.value })}
              />
            </FormControl>
            <FormDescription>
              The full name of your token (e.g., "Ethereum")
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="symbol"
        render={() => (
          <FormItem>
            <FormLabel>Token Symbol</FormLabel>
            <FormControl>
              <Input
                placeholder="MTK"
                value={data.symbol}
                onChange={(e) => onChange({ symbol: e.target.value })}
                maxLength={5}
              />
            </FormControl>
            <FormDescription>
              A short identifier for your token (e.g., "ETH")
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

