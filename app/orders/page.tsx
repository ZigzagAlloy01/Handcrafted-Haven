"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/db/supabase";
import { Order } from "@/types/order";

export default function OrdersPage() {
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellerMap, setSellerMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }


      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Orders error:", ordersError);
        setOrders([]);
        setLoading(false);
        return;
      }

      setOrders(ordersData || []);

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, shop_name, first_name, last_name");

      if (profilesError) {
        console.error("Profiles error:", profilesError);
      }

      const map: Record<string, string> = {};

      (profiles || []).forEach((p: any) => {
        map[p.id] =
          p.shop_name ||
          `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() ||
          "Unknown Artisan";
      });

      setSellerMap(map);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading orders...</p>;
  }

  if (!orders.length) {
    return <p style={{ padding: "2rem" }}>No orders yet.</p>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>My Orders</h1>

      {orders.map((order) => {
        const grouped = (order.items || []).reduce(
          (acc: Record<string, any[]>, item: any) => {
            const key = item.seller_id ?? "unknown";

            if (!acc[key]) acc[key] = [];
            acc[key].push(item);

            return acc;
          },
          {}
        );

        return (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>Order:</strong> {order.id}
            </p>

            <p>
              <strong>Status:</strong> {order.status}
            </p>

            <p>
              <strong>Total:</strong> ${order.total.toFixed(2)}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>

            <details>
              <summary>Items by Seller</summary>

              <div style={{ marginTop: "0.75rem" }}>
                {Object.entries(grouped).map(([sellerId, items]: any) => (
                  <div key={sellerId} style={{ marginBottom: "1rem" }}>
                    <h4>
                      Seller: {sellerMap[sellerId] || "Unknown Artisan"}
                    </h4>

                    {items.map((item: any, idx: number) => (
                      <div
                        key={`${item.id || item.product_id}-${idx}`}
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <img
                          src={item.image_url || "/placeholder.jpg"}
                          alt={item.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />

                        <div>
                          <p style={{ margin: 0 }}>{item.name}</p>
                          <p style={{ margin: 0, fontSize: "0.8rem" }}>
                            {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </details>
          </div>
        );
      })}
    </main>
  );
}