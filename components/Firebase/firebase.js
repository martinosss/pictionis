import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database'

import firebaseConfig from './firebaseConfig';

// Initialize Firebase App

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();

export const database = firebase.database()

export const loginWithEmail = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

export const registerWithEmail = async (email, password, name) => {
  const { user } = await auth.createUserWithEmailAndPassword(email, password);
  
  database.ref(`users/${user.uid}`).set({
    name
  })
}

export const logout = () => auth.signOut();