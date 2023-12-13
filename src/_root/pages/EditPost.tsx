import PostForm, {PostFormAction} from "@/components/forms/PostForm.tsx";
import {useParams} from "react-router-dom";
import {useGetPostById} from "@/lib/react-query/queriesAndMutatios.ts";
import Loading from "@/components/shared/Loading.tsx";

const EditPost = () => {
  const {id} = useParams<{ id: string }>()
  const {data: post, isPending} = useGetPostById(id!)
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            height="36"
            width="36"
          />
          <h2 className="h3-bold md:h2-bold text-left">
            Edit Post
          </h2>
        </div>

        {isPending ? <Loading/> : <PostForm post={post} action={PostFormAction.UPDATE}/>}
      </div>
    </div>
  );
};

export default EditPost;