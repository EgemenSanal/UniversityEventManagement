import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;
    const isSchool = user?.role === 'school';
    
    // Get CSRF token from meta tag
    const getCsrfToken = () => {
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute('content') : '';
    };

    const [events, setEvents] = useState([]);
    const [university, setUniversity] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        event_title: '',
        event_description: '',
        event_image: '',
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch user's events if school
    useEffect(() => {
        if (isSchool) {
            fetch('/user/events', {
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.events) {
                        // Backend'den tek event dönüyor, array'e çeviriyoruz
                        setEvents(Array.isArray(data.events) ? data.events : [data.events]);
                    } else {
                        setEvents([]);
                    }
                    if (data.university) {
                        setUniversity(data.university);
                    }
                })
                .catch(error => {
                    console.error('Error fetching events:', error);
                    setEvents([]);
                });
        }
    }, [isSchool]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const csrfToken = getCsrfToken();
            const response = await fetch('/createEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 403) {
                    setErrors({ general: 'Sadece okul kullanıcıları etkinlik oluşturabilir!' });
                } else {
                    setErrors({ general: data.message || 'Bir hata oluştu' });
                }
                setLoading(false);
                return;
            }

            setSuccessMessage('Etkinlik başarıyla oluşturuldu!');
            setFormData({
                event_title: '',
                event_description: '',
                event_image: '',
            });
            setShowCreateForm(false);
            
            // Refresh events list
            if (isSchool) {
                fetch('/user/events', {
                    headers: {
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.events) {
                            setEvents(Array.isArray(data.events) ? data.events : [data.events]);
                        }
                    });
            }
        } catch (error) {
            console.error('Error creating event:', error);
            setErrors({ general: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-black text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">
                            <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                                Hoş Geldiniz, {user?.name}
                            </span>
                        </h1>
                        <p className="text-gray-400">
                            {isSchool ? 'Okul Paneli' : 'Öğrenci Paneli'}
                        </p>
                    </div>

                    {/* School User - Create Event Section */}
                    {isSchool && (
                        <div className="mb-8">
                            {!showCreateForm ? (
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition duration-200 flex items-center"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    Yeni Etkinlik Oluştur
                                </button>
                            ) : (
                                <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-600/20 rounded-xl p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-white">
                                            Yeni Etkinlik Oluştur
                                        </h2>
                                        <button
                                            onClick={() => {
                                                setShowCreateForm(false);
                                                setFormData({
                                                    event_title: '',
                                                    event_description: '',
                                                    event_image: '',
                                                });
                                                setErrors({});
                                                setSuccessMessage('');
                                            }}
                                            className="text-gray-400 hover:text-white transition duration-200"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    {successMessage && (
                                        <div className="mb-4 p-4 text-sm font-medium text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg">
                                            {successMessage}
                                        </div>
                                    )}

                                    {errors.general && (
                                        <div className="mb-4 p-4 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                                            {errors.general}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <InputLabel htmlFor="event_title" value="Etkinlik Başlığı" />
                                            <TextInput
                                                id="event_title"
                                                name="event_title"
                                                value={formData.event_title}
                                                onChange={handleInputChange}
                                                className="mt-2 block w-full"
                                                required
                                                maxLength={255}
                                            />
                                            <InputError message={errors.event_title} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="event_description" value="Etkinlik Açıklaması" />
                                            <textarea
                                                id="event_description"
                                                name="event_description"
                                                value={formData.event_description}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="mt-2 block w-full px-4 py-3 bg-black/50 border border-red-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition duration-200"
                                                required
                                                maxLength={255}
                                            />
                                            <InputError message={errors.event_description} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="event_image" value="Etkinlik Görseli URL (Opsiyonel)" />
                                            <TextInput
                                                id="event_image"
                                                name="event_image"
                                                type="url"
                                                value={formData.event_image}
                                                onChange={handleInputChange}
                                                className="mt-2 block w-full"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            <InputError message={errors.event_image} className="mt-2" />
                                        </div>

                                        <div className="flex gap-4">
                                            <PrimaryButton
                                                type="submit"
                                                className="flex-1 justify-center"
                                                disabled={loading}
                                            >
                                                {loading ? 'Oluşturuluyor...' : 'Etkinlik Oluştur'}
                                            </PrimaryButton>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowCreateForm(false);
                                                    setFormData({
                                                        event_title: '',
                                                        event_description: '',
                                                        event_image: '',
                                                    });
                                                    setErrors({});
                                                    setSuccessMessage('');
                                                }}
                                                className="px-6 py-3 bg-transparent border-2 border-red-600/30 hover:border-red-600/50 text-red-500 rounded-lg font-semibold transition duration-200"
                                            >
                                                İptal
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}

                    {/* My Events Section (School) */}
                    {isSchool && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-white">
                                Oluşturduğum Etkinlikler
                            </h2>
                            {events.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {events.map((event) => (
                                        <div
                                            key={event.id}
                                            className="bg-gradient-to-br from-red-900/20 to-black border border-red-600/20 rounded-xl overflow-hidden hover:border-red-600/40 transition duration-300"
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
                                                {university && (
                                                    <div className="mb-2">
                                                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-red-600/20 text-red-400 rounded-full border border-red-600/30">
                                                            {university.name}
                                                        </span>
                                                    </div>
                                                )}
                                                <h3 className="text-xl font-bold mb-2 text-white line-clamp-2">
                                                    {event.event_title}
                                                </h3>
                                                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                                    {event.event_description}
                                                </p>
                                                <Link
                                                    href={route('event-detail', event.id)}
                                                    className="inline-flex items-center text-red-500 hover:text-red-400 font-medium transition duration-200"
                                                >
                                                    Detayları Gör
                                                    <svg
                                                        className="w-4 h-4 ml-2"
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
                                <div className="text-center py-12 bg-gradient-to-br from-red-900/20 to-black border border-red-600/20 rounded-xl">
                                    <p className="text-gray-400">Henüz etkinlik oluşturmadınız.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Student User - Quick Actions */}
                    {!isSchool && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-600/20 rounded-xl p-6">
                                <h3 className="text-xl font-bold mb-4 text-white">
                                    Etkinlikleri Keşfet
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    Tüm üniversite etkinliklerini görüntüleyin ve ilginizi çeken etkinliklere katılın.
                                </p>
                                <a
                                    href={route('events-page')}
                                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
                                >
                                    Etkinliklere Git
                                    <svg
                                        className="w-4 h-4 ml-2"
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
                                </a>
                            </div>

                            <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-600/20 rounded-xl p-6">
                                <h3 className="text-xl font-bold mb-4 text-white">
                                    Profil Ayarları
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    Profil bilgilerinizi güncelleyin ve hesap ayarlarınızı yönetin.
                                </p>
                                <a
                                    href={route('profile.edit')}
                                    className="inline-flex items-center px-4 py-2 bg-transparent border-2 border-red-600/30 hover:border-red-600/50 text-red-500 rounded-lg transition duration-200"
                                >
                                    Profili Düzenle
                                    <svg
                                        className="w-4 h-4 ml-2"
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
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
