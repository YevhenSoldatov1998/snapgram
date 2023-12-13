import {Post} from "@/types";
import {FC, MouseEvent, useEffect, useState} from "react";
import {useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost} from "@/lib/react-query/queriesAndMutatios.ts";
import Loading from "@/components/shared/Loading.tsx";

type PostStatsProps = {
  post: Post;
  userId: string;
}
const PostStats: FC<PostStatsProps> = ({post, userId}) => {
  const {data: currentUser} = useGetCurrentUser()

  const likedList = post.likes?.map((user) => user.$id)

  const [likes, setLikes] = useState(likedList || [])

  const [isSaved, setIsSaved] = useState(false)
  const {mutate: savePost, isPending: isPendingSavePost} = useSavePost()
  const {mutate: likePost, isPending: isPendingLike} = useLikePost()

  const {mutate: deleteSavedPost, isPending: isPendingDeleteSaved} = useDeleteSavedPost()


  const isLiked = likes.includes(currentUser?.$id ?? "");

  const savedPostRecord = currentUser?.save.find((record) => record.post.$id === post.$id)
  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [currentUser])
  const handleLikePost = async (e: MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likes]
    const hasLiked = newLikes.includes(userId)
    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId)
    }
    setLikes(newLikes)
    likePost({
      postId: post.$id,
      likesArray: newLikes
    })

  }

  const handleSavePost = async (e: MouseEvent) => {
    e.stopPropagation();
    if (savedPostRecord) {
      setIsSaved(false)
      deleteSavedPost(savedPostRecord.$id)
      return;
    }

    savePost({postId: post.$id, userId})
    setIsSaved(true)

  }

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <button disabled={isPendingLike}>
          <img
            src={isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
            alt="liked"
            width="20"
            height="20"
            onClick={handleLikePost}
            className="cursor-pointer"
          />
        </button>
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        {isPendingDeleteSaved || isPendingSavePost
          ? <Loading/>
          : (
            <button className="cursor-pointer">
              <img
                src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
                alt="save"
                width="20"
                height="20"
                onClick={handleSavePost}
                className="cursor-pointer"
              />
            </button>
          )}
      </div>

    </div>
  );
};

export default PostStats;