import {Link, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {useSignOutAccount} from "@/lib/react-query/queriesAndMutatios.ts";
import {useEffect} from "react";
import {useUserContext} from "@/context/AuthContext.tsx";

const Topbar = () => {
  const {mutate: signOut, isPending: loadingSignOut, isSuccess} = useSignOutAccount()
  const navigate = useNavigate()

  const {user} = useUserContext()
  useEffect(() => {
    if (isSuccess) {
      navigate(0)
    }
  }, [isSuccess])
  return (
    <section className="topbar">
      <div className="flex items-center justify-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/assets/images/logo.svg"
               alt="logo"
               width={130}
               height={325}
          />
        </Link>

        <div className="flex gap-4">
          <Button variant="ghost" className="shad-button_ghost"
                  disabled={loadingSignOut}
                  onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout"/>
          </Button>
          <Link to={`/profile.${user.id}`}
                className="flex-center">
            <img className="rounded-full w-8 h-8" src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
                 alt="profile"/>
          </Link>

        </div>

      </div>
    </section>
  );
};

export default Topbar;