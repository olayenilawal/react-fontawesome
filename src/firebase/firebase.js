import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'; // Import additional services (e.g., firestore)


const firebaseConfig = {
    apiKey: "AIzaSyBBVqOfDbjWDa22YD5oAffCpOVtxF4wIsM",
    authDomain: "luth-48cc9.firebaseapp.com",
    projectId: "luth-48cc9",
    storageBucket: "luth-48cc9.appspot.com",
    messagingSenderId: "172218338811",
    appId: "1:172218338811:web:7a7c5a81ac0e45420f4f5e",
    measurementId: "G-08X8KK2DPF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage(); // Export Firebase Storage instance


export default firebase;