import UserLayout from '@/layout/UserLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './style.module.css'
import { loginUser, registerUser } from '@/config/redux/action/authAction'
import { emptyMessage } from '@/config/redux/reducer/authReducer'

export default function LoginComponent() {
  const autState = useSelector((state) => state.auth)
  const router = useRouter()
  const [loggedinMethod, setUserLoginMethod] = useState(false)
  const dispatch = useDispatch()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  useEffect(() => {
    if (autState.loggedIn) {
      router.push("/dashboard")
    }
  }, [autState.loggedIn])

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard")
    }
  })

  useEffect(() => {
    dispatch(emptyMessage())
  }, [loggedinMethod])

  const handleRegister = () => {
    dispatch(registerUser({ username, password, email, name }))
  }

  const handleLogin = () => {
    dispatch(loginUser({ email, password }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (loggedinMethod) {
      handleLogin()
    } else {
      handleRegister()
    }
  }

  return (
    <UserLayout>
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.cardForm}>
            <div className={styles.formHeader}>
              <h1 className={styles.title}>
                {loggedinMethod ? "Welcome back" : "Create your account"}
              </h1>
              <p className={styles.subtitle}>
                {loggedinMethod
                  ? "Sign in to continue to ProConnect"
                  : "Join thousands of professionals on ProConnect"}
              </p>
            </div>

            {autState.message && (
              <div className={`${styles.alert} ${autState.isError ? styles.alertError : styles.alertSuccess}`}>
                {autState.message}
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
              {!loggedinMethod && (
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="username" className={styles.label}>Username</label>
                    <input
                      id="username"
                      onChange={(e) => setUsername(e.target.value)}
                      type="text"
                      placeholder="johndoe"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.label}>Full name</label>
                    <input
                      id="name"
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      placeholder="John Doe"
                      className={styles.input}
                    />
                  </div>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@company.com"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                {loggedinMethod ? "Sign in" : "Create account"}
              </button>
            </form>

            <div className={styles.toggleSection}>
              <p className={styles.toggleText}>
                {loggedinMethod
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setUserLoginMethod(!loggedinMethod)}
              >
                {loggedinMethod ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>

          <div className={styles.cardAside}>
            <div className={styles.asideContent}>
              <div className={styles.asideIcon}>P</div>
              <h2 className={styles.asideTitle}>ProConnect</h2>
              <p className={styles.asideText}>
                Where professionals connect, share insights, and grow their careers together.
              </p>
              <ul className={styles.featureList}>
                <li>Build your professional network</li>
                <li>Share updates with your connections</li>
                <li>Discover opportunities in your field</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
