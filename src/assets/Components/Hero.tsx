import { useTrendingMovies } from '../../hooks/useNetflixQueries'
import { getBackdropUrl } from '../../config/environment'

const Hero = () => {
    const { data: movies, isLoading, isError } = useTrendingMovies('week')

    // Loading state
    if (isLoading) {
        return (
            <div 
                className="hero-component"
                style={{
                    position: 'relative',
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#1a1a1a',
                    marginLeft: 'calc(-50vw + 50%)',
                    marginRight: 'calc(-50vw + 50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <div style={{ color: 'white', fontSize: '1.25rem' }}>
                    Loading hero content...
                </div>
            </div>
        )
    }

    // Select the first movie for the hero section (stable, no randomness during render)
    const heroMovie = movies?.[0]

    // Error state
    if (isError || !heroMovie) {
        return (
            <div 
                className="hero-component"
                style={{
                    position: 'relative',
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#1a1a1a',
                    marginLeft: 'calc(-50vw + 50%)',
                    marginRight: 'calc(-50vw + 50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <div style={{ color: 'white', fontSize: '1.25rem' }}>
                    Unable to load hero content
                </div>
            </div>
        )
    }

    // Get the backdrop image URL
    const backdropUrl = heroMovie.backdrop_path 
        ? getBackdropUrl(heroMovie.backdrop_path, 'original')
        : '/hero-background.jpg'

    return (
        <div
            className="hero-component"
            style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                backgroundColor: '#1a1a1a',
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)'
            }}
        >
            {/* Dynamic movie backdrop */}
            <img
                src={backdropUrl}
                alt={`${heroMovie.title} backdrop`}
                onLoad={() => console.log('✅ Hero movie backdrop loaded:', heroMovie.title)}
                onError={(e) => {
                    console.error('❌ Hero backdrop failed:', e);
                }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 1
                }}
            />

            {/* Dark Overlay */}
            <div 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 3
                }}
            />

            {/* Content that sits on top */}
            <div style={{
                position: 'relative',
                zIndex: 4,
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
            }}>
                <div style={{ textAlign: 'center', maxWidth: '1024px' }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 4rem)',
                        fontWeight: 'bold',
                        lineHeight: '1.2',
                        marginBottom: '1.5rem',
                        color: 'white',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}>
                        {heroMovie.title}
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        fontWeight: 'normal',
                        marginBottom: '2rem',
                        color: 'white',
                        opacity: 0.9,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        maxWidth: '600px',
                        margin: '0 auto 2rem auto'
                    }}>
                        {heroMovie.overview}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '1rem 2rem',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}>
                            ▶ Play
                        </button>
                        <button style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)',
                            borderRadius: '6px',
                            padding: '1rem 2rem',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}>
                            ℹ More Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;