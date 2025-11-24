import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome({ auth }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch events from API
        fetch('/events')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setEvents(data.slice(0, 6)); // Show first 6 events
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Head title="Ana Sayfa - Üniversite Etkinlik Yönetimi" />
            
            <div className="min-h-screen bg-black text-white">
                {/* Navigation */}
                <nav className="border-b border-red-600/20 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                        Eventify
                                    </h1>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth?.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-4 py-2 text-gray-300 hover:text-white transition duration-200"
                                        >
                                            Giriş Yap
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 font-medium"
                                        >
                                            Kayıt Ol
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black"></div>
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
                    </div>
                    
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                        <div className="text-center">
                            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
                                <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent">
                                    Üniversite Etkinliklerini
                                </span>
                                <br />
                                <span className="text-white">Keşfedin</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
                                Üniversiteler etkinliklerini paylaşır, öğrenciler keşfeder ve katılır. 
                                Akademik dünyanın en iyi etkinliklerini bir arada bulun.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {!auth?.user && (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-lg font-semibold transition duration-200 transform hover:scale-105 shadow-lg shadow-red-600/50"
                                        >
                                            Hemen Başla
                                        </Link>
                                        <Link
                                            href="#events"
                                            className="px-8 py-4 bg-transparent border-2 border-red-600 hover:bg-red-600/10 text-red-600 rounded-lg text-lg font-semibold transition duration-200"
                                        >
                                            Etkinlikleri Görüntüle
                                        </Link>
                                    </>
                                )}
                                {auth?.user && (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-lg font-semibold transition duration-200 transform hover:scale-105 shadow-lg shadow-red-600/50"
                                    >
                                        Dashboard'a Git
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 border-t border-red-600/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                                    Neden Eventify?
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                Üniversite etkinliklerini yönetmek ve keşfetmek için en iyi platform
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-600/20 rounded-xl p-8 hover:border-red-600/40 transition duration-300">
                                <div className="w-16 h-16 bg-red-600/20 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Etkinlik Oluştur</h3>
                                <p className="text-gray-400">
                                    Üniversiteler kolayca etkinlik oluşturup öğrencilerle paylaşabilir
                                </p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-600/20 rounded-xl p-8 hover:border-red-600/40 transition duration-300">
                                <div className="w-16 h-16 bg-red-600/20 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Etkinlik Keşfet</h3>
                                <p className="text-gray-400">
                                    Öğrenciler tüm üniversite etkinliklerini tek bir yerden keşfedebilir
                                </p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-600/20 rounded-xl p-8 hover:border-red-600/40 transition duration-300">
                                <div className="w-16 h-16 bg-red-600/20 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Etkinliklere Katıl</h3>
                                <p className="text-gray-400">
                                    İlginizi çeken etkinliklere katılarak akademik ağınızı genişletin
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Events Section */}
                <section id="events" className="py-20 border-t border-red-600/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                                    Popüler Etkinlikler
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg">
                                En güncel üniversite etkinliklerini keşfedin
                            </p>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                                <p className="mt-4 text-gray-400">Etkinlikler yükleniyor...</p>
                            </div>
                        ) : events.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        className="bg-gradient-to-br from-red-900/20 to-black border border-red-600/20 rounded-xl overflow-hidden hover:border-red-600/40 transition duration-300 transform hover:scale-105"
                                    >
                                        {event.event_image ? (
                                            <div className="h-48 bg-red-600/20 overflow-hidden">
                                                <img
                                                    src={event.event_image}
                                                    alt={event.event_title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-48 bg-gradient-to-br from-red-600/30 to-red-900/30 flex items-center justify-center">
                                                <svg className="w-16 h-16 text-red-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2 text-white line-clamp-2">
                                                {event.event_title}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                                {event.event_description}
                                            </p>
                                            {auth?.user && (
                                                <Link
                                                    href={`/event/${event.id}`}
                                                    className="inline-flex items-center text-red-500 hover:text-red-400 font-medium transition duration-200"
                                                >
                                                    Detayları Gör
                                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-block w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-400 text-lg">Henüz etkinlik bulunmamaktadır</p>
                                {auth?.user && (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-block mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
                                    >
                                        İlk Etkinliği Oluştur
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                {!auth?.user && (
                    <section className="py-20 border-t border-red-600/20">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <div className="bg-gradient-to-br from-red-900/30 to-black border border-red-600/20 rounded-2xl p-12">
                                <h2 className="text-4xl font-bold mb-4">
                                    <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                                        Hemen Başlayın
                                    </span>
                                </h2>
                                <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                                    Üniversite etkinliklerini keşfetmek veya kendi etkinliklerinizi paylaşmak için 
                                    hemen kayıt olun ve topluluğumuza katılın.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href={route('register')}
                                        className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-lg font-semibold transition duration-200 transform hover:scale-105 shadow-lg shadow-red-600/50"
                                    >
                                        Ücretsiz Kayıt Ol
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="px-8 py-4 bg-transparent border-2 border-red-600 hover:bg-red-600/10 text-red-600 rounded-lg text-lg font-semibold transition duration-200"
                                    >
                                        Zaten Hesabım Var
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="border-t border-red-600/20 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-4">
                                Eventify
                            </h3>
                            <p className="text-gray-500 text-sm">
                                © 2024 Eventify. Tüm hakları saklıdır.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
