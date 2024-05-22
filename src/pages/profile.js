import React, { useEffect, useState } from "react";
import { imageDb } from '../firebase/firebase';
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { useLocation } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { v4 } from "uuid";

function FirebaseImageUpload(){
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const profileNameFromSignUp = searchParams.get("name") || '';

    const [img, setImg] = useState(null);
    const [imgUrl, setImgUrl] = useState([]);
    const [profileName, setProfileName] = useState(profileNameFromSignUp || '');
    const [newProfileName, setNewProfileName] = useState('');
    const [bio, setBio] = useState('');
    const [newBio, setNewBio] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const email = user.email;
                const db = getFirestore();
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setProfileName(userData.profileName);
                    setBio(userData.bio || '');
                } else {
                    console.error("No such document!");
                }

                // Retrieve user's profile picture
                const imgRef = ref(imageDb, `images/${encodeURIComponent(email)}`);
                getDownloadURL(imgRef)
                    .then(url => {
                        setImgUrl([url]);
                    })
                    .catch(error => {
                        console.error("Error getting profile picture:", error);
                    });
            }
        });
        
        listAll(ref(imageDb, "files"))
            .then(imgs => {
                Promise.all(imgs.items.map(val =>
                    getDownloadURL(val).then(url => url)
                )).then(urls => {
                    setImgUrl(urls);
                }).catch(error => {
                    console.error("Error fetching images:", error);
                });
            })
            .catch(error => {
                console.error("Error listing images:", error);
            });
    }, []);

    const handleClick = () =>{
        if(img){
            const email = getAuth().currentUser.email;
            const imgRef = ref(imageDb,`images/${encodeURIComponent(email)}`);
            uploadBytes(imgRef, img)
                .then(value => {
                    console.log("Upload successful:", value);
                    getDownloadURL(value.ref)
                        .then(url => {
                            setImgUrl([url]);
                        })
                        .catch(error => {
                            console.error("Error getting download URL:", error);
                        });
                })
                .catch(error => {
                    console.error("Error uploading image:", error);
                });
        }
    }

    const handleChangeName = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        try {
            const db = getFirestore();
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                profileName: newProfileName
            });
            setProfileName(newProfileName);
            setNewProfileName('');
            setError('');
        } catch (error) {
            setError('Error updating profile name: ' + error.message);
            console.error("Error updating profile name:", error);
        }
    }

    const handleChangeBio = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        try {
            const db = getFirestore();
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                bio: newBio
            });
            setBio(newBio);
            setNewBio('');
            setError('');
        } catch (error) {
            setError('Error updating bio: ' + error.message);
            console.error("Error updating bio:", error);
        }
    }

    const handleBackClick = () => {
        window.location.href = '/quiz'
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
            <div className="max-w-4xl mx-auto p-8 bg-violet-300 shadow-md rounded-lg">
                <div className="flex items-center mb-8">
                    <div className="w-20 h-20 overflow-hidden rounded-full bg-blue-400">
                        {imgUrl.length > 0 && <img src={imgUrl[0]} alt="Profile" className="w-full h-full object-cover" />}
                    </div>
                    <div className="ml-4">
                        <h2 className="text-2xl font-semibold text-green-700">{profileName}</h2>
                        <input type="file" onChange={(e)=>setImg(e.target.files[0])} className="border rounded py-1 px-2 mt-2 bg-indigo-100" /> 
                    </div>
                </div>
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2 text-blue-800">Bio</h3>
                    <p>{bio}</p>
                    <textarea value={newBio} onChange={(e) => setNewBio(e.target.value)} placeholder="Tell us about yourself..." className="w-full border rounded py-2 px-4 bg-purple-100"></textarea>
                    <button onClick={handleChangeBio} className="mt-2 bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded">Update Bio</button>
                </div>
                <div className="mb-8">
                    <input type="text" value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} placeholder="Enter New Profile Name" className="border rounded py-2 px-4 bg-orange-100" />
                    <button onClick={handleChangeName} className="ml-2 bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded">Change Name</button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
                <button onClick={handleClick} className="mt-8 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">Upload</button>
                <button onClick={handleBackClick} className="mt-4 bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">Back to Quiz</button>
            </div>
        </div>
    )
}

export default FirebaseImageUpload;
