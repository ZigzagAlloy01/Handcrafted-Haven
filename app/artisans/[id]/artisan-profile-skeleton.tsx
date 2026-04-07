export default function ArtisanProfileSkeleton() {
  return (
    <div className="artisan-profile-card artisan-profile-skeleton-card">
      <div className="artisan-profile-top">
        <div className="artisan-profile-details">
          <div className="artisan-profile-skeleton-label artisan-profile-skeleton-line" />
          <div className="artisan-profile-skeleton-name artisan-profile-skeleton-line" />
          <div className="artisan-profile-skeleton-shop artisan-profile-skeleton-line" />

          <div className="artisan-profile-section">
            <div className="artisan-profile-skeleton-heading artisan-profile-skeleton-line" />
            <div className="artisan-profile-skeleton-line" />
            <div className="artisan-profile-skeleton-line" />
            <div className="artisan-profile-skeleton-line artisan-profile-skeleton-short" />
          </div>

          <div className="artisan-profile-section">
            <div className="artisan-profile-skeleton-heading artisan-profile-skeleton-line" />
            <div className="artisan-profile-skeleton-line artisan-profile-skeleton-medium" />
          </div>

          <div className="artisan-profile-section">
            <div className="artisan-profile-skeleton-button artisan-profile-skeleton-line" />
          </div>
        </div>

      <div className="artisan-profile-image-wrap">
        <div className="artisan-profile-skeleton-avatar" />
      </div>
      </div>

      <div className="artisan-profile-products">
        <div className="artisan-profile-skeleton-products-title artisan-profile-skeleton-line" />

        <div className="artisan-products-grid">
          <div className="product-card product-card-skeleton">
            <div className="product-card-image-wrap artisan-profile-skeleton-block" />
            <div className="product-card-content">
              <div className="artisan-profile-skeleton-line artisan-profile-skeleton-medium" />
              <div className="artisan-profile-skeleton-line" />
              <div className="artisan-profile-skeleton-line artisan-profile-skeleton-short" />
              <div className="artisan-profile-skeleton-line artisan-profile-skeleton-price" />
            </div>
          </div>

          <div className="product-card product-card-skeleton">
            <div className="product-card-image-wrap artisan-profile-skeleton-block" />
            <div className="product-card-content">
              <div className="artisan-profile-skeleton-line artisan-profile-skeleton-medium" />
              <div className="artisan-profile-skeleton-line" />
              <div className="artisan-profile-skeleton-line artisan-profile-skeleton-short" />
              <div className="artisan-profile-skeleton-line artisan-profile-skeleton-price" />
            </div>
          </div>

          <div className="product-card product-card-skeleton">
            <div className="product-card-image-wrap artisan-profile-skeleton-block" />
            <div className="product-card-content">
              <div className="artisan-profile-skeleton-line artisan-profile-skeleton-medium" />
              <div className="artisan-profile-skeleton-line" />
              <div className="artisan-profile-skeleton-line artisan-profile-skeleton-short" />
              <div className="artisan-profile-skeleton-line artisan-profile-skeleton-price" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}