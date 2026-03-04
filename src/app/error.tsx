"use client"; // Error components must be Client Components

import Image from "next/image";
import { useEffect } from "react";
import ErrorImage from "@/assets/error.gif";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/common/button-link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  // Determine user-friendly error message
  const getErrorMessage = (): string => {
    const errorMessage = error?.message || "";
    
    if (errorMessage.includes("autocancelled") || errorMessage.includes("auto cancelled")) {
      return "Request was cancelled. Please try again.";
    }
    if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
      return "Network error. Please check your internet connection.";
    }
    if (errorMessage.includes("timeout")) {
      return "Request timed out. Please try again.";
    }
    if (errorMessage.includes("PocketBase") || errorMessage.includes("pocketbase")) {
      return "Database connection error. Please try again later.";
    }
    
    return "Something went wrong while processing your request.";
  };

  return (
    <div className="w-[100dvw] h-[100dvh]">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-5 items-center justify-center px-4">
        <Image
          src={ErrorImage.src}
          alt="error"
          width={300}
          height={300}
          className=""
        />
        <p className="font-bold text-2xl text-center">Oops! {getErrorMessage()}</p>
        {error?.digest && (
          <p className="text-sm text-gray-500">Error ID: {error.digest}</p>
        )}
        <div className="flex gap-3 items-center flex-wrap justify-center">
          <ButtonLink href={ROUTES.HOME}>Back to Home</ButtonLink>
          <Button onClick={() => reset()} className="" variant={"secondary"}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

