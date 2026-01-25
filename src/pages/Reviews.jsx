import { useState } from 'react';
import { IoMdStar } from "react-icons/io";
import { ReviewsModal } from "./ReviewsModal.jsx";

export function Reviews({ reviews }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(6);
    const maxLength = 70;

    const visibleReviews = reviews.slice(0, visibleCount);

    function getTimeAgo(timestamp) {
        const now = Date.now()
        const diffMs = now - timestamp

        const minute = 1000 * 60
        const hour = minute * 60
        const day = hour * 24
        const week = day * 7
        const month = day * 30
        const year = day * 365

        if (diffMs >= year) return `${Math.floor(diffMs / year)} year${Math.floor(diffMs / year) > 1 ? 's' : ''} ago`
        if (diffMs >= month) return `${Math.floor(diffMs / month)} month${Math.floor(diffMs / month) > 1 ? 's' : ''} ago`
        if (diffMs >= week) return `${Math.floor(diffMs / week)} week${Math.floor(diffMs / week) > 1 ? 's' : ''} ago`
        if (diffMs >= day) return `${Math.floor(diffMs / day)} day${Math.floor(diffMs / day) > 1 ? 's' : ''} ago`
        if (diffMs >= hour) return `${Math.floor(diffMs / hour)} hour${Math.floor(diffMs / hour) > 1 ? 's' : ''} ago`
        if (diffMs >= minute) return `${Math.floor(diffMs / minute)} minute${Math.floor(diffMs / minute) > 1 ? 's' : ''} ago`
        return 'just now'
    }

    return (
        <section className="review-list">
            {visibleReviews.map((review, idx) => {
                const isLong = review.txt?.length > maxLength
                const displayText = isLong ? review.txt.slice(0, maxLength) + '...' : review.txt

                return (
                    <div className="review-item" key={idx}>
                        <div className="review-header">
                            <img
                                src={review.by?.imgUrl}
                                alt={review.by?.fullname}
                                className="review-avatar"
                            />
                            <span className="review-name">{review.by?.fullname}</span>
                        </div>

                        <div className="review-meta">
                            <div className="rating">
                                {Array.from({ length: Math.floor(review.rate) }).map((_, i) => (
                                    <IoMdStar key={i} />
                                ))}
                            </div>
                            <span className="review-date">· {getTimeAgo(review.at)}</span>
                        </div>

                        <p className="review-text">{displayText}</p>

                        {isLong && (
                            <button
                                className='btn-review-more'
                                onClick={() => setIsModalOpen(true)}
                            >
                                Show more
                            </button>
                        )}
                    </div>
                )
            })}

            {reviews.length > visibleCount && (
                <button className="btn-reviews-more" onClick={() => setIsModalOpen(true)}>
                    Show all {reviews.length} reviews
                </button>
            )}

            {isModalOpen && (
                <ReviewsModal
                    reviews={reviews}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </section>
    )
}
