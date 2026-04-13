"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/db/supabase";
import { Order, OrderStatus } from "@/types/order";

export default function AdminOrdersPage() {
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellerMap, setSellerMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);

    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Orders error:", ordersError);
      setOrders([]);
      setLoading(false);
      return;
    }

    setOrders(ordersData || []);

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, shop_name, first_name, last_name");

    if (profileError) {
      console.error("Profile error:", profileError);
    }

    const map: Record<string, string> = {};

    (profiles || []).forEach((p: any) => {
      map[p.id] =
        p.shop_name ||
        `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() ||
        "Unknown Seller";
    });

    setSellerMap(map);

    setLoading(false);
  };

const updateStatus = async (id: string, status: OrderStatus) => {
  console.log("Updating order:", id, status);

  const { data, error, count } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select();

  console.log("UPDATE RESULT:", { data, error, count });

  if (error) {
    console.error("Update failed:", error);
    alert("Update failed — check console");
    return;
  }

  if (!data || data.length === 0) {
    console.warn("No rows updated — likely RLS issue");
    alert("No update occurred (check RLS policies)");
    return;
  }

  fetchAll();
};

  if (loading) return <p style={{ padding: "2rem" }}>Loading orders...</p>;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Admin Orders</h1>

      {orders.map((order) => {
        const grouped = order.items.reduce((acc: any, item: any) => {
          const key = item.seller_id || "unknown";
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});

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
              <strong>User:</strong> {order.user_id}
            </p>

            <p>
              <strong>Total:</strong> ${order.total.toFixed(2)}
            </p>

            <p>
              <strong>Status:</strong> {order.status}
            </p>

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(order.id, e.target.value as OrderStatus)
              }
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <details style={{ marginTop: "0.75rem" }}>
              <summary>Items by Seller</summary>

              {Object.entries(grouped).map(([sellerId, items]: any) => (
                <div key={sellerId} style={{ marginTop: "1rem" }}>
                  <h4>
                    Seller:{" "}
                    {sellerMap[sellerId] || "Unknown Seller"}
                  </h4>

                  {items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <img
                        src={item.image_url || "/placeholder.jpg"}
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
            </details>
          </div>
        );
      })}
    </main>
  );
}