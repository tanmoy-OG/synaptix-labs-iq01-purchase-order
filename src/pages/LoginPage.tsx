import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';

// Firebase imports (using CDN for browser, but here we use npm package)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { initializeApp } from 'firebase/app';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBSB1d41zwViYbT40DEWmdn88OlcosLWHs',
  authDomain: 'synaptix-user-data.firebaseapp.com',
  databaseURL: 'https://synaptix-user-data-default-rtdb.firebaseio.com',
  projectId: 'synaptix-user-data',
  storageBucket: 'synaptix-user-data.appspot.com',
  messagingSenderId: '1063709047082',
  appId: '1:1063709047082:web:c3604b9d472df339c50653',
};

// Initialize Firebase only once
let app: ReturnType<typeof initializeApp> | undefined;

declare global {
  interface Window {
    _firebaseApp?: ReturnType<typeof initializeApp>;
  }
}

if (!window._firebaseApp) {
  app = initializeApp(firebaseConfig);
  window._firebaseApp = app;
} else {
  app = window._firebaseApp;
}

const provider = new GoogleAuthProvider();

export function LoginPage() {
  useEffect(() => {
    document.title = 'Login | Inforium';
  }, []);

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, provider);
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential?.accessToken;
      // const user = result.user;
      toast.success('Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = '/data-configuration';
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Login failed. Please try again.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 rounded-2xl shadow-xl border bg-card">
        <h1 className="text-3xl font-bold text-primary">Welcome to Inforium</h1>
        <p className="mb-8 text-muted-foreground">Sign in to continue to your account</p>
        <Button
          variant="outline"
          className="w-full flex items-center gap-3 py-6 text-lg font-semibold border border-input hover:bg-accent hover:border-primary"
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className="w-6 h-6" />
          Sign in with Google
        </Button>
        <Toaster position="top-right" />
      </Card>
    </div>
  );
} 