import { useState, useRef } from "react";
import { Position } from "../lib/types";
import RedeemButton from "./RedeemButton";
import { formatDistanceToNow } from "date-fns";
import { 
  calculateFee, 
  formatUSDC, 
  formatUSDCSummary 
} from "../lib/feeCalculation";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import FAQModal from "./FAQ";
import { useIsMobile } from "../hooks/use-mobile";

interface DustTableProps {
  positions: Position[];
  safeAddress: string;
}

export default function DustTable({ positions, safeAddress }: DustTableProps) {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [faqSection, setFaqSection] = useState("proxy");
  const isMobile = useIsMobile();

  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatNumber = (num: number): string => {
    return num.toFixed(6);
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  const calculateTotal = (): number => {
    return positions.reduce((acc, position) => acc + position.value, 0);
  };

  const total = calculateTotal();
  const fee = calculateFee(total);
  const netAmount = total - fee;

  const handleOpenFAQ = (section: string) => {
    setFaqSection(section);
    setShowFAQ(true);
  };

  return (
    <div className="max-w-4xl mx-auto relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Dust Positions</h2>
        <span className="text-sm text-gray-500 flex items-center">
          Proxy (Safe): 
          <span className="font-medium ml-1">{formatAddress(safeAddress)}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="ml-1 text-gray-400 hover:text-gray-600" 
                  onClick={() => handleOpenFAQ("proxy")}
                >
                  <InfoIcon size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-48">What is a proxy Safe?</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      </div>

      <div className="overflow-x-auto mb-24">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-600">Market</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Outcome</th>
              <th className="px-4 py-3 font-semibold text-gray-600">End Date</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-right">Quantity</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-right">Value (USDC)</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    {position.icon && (
                      <img 
                        src={position.icon}
                        alt={position.marketTitle} 
                        className="w-6 h-6 rounded mr-2 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <span className="line-clamp-2">{position.marketTitle}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {position.outcome || "N/A"}
                </td>
                <td className="px-4 py-3">
                  {formatDate(position.endDate)}
                </td>
                <td className="px-4 py-3 text-right">{formatNumber(position.quantity)}</td>
                <td className="px-4 py-3 text-right">{formatNumber(position.value)} USDC</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sticky Summary Bar - CSS only */}
      <div className={`
        sticky ${isMobile ? 'top-0' : 'bottom-0'} sm:top-auto sm:bottom-0
        bg-white border-t border-gray-200 py-3 px-4 rounded-b-2xl shadow-md
      `}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="space-y-1 mb-4 sm:mb-0">
              <div className="flex items-center justify-between sm:justify-start">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium ml-4">{formatUSDCSummary(total)}</span>
              </div>

              <div className="flex items-center justify-between sm:justify-start">
                <div className="flex items-center">
                  <span className="text-gray-600">Fee:</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          className="ml-1 text-gray-400 hover:text-gray-600" 
                          onClick={() => handleOpenFAQ("fee")}
                        >
                          <InfoIcon size={14} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60">We charge 2.5% (min 0.05 USDC, max 1 USDC) collected inside the same Safe transaction</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-gray-600 ml-4">{formatUSDCSummary(fee)}</span>
              </div>

              <div className="flex items-center justify-between sm:justify-start border-t pt-1">
                <span className="font-semibold">Net Amount:</span>
                <span className="font-semibold text-[#51b27f] ml-4">{formatUSDCSummary(netAmount)}</span>
              </div>
            </div>

            <div className="flex items-end justify-center sm:justify-end">
              <RedeemButton 
                positions={positions} 
                safeAddress={safeAddress} 
                isRedeeming={isRedeeming}
                setIsRedeeming={setIsRedeeming}
                fee={fee}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Modal */}
      <FAQModal 
        open={showFAQ} 
        setOpen={setShowFAQ}
        initialSection={faqSection}
      />
    </div>
  );
}