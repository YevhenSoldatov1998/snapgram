import {bottombarLinks} from "@/constants";
import {Link, useLocation} from "react-router-dom";

const Bottombar = () => {
  const {pathname} = useLocation()
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route

        return (

          <Link
            to={link.route}
            key={link.label}
            className={` gap-1 items-center flex-col flex rounded-[10px] text-xs p-2 ${
              isActive && "bg-primary-500"
            }`}>

            <img
              width="16"
              height="16"
              src={link.imgURL}
              alt={link.label}
              className={`${isActive && "invert-white"}`}
            />
            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
        );
      })}

    </section>
  );
};

export default Bottombar;