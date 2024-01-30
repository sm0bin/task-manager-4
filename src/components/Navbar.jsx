import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navLinksPath = [
        { title: "Home", path: "/" },
        { title: "Dashboard", path: "/dashboard" },
        { title: "About", path: "/about" },
        { title: "Contact", path: "/contact" },
    ];


    const navLinks = navLinksPath.map((link) => {
        return (
            <li key={link.title}>
                <NavLink to={link.path}>{link.title}</NavLink>
            </li>
        )
    })

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
                    <img src="/logo.png" alt="logo" className="w-10 h-10" />
                    ProTaskify</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navLinks}
                </ul>
            </div>

            <div className="navbar-end">
                {/* <label htmlFor="my-drawer-4" className="drawer-button btn btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </label> */}



                {user ?
                    <div className="flex items-center gap-2 border-black">
                        {/* <label className="btn btn-ghost btn-circle drawer-button" htmlFor="my-drawer-4" >
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                 <span className="badge badge-xs w-4 h-4 badge-error indicator-item">8</span> 
                                <span className="badge badge-sm indicator-item">8</span>
                            </div>
                        </label> */}

                        <button onClick={logout} className="btn btn-ghost btn-circle">

                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                {/* <span className="badge badge-sm indicator-item">8</span> */}
                            </div>
                        </button>
                        <div className="divider border"></div>

                        {
                            user?.photoURL ?
                                <div className="avatar">
                                    <div className="w-8 rounded-full">
                                        <img src={user?.photoURL} />
                                    </div>
                                </div>
                                :
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                                        <span>SM</span>
                                    </div>
                                </div>
                        }
                        {/* <div className="avatar">
                                        <div className="w-12 rounded-full">
                                            <img src={user?.photoURL} />
                                        </div>
                                    </div> */}
                        {user && <h3 className="font-semibold">{user?.displayName}</h3>}
                        {/* <button onClick={logout} className="btn btn-neutral">Logout</button> */}
                    </div>
                    :
                    <NavLink to="/login" className="btn btn-neutral">Let&apos;s Explore</NavLink>


                }
            </div>
            {/* <div className="navbar-end">
                <NavLink to='/login' className="btn btn-neutral">Let&apos;s Explore</NavLink>
            </div> */}
        </nav>
    );
};

export default Navbar;