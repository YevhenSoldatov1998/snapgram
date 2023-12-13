import {INewPost, INewUser, IUpdatePost, Post, User} from "@/types";
import {ID, Models, Query} from 'appwrite'
import {account, appwriteConfig, avatars, database, storage} from "@/lib/appwrite/config.ts";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
    )

    if (!newAccount) throw Error('Account not created')
    const avatarUrl = avatars.getInitials(user.name)
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      username: user.username,
      imageUrl: avatarUrl,
    })
    return newUser
  } catch (e) {
    console.log(e)
    return e
  }
}

export async function saveUserToDB(user: {
  accountId: string,
  email: string,
  name: string,
  username?: string,
  imageUrl: URL,
}) {
  try {
    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    )
    return newUser
  } catch (e) {
    console.log(e)
  }
}

export async function sinInAccount(user: {
  email: string,
  password: string
}) {
  try {
    const session = await account.createEmailSession(user.email, user.password)

    return session
  } catch (e) {
    console.log(e)
  }
}

export async function signOutAccount() {
  try {
    await account.deleteSession('current')
  } catch (e) {
    console.log(e)
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get()

    if (!currentAccount) throw Error

    const currentUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal('accountId', currentAccount.$id)
      ]
    )
    if (!currentUser) throw Error('User not found')

    return currentUser.documents[0] as User
  } catch (e) {
    console.log(e)
  }
}

async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)
    return {status: 'ok'}
  } catch (e) {
    console.log(e)
  }
}

async function uploadFile(file: File) {
  return await storage.createFile(
    appwriteConfig.storageId,
    ID.unique(),
    file
  )
}

export async function getRecentPosts() {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(20),
      ]
    )
    if (!posts) throw Error('Posts not found')
    return posts as Models.DocumentList<Post>
  } catch (e) {
    console.log(e)
  }
}

export async function savePost({postId, userId}: { postId: string, userId: string }) {
  try {
    const newSave = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        post: postId,
        user: userId
      }
    )
    if (!newSave) throw Error('Save not created')
    return newSave
  } catch (e) {
    console.log(e)
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    )
    if (!statusCode) throw Error
    return {
      status: 'ok'
    }
  } catch (e) {
    console.log(e)
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )
    if (!updatedPost) throw Error('Post not updated')
    return updatedPost
  } catch (e) {
    console.log(e)
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    if (!post) throw Error('Post not found')
    return post as Post
  } catch (e) {
    console.log(e)
  }
}


export async function createPost(post: INewPost) {
  if (!post.file.length) {
    throw new Error('No file provided')
  }
  const newFile = await uploadFile(post.file[0])
  const imageUrl = storage.getFileDownload(appwriteConfig.storageId, newFile.$id)

  if (!imageUrl) {
    await deleteFile(newFile.$id)
    throw new Error('Image not found')
  }

  const newPost = await database.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    ID.unique(),
    {
      creator: post.userId,
      imageUrl,
      imageId: newFile.$id,
      caption: post.caption,
      tags: post.tags?.split(',').map(tag => tag.trim()) || [],
      location: post.location,
    }
  )
  if (!newPost) {
    await deleteFile(newFile.$id)
    throw new Error('Post not created')
  }
  return newPost
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpload = post.file.length > 0
  let image = {
    imageUrl: post.imageUrl,
    imageId: post.imageId,
  };

  if (hasFileToUpload) {
    const newFile = await uploadFile(post.file[0])
    const imageUrl = storage.getFileDownload(appwriteConfig.storageId, newFile.$id)

    if (!imageUrl) {
      await deleteFile(newFile.$id)
      throw new Error('Image not found')
    }
    image = {
      imageUrl: imageUrl,
      imageId: newFile.$id,
    }
  }

  const newPost = await database.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    post.postId,
    {
      imageUrl: image.imageUrl,
      imageId: image.imageId,
      caption: post.caption,
      tags: post.tags?.split(',').map(tag => tag.trim()) || [],
      location: post.location,
    }
  )
  if (!newPost) {
    await deleteFile(image.imageId)
    throw new Error('Post not created')
  }
  return newPost
}


export async function deletePost(postId: string, imageId: string) {
  try {
    const statusCode = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    if (!statusCode) throw Error('Post not deleted')
    await deleteFile(imageId)
    return {
      status: 'ok'
    }
  } catch (e) {
    console.log(e)
  }
}

export async function getInfinitePosts({pageParam}: {pageParam: number}){

  const queries  = [Query.orderDesc('$updatedAt'), Query.limit(9)]
  if(pageParam){
    queries.push(Query.cursorAfter(pageParam.toString()))
  }

  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    )
    if (!posts) throw Error('Posts not found')
    return posts as Models.DocumentList<Post>
  }
  catch(e){
    console.log(e)
  }
}

export async function searchPosts(searchTemr: string) {
  try{
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [
        Query.search('caption',searchTemr),
      ]
    )
    if (!posts) throw Error('Posts not found')
    return posts as Models.DocumentList<Post>
  }
  catch(e){
    console.log(e)
  }
}