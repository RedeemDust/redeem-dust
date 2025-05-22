import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchPositions } from "../lib/polymarket";
import { Position } from "../lib/types";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AddressFormProps {
  onSubmit: (address: string) => void;
  isLoading: boolean;
  error: string | null;
  onError: (error: string) => void;
  onPositionsLoaded: (positions: Position[]) => void;
}

export default function AddressForm({ 
  onSubmit, 
  isLoading, 
  error, 
  onError, 
  onPositionsLoaded 
}: AddressFormProps) {
  const [address, setAddress] = useState("");

  const isValidEthereumAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      onError("Please enter a Proxy Safe address");
      return;
    }

    if (!isValidEthereumAddress(address)) {
      onError("Please enter a valid Ethereum address");
      return;
    }

    onSubmit(address);

    try {
      const threshold = import.meta.env.VITE_SIZE_THRESHOLD_DEFAULT || 0;
      const positions = await fetchPositions(address, Number(threshold));
      onPositionsLoaded(positions);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to fetch positions");
    }
  };

  const openFAQ = () => {
    // Dispatch a custom event that App.tsx will listen for
    const event = new CustomEvent('openFAQ', { detail: { section: 'proxy' } });
    window.dispatchEvent(event);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold">Enter Proxy (Safe) Address</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={openFAQ}
                className="ml-2 text-gray-400 hover:text-gray-600"
                type="button"
              >
                <InfoIcon size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-48">What is a proxy Safe?</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51b27f] focus:border-transparent"
            disabled={isLoading}
          />
          {error && (
            <div className="text-red-500 text-sm mt-1">
              {error}
            </div>
          )}
        </div>
        <Button 
          type="submit" 
          className="bg-[#51b27f] hover:opacity-80 text-white font-medium py-2 px-4 rounded-2xl shadow-md whitespace-nowrap" 
          disabled={isLoading}
        >
          Fetch Dust
        </Button>
      </form>
    </div>
  );
}
