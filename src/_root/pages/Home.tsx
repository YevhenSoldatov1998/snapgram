import Loading from "@/components/shared/Loading.tsx";
import {useGetRecentPosts} from "@/lib/react-query/queriesAndMutatios.ts";
import PostCard from "@/components/shared/PostCard.tsx";

const Home = () => {
  const {data, isPending: isPostLoading} = useGetRecentPosts()
console.log(data)
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home feed</h2>
          {isPostLoading ? (
            <div className="pt-5">
              <Loading/>
            </div>) : (
            <ul
              className="flex flex-col flex-1 gap-9 w-full">
              {data?.documents?.map((post) => (
                  <PostCard key={post.$id} post={post}/>
                )
              )}
            </ul>
          )}
        </div>
      </div>

    </div>
  );
};

export default Home;