import { getProducts } from "@/lib/shop/ListProducts";
import { getCurrentUser } from "@/lib/data/users";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/shop/AddToCartButton";
import ReviewSection from "@/components/reviews/ReviewSection";
import "./product-detail.css";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetail({ params }: Props) {
  const { id } = await params;

  const [products, currentUser] = await Promise.all([
    getProducts(),
    getCurrentUser(),
  ]);

  const product = products.find((p) => p.id === id);

  if (!product) return notFound();

  const isAdmin = currentUser?.role === "admin";
  const isOwnProduct = currentUser?.id === product.seller_id;

  return (
    <main className="product-detail-page container">
      <header className="product-detail-header">
        <h1 className="product-detail-title">{product.name}</h1>
      </header>

      <section className="product-detail-layout">
        <div className="product-detail-image-card">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="product-detail-image"
              priority
            />
          ) : (
            <div className="product-detail-no-image">
              <span className="product-detail-no-image-icon">🖼️</span>
              <p>No image available</p>
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <div className="product-detail-price-row">
            <span className="product-detail-price">
              ${Number(product.price).toFixed(2)}
            </span>

            <span className="product-detail-rating">
              {product.rating ? `⭐ ${product.rating}` : "No reviews yet"}
            </span>
          </div>

          <div className="product-detail-description">
            <p>{product.description}</p>
          </div>

          <div className="product-detail-actions">
            <AddToCartButton
              product={product}
              canAddToCart={!isAdmin && !isOwnProduct}
            />

            <Link
              href="/shop"
              className="product-button btn btn-secondary w-full text-center"
            >
              ← Back to shop
            </Link>

            <p className="product-detail-note">
              Secure checkout • Handcrafted quality guaranteed
            </p>
          </div>
        </div>
      </section>

      <ReviewSection
        productId={id}
        sellerId={product.seller_id}
      />
    </main>
  );
}