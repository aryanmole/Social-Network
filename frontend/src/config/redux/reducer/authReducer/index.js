import { createSlice } from "@reduxjs/toolkit"
import { getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionRequest, loginUser, registerUser } from "../../action/authAction"

const initialState = {  // don't worry about initial state as u will develop this skill with time
    user: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",   // always string
    profileFetched: false,
    isTokenThere:false,
    connections: [],
    connectionRequest: [],
    all_users: [],
    all_profileFetched:false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        emptyMessage: (state) => {
            state.message = ""
        },
        setTokenisThere: (state) =>{
            state.isTokenThere  = true
        },
        setTokenisNotThere: (state) =>{
            state.isTokenThere = false
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true
            state.message = "Knocking the door..."
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = true
            state.loggedIn = true
            state.message = "Login Successful"
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload || "Login Failed"
        })
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true
            state.message = "Registering..."
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = true
            state.message = "Registration Successful. Please login."
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload || "Registration Failed"  // tells the error
        })
        .addCase(getAboutUser.fulfilled,(state,action)=>{
             state.isLoading = false
             state.isError = false
             state.profileFetched = true
             state.user = action.payload.userProfile
        })
        .addCase(getAllUsers.fulfilled,(state,action)=>{
             state.isLoading = false
             state.isError = false
             state.all_profileFetched = true
             state.all_users = action.payload.profile
        })
        .addCase(getAllUsers.rejected,(state,action)=>{
            state.isLoading = false
            state.isError = true
        })
        .addCase(getConnectionsRequest.fulfilled,(state,action) =>{
            state.connections = action.payload
        })
        .addCase(getConnectionsRequest.rejected,(state,action) =>{
            state.message = action.payload
        })
        .addCase(getMyConnectionRequest.fulfilled,(state,action)=>{
            state.connectionRequest = action.payload
        })
        .addCase(getMyConnectionRequest.rejected,(state,action) =>{
            state.message = action.payload
        })
    }
})

export const { reset, emptyMessage, setTokenisNotThere, setTokenisThere } = authSlice.actions
export default authSlice.reducer