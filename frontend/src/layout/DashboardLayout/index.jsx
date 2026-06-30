import React, { useEffect } from 'react'
import styles from './index.module.css'
import { useRouter } from 'next/router'
import { setTokenisThere } from '@/config/redux/reducer/authReducer'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from '@/config'

const NAV_ITEMS = [
  {
    label: 'Home',
    path: '/dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: 'Discover',
    path: '/discover',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    label: 'My Network',
    path: '/my_connections',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
      </svg>
    ),
  },
]

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const authState = useSelector((state) => state.auth)

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login")
    }
    dispatch(setTokenisThere())
  }, [])

  const isActive = (path) => router.pathname === path

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.layoutGrid}>
        <aside className={styles.leftSidebar} aria-label="Sidebar navigation">
          <nav className={styles.sidebarNav}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => router.push(item.path)}
                className={`${styles.sidebarOption} ${isActive(item.path) ? styles.sidebarOptionActive : ''}`}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className={styles.mainContent}>
          {children}
        </div>

        <aside className={styles.rightRail} aria-label="Suggested profiles">
          <div className={styles.rightRailCard}>
            <h2 className={styles.rightRailTitle}>Suggested for you</h2>
            {authState.all_profileFetched && authState.all_users.length > 0 ? (
              <ul className={styles.profileList}>
                {authState.all_users.slice(0, 6).map((profile) => (
                  <li key={profile._id}>
                    <button
                      type="button"
                      className={styles.profileListItem}
                      onClick={() => router.push(`/view_profile/${profile.userId.username}`)}
                    >
                      <img
                        src={`${BASE_URL}/uploads/${profile.userId?.profilePicture || ''}`}
                        alt=""
                        className={styles.profileListAvatar}
                      />
                      <div className={styles.profileListInfo}>
                        <span className={styles.profileListName}>{profile.userId.name}</span>
                        <span className={styles.profileListUsername}>@{profile.userId.username}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyState}>No suggestions yet</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
