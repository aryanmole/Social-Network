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

            <div style={{ display: "flex", gap: "1.2rem" }}>

              <div style={{ flex: "0.8" }}>

                <div style={{ display: "flex", width: "fit-content", gap: "1.2rem", alignItems: "center" }}>
                  <input className={styles.nameEdit} type="text" value={userProfile.userId?.name || ''} onChange={(e)=> setUserProfile({
                    ...userProfile,
                    userId: { ...userProfile.userId, name: e.target.value }
                  })} />

                  <div>
                  <span>@</span>
                 <input className={styles.usernameEdit} style={{ color: "gray" }} type="text" value = {userProfile.userId?.username} onChange={(e)=>{
                    setUserProfile({
                      ...userProfile,
                      userId: {...userProfile.userId, username: e.target.value}
                    })
                  }}/>
                  </div>
                  
                </div>

                

                
                  <div>
                    <textarea className={styles.bioEdit}
                        value={userProfile.bio}
                        onChange={(e)=>{
                          setUserProfile({...userProfile,bio: e.target.value})
                        }}
                        rows={Math.max(3,Math.ceil(userProfile.bio.length / 80))}
                        style={{width:'100%'}}
                    >
                      
                    </textarea>
                  </div>

                <div className={styles.workHistory}>
                  <h4>Work History</h4>

                  <div className={styles.workHistoryContainer}>
                    {userProfile.pastWork.map((work, index) => (
                      <div key={index} className={styles.workHistoryCard}>
                        <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                          {work.company} - {work.position}
                        </p>
                        <p>{work.years}</p>
                      </div>
                    ))}


                    <div className={styles.addWork}>
                    <button className={styles.addBtn} onClick={()=>{
                          setIsModalOpen(true)
                    }}>
                      Add Work
                    </button>
                  </div>

                  

                </div>

                  </div>

                 <div className={styles.workHistory}>
                  <h4>Education History</h4>

                  <div className={styles.workHistoryContainer}>
                    {userProfile.education?.map((edu, index) => (
                      <div key={index} className={styles.workHistoryCard}>
                        <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                          School: {edu.school}
                        </p>
                        <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                          Degree: {edu.degree}
                        </p>
                        <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                          Field: {edu.fieldOfStudy}</p>
                      </div>
                    ))}


                    <div className={styles.addWork}>
                    <button className={styles.addBtn} onClick={()=>{
                          setIsEducation(true)
                    }}>
                      Add Education
                    </button>
                  </div>

                  

                </div>

                  {userProfile != authState.user && 
                  
                  <div onClick={()=>{
                    updateProfileData()
                  }} className={styles.connectBtn}>
                        Update 
                    </div>}

                  </div>

              </div>

              <div style={{ flex: "0.2", width: "fit-content", padding: "0.8rem" }}>
                <h2>Recent Activity</h2>

                {userPosts.map((post) => (
                  <div key={post._id} className={styles.postCard}>

                    <div className={styles.card}>

                      <div className={styles.card_profileContainer}>

                        {post.media !== "" ? (
                          <img
                            src={`${BASE_URL}/uploads/${post.media}`}
                            alt={userProfile.userId?.name}
                          />
                        ) : (
                          <div style={{ width: "3.4rem", height: "3.4rem" }}></div>
                        )}

                      </div>

                      <p>{post.body}</p>

                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>
        }

        
          {IsModalOpen && 
                    <div  onClick={() => {   // this is from posAction when we click outside the box it will automatically become normal
                          setIsModalOpen(false)
                     }}
          
                    className={styles.commentContainer}>
            
            <div onClick={(e)=>{
                e.stopPropagation() //when we click on white box it should not go back to normal
              }}
            className={styles.allCommentsContainer}>

            <input onChange={(e)=>{setComapnyName(e.target.value)}} type='text' placeholder='Enter Company' className={styles.inputField}></input>

            <input onChange={(e)=>{setPostion(e.target.value)}} type='text' placeholder='Enter Position' className={styles.inputField}></input>
          

            <input onChange={(e)=>{setYears(e.target.value)}} type='number' placeholder='Years' className={styles.inputField}></input>
                <div onClick={()=>{
                  const newWork = { company: companyName, position: postion, years: years }

                    setUserProfile({...userProfile,pastWork:[...userProfile.pastWork,newWork]})
                    setIsModalOpen(false)
                  }} className={styles.connectBtn}>
                        Add Work 
                    </div>
            </div>
          </div>
                }

            {IsEducation && 
                <div  onClick={() => {   // this is from posAction when we click outside the box it will automatically become normal
                          setIsEducation(false)
                     }}
          
                    className={styles.commentContainer}>
            
            <div onClick={(e)=>{
                e.stopPropagation() //when we click on white box it should not go back to normal
              }}
            className={styles.allCommentsContainer}>

            <input onChange={(e)=>{setSchoolName(e.target.value)}} type='text' placeholder='Enter School' className={styles.inputField}></input>

            <input onChange={(e)=>{setDegreeName(e.target.value)}} type='text' placeholder='Enter Degree' className={styles.inputField}></input>
          

            <input onChange={(e)=>{setFieldName(e.target.value)}} type='text' placeholder='Enter Field' className={styles.inputField}></input>
                <div onClick={()=>{
                  const newWork = { school: schoolName, degree: degreeName, fieldOfStudy: fieldName }

                    setUserProfile({...userProfile,education:[...userProfile.education,newWork]})
                    setIsEducation(false)
                  }} className={styles.connectBtn}>
                        Add Education 
                    </div>
            </div>
          </div>
          }

      </DashboardLayout>
    </UserLayout>
  );
}