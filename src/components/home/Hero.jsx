import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-xl">
                    <h1 className="text-5xl font-bold">Hello there</h1>
                    <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                    <Link to='/signup' className="btn btn-neutral mr-3">Get Started</Link>
                    <Link to='/about' className="btn btn-neutral btn-outline">Learn More</Link>
                </div>
            </div>
        </div>
    );
};

export default Hero;