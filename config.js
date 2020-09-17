import * as firebase from 'firebase';
require('@firebase/firestore')






var firebaseConfig = {
    apiKey: "AIzaSyDmCcn8i4BJ-HDQ0ObDrs-rQ-_-RK7xjfc",
    authDomain: "wily-8af34.firebaseapp.com",
    databaseURL: "https://wily-8af34.firebaseio.com",
    projectId: "wily-8af34",
    storageBucket: "wily-8af34.appspot.com",
    messagingSenderId: "989814349908",
    appId: "1:989814349908:web:f067e01ed7757fd38c4dc1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()