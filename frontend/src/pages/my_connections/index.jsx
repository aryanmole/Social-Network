import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { AcceptConnectionRequest, getConnectionsRequest, getMyConnectionRequest } from '@/config/redux/action/authAction'
import { BASE_URL } from '@/config'
import styles from './index.module.css'
import { useRouter } from 'next/router'

export default function MyConnectionsPage() {
  const dispatch = useDispatch()
  const authState = useSelector((state) => state.auth)
  const router = useRouter()

  const pendingRequests = (authState.connectionRequest || []).filter(
    (connection) => connection.status_accepted === null || connection.status_accepted === false
  )

  const incomingAccepted = (authState.connectionRequest || []).filter(
    (connection) => connection.status_accepted === true
  )

  const outgoingAccepted = (authState.connections || []).filter(
    (connection) => connection.status_accepted === true
  )

  const acceptedConnections = [
    ...incomingAccepted.map((conn) => ({
      ...conn,
      otherUser: conn.userId
    })),
    ...outgoingAccepted.map((conn) => ({
      ...conn,
      otherUser: conn.connectionId
    }))
  ]
    .filter((conn) => conn.otherUser && typeof conn.otherUser === 'object' && (conn.otherUser.name || conn.otherUser.username))
    .filter((conn, index, self) =>
      index === self.findIndex((c) => String(c._id) === String(conn._id))
    )

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    dispatch(getMyConnectionRequest({ token }))
    dispatch(getConnectionsRequest({ token }))
  }, [dispatch])

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.page}>
          <div className={styles.pageHeader}>
            <h1 className={styles.title}>My Network</h1>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pending invitations</h2>
            {pendingRequests.length === 0 ? (
              <div className={styles.emptyState}>No pending requests</div>
            ) : (
              pendingRequests.map((user, index) => (
                <div
                  onClick={() => router.push(`/view_profile/${user.userId.username}`)}
                  className={styles.userCard}
                  key={user._id || index}
                >
                  <img
                    className={styles.profileImage}
                    src={`${BASE_URL}/uploads/${user.userId.profilePicture}`}
                    alt={user.userId.name}
                  />
                  <div className={styles.userInfo}>
                    <h3>{user.userId.name}</h3>
                    <p>@{user.userId.username}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch(AcceptConnectionRequest({
                        token: localStorage.getItem('token'),
                        connectionId: user._id,
                        action: "accept"
                      }))
                    }}
                    className={styles.connectedBtn}
                  >
                    Accept
                  </button>
                </div>
              ))
            )}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Your connections</h2>
            {acceptedConnections.length === 0 ? (
              <div className={styles.emptyState}>No connections yet. Start by discovering people!</div>
            ) : (
              acceptedConnections.map((conn, index) => {
                const otherUser = conn.otherUser
                if (!otherUser) return null
                return (
                  <div
                    onClick={() => router.push(`/view_profile/${otherUser.username}`)}
                    className={styles.userCard}
                    key={conn._id || index}
                  >
                    <img
                      className={styles.profileImage}
                      src={`${BASE_URL}/uploads/${otherUser.profilePicture || 'default.jpg'}`}
                      alt={otherUser.name}
                    />
                    <div className={styles.userInfo}>
                      <h3>{otherUser.name}</h3>
                      <p>@{otherUser.username}</p>
                    </div>
                    <span className={styles.connectedLabel}>Connected</span>
                  </div>
                )
              })
            )}
          </section>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}
