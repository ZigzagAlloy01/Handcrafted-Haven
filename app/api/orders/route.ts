import { createServerSupabaseClient } from "@/lib/db/supabase-server";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const body = await req.json();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return Response.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user.id,
          items: body.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image_url,
            seller_id: item.seller_id, 
        })),
          total: body.total,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return Response.json({ success: false }, { status: 500 });
    }

    return Response.json({ success: true, order: data });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json([], { status: 500 });
  }

  return Response.json(data);
}