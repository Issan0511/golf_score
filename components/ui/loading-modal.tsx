"use client";

import React from "react";
import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";

interface LoadingModalProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingModal({ isLoading, message = "読み込み中..." }: LoadingModalProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-white p-8 shadow-lg animate-in fade-in duration-300">
        <Spinner size="lg" color="primary" />
        <p className="text-lg font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
}