import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../AppSlicer/userslicer";

import {createStore} from 'redux'
import  storage  from "redux-persist/lib/storage";
import {persistStore,persistReducer} from 'redux-persist';
import { combineReducers } from "redux";

 
// Set up the configuration for redux-persist
const persistConfig = {
    key: 'root', // key for the storage
    storage, // storage engine
  };
  const rootReducer = combineReducers({
    user: UserReducer,  // State for user// State for task
  });
  // Create a persisted reducer
  const persistedReducer = persistReducer(persistConfig,rootReducer);
   
  // Create the Redux store
  const store = createStore(persistedReducer);
   
  // Create a persistor
  const persistor = persistStore(store);
  
 









const myStore = configureStore({
    reducer:{
        user:UserReducer,
        task:UserReducer
    },
    middleware:(getDefaultMiddleWare)=>
        getDefaultMiddleWare({
            serializableCheck:false
        })
})
// Define the RootState type based on the reducers
export type RootState = ReturnType<typeof myStore.getState>;
export { store, persistor };

export default myStore;

