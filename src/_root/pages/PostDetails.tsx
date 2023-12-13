import {Link, useNavigate, useParams} from "react-router-dom";
import {useDeletePost, useGetPostById} from "@/lib/react-query/queriesAndMutatios.ts";
import Loading from "@/components/shared/Loading.tsx";
import {formatDateToRelative} from "@/lib/utils.ts";
import {useUserContext} from "@/context/AuthContext.tsx";
import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast.ts";
import PostStats from "@/components/shared/PostStats.tsx";

const PostDetails = () => {
  const navigate = useNavigate()
  const {id} = useParams<{ id: string }>()
  const {toast} = useToast()
  const {data: post, isPending} = useGetPostById(id || '')
  const {mutateAsync: deletePost, isPending: isPendingDelete} = useDeletePost()
  const {user} = useUserContext()
  const handleDeletePost = async () => {
    try {
      if (!id || !post?.imageId) return
      const status = await deletePost({postId: id, imageId: post.imageId})
      if (status) {
        toast({
          title: 'Post deleted',
          description: 'Post deleted successfully',
        })
        navigate('/')
      }
    } catch (e) {
      toast({
        title: 'Post not deleted',
        description: 'Please, try again later',
      })
    }
  }
  return (
    <div className="post_details-container">
      {isPending ? <Loading/> : (
        <div className="post_details-card">

          <img src={post?.imageUrl} alt="create"
               className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                <img
                  src={post?.creator.imageUrl || '/assets/icons/profile-placeholder.svg'}
                  alt="avatar"
                  className="rounded-full w-12 h-12"
                />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">{post?.creator.name}</p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">{formatDateToRelative(post?.$createdAt)}</p>
                    -
                    <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                  </div>
                </div>
              </Link>
              <div className="flex-center gap-4">
                {user.id === post?.creator.$id && (
                  <>

                    <Link to={`/update-post/${post?.$id}`}>
                      <img src="/assets/icons/edit.svg"
                           width="24" height="24" alt="edit"/>
                    </Link>
                    <Button
                      disabled={isPendingDelete}
                      variant="ghost"
                      className="ghost_details-delete_btn"
                      onClick={handleDeletePost}>
                      <img src="/assets/icons/delete.svg"
                           width="24" height="24" alt="delete"/>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <hr className="border-1 w-full mt-2 lg:mt-4  border-dark-4/80"/>
            <div className="small-medium lg:base-medium py-5">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags?.map((tag) => (
                  <li key={tag} className="text-light-3">#{tag}</li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              <PostStats post={post!} userId={user.id}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;