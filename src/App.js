import logo from './logo.svg';
import './App.css';
import firebase from "firebase";
import "firebase/analytics";
import firebaseConfig from './firebaseConfig';
import { useState } from 'react';


firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false)

  const [user, setUser] = useState({

    isSigned: false,

    name: '',
    email: '',
    password: '',
    photo: '',
    success: false,
  })

  const provider = new firebase.auth.GoogleAuthProvider();

  const signOutUser = () => {
    firebase.auth().signOut()
      .then(() => {
        const signedOut = {
          isSigned: false,
          name: '',
          email: '',
          password: '',
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

  const onBlur = (e) => {
    console.log(e.target.name, e.target.value)
    let validForm = true
    if (e.target.name === "email") {
      validForm = /\S+@\S+\.\S+/.test(e.target.value)

    }
    if (e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6
      const passwordContainDigit = /\d{1}/.test(e.target.value)
      validForm = (isPasswordValid && passwordContainDigit);
    }
    if (validForm) {
      const newUserInfo = { ...user }
      newUserInfo[e.target.name] = e.target.value
      setUser(newUserInfo)
    }
  }
  const handleSubmit = (e) => {

    console.log(user.email, user.password);

    if (newUser && user.email && user.password) {
      console.log("submitting");
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)

        .then((res) => {
          const newUserInfo = { ...user }
          newUserInfo.success = true;
          newUserInfo.error = " ";
          setUser(newUserInfo)
          updateUserInfo(user.name)
        })

        .catch((error) => {
          const newUserInfo = { ...user }
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo)

        });

    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user }
          newUserInfo.success = true;
          newUserInfo.error = " ";
          setUser(newUserInfo)
          console.log("update user name", res.user);
        })
        .catch((error) => {
          const newUserInfo = { ...user }
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo)

        });
    }
    e.preventDefault()
  }
  const updateUserInfo = name => {
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
     
    }).then(function () {
     console.log("user name updated successfully");
    }).catch(function (error) {
      console.log(error);
    });
  }
  return (

    <div className="App">
      {
        user.isSigned ? <button onClick={signOutUser}>sign out</button> : <button onClick={handleSignIn}>sign in</button>
      }<br/>
      <button>log in using facebook</button>
      {
        user.isSigned && <div>

          <h1>welcome, {user.name}</h1>
          <p>email, {user.email}</p>
          <img src={user.photo} alt="" />

        </div>
      }
      <p>email {user.email}</p>
      <p>pass {user.password}</p>
      <input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)} id="" />
      <label htmlFor="newUser">newUser sign up</label>
      <form onSubmit={handleSubmit}>
        {
          newUser && <input type="text" name="name" onBlur={onBlur} id="" placeholder="name" />
        }
        <br />
        <input type="text" name="email" onBlur={onBlur} id="" required placeholder="email" /><br />
        <input type="password" name="password" onBlur={onBlur} id="" placeholder="password" required /><br />
        <input type="submit" value={newUser ? 'sign up' : 'sign in'} />
      </form>
      <p style={{ color: "red" }}>{user.error}</p>
      {
        user.success && <p style={{ color: "green" }}>you are successfully {newUser ? 'created' : 'loged in'} in form</p>
      }

    </div>
  );
}

export default App;
