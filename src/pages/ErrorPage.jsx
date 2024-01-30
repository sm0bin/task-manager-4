import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    // const navigate = useNavigate();
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page" className="flex flex-col items-center justify-center my-24 gap-3 space-y-4 w-11/12 mx-auto">
            <img className="lg:w-1/3 mx-auto" src="/404-cat.svg" alt="" />
            <div>
                <h2 className="font-semibold text-2xl text-center">Sorry, an unexpected error has occurred.</h2>
                <h4 className="font-medium text-lg text-center">
                    <i>{error.statusText || error.message}</i>
                </h4>
            </div>
            {/* <button onClick={() => navigate(-1)} className="btn btn-neutral">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Go Back
                </button> */}
            {/* <button onClick={() => navigate('')} className="btn btn-neutral">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Go Home
                </button> */}
            <button onClick={() => window.location.reload(true)} className="btn btn-neutral">
                Reload
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>
        </div>
    );
}