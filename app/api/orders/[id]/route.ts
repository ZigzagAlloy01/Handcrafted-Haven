import { createServerSupabaseClient } from "@/lib/db/supabase-server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ FIX HERE

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return Response.json(null, { status: 404 });
  }

  return Response.json(data);
}