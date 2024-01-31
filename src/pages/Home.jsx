import Hero from "../components/home/Hero";
import useAuth from "../hooks/useAuth";
import Dashboard from "./Dashboard";

const Home = () => {
    const { user } = useAuth();


    return (
        <>
            {
                user ?
                    <Dashboard />
                    :
                    <Hero></Hero>
            }
            {/* <Hero></Hero> */}
        </>
    );
};

export default Home;