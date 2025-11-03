import React from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '../../appwrite/auth'
import service, { Service } from '../../appwrite/service'
import { useCallback } from 'react'
import { useEffect } from 'react'
import Input from '../Input'
import RTE from '../RTE'
import Select from '../Select'
import Button from '../Button'

function PostForm({post}) {
    const {register,control,handleSubmit,watch,setValue,getValues}=useForm({
defaultValues:{
    title:post?.title || "",
    slug: post ?.slug || "",
    content: post?.content || "",
    status:post?.status || 'active'
}
})
const Navigate=useNavigate()
const userData=useSelector(state=>state.auth.userData)
 
const submit= async(data)=>{

    if (post) {
        const file=data.image[0]? await service.uploadFile(data.image[0]) : null 
        if (file) {
            service.deleteFile(post.featuredImage)
           
        }
        const dbPost=await service.updatePost(post.$id,{...data,featuredImage:file? file.$id : undefined})

        if(dbPost){
         Navigate(`/post/${dbPost.$id}`)
        }
        

    }


    else{

        const file =await service.uploadFile(data.image[0])
    if(file){
        const fileid=file.$id
        data.featuredImage=fileid
        const dbPost= await service.createPost({  ...data, userId:userData?.$id  })
        if(dbPost){
            Navigate(`/post/${dbPost.$id}`)
        }
    }


    }
}

const slugtransform=useCallback((value)=>{
if (value && typeof value=== 'string') {
    return value
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z\d\s]+/g, "-")
    .replace(/\s/g, "-")
    
}
return "";


},[])

useEffect(()=>{
const subscription=watch((value,{name})=>{
    if (name==="title") {
            setValue("slug",slugtransform(value.title),
            {shouldValidate:true})  
    }
})

return ()=>{
    subscription.unsubscribe()
}
},[watch,slugtransform,setValue])

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugtransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={service.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );

  
}

export default PostForm
