"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/db/supabase";
import { Order } from "@/types/order";
import "./orders.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellerMap, setSellerMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const supabase = createClient();

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
    return <p className="orders-loading">Loading orders...</p>;
  }

  if (!orders.length) {
    return <p className="orders-empty">No orders yet.</p>;
  }

  return (
    <main className="orders-page">
      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>

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
            <article key={order.id} className="order-card">
              <div className="order-meta">
                <p><strong>Order:</strong> {order.id}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="order-status">{order.status}</span>
                </p>
                <p><strong>Total:</strong> ${Number(order.total).toFixed(2)}</p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <details className="order-details">
                <summary>Items by Seller</summary>

                <div className="order-sellers">
                  {Object.entries(grouped).map(([sellerId, items]: any) => (
                    <div key={sellerId} className="order-seller-group">
                      <h4 className="order-seller-name">
                        Seller: {sellerMap[sellerId] || "Unknown Artisan"}
                      </h4>

                      {items.map((item: any, idx: number) => (
                        <div
                          key={`${item.id || item.product_id}-${idx}`}
                          className="order-item"
                        >
                          <img
                            src={item.image_url || "/placeholder.jpg"}
                            alt={item.name}
                            className="order-item-image"
                          />
                          <div className="order-item-info">
                            <p className="order-item-name">{item.name}</p>
                            <p className="order-item-meta">
                              {item.quantity} × ${Number(item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </details>
            </article>
          );
        })}
      </div>
    </main>
  );
}