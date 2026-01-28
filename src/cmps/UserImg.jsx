
export function UserImg({ url, alt = 'User avatar', className = '' }) {

    const fallbackImg = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"

    function getInitial() {
        if (!fullname) return ''
        return fullname.charAt(0).toUpperCase()
    }

    return (
        <section className={`user-img ${className}`}>
            {url ? (
                <img
                    src={url}
                    alt={alt}
                    className="user-img-src"
                    onError={(e) => {
                        e.target.style.display = 'none' 
                        e.target.nextSibling.style.display = 'flex' 
                    }}
                />
            ) : null}

            {!url && (
                <div className="user-initials-fallback">
                    {getInitial}
                </div>
            )}
        </section>
    )
}