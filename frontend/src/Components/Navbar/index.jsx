import React from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { reset } from '@/config/redux/reducer/authReducer'

export default function Navbar() {
  const router = useRouter()
  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
    dispatch(reset())
  }

  return (
    <header className={styles.header}>
      <nav className={styles.navBar} aria-label="Main navigation">
        <button
          type="button"
          className={styles.logo}
          onClick={() => router.push("/")}
          aria-label="ProConnect home"
        >
          <span className={styles.logoIcon}>P</span>
          <span className={styles.logoText}>ProConnect</span>
        </button>

        {authState.profileFetched ? (
          <div className={styles.authSection}>
            <span className={styles.greeting}>
              Hi, <strong>{authState.user?.userId?.name}</strong>
            </span>
            <div className={styles.navActions}>
              <button
                type="button"
                className={styles.navLink}
                onClick={() => router.push("/profilePage")}
              >
                Profile
              </button>
              <button
                type="button"
                className={styles.navLinkMuted}
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.guestSection}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => router.push("/login")}
            >
              Join now
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}
