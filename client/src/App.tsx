import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Position } from "./lib/types";
import AddressForm from "./components/AddressForm";
import DustTable from "./components/DustTable";
import FAQModal from "./components/FAQ";
import { useToast } from "@/hooks/use-toast";
import { InfoIcon } from "lucide-react";

function App() {
  const [safeAddress, setSafeAddress] = useState<string>("");
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showFAQ, setShowFAQ] = useState<boolean>(false);
  const [faqSection, setFaqSection] = useState<string>("proxy");
  const { toast } = useToast();

  const handlePositionsLoaded = (loadedPositions: Position[]) => {
    setPositions(loadedPositions);
    setIsLoading(false);
    
    if (loadedPositions.length === 0) {
      toast({
        title: "No positions found",
        description: "No redeemable dust positions found for this address.",
        variant: "default",
      });
    }
  };

  const handleFetchPositions = (address: string) => {
    setSafeAddress(address);
    setIsLoading(true);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const openFAQ = (section: string = "proxy") => {
    setFaqSection(section);
    setShowFAQ(true);
  };
  
  // Listen for custom events from child components
  useEffect(() => {
    const handleOpenFAQ = (event: any) => {
      if (event.detail && event.detail.section) {
        openFAQ(event.detail.section);
      }
    };
    
    window.addEventListener('openFAQ', handleOpenFAQ);
    
    return () => {
      window.removeEventListener('openFAQ', handleOpenFAQ);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="bg-[#f5f6fa] text-gray-900 font-sans min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-semibold mb-2">RedeemDust</h1>
              <p className="text-gray-600">Batch redeem your dust positions on Polymarket</p>
            </header>

            <main>
              <div className="bg-white rounded-2xl shadow-md p-6 max-w-xl mx-auto mt-10">
                <AddressForm 
                  onSubmit={handleFetchPositions} 
                  isLoading={isLoading}
                  error={error}
                  onError={handleError}
                  onPositionsLoaded={handlePositionsLoaded}
                />
                
                {isLoading && (
                  <div className="py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#51b27f]"></div>
                    <p className="mt-4 text-gray-600">Fetching dust positions...</p>
                  </div>
                )}

                {!isLoading && positions.length === 0 && safeAddress && (
                  <div className="py-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-4 text-gray-600">No redeemable dust positions found</p>
                  </div>
                )}

                {!isLoading && positions.length > 0 && (
                  <DustTable 
                    positions={positions} 
                    safeAddress={safeAddress} 
                  />
                )}
              </div>
            </main>

            <footer className="text-center mt-12 text-sm text-gray-500">
              <div className="flex items-center justify-center">
                <p>RedeemDust - Polymarket Batch Redemption Tool</p>
                <button 
                  onClick={() => openFAQ("security")}
                  className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                  aria-label="FAQ"
                >
                  <InfoIcon size={14} />
                </button>
              </div>
              <div className="mt-2 space-x-4">
                <button 
                  onClick={() => openFAQ("intro")}
                  className="text-indigo-500 hover:underline"
                >
                  What is RedeemDust?
                </button>
                <a href="mailto:redeemdust@proton.me" className="text-indigo-500 hover:underline">Contact</a>
                <span className="text-gray-400">|</span>
                <span className="text-gray-700">Tip: <span className="font-mono">0x4745BED9080A47cdf2e8280fD57Dd49237305916</span></span>
                <span className="text-gray-400">|</span>
                <a href="https://github.com/RedeemDust" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">GitHub</a>
              </div>
            </footer>
          </div>

          {/* Video Demo Section */}
          <section className="flex flex-col items-center mt-12 mb-6">
            <div className="w-full max-w-xl">
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/N67NYHbH6hQ"
                  title="RedeemDust Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <h2 className="text-lg font-semibold mt-4 text-center">See RedeemDust in Action</h2>
              <p className="mt-2 text-gray-600 text-sm text-center">Watch this quick video to learn what RedeemDust does and how to use it.</p>
            </div>
          </section>

          {/* FAQ Modal */}
          <FAQModal 
            open={showFAQ} 
            setOpen={setShowFAQ}
            initialSection={faqSection}
          />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
