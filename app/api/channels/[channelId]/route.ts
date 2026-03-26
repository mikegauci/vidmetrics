import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  const { channelId } = params;

  if (!channelId) {
    return NextResponse.json({ error: "channelId is required" }, { status: 400 });
  }

  const { error } = await supabase.from("channels").delete().eq("id", channelId);

  if (error) {
    console.error("Delete channel error:", error);
    return NextResponse.json({ error: "Failed to delete channel" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
