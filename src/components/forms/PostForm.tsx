import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea.tsx";
import FileUploader from "@/components/shared/FileUploader.tsx";
import {PostValidation} from "@/lib/validation";
import {Models} from "appwrite";
import {useUserContext} from "@/context/AuthContext.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import {useNavigate} from "react-router-dom";
import {useCreatePost, useUpdatePost} from "@/lib/react-query/queriesAndMutatios.ts";
import {IUpdatePost} from "@/types";

export enum PostFormAction {
  CREATE = 'create',
  UPDATE = 'update'
}

type PostFormProps = {
  post?: Models.Document,
  action: PostFormAction
}
const PostForm = ({action, post}: PostFormProps) => {
  const {toast} = useToast()
  const navigate = useNavigate()
  const {mutateAsync: updatePost, isPending: isLodingUpdate} = useUpdatePost()
  const {mutateAsync: createPost, isPending: isLoadingCreate} = useCreatePost()
  const {user} = useUserContext()
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post?.caption || "",
      file: [],
      location: post?.location || "",
      tags: post?.tags?.join(', ') || "",
    },
  })

// 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {

    if (action === PostFormAction.UPDATE) {
      const variables = {
        ...values,
        postId: post?.$id,
      } as IUpdatePost
      const updatedPost = await updatePost(variables)
      if (!updatedPost) {
        toast({
          title: 'Post not updated',
          description: 'Please, try again later',
        })
        navigate('/posts/' + post?.$id)
        return
      }

      navigate('/')
      return;
    }

    const newPost = await createPost({
      ...values,
      userId: user.id,
    })

    if (!newPost) {
      toast({
        title: 'Post not created',
        description: 'Please, try again later',
      })
      return
    }
    navigate('/')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({field}) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter caption" className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({field}) => (
            <FormItem>
              <FormLabel className="shad-form_label">File</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  imageUrl={post?.imageUrl}

                />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({field}) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({field}) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add tags (separated by comma ", ")</FormLabel>
              <FormControl>
                <Input placeholder="JS, React, Next" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <div className="flex justify-end items-center gap-2">
          <Button type="button"
                  onClick={() => navigate(-1)}
                  className="shad-button_dark_4 rounded-xl">Cancel</Button>
          <Button
            type="submit"
            disabled={isLodingUpdate || isLoadingCreate}
            className="shad-button_primary h-10 rounded-xl whitespace-nowrap">{action === PostFormAction.UPDATE ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;