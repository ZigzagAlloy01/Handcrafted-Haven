import { getReviewsByProduct } from '@/lib/data/reviews';
import { getCurrentUser } from '@/lib/data/users';
import ReviewForm from './ReviewForm';
import DeleteReviewButton from './DeleteReviewButton';
import Image from 'next/image';
import Link from 'next/link';
import './review-section.css';

type Props = {
  productId: string;
  sellerId: string;
};

function StarDisplay({ rating }: { rating: number | null }) {
  if (!rating) return null;

  return (
    <span className="review-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? 'text-[#C76B4F]' : 'text-[#E5DEC9]'}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function ReviewSection({ productId, sellerId }: Props) {
  const [reviews, currentUser] = await Promise.all([
    getReviewsByProduct(productId),
    getCurrentUser(),
  ]);

  const isAdmin = currentUser?.role === 'admin';
  const isOwnProduct = currentUser?.id === sellerId;
  const canReview = !!currentUser && !isAdmin && !isOwnProduct;

  return (
    <section className="review-section">
      <div className="review-section-inner">
        <h2 className="review-section-title">
          Customer Reviews{' '}
          <span className="review-section-count">({reviews.length})</span>
        </h2>

        {reviews.length === 0 ? (
          <p className="review-empty">No reviews yet.</p>
        ) : (
          <ul className="review-list">
            {reviews.map((review) => {
              const profile = review.profiles;
              const displayName =
                profile?.username ||
                (profile?.first_name
                  ? `${profile.first_name}${profile.last_name ? ' ' + profile.last_name : ''}`
                  : 'Anonymous');
              const initials = displayName.slice(0, 2).toUpperCase();
              const isOwner = currentUser?.id === review.user_id;

              return (
                <li key={review.id} className="review-item">
                  <div className="review-row">
                    <div className="review-avatar-wrap">
                      {profile?.avatar_url ? (
                        <Image
                          src={profile.avatar_url}
                          alt={displayName}
                          width={40}
                          height={40}
                          className="review-avatar-image"
                        />
                      ) : (
                        <div className="review-avatar-fallback">{initials}</div>
                      )}
                    </div>

                    <div className="review-content">
                      <div className="review-meta">
                        <div className="review-user">
                          <span className="review-name">{displayName}</span>
                          {review.rating && <StarDisplay rating={review.rating} />}
                        </div>

                        <div className="review-date-actions">
                          <span className="review-date">
                            {formatDate(review.created_at)}
                          </span>
                          {isOwner && (
                            <DeleteReviewButton
                              reviewId={review.id}
                              productId={productId}
                            />
                          )}
                        </div>
                      </div>

                      <p className="review-text">{review.content}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {!currentUser ? (
          <div className="review-login-box">
            <p className="review-login-text">
              <Link href="/login" className="review-login-link">
                Log in
              </Link>{' '}
              to leave a review.
            </p>
          </div>
        ) : canReview ? (
          <ReviewForm productId={productId} />
        ) : null}
      </div>
    </section>
  );
}