import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function TokenLaunchDocumentation() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is a TRC-20 token?</AccordionTrigger>
        <AccordionContent>
          A TRC-20 token is a standard for fungible tokens on the TRON blockchain. It's similar to Ethereum's ERC-20 standard and allows for the creation of custom tokens that can be easily traded and integrated into various applications.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I create a token?</AccordionTrigger>
        <AccordionContent>
          To create a token, you need to:
          <ol className="list-decimal list-inside mt-2">
            <li>Define your token's properties (name, symbol, decimals, total supply)</li>
            <li>Deploy a smart contract to the TRON network</li>
            <li>Verify your contract on TRONSCAN (optional but recommended)</li>
          </ol>
          Our token creation wizard guides you through this process step-by-step.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What is token launching?</AccordionTrigger>
        <AccordionContent>
          Token launching refers to making your token available for trading on a decentralized exchange (DEX). This involves creating a trading pair for your token (usually with TRX) and providing initial liquidity to enable trading.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Why do I need to provide liquidity?</AccordionTrigger>
        <AccordionContent>
          Providing liquidity is essential for enabling trading of your token. It creates a pool of your token and TRX (or another token) that traders can swap between. Without liquidity, there would be no way for others to buy or sell your token on the DEX.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger>What are the risks of creating and launching a token?</AccordionTrigger>
        <AccordionContent>
          Creating and launching a token comes with several risks:
          <ul className="list-disc list-inside mt-2">
            <li>Smart contract vulnerabilities could lead to loss of funds</li>
            <li>Lack of adoption may result in low liquidity and difficulty trading</li>
            <li>Regulatory risks depending on your jurisdiction and the nature of your token</li>
            <li>Potential for impermanent loss when providing liquidity</li>
          </ul>
          Always do thorough research and consider consulting with legal and financial professionals before launching a token.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

