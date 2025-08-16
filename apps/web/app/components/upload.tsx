"use client";

import { useState } from 'react';

export function ImageUpload({ onUploaded }: { onUploaded: (publicUrl: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);

    const signRes = await fetch('/api/admin/storage/sign-upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: file.name }) });
    const signData = await signRes.json();
    if (!signRes.ok) {
      setError(signData.error || 'Failed to sign upload');
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    const uploadRes = await fetch(signData.signedUrl, { method: 'POST', body: formData });
    if (!uploadRes.ok) {
      setError('Upload failed');
      setUploading(false);
      return;
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${signData.path}`;
    onUploaded(publicUrl);
    setUploading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" accept="image/*" onChange={onChange} disabled={uploading} />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}