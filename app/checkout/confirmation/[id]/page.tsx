"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Order } from "@/types/order";
import "./confirmation.css";

export default function ConfirmationPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

useEffect(() => {
  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);

      if (!res.ok) throw new Error("Failed to fetch order");

      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (id) fetchOrder();
}, [id]);

  if (!order) return <p>Loading order...</p>;

  return (
    <main className="confirmation-page">
      <h1 className="confirmation-title">Order Confirmed 🎉</h1>

      <div className="confirmation-card">
        <div className="confirmation-meta">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>
          <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
        </div>

        <h2>Items</h2>

        {order.items.map((item, index) => (
          <div
            key={`${item.product_id}-${index}`}
            className="confirmation-item"
          >
            <img
                src={item.image_url || "/placeholder.jpg"}
                alt={item.name}
            />

            <div className="confirmation-info">
              <p><strong>{item.name}</strong></p>
              <p>
                {item.quantity} × ${item.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}

        <div className="confirmation-actions">
          <button
            className="confirmation-btn"
            onClick={() => (window.location.href = "/")}
          >
            Continue Shopping
          </button>

          <button
            className="confirmation-btn"
            onClick={() => router.push("/orders")}
          >
            View Orders
          </button>
        </div>
      </div>
    </main>
  );
}