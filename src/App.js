import logo from './logo.svg';
import './App.css';
import firebase from "firebase";
import "firebase/analytics";
import firebaseConfig from './firebaseConfig';
import { useState } from 'react';


firebase.initializeApp(firebaseConfig);

function App() {

  const [user, setUser] = useState({

    isSigned: false,
    name: '',
    email: '',
    photo: '',
  })

  const provider = new firebase.auth.GoogleAuthProvider();



  const signOutUser = () => {
    firebase.auth().signOut()
      .then(() => {
        const signedOut = {
          isSigned: false,
          name: '',
          email: '',
          photo: '',

        }
        setUser(signedOut)
      })
      .catch((error) => {

      });
  }

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user
        const signedInUser = {
          isSigned: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser)
      })

      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  }



  return (

    <div className="App">
      {
        user.isSigned ? <button onClick={signOutUser}>sign out</button> : <button onClick={handleSignIn}>sign in</button>
      }
      {
        user.isSigned && <div>

          <h1>welcome, {user.name}</h1>
          <p>email, {user.email}</p>
          <img src={user.photo} alt="" />

        </div>
      }

    </div>
  );
}

export default App;
