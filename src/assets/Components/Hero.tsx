import { useRef, useEffect, useState } from 'react'
import { VolumeX, Volume2 } from 'lucide-react'
import { useTrendingMovies } from '../../hooks/useNetflixQuery'
import { useMovieVideos } from '../../hooks/useMovieVideos'
import { useNavigate } from '@tanstack/react-router'

const Hero = () => {
    const { data: movies, isLoading, isError } = useTrendingMovies('week')
    const navigate = useNavigate()
    const imgRef = useRef<HTMLImageElement>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const [trailerOpen, setTrailerOpen] = useState(false)
    const [trailerActive, setTrailerActive] = useState(false)
    const [isMuted, setIsMuted] = useState(true)

    const heroMovie = movies?.[0]
    const { data: videoData } = useMovieVideos(heroMovie?.id ?? 0)
    const trailer = videoData?.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')

    // Parallax scroll on backdrop
    useEffect(() => {
        const handleScroll = () => {
            if (!imgRef.current) return
            imgRef.current.style.transform = `translateY(${Math.min(window.scrollY * 0.5, 120)}px)`
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Body scroll lock when full-screen modal is open
    useEffect(() => {
        document.body.style.overflow = trailerOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [trailerOpen])

    // Escape key closes full-screen modal
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setTrailerOpen(false)
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [])

    // Autoplay timer — starts 5 seconds after trailer key is available
    useEffect(() => {
        if (!trailer?.key) return
        const timer = setTimeout(() => setTrailerActive(true), 5000)
        return () => clearTimeout(timer)
    }, [trailer?.key])

    // Reset trailer state when the hero movie changes
    useEffect(() => {
        setTrailerActive(false)
        setIsMuted(true)
    }, [heroMovie?.id])

    // Mute/unmute via YouTube postMessage — no iframe reload, video keeps playing
    const toggleMute = () => {
        const iframe = iframeRef.current
        if (iframe?.contentWindow) {
            const cmd = isMuted
                ? '{"event":"command","func":"unMute","args":""}'
                : '{"event":"command","func":"mute","args":""}'
            iframe.contentWindow.postMessage(cmd, '*')
        }
        setIsMuted(m => !m)
    }

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
                <div style={{ color: 'white', fontSize: '1.25rem' }}>Loading hero content...</div>
            </div>
        )
    }

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
                <div style={{ color: 'white', fontSize: '1.25rem' }}>Unable to load hero content</div>
            </div>
        )
    }

    const backdropUrl = heroMovie.backdrop_path || '/hero-background.jpg'

    return (
        <>
            <div
                className="hero-component"
                style={{
                    position: 'relative',
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#141414',
                    marginLeft: 'calc(-50vw + 50%)',
                    marginRight: 'calc(-50vw + 50%)',
                    overflow: 'hidden'
                }}
            >
                {/* Backdrop image with parallax — fades out when trailer takes over */}
                <img
                    ref={imgRef}
                    src={backdropUrl}
                    alt={`${heroMovie.title} backdrop`}
                    style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        zIndex: 1,
                        willChange: 'transform',
                        opacity: trailerActive ? 0 : 1,
                        transition: 'opacity 1.5s ease',
                    }}
                />

                {/* Muted autoplay trailer — mounted early to preload, fades in after timer */}
                {trailer && (
                    <iframe
                        ref={iframeRef}
                        src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&enablejsapi=1&loop=1&playlist=${trailer.key}`}
                        title={`${heroMovie.title} trailer`}
                        allow="autoplay; encrypted-media"
                        style={{
                            position: 'absolute',
                            // Cover technique: center a 16:9 iframe that always fills the container
                            top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100vw',
                            height: '56.25vw',   // 16:9 of viewport width
                            minHeight: '100vh',
                            minWidth: '177.78vh', // 16:9 of viewport height
                            border: 'none',
                            zIndex: 1,
                            pointerEvents: 'none',
                            opacity: trailerActive ? 1 : 0,
                            transition: 'opacity 1.5s ease',
                        }}
                    />
                )}

                {/* Bottom-to-top gradient */}
                <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                    background: 'linear-gradient(to top, #000000 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                    zIndex: 2
                }} />

                {/* Left-to-right gradient for text contrast */}
                <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                    background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                    zIndex: 2
                }} />

                {/* Content — bottom-left */}
                <div style={{
                    position: 'absolute', zIndex: 4,
                    bottom: '15%', left: '4%',
                    maxWidth: '550px'
                }}>
                    <h1 style={{
                        fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                        fontWeight: 'bold', lineHeight: '1.1',
                        marginBottom: '1rem', color: 'white',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}>
                        {heroMovie.title}
                    </h1>
                    <p style={{
                        fontSize: '1.1rem', marginBottom: '1.5rem',
                        color: 'rgba(255,255,255,0.85)',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {heroMovie.overview}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => {
                                if (trailer) {
                                    setTrailerOpen(true)
                                } else {
                                    navigate({ to: '/movie/$id', params: { id: String(heroMovie.id) } })
                                }
                            }}
                            style={{
                                backgroundColor: 'white', color: 'black',
                                border: 'none', borderRadius: '6px',
                                padding: '0.75rem 2rem', fontSize: '1rem',
                                fontWeight: '700', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                transition: 'background-color 0.2s ease',
                            }}>
                            ▶ Play
                        </button>
                        <button
                            onClick={() => navigate({ to: '/movie/$id', params: { id: String(heroMovie.id) } })}
                            style={{
                                backgroundColor: 'rgba(109,109,110,0.7)', color: 'white',
                                border: 'none', borderRadius: '6px',
                                padding: '0.75rem 2rem', fontSize: '1rem',
                                fontWeight: '700', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                transition: 'background-color 0.2s ease',
                            }}>
                            ℹ More Info
                        </button>
                    </div>
                </div>

                {/* Mute/unmute button — only visible when trailer is playing */}
                {trailerActive && trailer && (
                    <button
                        onClick={toggleMute}
                        aria-label={isMuted ? 'Unmute trailer' : 'Mute trailer'}
                        style={{
                            position: 'absolute', zIndex: 4,
                            bottom: '15%', right: '4%',
                            background: 'transparent',
                            border: '2px solid rgba(255,255,255,0.5)',
                            borderRadius: '50%',
                            width: '2.75rem', height: '2.75rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'white',
                            transition: 'border-color 0.2s ease',
                        }}
                    >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                )}
            </div>

            {/* Full-screen trailer modal (Play button) */}
            {trailerOpen && trailer && (
                <div
                    onClick={() => setTrailerOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 100,
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '1rem'
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{ position: 'relative', width: '100%', maxWidth: '900px', aspectRatio: '16/9' }}
                    >
                        <button
                            onClick={() => setTrailerOpen(false)}
                            style={{
                                position: 'absolute', top: '-2.5rem', right: 0,
                                background: 'none', border: 'none',
                                color: 'white', fontSize: '1rem', fontWeight: '600',
                                cursor: 'pointer', padding: '0.25rem 0.5rem',
                                letterSpacing: '0.05em'
                            }}
                        >
                            ✕ CLOSE
                        </button>
                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                            title={trailer.name}
                            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '4px' }}
                            allow="autoplay; encrypted-media; fullscreen"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default Hero
