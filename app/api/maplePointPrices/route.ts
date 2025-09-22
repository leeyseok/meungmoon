import { fetchMaplePointPrices } from "@/lib/maplePointPrices/fetchScaniaPrices"
import { NextResponse } from "next/server"

export const runtime = 'nodejs'

export async function GET() {
    try {
        const prices = await fetchMaplePointPrices();
        return NextResponse.json(prices)
    } catch (error: unknown) {
        return NextResponse.json({ error: 'Failed to fetch prices', errorMessage: error }, { status: 500 })
    }
}