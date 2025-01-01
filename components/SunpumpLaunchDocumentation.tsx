import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function SunpumpLaunchDocumentation() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is the Sunpump Launchpad?</AccordionTrigger>
        <AccordionContent>
          The Sunpump Launchpad is a decentralized platform for launching new tokens on the TRON network. It uses a unique bonding curve mechanism to provide instant liquidity and fair token distribution.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How does the bonding curve work?</AccordionTrigger>
        <AccordionContent>
          <p>The bonding curve is a mathematical function that determines the token price based on the supply. In Sunpump:</p>
          <ul className="list-disc list-inside mt-2">
            <li>As more tokens are purchased, the price increases</li>
            <li>As tokens are sold back, the price decreases</li>
            <li>This creates a self-regulating market with instant liquidity</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>How do I create a token on Sunpump?</AccordionTrigger>
        <AccordionContent>
          <ol className="list-decimal list-inside mt-2">
            <li>Choose a name and symbol for your token</li>
            <li>Set the initial liquidity in TRX</li>
            <li>The platform automatically creates your token and initializes the bonding curve</li>
            <li>No need to set supply or other parameters - Sunpump handles this automatically</li>
          </ol>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>What is the token launch process?</AccordionTrigger>
        <AccordionContent>
          <ol className="list-decimal list-inside mt-2">
            <li>Create your token using the Sunpump interface</li>
            <li>The token is immediately available for trading on the Sunpump DEX</li>
            <li>Users can buy tokens, increasing the price and supply</li>
            <li>Token creators can choose to lock liquidity for a certain period</li>
          </ol>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger>How does trading work on Sunpump?</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc list-inside mt-2">
            <li>Tokens can be bought and sold instantly against TRX</li>
            <li>The price is determined by the bonding curve</li>
            <li>No need for traditional order books or liquidity providers</li>
            <li>Trading fees are built into the bonding curve mechanism</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-6">
        <AccordionTrigger>What are the benefits of launching on Sunpump?</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc list-inside mt-2">
            <li>Instant liquidity from the moment of token creation</li>
            <li>Fair and transparent price discovery</li>
            <li>No need for complex tokenomics or initial distribution</li>
            <li>Reduced risk of "rug pulls" due to the bonding curve mechanism</li>
            <li>Automatic market making without the need for external liquidity providers</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-7">
        <AccordionTrigger>What should users understand about Sunpump token launches?</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc list-inside mt-2">
            <li>Token price is volatile and based on supply and demand</li>
            <li>Early buyers may see significant price increases as more users buy in</li>
            <li>Selling large amounts can significantly decrease the token price</li>
            <li>Always do your own research before investing in any token</li>
            <li>Be aware of the risks associated with new and experimental token models</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

