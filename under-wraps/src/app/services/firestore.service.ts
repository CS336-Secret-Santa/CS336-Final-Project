import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, DocumentReference, where, query, getDoc, getDocs, setDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);

  userColl = collection(this.firestore, 'Users');
  groupColl = collection(this.firestore, 'Groups');

  // groups$: Observable<any[]>;

  constructor() { 
    // this.groups$ = collectionData(this.groupColl);
  }

  /**
   * Since most methods in the API return a reference to a document, 
   * this method is useful for converting that reference to the actual document data.
   * 
   * @param ref a reference to a document
   * @returns document data
   */
  convertRefToDoc(ref: DocumentReference) {
    return getDoc(ref);
  }

  /// USERS ///

  /** 
   * Creates a user in the Firestore "Users" collection
   * NOTE: password storage is handled by Firebase Auth
   * 
   * @param email the user's email
   * @param username the user's username
   * @returns the user's document OR false if an error occurred
  */ 
  async createUser(email: string, username: string) {
    try {
      // create user
      const docRef = await addDoc(this.userColl, { email: email, username: username });
      return docRef; // return the actual data from the document, not the reference.
    }
    catch (e) {
      console.error(e);
      return false;
    }
  }

  /**
   * Retrieves a user document based on which email they used to sign up
   * NOTE: each document in the "Users" collection should have a unique email
   * 
   * @param email the user's email
   * @returns the user's document reference OR false if an error occurred
   */
  async getUserByEmail(email: string) {
    try {
      // get user by email
      const queryRes = query(this.userColl, where("email", "==", email))
      const querySnapshot = await getDocs(queryRes); // technically getDocs, but should only have one document; one match for the query
      return querySnapshot.docs[0].ref;
    }
    catch (e) {
      console.error(e);
      return false;
    }
  }

  /**
   * Updates a user's username in the Firestore "Users" collection
   * 
   * @param document a reference to the user's document
   * @param username the new username
   */
  updateUsername(document: DocumentReference, username: string) {
    // update username for a particular user
    try {
      setDoc(document, { username: username }, { merge: true });
    }
    catch (e) {
      console.error(e);
    }
  }

  /**
   * Deletes a user from the Firestore "Users" collection
   * 
   * @param document a reference to the user's document
   */
  deleteUser(document: DocumentReference) {
    // delete a user
    try {
      deleteDoc(document);
    }
    catch (e) {
      console.error(e);
    }
  }

  /**
   * Updates a user's bio in the Firestore "Users" collection
   * 
   * @param document a reference to the user's document
   * @param bio the user's bio
   */
  updateBio(document: DocumentReference, bio: string) {
    // update bio for a particular user
    try {
      setDoc(document, { bio: bio }, { merge: true });
    }
    catch (e) {
      console.error(e);
    }
  }

  /**
   * Updates a user's profile picture in the Firestore "Users" collection
   * 
   * @param document a reference to the user's document
   * @param profilePic the user's profile picture
   */
  updateProfilePic(document: DocumentReference, profilePic: string) {
    // update profile picture for a particular user
    try {
      setDoc(document, { profilePic: profilePic }, { merge: true });
    }
    catch (e) {
      console.error(e);
    }
  }

  /// GROUPS ///

  /**
   * Creates a group in the Firestore "Groups" collection
   * 
   * @param name the group's name
   * @param code the group's join code
   * - this code is used to join the group. 
   * - It should be unique and not easily guessable.
   * - It should be a string of 5 characters (upper/lower case letters and numbers).
   * @returns the group's document OR false if an error occurred
   */
  async createGroup(name: string, code: string) {
    try {
      // create group
      const docRef = await addDoc(this.groupColl, { name: name, code: code });
      return docRef; // return the actual data from the document, not the reference.
    }
    catch (e) {
      console.error(e);
      return false;
    }
  }  


}
