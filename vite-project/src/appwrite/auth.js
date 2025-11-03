import config from "../config/config.js";

import { Client, Account, ID } from "appwrite";

export class AuthService{
    client = new Client()
    account;


    constructor(){
        this.client 
         .setEndpoint(config.url) // Your API Endpoint
        .setProject(config.projectId);  
        this.account=new Account(this.client)
    }


    async createAccount({ email, password, username }) {
    try {
        const useraccount = await this.account.create({
            userId: ID.unique(),
            email: email,
            password: password,
            name: username // optional
        });

        if (useraccount) {
            // If account created successfully, log the user in
            return await this.login({ email, password });
        } else {
            return useraccount;
        }
    } catch (error) {
        throw error;
    }
}


    async login({email,password}){
        try {
          return  await this.account.createEmailPasswordSession({email,password})
        } catch (error) {
            throw error;
        }
    }


    async getcurrentuser(){
       try {
         return await this.account.get();
       } catch (error) {
        
       }
       return null;
    }

    async logout(){
        try {
          return  await this.account.deleteSessions()
        } catch (error) {
            throw error;
            
        }
    }
}

const authservice=new AuthService()
export default authservice;