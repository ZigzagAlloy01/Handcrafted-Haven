"use client";

import { useRouter, useSearchParams } from "next/navigation";
import "./product-filter.css";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("q") ?? "";
  const currentCategory = searchParams.get("category") ?? "all";
  const currentSort = searchParams.get("sort") ?? "featured";

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all" || value === "featured") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/shop?${params.toString()}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParams("q", e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams("sort", e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams("category", e.target.value);
  };

  const handleClearFilters = () => {
    router.push("/shop");
  };

  const hasActiveFilters =
    currentQuery !== "" ||
    currentCategory !== "all" ||
    currentSort !== "featured";

  return (
    <div className="product-filters-wrap">
      <div className="product-filters">
        <div className="product-filter-control product-filter-search">
          <input
            type="text"
            placeholder="Search products..."
            onChange={handleSearch}
            defaultValue={currentQuery}
            className="product-filter-input"
          />
        </div>

        <div className="product-filter-control product-filter-select-wrap">
          <select
            onChange={handleCategoryChange}
            className="product-filter-select"
            value={currentCategory}
          >
            <option value="all">Select Category</option>
            <option value="home-decor">Home Decor</option>
            <option value="accessories">Accessories</option>
            <option value="kitchen">Kitchen</option>
            <option value="gifts">Gifts</option>
          </select>
        </div>

        <div className="product-filter-control product-filter-select-wrap">
          <select
            onChange={handleSortChange}
            className="product-filter-select"
            value={currentSort}
          >
            <option value="featured">Sort By</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClearFilters}
          className="product-filter-clear"
        >
          Clear search results
        </button>
      )}
    </div>
  );
}