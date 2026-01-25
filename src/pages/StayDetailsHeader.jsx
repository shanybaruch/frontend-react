export function StayDetailsHeader({ photosRef, amenitiesRef, reviewsRef, hidden }) {

    function scrollTo(ref) {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <nav className={`stay-header ${hidden ? 'hidden' : ''}`}>
            <ul className="stay-header-nav">
                <li onClick={scrollToTop}>Photos</li>
                <li onClick={() => scrollTo(amenitiesRef)}>Amenities</li>
                <li onClick={() => scrollTo(reviewsRef)}>Reviews</li>
            </ul>

            {/* <section className="header-order hidden">
                <OrderCard />
            </section> */}
        </nav>
        
    )
}
