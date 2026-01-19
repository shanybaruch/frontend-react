import { useState } from 'react';
import { IoMdStar } from "react-icons/io";

export function Reviews({ reviews }) {
    console.log(reviews);
    const [visibleCount, setVisibleCount] = useState(6); // מראה 6 ראשונות

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6); // מראה עוד 6 בכל לחיצה
    };

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

        if (diffMs >= year) {
            const years = Math.floor(diffMs / year)
            return `${years} year${years > 1 ? 's' : ''} ago`
        }

        if (diffMs >= month) {
            const months = Math.floor(diffMs / month)
            return `${months} month${months > 1 ? 's' : ''} ago`
        }

        if (diffMs >= week) {
            const weeks = Math.floor(diffMs / week)
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`
        }

        if (diffMs >= day) {
            const days = Math.floor(diffMs / day)
            return `${days} day${days > 1 ? 's' : ''} ago`
        }

        if (diffMs >= hour) {
            const hours = Math.floor(diffMs / hour)
            return `${hours} hour${hours > 1 ? 's' : ''} ago`
        }

        if (diffMs >= minute) {
            const minutes = Math.floor(diffMs / minute)
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
        }

        return 'just now'
    }

    return (
        <section className="review-list">
            {visibleReviews.map((review, idx) => (
                <div className="review-item" key={idx}>
                    <div className="review-header">
                        <img
                            src={review.by.imgUrl}
                            alt={review.by.fullname}
                            className="review-avatar"
                        />
                        <span className="review-name">{review.by.fullname}</span>
                    </div>

                    <div className="review-meta">
                        <div className="rating">
                            {Array.from({ length: Math.floor(review.rate) }).map((_, i) => (
                                <IoMdStar key={i} />
                            ))}
                        </div>
                        <span className="review-date">· {getTimeAgo(review.at)}</span>
                    </div>

                    <p className="review-text">{review.txt}</p>
                </div>
            ))}

            {/* כפתור Load More אם יש עוד */}
            {visibleCount < reviews.length && (
                <button className="btn-reviews-more" onClick={handleLoadMore}>
                    Show all {reviews.length} reviews
                </button>
            )}
        </section>
    )
}