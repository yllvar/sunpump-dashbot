"use client"

import { useState } from "react"
import { BasicInfoStep } from "./steps/BasicInfoStep"
import { AdvancedParamsStep } from "./steps/AdvancedParamsStep"
import { LiquiditySettingsStep } from "./steps/LiquiditySettingsStep"
import { LaunchConfigurationStep } from "./steps/LaunchConfigurationStep"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useWallet } from "@/contexts/WalletContext"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface TokenCreationData {
  name: string;
  symbol: string;
  initialLiquidity: number;
  launchImmediately: boolean;
}

export function TokenCreationWizard() {
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TokenCreationData>({
    name: "",
    symbol: "",
    initialLiquidity: 0,
    launchImmediately: false,
  })
  const [createdTokenAddress, setCreatedTokenAddress] = useState<string | null>(null)
  
  const { createToken, launchToken } = useWallet()

  const steps = [
    { title: "Basic Info", component: BasicInfoStep },
    { title: "Advanced Parameters", component: AdvancedParamsStep },
    { title: "Liquidity Settings", component: LiquiditySettingsStep },
    { title: "Launch Configuration", component: LaunchConfigurationStep },
  ]

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Create token
      const createResult = await createToken({
        name: data.name,
        symbol: data.symbol,
        initialLiquidity: data.initialLiquidity,
      })
      
      setCreatedTokenAddress(createResult.tokenAddress)

      // If immediate launch is selected, launch to DEX
      if (data.launchImmediately && createResult.tokenAddress) {
        await launchToken({
          tokenAddress: createResult.tokenAddress,
          trxAmount: data.initialLiquidity,
        })
      }

      handleNext()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const CurrentStepComponent = steps[step].component

  return (
    <div className="space-y-6">
      <Progress value={(step / (steps.length - 1)) * 100} />
      
      <div className="grid gap-4">
        <h2 className="text-lg font-semibold">{steps[step].title}</h2>
        
        <CurrentStepComponent
          data={data}
          onChange={(newData) => setData((prev) => ({ ...prev, ...newData }))}
        />
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 0 || isLoading}
        >
          Back
        </Button>

        {step < steps.length - 1 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Token"}
          </Button>
        )}
      </div>

      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

