import { createSlice }  from "@reduxjs/toolkit"
import { createPost, getAllComments, getAllPosts } from "../../action/postAction"

//action.payload is used when api call is fulfilled and as it is getting dispatched it should get dispatched something

const initialState = {  // don't worry about initial state as u will develop this skill with time
    posts: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    loggedIn: false,
    message: "",   // always string
    comments: [],
    postId:""
}


const postSlice = createSlice({
    name:"post",
    initialState,
    reducers:{
        reset: () => initialState,
        resetPostId: (state) =>{
            state.postId = ""
        },
        setPostId: (state, action) => {
            state.postId = action.payload
        }
    },
    extraReducers: (builder) =>{
        builder
                .addCase(getAllPosts.pending,(state) =>{
                    state.isLoading = true
                    state.isError = false
                    state.message = "Fetching all posts..."
                })
                .addCase(getAllPosts.fulfilled,(state,action)=>{
                    state.message = "All posts visible"
                    state.isLoading = false
                    state.postFetched = true
                    state.posts = action.payload.post.reverse()  //It stores the API response data into Redux state so the UI can use it.
                })
                .addCase(getAllPosts.rejected,(state,action)=>{
                    state.isError = true
                    state.message = action.payload // tells the error
                    state.isLoading = false
                })
                .addCase(createPost.pending,(state) =>{
                    state.isLoading = true
                    state.isError = false
                    state.message = "Uploading post..."
                })
                .addCase(createPost.fulfilled,(state,action)=>{
                    state.isLoading = false
                    state.isError = false
                    state.message = action.payload || "Post uploaded"
                })
                .addCase(createPost.rejected,(state,action)=>{
                    state.isLoading = false
                    state.isError = true
                    state.message = action.payload?.message || action.payload || "Post upload failed"
                })
                .addCase(getAllComments.fulfilled,(state,action)=>{
                    state.postId = action.payload.post_id
                    state.comments = action.payload.comments
                })
    }
})


export const { reset, resetPostId, setPostId } = postSlice.actions

export default postSlice.reducer