"use client";
import { create } from "zustand";
import { PriceData } from "./type";

interface ScaniaConstants {
  // 메이플포인트 가격 추이 데이터
  mPointPrices: PriceData[];
}

interface ScaniaActions {
  setMPointPrices: (mPointPrices: PriceData[]) => void;
}

type ScaniaState = ScaniaConstants & ScaniaActions;

export const useScania = create<ScaniaState>((set) => ({
  mPointPrices: [],
  setMPointPrices: (mPointPrices) => set({ mPointPrices }),
}));
