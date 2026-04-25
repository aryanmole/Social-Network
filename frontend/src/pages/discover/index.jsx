import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '@/config/redux/action/authAction'
import { BASE_URL } from '@/config'
import styles from './index.module.css'
import { useRouter } from 'next/router'

//here i have done server side rendering on line 36

export default function DiscoverPage() {

  const authState = useSelector((state)=>state.auth)
  const router = useRouter()

  const dispatch =useDispatch()

  useEffect(()=>{
    if(!authState.all_profileFetched){
        dispatch(getAllUsers())
    }
  },[])

  return (
    <UserLayout>
        
        <DashboardLayout>
            <h1>
                DiscoverPage
            </h1>
            <div className={styles.allUserProfile}>
            {authState.all_profileFetched && authState.all_users.map((user)=>{  {/*all_users is coming from authreducer on 17 line*/}
              return(
                  <div onClick={()=>{
                    router.push(`/view_profile/${user.userId.username}`)
                  }} key={user._id} className={styles.userProfile}>
                        <img src={`${BASE_URL}/uploads/${user.userId?.profilePicture || ''}`} alt={user.userId?.name} />  
                      <h1>{user.userId.name}</h1>
                      <p>{user.userId.username}</p>
                  </div>
              )
            })}
            </div>
        </DashboardLayout>
        
    </UserLayout>
  )
}
