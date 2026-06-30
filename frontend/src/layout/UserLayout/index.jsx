import Navbar from '@/Components/Navbar'
import React from 'react'
import styles from './index.module.css'

export default function UserLayout({ children }) {
  return (
    <div className={styles.appShell}>
      <Navbar />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
