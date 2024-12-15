import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { collection, addDoc, DocumentReference } from 'firebase/firestore';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: Auth = inject(Auth);
  firestoreService: FirestoreService = inject(FirestoreService);

  currentUser: DocumentReference | null = null;
  constructor(private router: Router, private toastController: ToastController) { }

  // code based on https://firebase.google.com/docs/auth/web/password-auth

  // Handle Login
  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const userRef = this.firestoreService.getUserByEmail(email);
      userRef.then((docRef) => { 
        if (docRef) {
          // save the document reference for the current user
          this.currentUser = docRef;
          console.log(this.currentUser);
          // route to a new page if login is successful
          this.router.navigate(['/group']); // this page should also be restricted to authorized users
        }
      });
      
    })
    .catch((error) => {
      // catch error information for log 
      console.log(error.code, error.message);

      // display error message to user
      let errorString: string = "Login failed:" + error.message;
      if (error.code === "auth/wrong-password") {
        errorString = "Incorrect password.";
      } else if (error.code === "auth/user-not-found") {
        errorString = "No user found with this email.";
      } // else display the default, initial message

      this.showAuthError(errorString);
    });
  }

  // Handle Sign Up
  signup(email: string, password: string, username: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // User Created 
      // if the user was successfully created, also store their username in the database
      const userRef = this.firestoreService.createUser(email, username);
      // route to a new page if sign up is successful
      userRef.then((docRef) => { 
        if (docRef) {
          // save the document reference for the current user
          this.currentUser = docRef;
          // this page should also be restricted to authorized users
          this.router.navigate(['/join-group']);
        }
      });
    })
    .catch((error) => {
      // catch error information for log 
      console.log(error.code, error.message);

      // display error message to user
      let errorString: string = "Login failed:" + error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorString = 'The email address is already in use by another account.';
      } else if (error.code === 'auth/invalid-email') {
        errorString = 'The email address is not valid. Please check and try again.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorString = 'Email/password accounts are not enabled. Please contact support.';
      } else if (error.code === 'auth/weak-password') {
        errorString = 'The password is too weak. Please choose a stronger password.';
      } // else display the default, initial message

      this.showAuthError(errorString);
    });
  }

  async showAuthError(errorMessage: string) {
    const toast = await this.toastController.create({
      message: errorMessage,
      duration: 10000,
    });
    toast.present();
  }

}
