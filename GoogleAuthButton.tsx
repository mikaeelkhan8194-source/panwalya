import React from 'react';
import { User } from 'firebase/auth';
import { LogOut, Mail, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { logout } from '../lib/firebase';

interface GoogleAuthButtonProps {
  user: User | null;
  needsAuth: boolean;
  isLoggingIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  gmailActive?: boolean;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  user,
  needsAuth,
  isLoggingIn,
  onLogin,
  onLogout,
  gmailActive = false,
}) => {
  if (user) {
    return (
      <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-full text-xs text-stone-700 dark:text-stone-300">
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user.displayName || 'Google User'} 
            className="w-5 h-5 rounded-full object-cover border border-stone-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
            {user.displayName ? user.displayName[0].toUpperCase() : 'G'}
          </div>
        )}
        <div className="flex flex-col text-left">
          <span className="font-semibold leading-none truncate max-w-[120px]">
            {user.displayName || user.email?.split('@')[0]}
          </span>
          <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
            <CheckCircle2 className="w-2.5 h-2.5" /> Gmail Linked
          </span>
        </div>
        <button
          onClick={onLogout}
          title="Sign out of Google"
          className="ml-1 p-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full text-stone-500 hover:text-stone-800 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onLogin}
      disabled={isLoggingIn}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium border border-stone-300 rounded-full shadow-xs hover:shadow transition disabled:opacity-50 cursor-pointer"
    >
      <div className="w-4 h-4 flex-shrink-0">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '100%', height: '100%' }}>
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        </svg>
      </div>
      <span>{isLoggingIn ? 'Connecting...' : 'Connect Gmail Account'}</span>
    </button>
  );
};
