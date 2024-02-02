import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { toast } from "react-hot-toast";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    console.log(user);
    const navLinksPath = [
        { title: "Home", path: "/" },
        { title: "Dashboard", path: "/dashboard" },
        { title: "Login", path: "/login" },
        { title: "Signup", path: "/signup" }
    ];


    const navLinks = navLinksPath.map((link) => {
        return (
            <li key={link.title}>
                <NavLink to={link.path}>{link.title}</NavLink>
            </li>
        )
    })

    const handleLogout = () => {
        logout()
            .then((res) =>
                toast.success("Logout Successful!")
            )
            .catch((err) =>
                toast.error("Logout Failed!")
            )
    }

    return (
        <nav className="fixed z-40 navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navLinks}
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl font-bold">
                    <img src="/task-manager-logo.png" alt="logo" className="w-10 h-10" />
                    Task Manager</a>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navLinks}
                </ul>
            </div>

            <div className="navbar-end">
                {
                    user ?
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost m-1 font-semibold text-lg">{user?.displayName}</div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <a>Profile</a>
                                </li>
                                <li>
                                    <a>Settings</a>
                                </li>
                                <li>
                                    <a onClick={handleLogout} className="">Logout</a>
                                </li>
                            </ul>
                        </div>
                        :
                        <NavLink to='/login' className="btn btn-neutral">Login</NavLink>
                }
            </div>
        </nav>
    );
};

export default Navbar;