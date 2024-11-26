import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { addUse, validate } from "./userthunk"
import { UserRole } from "../Service/Role";

interface UserState {
    isLogIn: boolean;
    isRegister: boolean;
    regisstatus: string;
    loginStatus: string;
    userId: number | null;
    role:UserRole|null;
}
const initialState :UserState = {
    isLogIn : false,
    isRegister:false,
    regisstatus : '',
    loginStatus : '',
    userId:null,
    role:null
}

const userSlicer = createSlice({
    name : 'user',
    initialState,
    reducers:{
        logout :(state) =>{
            state.isLogIn = false;
            state.userId=null;
            state.role=null;
        },
        loginn:(state,action:PayloadAction<number>) =>{
            state.isLogIn=true,
            state.userId = action.payload;
        },
        register : (state) =>{
            state.isRegister = true
        },
        setRole:(state,action:PayloadAction<UserRole>)=>{
            state.role=action.payload
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(addUse.fulfilled,(state)=>{
            console.log("Fulfilled");
            state.isRegister = true
        })
        .addCase(addUse.pending,(state)=>{
            console.log("Pending");
            state.regisstatus = "pending"
        })
        .addCase(addUse.rejected,(state)=>{
            console.log("rejected");
            state.regisstatus = "rejected"
        })
        .addCase(validate.fulfilled,(state)=>{
            console.log("Full");
            state.isLogIn=true
        })
        .addCase(validate.pending,(state)=>{
            state.loginStatus = "Pending"
        })
        .addCase(validate.rejected,(state)=>{
            state.loginStatus = "rejected"
        })
    }
})

export const {logout,loginn,setRole} = userSlicer.actions;
export default userSlicer.reducer
