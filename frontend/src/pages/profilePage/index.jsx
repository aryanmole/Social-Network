import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { BASE_URL, clientServer } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";

export default function ProfilePage() {

  const dispatch = useDispatch();
  const postReducer = useSelector((state)=> state.posts)

    const router = useRouter()

    const authState = useSelector((state)=>state.auth)

    const [userProfile,setUserProfile] = useState({})

    const [userPosts,setUserPosts] = useState([])

    const [IsModalOpen,setIsModalOpen] = useState(false)

    const [companyName,setComapnyName] = useState("")
    const [postion,setPostion] = useState("")
    const [years,setYears] = useState(0)

    const [IsEducation,setIsEducation] = useState(false)

    const[schoolName,setSchoolName] = useState("")
    const[degreeName,setDegreeName] = useState("")
    const[fieldName,setFieldName] = useState("")

  
  useEffect(() => {
    
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts())

  }, [dispatch]);

    useEffect(()=>{
        setUserProfile(authState.user)
    },[authState.user])

    useEffect(()=>{  
          if (!router.isReady) return
          let post = postReducer.posts.filter((post) =>{
              return post.userId?.username === authState.user?.userId?.username  //my current username is checked with post username and then posts are shown
          })
    
          setUserPosts(post)
        },[router.isReady, authState.user, postReducer.posts])

    const updateProfilePicture = async(file)=>{
        const formData = new FormData()
        formData.append("profile_picture",file)
        formData.append("token",localStorage.getItem("token"))

        const response = await clientServer.post("/update_profile_picture",formData,{
            headers:{
                'Content-Type' : 'multipart/form-data'
            },
        });

        dispatch(getAboutUser({token:localStorage.getItem("token")}))
    }


    const updateProfileData = async()=>{
      const request = await clientServer.post("/user_update",{
        token: localStorage.getItem("token"),
        name: userProfile.userId.name
      })

      const response = await clientServer.post("/update_profile_data",{
          token: localStorage.getItem("token"),
          bio: userProfile.bio,
          currentPost: userProfile.currentPost,
          pastWork: userProfile.pastWork,
          education: userProfile.education
      })

      dispatch(getAboutUser({token: localStorage.getItem("token")}))
    }

  return (
    <UserLayout>
      <DashboardLayout>

        {authState.user && userProfile.userId && <div className={styles.container}>

          <div className={styles.backDropContainer}>

          
                
                <label htmlFor="profilePictureUpload" className={styles.profileOverlay}>
    
    <img
        className={styles.profilePhoto}
        src={`${BASE_URL}/uploads/${userProfile.userId?.profilePicture}`}
        alt={userProfile.userId?.name}
    />

    <div className={styles.overlayText}>
        Edit
    </div>

</label>

      <input onChange={(e)=>[
          updateProfilePicture(e.target.files[0])
      ]} type="file" id="profilePictureUpload" className={styles.fileInput}/>
           
            
          </div>

          <div className={styles.profileContainer_details}>
            <div className={styles.profileLayout}>
              <div className={styles.profileMain}>
                <div className={styles.nameRow}>
                  <input className={styles.nameEdit} type="text" value={userProfile.userId?.name || ''} onChange={(e)=> setUserProfile({
                    ...userProfile,
                    userId: { ...userProfile.userId, name: e.target.value }
                  })} />
                  <div>
                    <span>@</span>
                    <input className={styles.usernameEdit} type="text" value={userProfile.userId?.username} readOnly />
                  </div>
                </div>

                <textarea className={styles.bioEdit}
                    value={userProfile.bio}
                    onChange={(e)=>{
                      setUserProfile({...userProfile,bio: e.target.value})
                    }}
                    rows={Math.max(3,Math.ceil((userProfile.bio?.length || 0) / 80))}
                    placeholder="Write a short bio about yourself..."
                />

                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>Work History</h4>
                  <div className={styles.workHistoryContainer}>
                    {userProfile.pastWork.map((work, index) => (
                      <div key={index} className={styles.workHistoryCard}>
                        <p>{work.company} — {work.position}</p>
                        <p>{work.years} {work.years === 1 ? 'year' : 'years'}</p>
                      </div>
                    ))}
                    <div className={styles.addWork}>
                      <button type="button" className={styles.addBtn} onClick={()=>{
                            setIsModalOpen(true)
                      }}>
                        + Add experience
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>Education</h4>
                  <div className={styles.workHistoryContainer}>
                    {userProfile.education?.map((edu, index) => (
                      <div key={index} className={styles.workHistoryCard}>
                        <p>{edu.school}</p>
                        <p>{edu.degree} in {edu.fieldOfStudy}</p>
                      </div>
                    ))}
                    <div className={styles.addWork}>
                      <button type="button" className={styles.addBtn} onClick={()=>{
                            setIsEducation(true)
                      }}>
                        + Add education
                      </button>
                    </div>
                  </div>
                </div>

                {userProfile != authState.user && 
                  <button type="button" onClick={()=>{
                    updateProfileData()
                  }} className={styles.connectBtn}>
                    Save changes
                  </button>}
              </div>

              <aside className={styles.profileSidebar}>
                <div className={styles.activityCard}>
                  <h2 className={styles.activityTitle}>Recent Activity</h2>
                  {userPosts.length === 0 && (
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>No posts yet</p>
                  )}
                  {userPosts.map((post) => (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media !== "" ? (
                            <img
                              src={`${BASE_URL}/uploads/${post.media}`}
                              alt=""
                            />
                          ) : (
                            <div style={{ width: "48px", height: "48px", background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }} />
                          )}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>

        </div>
        }

        
          {IsModalOpen && 
                    <div onClick={() => setIsModalOpen(false)} className={styles.commentContainer} role="dialog" aria-label="Add work experience">
            <div onClick={(e)=> e.stopPropagation()} className={styles.allCommentsContainer}>
            <h3 className={styles.modalTitle}>Add work experience</h3>
            <input onChange={(e)=>{setComapnyName(e.target.value)}} type='text' placeholder='Company name' className={styles.inputField} />
            <input onChange={(e)=>{setPostion(e.target.value)}} type='text' placeholder='Position / title' className={styles.inputField} />
            <input onChange={(e)=>{setYears(e.target.value)}} type='number' placeholder='Years of experience' className={styles.inputField} />
                <button type="button" onClick={()=>{
                  const newWork = { company: companyName, position: postion, years: years }
                    setUserProfile({...userProfile,pastWork:[...userProfile.pastWork,newWork]})
                    setIsModalOpen(false)
                  }} className={styles.connectBtn}>
                        Add experience
                    </button>
            </div>
          </div>
                }

            {IsEducation && 
                <div onClick={() => setIsEducation(false)} className={styles.commentContainer} role="dialog" aria-label="Add education">
            <div onClick={(e)=> e.stopPropagation()} className={styles.allCommentsContainer}>
            <h3 className={styles.modalTitle}>Add education</h3>
            <input onChange={(e)=>{setSchoolName(e.target.value)}} type='text' placeholder='School / university' className={styles.inputField} />
            <input onChange={(e)=>{setDegreeName(e.target.value)}} type='text' placeholder='Degree' className={styles.inputField} />
            <input onChange={(e)=>{setFieldName(e.target.value)}} type='text' placeholder='Field of study' className={styles.inputField} />
                <button type="button" onClick={()=>{
                  const newWork = { school: schoolName, degree: degreeName, fieldOfStudy: fieldName }
                    setUserProfile({...userProfile,education:[...userProfile.education,newWork]})
                    setIsEducation(false)
                  }} className={styles.connectBtn}>
                        Add education
                    </button>
            </div>
          </div>
          }

      </DashboardLayout>
    </UserLayout>
  );
}