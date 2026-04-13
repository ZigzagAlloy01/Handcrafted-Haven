'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/db/supabase-server';
import { ROUTES } from '@/constants/routes';

export async function updateProfile(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('Profile not found.');
  }

  const first_name = (formData.get('first_name') as string)?.trim();
  const last_name = (formData.get('last_name') as string)?.trim();
  const address = ((formData.get('address') as string) || '').trim() || null;
  const avatar_url = ((formData.get('avatar_url') as string) || '').trim() || null;

  if (!first_name || !last_name) {
    throw new Error('First name and last name are required.');
  }

  const updates: Record<string, string | null> = {
    first_name,
    last_name,
    address,
    avatar_url,
  };

  if (profile.role === 'artisan') {
    const description = ((formData.get('description') as string) || '').trim() || null;
    const shop_name = ((formData.get('shop_name') as string) || '').trim() || null;

    updates.description = description;
    updates.shop_name = shop_name;
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);

  if (error) throw new Error(error.message);

  revalidatePath(ROUTES.ACCOUNT);
  revalidatePath(ROUTES.ACCOUNT_EDIT ?? '/account/edit');
}