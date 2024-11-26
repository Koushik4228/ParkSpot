import { createAsyncThunk } from "@reduxjs/toolkit";
import { addUser,login } from "../Service/user.service";


export const addUse = createAsyncThunk("user/addUse",async(user)=>{
    const response = await addUser(user);
    console.log(response.data);
    return response.data;
})

export const validate = createAsyncThunk(
    'user/validate',
    async ({ email, password }: { email: string; password: string }) => {
      const response = await login(email, password);
      return response.data;
    }
)
