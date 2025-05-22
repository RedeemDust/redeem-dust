import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Position } from "../lib/types";
import { executeBatchRedeem } from "../lib/batchRedeem";
import { Icons } from "@/components/ui/icons";

interface RedeemButtonProps {
  positions: Position[];
  safeAddress: string;
  isRedeeming: boolean;
  setIsRedeeming: (isRedeeming: boolean) => void;
  fee: number;
}

export default function RedeemButton({ 
  positions, 
  safeAddress, 
  isRedeeming, 
  setIsRedeeming,
  fee
}: RedeemButtonProps) {
  const { toast } = useToast();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connectingWallet, setConnectingWallet] = useState<boolean>(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<boolean>(false);

  // Check if MetaMask or similar wallet is available
  const isWalletAvailable = typeof window !== 'undefined' && !!window.ethereum;

  // Check chain ID to make sure we're on Polygon (137)
  const checkNetwork = async () => {
    if (window.ethereum) {
      try {
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const networkId = parseInt(chainIdHex, 16).toString();
        setChainId(networkId);
        
        // Check if we're on Polygon mainnet (137)
        if (networkId !== '137') {
          setNetworkError(true);
        } else {
          setNetworkError(false);
        }
      } catch (error) {
        console.error("Error checking network:", error);
      }
    }
  };

  useEffect(() => {
    if (walletConnected) {
      checkNetwork();
    }
    
    // Setup event listener for chain changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        checkNetwork();
      });
    }
    
    return () => {
      // Cleanup event listener
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('chainChanged', checkNetwork);
      }
    };
  }, [walletConnected]);

  const switchToPolygon = async () => {
    if (!window.ethereum) return;
    
    try {
      // Try to switch to Polygon network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // 0x89 is hexadecimal for 137 (Polygon)
      });
    } catch (switchError: any) {
      // If the network is not added to MetaMask, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
              }
            ]
          });
        } catch (addError) {
          console.error("Error adding Polygon network:", addError);
        }
      } else {
        console.error("Error switching networks:", switchError);
      }
    }
  };

  const connectWallet = async () => {
    if (!isWalletAvailable) {
      toast({
        title: "Wallet not found",
        description: "Please install MetaMask or another Ethereum wallet",
        variant: "destructive",
      });
      return;
    }

    setConnectingWallet(true);
    
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
          
          // Check network after connecting
          await checkNetwork();
          
          toast({
            title: "Wallet connected",
            description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
            variant: "default",
          });
        }
      } else {
        throw new Error("No Ethereum wallet found");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection failed",
        description: "Could not connect to wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnectingWallet(false);
    }
  };

  const handleBatchRedeem = async () => {
    if (!walletConnected) {
      await connectWallet();
      return;
    }
    
    // Check if we're on Polygon network
    if (networkError) {
      toast({
        title: "Wrong network",
        description: "Please switch to Polygon network before redeeming",
        variant: "destructive",
      });
      return;
    }
    
    setIsRedeeming(true);
    
    try {
      // Pass the fee amount to the executeBatchRedeem function
      const transactionHash = await executeBatchRedeem(positions, safeAddress, fee);
      setTxHash(transactionHash);
      
      // Show success toast
      toast({
        title: "Transaction sent!",
        description: "Your redemption is being processed",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Batch redeem error:", error);
      
      let errorMessage = "Failed to submit transaction";
      
      // Handle user rejected transaction
      if (error?.code === 4001) {
        errorMessage = "Transaction was rejected by the user";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const viewTransaction = () => {
    if (txHash) {
      // Open transaction in explorer (assuming Polygon network)
      window.open(`https://polygonscan.com/tx/${txHash}`, '_blank');
    }
  };

  return (
    <div className={txHash ? "mt-6 text-center" : ""}>
      {networkError && walletConnected && (
        <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          <div className="flex items-center mb-1">
            <Icons.warning className="h-4 w-4 mr-1" />
            <span className="font-medium">Wrong Network</span>
          </div>
          <p className="text-xs mb-2">Please connect to Polygon network (Chain ID: 137)</p>
          <Button 
            onClick={switchToPolygon}
            variant="outline" 
            size="sm"
            className="text-xs py-1 h-7 bg-amber-100 border-amber-200 hover:bg-amber-200"
          >
            Switch to Polygon
          </Button>
        </div>
      )}

      {txHash ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <p className="text-green-800 font-medium">Transaction submitted!</p>
            <p className="text-sm text-green-600 mt-1">Your redemption is being processed</p>
            <p className="text-xs text-gray-500 mt-3 break-all">{txHash}</p>
          </div>
          <Button 
            onClick={viewTransaction}
            className="bg-[#51b27f] hover:opacity-80 text-white font-medium py-2 px-6 rounded-lg"
          >
            View Transaction
          </Button>
        </div>
      ) : (
        <>
          <Button 
            onClick={handleBatchRedeem} 
            disabled={isRedeeming || positions.length === 0 || connectingWallet}
            className="bg-[#51b27f] hover:opacity-80 text-white font-medium py-2 px-6 rounded-2xl shadow-md w-full sm:w-auto"
          >
            {isRedeeming || connectingWallet ? (
              <div className="flex items-center">
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                {connectingWallet ? "Connecting Wallet..." : "Processing..."}
              </div>
            ) : walletConnected ? "Batch Redeem" : "Connect Wallet to Redeem"}
          </Button>
          {walletConnected && walletAddress && (
            <p className="text-xs mt-2">Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">You'll need to sign a transaction and pay gas fees</p>
        </>
      )}
    </div>
  );
}
