"use client";

import React from "react";

export type ThreeCanvasVariant = "network" | "vault" | "community" | "beacon" | "cube";

export interface ThreeSubpageCanvasProps {
  variant?: ThreeCanvasVariant;
  className?: string;
  height?: number | string;
}

export function ThreeSubpageCanvas({
  className = "",
}: ThreeSubpageCanvasProps) {
  return null;
}

export default ThreeSubpageCanvas;
