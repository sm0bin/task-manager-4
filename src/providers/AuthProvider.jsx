import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import auth from "../firebase/firebase.config.js";
import { GoogleAuthProvider, TwitterAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import useAxiosPublic from '../hooks/useAxiosPublic.jsx';

const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();
export const AuthContext = createContext(null);


const AuthProvider = ({ children }) => {
    const axiosPublic = useAxiosPublic();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signUp = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }
    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }
    const logout = () => {
        setLoading(true);
        return signOut(auth);
    }
    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }
    const twitterSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, twitterProvider);
    }

    const updateUser = (name, photoURL) => {
        setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photoURL
        });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // console.log(currentUser.displayName, currentUser.email, currentUser.photoURL);

            setUser(currentUser);
            if (currentUser) {
                const userInfo = {
                    email: currentUser.email,
                };
                console.log(userInfo);
                axiosPublic.post("/jwt", userInfo)
                    .then(res => {
                        // console.log(res.data.token);
                        if (res.data.token) {
                            localStorage.setItem('token', res.data.token);
                            setLoading(false);
                        }
                    })
            } else {
                localStorage.removeItem('token');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [axiosPublic])

    const authInfo = {
        user,
        signUp,
        login,
        logout,
        googleSignIn,
        twitterSignIn,
        loading,
        updateUser,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider >
    );
};

export default AuthProvider;