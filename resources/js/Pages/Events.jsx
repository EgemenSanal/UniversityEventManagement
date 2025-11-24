import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [universityMap, setUniversityMap] = useState({}); // university_id -> university_name mapping
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch all events
        fetch('/events')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAllEvents(data);
                    setEvents(data);
                    
                    // Extract unique university IDs
                    const uniqueUniversityIds = [...new Set(data.map(event => event.organizer_university_id))];
                    
                    // Fetch university names for each unique ID
                    const universityPromises = uniqueUniversityIds.map(id => 
                        fetch(`/event/${data.find(e => e.organizer_university_id === id)?.id || id}`, {
                            headers: {
                                'Accept': 'application/json',
                            },
                            credentials: 'include',
                        })
                        .then(res => res.json())
                        .then(eventData => ({
                            id: id,
                            name: eventData.university?.name || `Üniversite ${id}`
                        }))
                        .catch(() => ({
                            id: id,
                            name: `Üniversite ${id}`
                        }))
                    );
                    
                    Promise.all(universityPromises).then(universityList => {
                        setUniversities(universityList);
                        // Create a map for quick lookup
                        const map = {};
                        universityList.forEach(uni => {
                            map[uni.id] = uni.name;
                        });
                        setUniversityMap(map);
                    });
                } else {
                    setAllEvents([]);
                    setEvents([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Filter events based on selected university and search term
        let filtered = allEvents;

        if (selectedUniversity) {
            filtered = filtered.filter(event => 
                event.organizer_university_id === parseInt(selectedUniversity)
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(event =>
                event.event_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.event_description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setEvents(filtered);
    }, [selectedUniversity, searchTerm, allEvents]);

    const handleUniversityChange = (e) => {
        setSelectedUniversity(e.target.value);
    };

    const clearFilters = () => {
        setSelectedUniversity('');
        setSearchTerm('');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Etkinlikler" />

            <div className="min-h-screen bg-black text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">
                            <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                                Üniversite Etkinlikleri
                            </span>
                        </h1>
                        <p className="text-gray-400">
                            Üniversiteleri seçerek etkinlikleri keşfedin
                        </p>
                    </div>

                    {/* Filters Section */}
                    <div className="mb-8 bg-gradient-to-br from-red-900/20 to-black border border-red-600/20 rounded-xl p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* University Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Üniversite Seçin
                                </label>
                                <select
                                    value={selectedUniversity}
                                    onChange={handleUniversityChange}
                                    className="w-full px-4 py-3 bg-black/50 border border-red-600/30 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition duration-200"
                                >
                                    <option value="">Tüm Üniversiteler</option>
                                    {universities.map((university) => (
                                        <option key={university.id} value={university.id}>
                                            {university.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Search Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Etkinlik Ara
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Etkinlik adı veya açıklama ara..."
                                        className="w-full px-4 py-3 pl-10 bg-black/50 border border-red-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition duration-200"
                                    />
                                    <svg
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        {(selectedUniversity || searchTerm) && (
                            <div className="mt-4">
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-red-500 hover:text-red-400 transition duration-200"
                                >
                                    Filtreleri Temizle
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Results Count */}
                    <div className="mb-6">
                        <p className="text-gray-400">
                            {loading ? (
                                'Yükleniyor...'
                            ) : (
                                <>
                                    <span className="text-white font-semibold">{events.length}</span> etkinlik bulundu
                                    {selectedUniversity && (
                                        <span className="ml-2">
                                            ({universities.find(u => u.id === parseInt(selectedUniversity))?.name})
                                        </span>
                                    )}
                                </>
                            )}
                        </p>
                    </div>

                    {/* Events Grid */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                            <p className="mt-4 text-gray-400">Etkinlikler yükleniyor...</p>
                        </div>
                    ) : events.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="bg-gradient-to-br from-red-900/20 to-black border border-red-600/20 rounded-xl overflow-hidden hover:border-red-600/40 transition duration-300 transform hover:scale-105 group"
                                >
                                    {event.event_image ? (
                                        <div className="h-48 bg-red-600/20 overflow-hidden">
                                            <img
                                                src={event.event_image}
                                                alt={event.event_title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-48 bg-gradient-to-br from-red-600/30 to-red-900/30 flex items-center justify-center">
                                            <svg
                                                className="w-16 h-16 text-red-500/50"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="mb-2">
                                            <span className="inline-block px-3 py-1 text-xs font-semibold bg-red-600/20 text-red-400 rounded-full border border-red-600/30">
                                                {universityMap[event.organizer_university_id] || `Üniversite ${event.organizer_university_id}`}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-white line-clamp-2 group-hover:text-red-400 transition duration-200">
                                            {event.event_title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                            {event.event_description}
                                        </p>
                                        <Link
                                            href={route('event-detail', event.id)}
                                            className="inline-flex items-center text-red-500 hover:text-red-400 font-medium transition duration-200 group/link"
                                        >
                                            Detayları Gör
                                            <svg
                                                className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-block w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    className="w-8 h-8 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Etkinlik Bulunamadı
                            </h3>
                            <p className="text-gray-400 mb-6">
                                {selectedUniversity || searchTerm
                                    ? 'Seçtiğiniz kriterlere uygun etkinlik bulunamadı.'
                                    : 'Henüz hiç etkinlik bulunmamaktadır.'}
                            </p>
                            {(selectedUniversity || searchTerm) && (
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
                                >
                                    Filtreleri Temizle
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

