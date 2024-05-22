import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyDBinYh9qjxiMHyzYbinJsHY1IQbTx8dHQ",
  authDomain: "adv102-3d5bc.firebaseapp.com",
  databaseURL: "https://adv102-3d5bc-default-rtdb.firebaseio.com",
  projectId: "adv102-3d5bc",
  storageBucket: "adv102-3d5bc.appspot.com",
  messagingSenderId: "508574004439",
  appId: "1:508574004439:web:5d6998efd5c195c330ec92",

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const imageDb = getStorage(app)
const imgDB = getStorage(app)
const txtDB = getFirestore(app)

export { app, auth, imgDB, txtDB }; // Export app, auth, db, and storage for use in your application
