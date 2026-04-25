import UserLayout from '@/layout/UserLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './style.module.css' 
import { loginUser, registerUser } from '@/config/redux/action/authAction'
import { emptyMessage } from '@/config/redux/reducer/authReducer'

export default function LoginComponent() {


  const autState = useSelector((state)=> state.auth)

  const router = useRouter()

  const [loggedinMethod,setUserLoginMethod] = useState(false)

  const dispatch = useDispatch()

  const [username,setUsername] = useState("") 
  const [email,setEmail] = useState("") 
  const [password,setPassword] = useState("") 
  const [name,setName] = useState("")


  useEffect(()=>{
    if(autState.loggedIn){
      router.push("/dashboard")
    }
  },[autState.loggedIn])

  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push("/dashboard")
    }
  })

  useEffect(()=>{
    dispatch(emptyMessage())
  },[loggedinMethod])

  const handleRegister = () =>{
    console.log("regitry")
    dispatch(registerUser({      //this function is from /redux/action/authAction
            username, password, email, name
    }))
  }

  const handleLogin = ()=>{
    console.log("logging")
    dispatch(loginUser({ email,password }))
  }

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>

            <div className={styles.cardContainer_left}>

                <p className={styles.cardLeft_heading}>{loggedinMethod?"Sign in" : "Sign up"}</p>

                 <p style={{color:autState.isError ? "red" : "green", display:'flex',justifyContent:"center",marginBottom:"10px"}}>{autState.message}</p>     
                 
                 
                 {/* this handles all the login successful type of msges*/} 

                <div className={styles.inputContainers}>

                  {!loggedinMethod && <div className={styles.inputRow}>

                        <input onChange={(e)=>{setUsername(e.target.value)}} type='text' placeholder='Username' className={styles.inputField}></input>

                        <input onChange={(e)=>{setName(e.target.value)}} type='text' placeholder='Name' className={styles.inputField}></input>

                    </div>}
                    

                    <input onChange={(e)=>{setEmail(e.target.value)}} type='text' placeholder='Email' className={styles.inputField}></input>

                    <input onChange={(e)=>{setPassword(e.target.value)}} type='text' placeholder='Password' className={styles.inputField}></input>

                    <div onClick={()=>{ 
                      if(loggedinMethod){
                         handleLogin() 
                       }else{
                         handleRegister() 
                         } 
                        }
                         } 
                      className={styles.buttonOutline}>SignUp</div>
                </div>

            </div>

            <div className={styles.cardContainer_right}>

                <div> {loggedinMethod ? 
                  <p className={styles.rightside}>Already have an account in</p>
                :
                 <p className={styles.rightside}>Don't have an account</p>} 
                 <div onClick={()=>{ 
                  setUserLoginMethod(!loggedinMethod) 
                  }} 
                  className={styles.buttonOutlines}>{loggedinMethod ? "Sign up" : "Sign in"}</div> 
                  
                </div>

            </div>
        </div>
      </div>


    </UserLayout>
  )
}
