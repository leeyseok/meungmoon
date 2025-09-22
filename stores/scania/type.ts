export interface PriceData {
  date: string;
  average_price: number;
}

export type ScaniaWindowKey = "1w" | "1m" | "3m" | "6m" | "1y" | "5y" | "all";
