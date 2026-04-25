import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { AcceptConnectionRequest, getConnectionsRequest, getMyConnectionRequest } from '@/config/redux/action/authAction'
import { BASE_URL } from '@/config'
import styles from './index.module.css'
import { useRouter } from 'next/router'

export default function MyConnectionsPage() {

  const dispatch= useDispatch()

  const authState = useSelector((state)=>state.auth)

  const router = useRouter()

  const pendingRequests = (authState.connectionRequest || []).filter(
    (connection) => connection.status_accepted === null || connection.status_accepted === false
  )

  // Accepted where I am the receiver (connectionId === me)
  const incomingAccepted = (authState.connectionRequest || []).filter(
    (connection) => connection.status_accepted === true
  )

  // Accepted where I am the sender (userId === me)
  const outgoingAccepted = (authState.connections || []).filter(
    (connection) => connection.status_accepted === true
  )

  // Normalize to always have otherUser populated for UI
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

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (!token) return
    dispatch(getMyConnectionRequest({token}))
    dispatch(getConnectionsRequest({token}))
  },[dispatch])

  useEffect(()=>{
    if(authState.connectionRequest.length !==0 ){
      console.log(authState.connectionRequest)
    }
  },[authState.connectionRequest])

  return (
    <UserLayout>
    
          <DashboardLayout>
            <div style={{display:'flex',flexDirection:'column',gap:'0.6rem'}}>
            <h1 className={styles.title}>
              My Connections</h1>

              {pendingRequests.length === 0 && (
                <div style={{textAlign:'center',marginTop:'1rem',color:'#666'}}>
                  <h3>No pending requests</h3>
                </div>
              )}

              {pendingRequests.map((user,index)=>{
                return(
                  <div onClick={()=>{
                      router.push(`/view_profile/${user.userId.username}`)
                  }} 
                  
                  className={styles.userCard} key={user._id || index}>
                      <div  style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                          <img style={{width:'6.6rem',borderRadius:'50%'}} src={`${BASE_URL}/uploads/${user.userId.profilePicture}`} alt="" />
                      </div>
                      <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>@{user.userId.username}</p>
                      </div>
                      <button onClick={(e)=>{
                        e.stopPropagation()

                        dispatch(AcceptConnectionRequest({
                          token:localStorage.getItem('token'),
                          connectionId:user._id,
                          action:"accept"
                        }))
                      }}
                       className={styles.connectedBtn}>Accept</button> 
                  </div>
                )
              })}

            <h2 style={{marginTop:'1.5rem'}}>My Network</h2>
            {acceptedConnections.length === 0 && (
              <div style={{textAlign:'center',marginTop:'1rem',color:'#666'}}>
                <h3>No connections yet</h3>
              </div>
            )}
            {acceptedConnections.map((conn,index)=>{
              const otherUser = conn.otherUser
              if (!otherUser) return null
              return(
                <div onClick={()=>{
                    router.push(`/view_profile/${otherUser.username}`)
                }} 
                
                className={styles.userCard} key={conn._id || index}>
                    <div  style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <img style={{width:'6.6rem',borderRadius:'50%'}} src={`${BASE_URL}/uploads/${otherUser.profilePicture || 'default.jpg'}`} alt="" />
                    </div>
                    <div className={styles.userInfo}>
                        <h3>{otherUser.name}</h3>
                        <p>@{otherUser.username}</p>
                    </div>
                    <span className={styles.connectedLabel}>Connected</span>
                </div>
              )
            })}

            </div>
          </DashboardLayout>
    
        </UserLayout>
  )
}
