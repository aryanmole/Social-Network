import { BASE_URL, clientServer } from '@/config'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts } from '@/config/redux/action/postAction'
import { getConnectionsRequest, getMyConnectionRequest, sendConnectionRequest } from '@/config/redux/action/authAction'

//this is server side rendering

export default function ViewProfilePage({userProfile}) {

    const searchParams = useSearchParams()

    const router = useRouter()
    const postReducer = useSelector((state)=> state.posts)  //this is from store.js
    const dispatch = useDispatch()

    const authState = useSelector((state)=> state.auth)  //this is from store.js

    const [userPosts,setUserPosts] = useState([])
    const [isCurrentUserInConnection,setisCurrentUserInConnection] = useState(false)

    const[isConnectionNull,setIsConnectionNull] = useState(true)

    const getUserPostAndConnections = async()=>{
      await dispatch(getAllPosts())
      await dispatch(getConnectionsRequest({token: localStorage.getItem("token")}))
      await dispatch(getMyConnectionRequest({token: localStorage.getItem("token")}))
    }

    // Ensure posts (and connections) are loaded when viewing a profile
    useEffect(() => {
      if (!router.isReady) return
      getUserPostAndConnections()
    }, [router.isReady, router.query.username])

    useEffect(()=>{  
      if (!router.isReady) return
      let post = postReducer.posts.filter((post) =>{
          return post.userId.username === router.query.username  //name in url is checked with post name and then posts are shown
      })

      setUserPosts(post)
    },[router.isReady, router.query.username, postReducer.posts]) 
    // 1.Router becomes ready
    //2. Username in URL changes
    //3.Posts in Redux store change


   useEffect(()=>{  

    console.log(authState.connections,userProfile.userId._id)

    const connection = authState.connections.find(
        user => String(user.connectionId) === String(userProfile.userId._id)
    )

    if(connection){
        setisCurrentUserInConnection(true)

        if(connection.status_accepted === true){
            setIsConnectionNull(false)
        }
    }

    if(authState.connectionRequest.some(user=> user.userId._id === userProfile.userId._id)){
      setisCurrentUserInConnection(true)
      if(authState.connectionRequest.find(user => user.userId._id === userProfile.userId._id)){
          setIsConnectionNull(false)
      }
    }

},[authState.connections, userProfile.userId._id, authState.connectionRequest])

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
              <img className={styles.profilePhoto} src={`${BASE_URL}/uploads/${userProfile.userId?.profilePicture}`}  alt={userProfile.userId?.name}></img>
          </div>
            
          <div className={styles.profileContainer_details}>
                <div className={styles.profileLayout}>
                    <div className={styles.profileMain}>
                          <div className={styles.nameRow}>
                              <h2 className={styles.profileName}>{userProfile.userId?.name}</h2>
                              <p className={styles.profileUsername}>@{userProfile.userId?.username}</p>
                          </div>

                        <div className={styles.actionRow}>
                          {isCurrentUserInConnection ? 
                              <button type="button" className={styles.connectedBtn}>{isConnectionNull ? "Pending" : "Connected"}</button> 
                            :
                              <button
                                type="button"
                                onClick={async () => {
                                  const result = await dispatch(
                                    sendConnectionRequest({
                                      token: localStorage.getItem("token"),
                                      connectionId: userProfile.userId?._id,
                                    })
                                  )
                                  const msg = result.payload?.message || ""
                                  if (
                                    result.meta?.requestStatus === "fulfilled" ||
                                    msg.toLowerCase().includes("req already sent")
                                  ) {
                                    setisCurrentUserInConnection(true)
                                    await dispatch(
                                      getConnectionsRequest({
                                        token: localStorage.getItem("token"),
                                      })
                                    )
                                  }
                                }}
                                className={styles.connectBtn}
                              >
                                Connect
                              </button>  
                        }
                          <button type="button" onClick={async()=>{
                            const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`)
                            window.open(`${BASE_URL}/uploads/${response.data.message}`,"_blank")
                          }} className={styles.downloadBtn} aria-label="Download resume">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                          </svg>
                        </button>
                    </div>

                        <p className={styles.bio}>{userProfile.bio || 'No bio yet.'}</p>

                        <div className={styles.section}>
                              <h4 className={styles.sectionTitle}>Work History</h4>
                          <div className={styles.workHistoryContainer}>
                                {userProfile.pastWork.map((work,index)=>{
                                  return(
                                    <div key={index} className={styles.workHistoryCard}>
                                      <p>{work.company} — {work.position}</p>
                                      <p>{work.years} {work.years === 1 ? 'year' : 'years'}</p>
                                    </div>
                                  )
                                })}
                          </div>
                      </div>

                      <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Education</h4>
                        <div className={styles.workHistoryContainer}>
                          {userProfile.education?.map((edu,index)=>{
                            return(
                              <div key={index} className={styles.workHistoryCard}>
                                <p>{edu.school}</p>
                                <p>{edu.degree} in {edu.fieldOfStudy}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <aside className={styles.profileSidebar}>
                        <div className={styles.activityCard}>
                          <h2 className={styles.activityTitle}>Recent Activity</h2>
                          {userPosts.length === 0 && (
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>No posts yet</p>
                          )}
                          { userPosts.map((post)=>{
                                return(
                                  <div key={post._id} className={styles.postCard}>
                                        <div className={styles.card}>
                                            <div className={styles.card_profileContainer}>
                                                {post.media !== "" ? <img src={`${BASE_URL}/uploads/${post.media}`} alt=""/>
                                                  :
                                                  <div style={{width:'48px',height:'48px',background:'var(--color-bg-subtle)',borderRadius:'var(--radius-md)'}} />
                                                }
                                            </div>
                                            <p>{post.body}</p>
                                        </div>
                                  </div>
                                )
                          })}
                        </div>
                    </aside>
                </div>
          </div>

          

        </div>
      </DashboardLayout>
    </UserLayout>
  )
}


export async function getServerSideProps(context) {
  
  console.log(context.query.username)

  const request = await clientServer.get("/user/get_profile_based_on_username",{
    params:{
      username: context.query.username
    }
  })
  
  const response = await request.data
  console.log(response)

  return {props : {userProfile: request.data.profile}}
}