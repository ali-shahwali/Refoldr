import firebase from 'firebase/app';
import 'firebase/firestore';
import "firebase/auth";
import store from "./store";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAg3CpzVGuU5Q7eOt3R0BwuNihQJ6MP660",
    authDomain: "refoldr.firebaseapp.com",
    projectId: "refoldr",
    storageBucket: "refoldr.appspot.com",
    messagingSenderId: "214659067460",
    appId: "1:214659067460:web:6f0ad935aece041acc5611",
    measurementId: "G-6E2C0F7QNM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
};


auth.onAuthStateChanged(user => {
    store.dispatch("fetchUser", user);

});


const { Timestamp } = firebase.firestore;
export { Timestamp };


