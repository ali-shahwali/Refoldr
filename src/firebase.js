import firebase from 'firebase/app';
import 'firebase/firestore';
import "firebase/auth";
import store from "./store";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDTDAye_KLurTMKFY15DMDk2SPOn9QntOU",
    authDomain: "code-bank-2aa9f.firebaseapp.com",
    projectId: "code-bank-2aa9f",
    storageBucket: "code-bank-2aa9f.appspot.com",
    messagingSenderId: "646917881443",
    appId: "1:646917881443:web:375a23b27acb80930c4256",
    measurementId: "G-P2YB3WHRT1"
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


