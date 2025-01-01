"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useWallet } from "@/contexts/WalletContext"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const tokenSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1, "Token symbol is required").max(5, "Symbol should be 5 characters or less"),
  decimals: z.number().min(0).max(18),
  totalSupply: z.number().positive("Total supply must be positive"),
})

type TokenFormValues = z.infer<typeof tokenSchema>

export function TokenCreationWizard() {
  const [step, setStep] = useState(0)
  const { createToken } = useWallet()

  const form = useForm<TokenFormValues>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      name: "",
      symbol: "",
      decimals: 18,
      totalSupply: 0,
    },
  })

  const onSubmit = async (values: TokenFormValues) => {
    try {
      await createToken(values)
      setStep(step + 1)
    } catch (error) {
      console.error("Token creation failed:", error)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return <TokenDetails form={form} />
      case 1:
        return <TokenLaunch />
      case 2:
        return <LiquidityProvision />
      default:
        return <div>Token Creation Complete!</div>
    }
  }

  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {renderStep()}
          {step < 2 && (
            <Button type="submit">
              {step === 0 ? "Create Token" : "Next"}
            </Button>
          )}
        </form>
      </Form>
    </TooltipProvider>
  )
}

function TokenDetails({ form }: { form: any }) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Token Name</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Input placeholder="My Awesome Token" {...field} />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-2">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose a unique and descriptive name for your token</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </FormControl>
            <FormDescription>
              The name of your token
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="symbol"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Token Symbol</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Input placeholder="MAT" {...field} />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-2">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>A short identifier for your token, usually 3-5 characters</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </FormControl>
            <FormDescription>
              The symbol of your token (usually 3-5 characters)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="decimals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Decimals</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-2">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The number of decimal places for your token. 18 is standard for most tokens.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </FormControl>
            <FormDescription>
              The number of decimal places for your token (usually 18)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="totalSupply"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Supply</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-2">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The total number of tokens to be created. This can't be changed later.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </FormControl>
            <FormDescription>
              The total number of tokens to create
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Learn More About Token Creation</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Token Creation Process</DialogTitle>
            <DialogDescription>
              Creating a token involves several steps:
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p>1. Define token properties (name, symbol, decimals, supply)</p>
            <p>2. Deploy the token contract to the TRON network</p>
            <p>3. Launch the token on a decentralized exchange</p>
            <p>4. Provide initial liquidity to enable trading</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function TokenLaunch() {
  const { launchToken } = useWallet()

  const handleLaunch = async () => {
    try {
      await launchToken()
      // Handle successful launch
    } catch (error) {
      console.error("Token launch failed:", error)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Launch Your Token</h2>
      <p className="mb-4">Your token has been created. Click the button below to launch it on the DEX.</p>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleLaunch}>Launch Token</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This will make your token available for trading on the decentralized exchange</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

function LiquidityProvision() {
  const { provideLiquidity } = useWallet()
  const [amount, setAmount] = useState("")

  const handleProvideLiquidity = async () => {
    try {
      await provideLiquidity(parseFloat(amount))
      // Handle successful liquidity provision
    } catch (error) {
      console.error("Liquidity provision failed:", error)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Provide Liquidity</h2>
      <p className="mb-4">Add liquidity to your token pair to enable trading.</p>
      <div className="flex items-center mb-4">
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount of TRX to provide as liquidity"
          className="mr-2"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>The amount of TRX you want to pair with your tokens for initial liquidity</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Button onClick={handleProvideLiquidity}>Provide Liquidity</Button>
    </div>
  )
}

