import { NextResponse } from "next/server";
import { offerGeneratorAgent } from "@/features/recruitment/agents/offer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await offerGeneratorAgent.execute(body);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
