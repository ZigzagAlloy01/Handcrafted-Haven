'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types/user'
import { ROUTES } from '@/constants/routes'
import { updateProfile } from '@/lib/actions/users'
import styles from './EditProfileForm.module.css'

export default function EditProfileForm({ user }: { user: User }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isArtisan = user.role === 'artisan'

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        await updateProfile(formData)
        setSuccess('Profile updated successfully.')
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
      }
    })
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className={styles.title}>Edit Profile</h1>
        <div className={styles.wrapper}>
          <div className={`card ${styles.card}`}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="first_name" className={styles.label}>
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  defaultValue={user.first_name ?? ''}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="last_name" className={styles.label}>
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  defaultValue={user.last_name ?? ''}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="address" className={styles.label}>
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  defaultValue={user.address ?? ''}
                  placeholder="Enter your address"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="avatar_url" className={styles.label}>
                  Avatar URL
                </label>
                <input
                  id="avatar_url"
                  name="avatar_url"
                  type="url"
                  defaultValue={user.avatar_url ?? ''}
                  placeholder="https://example.com/avatar.jpg"
                  className={styles.input}
                />
              </div>

              {isArtisan && (
                <>
                  <div className={styles.field}>
                    <label htmlFor="shop_name" className={styles.label}>
                      Shop Name
                    </label>
                    <input
                      id="shop_name"
                      name="shop_name"
                      type="text"
                      defaultValue={user.shop_name ?? ''}
                      placeholder="Enter your shop name"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="description" className={styles.label}>
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      defaultValue={user.description ?? ''}
                      placeholder="Tell customers about yourself or your shop..."
                      className={styles.textarea}
                      rows={5}
                    />
                  </div>
                </>
              )}

              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}

              <div className={styles.actions}>
                <button type="submit" className="btn btn-primary" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => router.push(ROUTES.ACCOUNT)}
                  disabled={isPending}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}