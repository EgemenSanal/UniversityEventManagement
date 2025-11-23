import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Giriş Yap" />

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                    Hoş Geldiniz
                </h2>
                <p className="text-gray-400">
                    Hesabınıza giriş yapın
                </p>
            </div>

            {status && (
                <div className="mb-4 p-4 text-sm font-medium text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="E-posta" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
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
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-400">
                            Beni hatırla
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-red-500 hover:text-red-400 transition duration-200"
                        >
                            Şifremi unuttum
                        </Link>
                    )}
                </div>

                <div>
                    <PrimaryButton 
                        className="w-full justify-center" 
                        disabled={processing}
                    >
                        {processing ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </PrimaryButton>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-400">
                        Hesabınız yok mu?{' '}
                        <Link
                            href={route('register')}
                            className="text-red-500 hover:text-red-400 font-medium transition duration-200"
                        >
                            Kayıt olun
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
