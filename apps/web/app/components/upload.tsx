"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export function ImageUpload({ onUploaded }: { onUploaded: (publicUrl: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    const path = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });
    if (error) setError(error.message);
    else {
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      onUploaded(data.publicUrl);
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" accept="image/*" onChange={onChange} disabled={uploading} />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}