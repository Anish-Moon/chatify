import {create} from 'zustand'


export const useAuthStore = create((set) => ({
    authUser:{name :"john", _id:123, age:23},
    isLoggedIn: false,

    login : ()=>{
        console.log("login");
        set({isLoggedIn:true})
    }
}))