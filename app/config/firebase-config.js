// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { GoogleAuthProvider, getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyBlOkM8CC7xo_J09kEEUgS7uTqrMPCkqk0",
    authDomain: "sosmet-aditya.firebaseapp.com",
    projectId: "sosmet-aditya",
    storageBucket: "sosmet-aditya.appspot.com",
    messagingSenderId: "1089574502086",
    appId: "1:1089574502086:web:0fcd2a4fda2fed6eece1c7",
    measurementId: "G-T8JHQDFRNX",
    databaseURL: "https://sosmet-aditya-default-rtdb.asia-southeast1.firebasedatabase.app/",
}

// Firebase Auth
const signInProvider = new GoogleAuthProvider()
signInProvider.addScope('https://www.googleapis.com/auth/contacts.readonly')

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
export const auth = getAuth(app)

// Firebase Realtime Database
export const db = getDatabase(app)
export const db_fs = getFirestore(app)
export const DB_ROOM = 'room'
export const DB_CHAT = 'chat'