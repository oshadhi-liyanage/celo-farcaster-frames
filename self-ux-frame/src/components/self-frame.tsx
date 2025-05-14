/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import sdk, { type Context } from "@farcaster/frame-sdk";
import { createStore } from "mipd";
import SelfQRcodeWrapper, { SelfAppBuilder } from "@selfxyz/qrcode";
import { useAccount } from "wagmi";
import { useVerification } from "~/hooks/useVerification";

export default function SelfFrame(
  { title }: { title?: string } = { title: "Self Frame" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const { address } = useAccount();
  const {
    isVerified,
    setIsVerified,
    isLoading: isVerificationLoading,
  } = useVerification();
  const appUrl = process.env.NEXT_PUBLIC_URL;
  console.log("appUrl", appUrl);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  const selfApp = address
    ? new SelfAppBuilder({
        appName: "Proof of ship",
        scope: "proof-of-ship-scope",
        endpoint: `${appUrl}api/verify`,
        userId: address,
        userIdType: "hex",
        endpointType: "https",
      }).build()
    : null;
  console.log("selfApp", selfApp);

  if (!address) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-600">
      {!isVerified && !isVerificationLoading && selfApp && (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-2 text-white drop-shadow">
            Verify Your Identity
          </h2>
          <p className="mb-4 text-gray-200 text-center max-w-xs">
            Scan the QR code with your Self app to verify your identity
          </p>
          <div className="p-3 rounded-2xl bg-white/20 border border-white/30 shadow-lg animate-pulse-slow">
            <SelfQRcodeWrapper
              selfApp={selfApp}
              onSuccess={async () => {
                await fetch(`/api/users/${address}`, {
                  method: "POST",
                });
                setIsVerified(true);
                // if (address) {
                //   await refetchBuilderScore();
                // }
              }}
              size={300}
            />
          </div>
        </div>
      )}
      {isVerified && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-600">
          <div className="bg-gradient-to-br from-green-500 to-green-600 border border-green-400 rounded-2xl p-10 shadow-2xl flex flex-col items-center max-w-md w-full">
            <div className="flex items-center mb-2">
              <svg
                className="w-8 h-8 text-white mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-label="Verified"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="#22c55e"
                />
                <path
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2l4-4"
                />
              </svg>
              <h2 className="text-2xl font-bold text-white drop-shadow">
                Identity Verified
              </h2>
            </div>
            <p className="text-white text-lg mb-4 text-center">
              Your identity has been successfully verified.
              <br />
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
