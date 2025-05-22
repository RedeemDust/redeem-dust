import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FAQModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialSection?: string;
}

export default function FAQModal({ open, setOpen, initialSection = "proxy" }: FAQModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg mx-auto" aria-describedby="faq-description">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Frequently Asked Questions</DialogTitle>
          <DialogDescription id="faq-description" className="text-gray-600 mt-2">
            Learn more about using RedeemDust for batch redeeming your Polymarket positions
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <Accordion type="single" collapsible defaultValue={initialSection}>
            <AccordionItem value="intro">
              <AccordionTrigger className="text-lg font-medium">What is RedeemDust?</AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <p className="mb-2">RedeemDust is a free, open-source tool for batch redeeming your dust positions on Polymarket using your Safe wallet. Enter your proxy Safe address, fetch your positions, and redeem up to 30 at a time in a single transaction. All transactions are signed by you and executed on the Polygon network.</p>
                <p className="mb-2">Support: <a href="mailto:redeemdust@proton.me" className="text-indigo-600 underline">redeemdust@proton.me</a></p>
                <p className="mb-2">Tip address (Polygon USDC): <span className="font-mono">0x4745BED9080A47cdf2e8280fD57Dd49237305916</span></p>
                <p className="mb-2">Open-source on <a href="https://github.com/RedeemDust" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">GitHub</a></p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="proxy">
              <AccordionTrigger className="text-lg font-medium">What is a proxy Safe?</AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <p className="mb-2">
                  A proxy Safe is a special Polymarket wallet address that holds your dust positions. 
                  Use the proxy Safe address (not your regular wallet address) in the input field.
                </p>
                <p className="mb-2">
                  When connecting your wallet to sign transactions, make sure to use the exact same account 
                  you used to register on Polymarket. If you registered with MetaMask, connect with MetaMask.
                </p>
                <p className="text-gray-500 text-sm">
                  Note: We currently don't support Magic Link registered users.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="fee">
              <AccordionTrigger className="text-lg font-medium">How is the fee calculated?</AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <p className="mb-2">
                  We charge a 2.5% service fee on the total value of all dust positions being redeemed, 
                  with a minimum fee of 0.05 USDC and a maximum fee of 1 USDC.
                </p>
                <p>
                  The fee is collected as part of the same Safe transaction that redeems your dust positions,
                  so you only need to sign once.
                </p>
                <p className="mt-2 text-sm text-gray-500">Tip address (Polygon USDC): <span className="font-mono">0x4745BED9080A47cdf2e8280fD57Dd49237305916</span></p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="batch">
              <AccordionTrigger className="text-lg font-medium">How many positions can I redeem at once?</AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <p>Each redemption batch is limited to a maximum of 30 positions. If you have more, please redeem in multiple batches.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="security">
              <AccordionTrigger className="text-lg font-medium">Security & Open Source</AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <p className="mb-2">
                  RedeemDust is built with security in mind. All transactions are executed directly through your
                  Safe wallet, and you'll need to sign each transaction with your connected wallet.
                </p>
                <p className="mb-2">
                  We never have access to your private keys or funds.
                </p>
                <p>
                  Our code is open-source and available for review on <a href="https://github.com/RedeemDust" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">GitHub</a>.
                </p>
                <p className="mt-2 text-sm text-gray-500">For support, contact <a href="mailto:redeemdust@proton.me" className="underline">redeemdust@proton.me</a></p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="network">
              <AccordionTrigger className="text-lg font-medium">Network Requirements</AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <p>
                  RedeemDust operates on the Polygon network (Chain ID: 137). 
                  Make sure your wallet is connected to Polygon before attempting to redeem your dust positions.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <DialogClose asChild>
          <Button className="mt-4" variant="default">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}