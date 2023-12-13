import {Navigate, Outlet} from "react-router-dom";

const AuthLayout = () => {
    const isAuth = true;
    if (!isAuth) return <Navigate to={'/'}/>
    return (
        <>
            <section className={"flex flex-col flex-1 items-center justify-center py-10"}>
                <Outlet/>
            </section>
            <img src='/assets/images/side-img.svg' alt={'logo'}
                 className={'hidden md:block h-screen w-1/2 object-cover bg-no-repeat'}
            />
        </>
    );
};

export default AuthLayout;