

/*
    Steps for state Management
    1. Submit action
    2. Handle action in it's reducer
    3. Register here -> reducer
*/

const { configureStore } = require("@reduxjs/toolkit");
import authReducer from './reducer/authReducer'
import postReducer from './reducer/postReducer'

export const store = configureStore({
    reducer: {
        auth:authReducer,
        posts:postReducer
    }
})