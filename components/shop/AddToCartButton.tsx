"use client";

import { useState } from "react";
import "@/app/shop/shop.css";

type Props = {
  product: any;
  canAddToCart: boolean;
};

export default function AddToCartButton({ product, canAddToCart }: Props) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!canAddToCart) return;

    const stored = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = stored.find((item: any) => item.id === product.id);

    let updated;

    if (existing) {
      updated = stored.map((item: any) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updated = [
        ...stored,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.images?.[0],
          seller_id: product.seller_id,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);

    setTimeout(() => setAdded(false), 1500);
  };

  if (!canAddToCart) {
    return null;
  }

  return (
    <button
      onClick={handleAdd}
      className="product-button btn btn-secondary w-full text-center"
    >
      {added ? "Added ✅" : "Add to Cart"}
    </button>
  );
}