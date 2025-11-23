import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const [role, setRole] = useState('student'); // Default: student

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student',
    });

    const handleRoleChange = (selectedRole) => {
        setRole(selectedRole);
        setData('role', selectedRole);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Kayıt Ol" />

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                    Hesap Oluştur
                </h2>
                <p className="text-gray-400">
                    EventHub topluluğuna katılın
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* Role Selection */}
                <div>
                    <InputLabel value="Rol Seçin" />
                    <div className="mt-2 grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => handleRoleChange('student')}
                            className={`px-4 py-3 rounded-lg border-2 transition duration-200 ${
                                role === 'student'
                                    ? 'border-red-500 bg-red-600/20 text-white'
                                    : 'border-red-600/30 bg-black/50 text-gray-400 hover:border-red-600/50 hover:text-white'
                            }`}
                        >
                            <div className="flex flex-col items-center">
                                <svg
                                    className="w-6 h-6 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                                <span className="font-semibold">Öğrenci</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRoleChange('school')}
                            className={`px-4 py-3 rounded-lg border-2 transition duration-200 ${
                                role === 'school'
                                    ? 'border-red-500 bg-red-600/20 text-white'
                                    : 'border-red-600/30 bg-black/50 text-gray-400 hover:border-red-600/50 hover:text-white'
                            }`}
                        >
                            <div className="flex flex-col items-center">
                                <svg
                                    className="w-6 h-6 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                                <span className="font-semibold">Okul</span>
                            </div>
                        </button>
                    </div>
                    <InputError message={errors.role} className="mt-2" />
                </div>

                <div>
                    <InputLabel 
                        htmlFor="name" 
                        value={role === 'school' ? 'Okul Adı' : 'Ad Soyad'} 
                    />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-2 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder={role === 'school' ? 'Okul' : 'Ad Soyad'}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="E-posta" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Şifre" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Şifre Tekrar"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-2 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div>
                    <PrimaryButton 
                        className="w-full justify-center" 
                        disabled={processing}
                    >
                        {processing ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
                    </PrimaryButton>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-400">
                        Zaten hesabınız var mı?{' '}
                        <Link
                            href={route('login')}
                            className="text-red-500 hover:text-red-400 font-medium transition duration-200"
                        >
                            Giriş yapın
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
