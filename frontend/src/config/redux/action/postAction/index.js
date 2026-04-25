import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const getAllPosts = createAsyncThunk(
    "/post/getAllPost",
    async( _, thunkAPI)=>{
        try{
            
            const response = await clientServer.get("/all_posts")  // this is from backend routes section

            return thunkAPI.fulfillWithValue(response.data)

        }catch(err){
            return  thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const createPost = createAsyncThunk(  //this is imp
    "/post/createPost",                            
    async(userData,thunkAPI) => {

        const{file,body} = userData //takes file and text from user
        try{
            
            const formData = new FormData()
            formData.append('token',localStorage.getItem('token'))
            formData.append('body',body)
            formData.append('media',file)

            const response = await clientServer.post("/posts", formData, {
                headers: {                                                     //this is multer part
                    'Content-Type':'multipart/form-data'
                }
            })

            if(response.status === 200){
                return thunkAPI.fulfillWithValue('Post uploaded')
            }else{
                return thunkAPI.rejectWithValue('Post not uploaded')
            }

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)


export const deletePost = createAsyncThunk(
    "post/deletePost",
    async(post_id,thunkAPI) =>{
        try{
            const response = await clientServer.delete("/deleted_post",{
                data:{
                    token: localStorage.getItem("token"),
                    post_id:post_id.post_id
                }
            })

             return thunkAPI.fulfillWithValue(response.data)
            
        }catch(err){
             return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const incrementLike = createAsyncThunk(
      "post/like",
            async(post,thunkAPI) => {
                try{
                    const response = await clientServer.post("/increment_post_likes",{
                        post_id:post.post_id
                })

                             return thunkAPI.fulfillWithValue(response.data)


                }catch(err){
                    return thunkAPI.rejectWithValue(err.response.data)
                }
            }
)
 

export const getAllComments = createAsyncThunk(
    "post/comment",
        async(postData,thunkAPI) => {
            try{
                const response = await clientServer.get("/get_comments",{
                    params: {
                     post_id: postData.post_id

                    }
                }
                )

                return thunkAPI.fulfillWithValue({
                    comments:response.data,
                     post_id: postData.post_id
                })

            }catch(err){
                return thunkAPI.rejectWithValue(err.response.data)   
            }
        }
)

export const postComment = createAsyncThunk(
    "post/postComment",
    async(commentData,thunkAPI)=>{
        try{
            const response = await clientServer.post("/comment",{
                token:localStorage.getItem("token"),
                post_id:commentData.post_id,
                comm : commentData.body // comm is beacuse in posts.controller i have initialised body with comm
            })

            return thunkAPI.fulfillWithValue(response.data)

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)