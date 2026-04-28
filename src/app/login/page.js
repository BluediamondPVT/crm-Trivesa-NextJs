

import LoginForm from '@/components/LoginForm';

export const metadata = {
  title: 'Login - Trivesa CRM',
  description: 'Sign in to manage your HR consultancy.',
};

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}