import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: Auth = inject(Auth);
  constructor(private router: Router, private toastController: ToastController) { }

  // code based on https://firebase.google.com/docs/auth/web/password-auth

  // Handle Login
  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // Signed in 
      // store information about the user (https://firebase.google.com/docs/reference/js/auth.user.md#user_interface)
      const user = userCredential.user;
      // route to a new page if login is successful
      this.router.navigate(['/home', user]); // this page should also be restricted to authorized users
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
  signup(email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // User Created 
      // store information about the user (https://firebase.google.com/docs/reference/js/auth.user.md#user_interface)
      const user = userCredential.user;
      // route to a new page if sign up is successful
      this.router.navigate(['/home', user]); // this page should also be restricted to authorized users
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
