// app/components/settings/AccountSettings.tsx
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/auth-client";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole, ShieldAlert, UserRound } from "lucide-react";

type AccountSettingsProps = {
  name: string;
  email: string;
  image?: string | null;
};

function Status({ message, error = false }: { message: string; error?: boolean }) {
  return (
    <p role={error ? "alert" : "status"} className={`mt-3 flex items-start gap-2 text-sm ${error ? "text-red-700" : "text-green-800"}`}>
      {error ? <AlertCircle className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}
      {message}
    </p>
  );
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100";
const buttonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#242424] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#444] disabled:cursor-not-allowed disabled:opacity-50";

export default function AccountSettings({ name, email }: AccountSettingsProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(name);
  const [savedName, setSavedName] = useState(name);
  const [nameBusy, setNameBusy] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ text: string; error: boolean } | null>(null);
  const [nameStatus, setNameStatus] = useState<{ text: string; error: boolean } | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ text: string; error: boolean } | null>(null);
  const [revokeOthers, setRevokeOthers] = useState(true);
  const [sessionsBusy, setSessionsBusy] = useState(false);
  const [sessionsStatus, setSessionsStatus] = useState<{ text: string; error: boolean } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<{ text: string; error: boolean } | null>(null);

  const updateName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = displayName.trim();
    if (value.length < 2 || value.length > 100) {
      setNameStatus({ text: "Please enter a name between 2 and 100 characters.", error: true });
      return;
    }
    setNameBusy(true);
    setNameStatus(null);
    try {
      const { error } = await authClient.updateUser({ name: value });
      if (error) throw new Error(error.message || "Unable to update your name.");
      setDisplayName(value);
      setSavedName(value);
      setNameStatus({ text: "Your name has been updated.", error: false });
      router.refresh();
    } catch (error) {
      setNameStatus({ text: error instanceof Error ? error.message : "Unable to update your name.", error: true });
    } finally {
      setNameBusy(false);
    }
  };

  const changeEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = newEmail.trim().toLowerCase();
    if (value === email.toLowerCase()) return;
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
      setEmailStatus({ text: "Enter a valid email address.", error: true });
      return;
    }
    setEmailBusy(true);
    setEmailStatus(null);
    try {
      const { error } = await authClient.changeEmail({
        newEmail: value,
        callbackURL: "/settings",
      });
      if (error) throw new Error(error.message || "Unable to request an email change.");
      setEmailStatus({ text: "Email change requested. Check the relevant inboxes for a verification message. Your current address stays active until verification is complete.", error: false });
    } catch (error) {
      setEmailStatus({ text: error instanceof Error ? error.message : "Email changes may require additional configuration by the authentication provider.", error: true });
    } finally {
      setEmailBusy(false);
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nextPassword.length < 8) {
      setPasswordStatus({ text: "Use at least 8 characters for your new password.", error: true });
      return;
    }
    if (nextPassword !== confirmPassword) {
      setPasswordStatus({ text: "New passwords do not match.", error: true });
      return;
    }
    if (nextPassword === currentPassword) {
      setPasswordStatus({ text: "Choose a password different from your current one.", error: true });
      return;
    }
    setPasswordBusy(true);
    setPasswordStatus(null);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword: nextPassword,
        revokeOtherSessions: revokeOthers,
      });
      if (error) throw new Error(error.message || "Unable to change your password.");
      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
      setPasswordStatus({ text: "Password updated successfully.", error: false });
    } catch (error) {
      setPasswordStatus({ text: error instanceof Error ? error.message : "Unable to change your password. If you use Google or Apple sign-in, use your provider's password settings.", error: true });
    } finally {
      setPasswordBusy(false);
    }
  };

  const revokeSessions = async () => {
    setSessionsBusy(true);
    setSessionsStatus(null);
    try {
      const { error } = await authClient.revokeOtherSessions();
      if (error) throw new Error(error.message || "Unable to sign out other sessions.");
      setSessionsStatus({ text: "Other signed-in sessions have been revoked.", error: false });
    } catch (error) {
      setSessionsStatus({ text: error instanceof Error ? error.message : "Unable to sign out other sessions.", error: true });
    } finally {
      setSessionsBusy(false);
    }
  };

  const deleteAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (deleteConfirmation !== "DELETE") {
      setDeleteStatus({ text: 'Type DELETE to confirm.', error: true });
      return;
    }
    setDeleteBusy(true);
    setDeleteStatus(null);
    try {
      const { error } = await authClient.deleteUser({
        ...(deletePassword ? { password: deletePassword } : {}),
      });
      if (error) throw new Error(error.message || "Account deletion could not be completed.");
      // Provider configurations may send a verification email instead of deleting immediately.
      const session = await authClient.getSession();
      if (session.data?.user) {
        setDeleteStatus({ text: "Deletion has been requested. If your account provider requires email verification, complete the instructions sent to your inbox. Your account remains active until deletion is confirmed.", error: false });
      } else {
        window.location.assign("/login");
      }
    } catch (error) {
      setDeleteStatus({ text: error instanceof Error ? error.message : "Unable to delete your account. Please contact support if deletion is not enabled by the authentication provider.", error: true });
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      <section id="profile" className="scroll-mt-28 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <UserRound className="size-5 text-gray-600" />
          <h2 className="font-[Fraunces] text-2xl text-gray-900">Personal information</h2>
        </div>
        <form onSubmit={updateName} className="max-w-lg space-y-4">
          <div>
            <label htmlFor="settings-name" className="mb-2 block text-sm font-medium">Full name</label>
            <input id="settings-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={100} autoComplete="name" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="settings-email" className="mb-2 block text-sm font-medium">Email address</label>
            <input id="settings-email" value={email} readOnly className={`${inputClass} bg-gray-50 text-gray-500`} />
            <p className="mt-2 text-xs text-gray-500">This is your current sign-in email.</p>
          </div>
          <button type="submit" disabled={nameBusy || displayName.trim() === savedName} className={buttonClass}>
            {nameBusy && <Loader2 className="size-4 animate-spin" />}
            Save changes
          </button>
          {nameStatus && <Status message={nameStatus.text} error={nameStatus.error} />}
        </form>
        <form onSubmit={changeEmail} className="mt-8 max-w-lg border-t border-gray-100 pt-6">
          <h3 className="mb-2 text-base font-semibold text-gray-900">Change email address</h3>
          <p className="mb-4 text-sm text-gray-500">Changing your sign-in address may require confirmation through email.</p>
          <label htmlFor="settings-new-email" className="mb-2 block text-sm font-medium">New email address</label>
          <input id="settings-new-email" type="email" autoComplete="email" value={newEmail} required onChange={(event) => setNewEmail(event.target.value)} className={inputClass} />
          <button type="submit" disabled={emailBusy || newEmail.trim().toLowerCase() === email.toLowerCase()} className={`${buttonClass} mt-4`}>
            {emailBusy && <Loader2 className="size-4 animate-spin" />}
            Request email change
          </button>
          {emailStatus && <Status message={emailStatus.text} error={emailStatus.error} />}
        </form>
      </section>

      <section id="security" className="scroll-mt-28 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="mb-2 flex items-center gap-3">
          <LockKeyhole className="size-5 text-gray-600" />
          <h2 className="font-[Fraunces] text-2xl text-gray-900">Password & security</h2>
        </div>
        <p className="mb-6 text-sm text-gray-500">Change the password for an email-and-password account. Social sign-in accounts manage their passwords through the connected provider.</p>
        <form onSubmit={changePassword} className="max-w-lg space-y-4">
          <div className="flex justify-end">
            <button type="button" onClick={() => setShowPasswords((value) => !value)} className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900">
              {showPasswords ? <EyeOff className="size-4" /> : <Eye className="size-4" />} {showPasswords ? "Hide passwords" : "Show passwords"}
            </button>
          </div>
          {[
            { id: "current-password", label: "Current password", value: currentPassword, setter: setCurrentPassword, autoComplete: "current-password" },
            { id: "new-password", label: "New password", value: nextPassword, setter: setNextPassword, autoComplete: "new-password" },
            { id: "confirm-password", label: "Confirm new password", value: confirmPassword, setter: setConfirmPassword, autoComplete: "new-password" },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="mb-2 block text-sm font-medium">{field.label}</label>
              <input id={field.id} type={showPasswords ? "text" : "password"} autoComplete={field.autoComplete} required value={field.value} onChange={(e) => field.setter(e.target.value)} className={inputClass} />
            </div>
          ))}
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input type="checkbox" checked={revokeOthers} onChange={(e) => setRevokeOthers(e.target.checked)} className="size-4 accent-[#242424]" />
            Sign out other devices when changing my password
          </label>
          <button type="submit" disabled={passwordBusy} className={buttonClass}>
            {passwordBusy && <Loader2 className="size-4 animate-spin" />}
            Update password
          </button>
          {passwordStatus && <Status message={passwordStatus.text} error={passwordStatus.error} />}
        </form>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <h3 className="text-base font-semibold text-gray-900">Other sessions</h3>
          <p className="mb-4 mt-1 text-sm text-gray-500">Sign out all other browsers and devices without ending this session.</p>
          <button type="button" onClick={revokeSessions} disabled={sessionsBusy} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
            {sessionsBusy ? "Signing out…" : "Sign out other devices"}
          </button>
          {sessionsStatus && <Status message={sessionsStatus.text} error={sessionsStatus.error} />}
        </div>
      </section>

      <section id="danger" className="scroll-mt-28 rounded-2xl border border-red-200 bg-red-50/40 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-1 size-5 shrink-0 text-red-700" />
          <div>
            <h2 className="font-[Fraunces] text-2xl text-red-900">Delete account</h2>
            <p className="mt-2 text-sm leading-6 text-red-800">Deleting your account is permanent. Account deletion may require recent sign-in or email verification. Any separate learning-progress records may require additional removal by support.</p>
          </div>
        </div>
        {!deleteOpen ? (
          <button type="button" onClick={() => setDeleteOpen(true)} className="mt-6 rounded-xl border border-red-300 px-5 py-3 text-sm font-semibold text-red-800 hover:bg-red-100">
            Delete my account
          </button>
        ) : (
          <form onSubmit={deleteAccount} className="mt-6 max-w-lg space-y-4">
            <p className="text-sm font-medium text-red-900">Confirm you want to permanently delete the account associated with {email}.</p>
            <div>
              <label htmlFor="delete-password" className="mb-2 block text-sm font-medium">Current password (for password-based accounts)</label>
              <input id="delete-password" type="password" autoComplete="current-password" value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="delete-confirm" className="mb-2 block text-sm font-medium">Type DELETE to confirm</label>
              <input id="delete-confirm" value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} autoComplete="off" required className={inputClass} />
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={deleteBusy || deleteConfirmation !== "DELETE"} className="rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50">
                {deleteBusy ? "Processing…" : "Confirm account deletion"}
              </button>
              <button type="button" disabled={deleteBusy} onClick={() => { setDeleteOpen(false); setDeleteConfirmation(""); setDeletePassword(""); setDeleteStatus(null); }} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-white">
                Cancel
              </button>
            </div>
            {deleteStatus && <Status message={deleteStatus.text} error={deleteStatus.error} />}
          </form>
        )}
      </section>
    </div>
  );
}
