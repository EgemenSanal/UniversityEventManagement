import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';

export default function EventDetail({ eventId }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isStudent = user?.role === 'student';
    const isSchool = user?.role === 'school';
    const canReply = isStudent || isSchool;
    
    const [event, setEvent] = useState(null);
    const [university, setUniversity] = useState(null);
    const [comments, setComments] = useState([]);
    const [replies, setReplies] = useState({});
    const [replyInputs, setReplyInputs] = useState({});
    const [replyErrors, setReplyErrors] = useState({});
    const [replySubmitLoading, setReplySubmitLoading] = useState({});
    const [replyFetching, setReplyFetching] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [commentsLoading, setCommentsLoading] = useState(false);

    // Fetch event details
    useEffect(() => {
        if (eventId) {
            fetch(`/event/${eventId}`, {
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Etkinlik bulunamadı');
                    }
                    return response.json();
                })
                .then(data => {
                    setEvent(data.event);
                    setUniversity(data.university);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching event:', error);
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [eventId]);

    // Fetch comments
    const fetchRepliesForComment = async (commentId) => {
        setReplyFetching((prev) => ({ ...prev, [commentId]: true }));

        try {
            const response = await fetch(`/reply/get/${commentId}`, {
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            setReplies((prev) => ({
                ...prev,
                [commentId]: data.data && Array.isArray(data.data) ? data.data : [],
            }));
        } catch (error) {
            console.error('Error fetching replies:', error);
            setReplies((prev) => ({
                ...prev,
                [commentId]: [],
            }));
        } finally {
            setReplyFetching((prev) => ({ ...prev, [commentId]: false }));
        }
    };

    const fetchComments = () => {
        if (!eventId) return;
        
        setCommentsLoading(true);
        fetch(`/comment/get/${eventId}`, {
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                console.log('Comments data from backend:', data); // Debug için
                if (data.data && Array.isArray(data.data)) {
                    // Backend'den gelen yorumları işle
                    const processedComments = data.data.map(comment => {
                        // Backend'den gelen veri yapısını kontrol et
                        // comment.user.name, comment.user_name, comment.name gibi farklı formatlar olabilir
                        let userName = null;
                        
                        if (comment.user && comment.user.name) {
                            userName = comment.user.name;
                        } else if (comment.user_name) {
                            userName = comment.user_name;
                        } else if (comment.name) {
                            userName = comment.name;
                        } else if (comment.userName) {
                            userName = comment.userName;
                        }
                        
                        return {
                            ...comment,
                            userName: userName || (comment.user_id ? `Kullanıcı #${comment.user_id}` : 'Bilinmeyen Kullanıcı')
                        };
                    });
                    setComments(processedComments);
                    setReplies({});
                    processedComments.forEach((comment) => {
                        if (comment.id) {
                            fetchRepliesForComment(comment.id);
                        }
                    });
                } else {
                    setComments([]);
                }
                setCommentsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
                setComments([]);
                setCommentsLoading(false);
            });
    };

    useEffect(() => {
        if (event) {
            fetchComments();
        }
    }, [event]);

    // Submit comment
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setCommentLoading(true);
        setCommentError('');

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        try {
            const response = await fetch('/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    comment: commentText.trim(),
                    event_id: parseInt(eventId),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 403) {
                    setCommentError('Sadece öğrenciler yorum yapabilir!');
                } else {
                    setCommentError(data.message || 'Yorum eklenirken bir hata oluştu');
                }
                setCommentLoading(false);
                return;
            }

            setCommentText('');
            setCommentError('');
            // Refresh comments
            fetchComments();
        } catch (error) {
            console.error('Error submitting comment:', error);
            setCommentError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setCommentLoading(false);
        }
    };

    const handleReplyInputChange = (commentId, value) => {
        setReplyInputs((prev) => ({
            ...prev,
            [commentId]: value,
        }));
    };

    const handleReplySubmit = async (e, commentId) => {
        e.preventDefault();
        const replyText = replyInputs[commentId]?.trim();

        if (!replyText) return;

        setReplySubmitLoading((prev) => ({ ...prev, [commentId]: true }));
        setReplyErrors((prev) => ({ ...prev, [commentId]: '' }));

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        try {
            const response = await fetch('/reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    reply: replyText,
                    event_id: parseInt(eventId),
                    comment_id: commentId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setReplyErrors((prev) => ({
                    ...prev,
                    [commentId]: data.message || 'Cevap eklenemedi. Lütfen tekrar deneyin.',
                }));
                return;
            }

            setReplyInputs((prev) => ({ ...prev, [commentId]: '' }));
            fetchRepliesForComment(commentId);
        } catch (error) {
            console.error('Error submitting reply:', error);
            setReplyErrors((prev) => ({
                ...prev,
                [commentId]: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            }));
        } finally {
            setReplySubmitLoading((prev) => ({ ...prev, [commentId]: false }));
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout>
                <Head title="Etkinlik Detayı" />
                <div className="min-h-screen bg-black text-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                        <p className="mt-4 text-gray-400">Etkinlik yükleniyor...</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (error || !event) {
        return (
            <AuthenticatedLayout>
                <Head title="Etkinlik Bulunamadı" />
                <div className="min-h-screen bg-black text-white py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Etkinlik Bulunamadı
                            </h3>
                            <p className="text-gray-400 mb-6">{error || 'Etkinlik bulunamadı'}</p>
                            <Link
                                href={route('events-page')}
                                className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
                            >
                                Etkinliklere Dön
                            </Link>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={event.event_title} />
            <div className="min-h-screen bg-black text-white py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Link
                        href={route('events-page')}
                        className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition duration-200"
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
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Etkinliklere Dön
                    </Link>

                    {/* Event Card */}
                    <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-600/20 rounded-xl overflow-hidden">
                        {event.event_image ? (
                            <div className="h-96 bg-red-600/20 overflow-hidden">
                                <img
                                    src={event.event_image}
                                    alt={event.event_title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="h-96 bg-gradient-to-br from-red-600/30 to-red-900/30 flex items-center justify-center">
                                <svg
                                    className="w-24 h-24 text-red-500/50"
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

                        <div className="p-8">
                            <div className="mb-4">
                                <span className="inline-block px-4 py-2 text-sm font-semibold bg-red-600/20 text-red-400 rounded-full border border-red-600/30">
                                    {university?.name || `Üniversite ${event.organizer_university_id}`}
                                </span>
                            </div>

                            <h1 className="text-4xl font-bold mb-4 text-white">
                                {event.event_title}
                            </h1>

                            <div className="prose prose-invert max-w-none">
                                <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {event.event_description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-8 bg-gradient-to-br from-red-900/20 to-black border border-red-600/20 rounded-xl p-8">
                        <h2 className="text-2xl font-bold mb-6 text-white">
                            Yorumlar ({comments.length})
                        </h2>

                        {/* Comment Form (Only for students) */}
                        {isStudent && (
                            <div className="mb-8 pb-8 border-b border-red-600/20">
                                <form onSubmit={handleCommentSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Yorumunuzu Yazın
                                        </label>
                                        <textarea
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            rows={4}
                                            maxLength={255}
                                            className="w-full px-4 py-3 bg-black/50 border border-red-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition duration-200"
                                            placeholder="Yorumunuzu buraya yazın..."
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            {commentText.length}/255 karakter
                                        </p>
                                    </div>

                                    {commentError && (
                                        <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                                            {commentError}
                                        </div>
                                    )}

                                    <PrimaryButton
                                        type="submit"
                                        disabled={commentLoading || !commentText.trim()}
                                        className="w-full sm:w-auto"
                                    >
                                        {commentLoading ? 'Gönderiliyor...' : 'Yorum Yap'}
                                    </PrimaryButton>
                                </form>
                            </div>
                        )}

                        {/* Comments List */}
                        {commentsLoading ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                                <p className="mt-2 text-gray-400">Yorumlar yükleniyor...</p>
                            </div>
                        ) : comments.length > 0 ? (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="bg-black/30 border border-red-600/10 rounded-lg p-4 hover:border-red-600/20 transition duration-200"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center">
                                                    <svg
                                                        className="w-5 h-5 text-red-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">
                                                        {comment.userName || comment.user?.name || `Kullanıcı #${comment.user_id}`}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(comment.created_at).toLocaleDateString('tr-TR', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">
                                            {comment.comment}
                                        </p>

                                        {/* Replies */}
                                        <div className="mt-4 space-y-3">
                                            {replyFetching[comment.id] ? (
                                                <div className="text-sm text-gray-400">
                                                    Yanıtlar yükleniyor...
                                                </div>
                                            ) : (replies[comment.id]?.length ?? 0) > 0 ? (
                                                <div className="space-y-3 border-l border-red-600/20 pl-4">
                                                    {replies[comment.id].map((reply) => {
                                                        const replyUserName =
                                                            reply.user?.name ||
                                                            reply.userName ||
                                                            (reply.user_id ? `Kullanıcı #${reply.user_id}` : 'Bilinmeyen Kullanıcı');

                                                        return (
                                                            <div
                                                                key={reply.id}
                                                                className="bg-black/40 border border-red-600/10 rounded-lg p-3"
                                                            >
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <p className="text-sm font-semibold text-white">
                                                                        {replyUserName}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {reply.created_at
                                                                            ? new Date(reply.created_at).toLocaleDateString('tr-TR', {
                                                                                year: 'numeric',
                                                                                month: 'long',
                                                                                day: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit',
                                                                            })
                                                                            : ''}
                                                                    </p>
                                                                </div>
                                                                <p className="text-gray-300 text-sm leading-relaxed">
                                                                    {reply.reply}
                                                                </p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">
                                                    Bu yoruma henüz yanıt verilmemiş.
                                                </p>
                                            )}
                                        </div>

                                        {/* Reply Form */}
                                        {canReply && (
                                            <form
                                                onSubmit={(e) => handleReplySubmit(e, comment.id)}
                                                className="mt-4 space-y-3"
                                            >
                                                <textarea
                                                    value={replyInputs[comment.id] || ''}
                                                    onChange={(e) => handleReplyInputChange(comment.id, e.target.value)}
                                                    rows={3}
                                                    maxLength={255}
                                                    className="w-full px-4 py-2 bg-black/50 border border-red-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition duration-200"
                                                    placeholder="Bu yoruma cevap yazın..."
                                                />
                                                <p className="text-xs text-gray-500">
                                                    {(replyInputs[comment.id]?.length || 0)}/255 karakter
                                                </p>
                                                {replyErrors[comment.id] && (
                                                    <div className="p-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded">
                                                        {replyErrors[comment.id]}
                                                    </div>
                                                )}
                                                <PrimaryButton
                                                    type="submit"
                                                    disabled={
                                                        replySubmitLoading[comment.id] ||
                                                        !(replyInputs[comment.id]?.trim())
                                                    }
                                                >
                                                    {replySubmitLoading[comment.id] ? 'Gönderiliyor...' : 'Cevapla'}
                                                </PrimaryButton>
                                            </form>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="inline-block w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mb-3">
                                    <svg
                                        className="w-6 h-6 text-red-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-gray-400">
                                    Henüz yorum yapılmamış. İlk yorumu siz yapın!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

