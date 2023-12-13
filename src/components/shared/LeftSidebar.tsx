import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import {useUserContext} from "@/context/AuthContext.tsx";
import {sidebarLinks} from "@/constants";
import {INavLink} from "@/types";
import {Button} from "@/components/ui/button.tsx";
import {useSignOutAccount} from "@/lib/react-query/queriesAndMutatios.ts";
import {useEffect} from "react";

const LeftSidebar = () => {
  const navigate = useNavigate()
  const {user} = useUserContext()
  const {mutate: signOut, isPending: loadingSignOut, isSuccess} = useSignOutAccount()

  const {pathname} = useLocation()
  useEffect(() => {
    if (isSuccess) {
      navigate(0)
    }
  }, [isSuccess])
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/assets/images/logo.svg"
               alt="logo"
               width={100}
               height={66}
          />
        </Link>

        <Link to={`/profile.${user.id}`}
              className="flex gap-3 items-center">
          <img className="rounded-full w-14 h-14"
               src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
               alt="profile"/>
          <div className="flex flex-col ">
            <p className="body-bold">
              {user.name}
            </p>
            <p className="small-regular text-light-3">
              @{user.username}
            </p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route

            return (
              <li key={link.label} className={`leftsidebar-link group ${
                isActive && "bg-primary-500"
              }`}>
                <NavLink key={link.label}
                         to={link.route}
                         className=" flex gap-4 items-center p-4 "

                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${isActive && "invert-white"}`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}

        </ul>
      </div>
      <Button variant="ghost" className="shad-button_ghost"
              disabled={loadingSignOut}
              onClick={() => signOut()}>
        <img src="/assets/icons/logout.svg" alt="logout"/>
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;