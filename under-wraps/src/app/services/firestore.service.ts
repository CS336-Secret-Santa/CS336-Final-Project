import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, DocumentReference, where, query, getDoc, getDocs, setDoc, deleteDoc } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { generate, Observable, timestamp } from 'rxjs';

/** 
 * FirestoreService implements an API for interacting with this app's Firestore database.
 * 
 * Note: Much of this code was implemented with copilot's help (and some chatgpt)
 * Development Note: Check for TODOs in the code. 
*/

// TODO list

  // function for deleting a group

  // ensure that data can be tracked throughout the app...
    // - when a user is created, store their reference in the app
    // - when a user logs in, store their reference in the app
    // - when a group is loaded, store the group reference in the app

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);

  userColl = collection(this.firestore, 'Users');
  groupColl = collection(this.firestore, 'Groups');

  /* 
  Firestore database structure:
  - Users
    - email (string)
    - username (string)
    - bio (string)
    - profilePic (string)
    - timestamp (timestamp)
    - Preferences
      - preference (string)
    - Groups
      - group (reference)
      - match (reference)
      - isAdmin (boolean)
  - Groups
    - name (string)
    - code (string)
    - admin (reference)
    - closed (boolean)
    - timestamp (timestamp)
    - members
      - member (reference)
  */

  constructor(private toastController: ToastController) {  }

  /// UTILITIES ///

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
      const docRef = await addDoc(this.userColl, { email: email, username: username, timestamp: new Date(Date.now()).toLocaleString() });
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

  /**
   * Check if a user is an admin of a group
   * 
   * @param user a reference to the user's document
   * @param group a reference to the group's document
   * @returns true if the user is an admin of the group, false otherwise
   */
  async checkIfAdmin(user: DocumentReference, group: DocumentReference) {
    // check if a user is an admin of a group
    try {
      const queryRes = query(collection(user, "Groups"), where("group", "==", group))
      const querySnapshot = await getDocs(queryRes);
      return querySnapshot.docs[0].data()['isAdmin'];
    }
    catch (e) {
      console.error(e);
      return false
    }
  }

  /// PREFERENCES ///

  /**
   * Retrieves a user's preferences from the Firestore "Preferences" collection
   * 
   * @param document a reference to the user's document
   * @returns an array of the user's preferences OR false if an error occurred
   */
  async getPreferences(document: DocumentReference) {
    try {
      // get user's preferences
      const prefDocs = collection(document, "Preferences");
      const querySnapshot = await getDocs(prefDocs);
      const preferences = querySnapshot.docs.map(doc => doc.data());
      return preferences;
    }
    catch (e) {
      console.error(e);
      return false;
    }
  }

  /**
   * Adds a preference to the Firestore "Preferences" collection
   * 
   * @param document a reference to the user's document
   * @param preference the user's preference
   */
  addPreference(document: DocumentReference, preference: string) {
    // add a preference for a particular user
    try {
      addDoc(collection(document, "Preferences"), { preference: preference });
    }
    catch (e) {
      console.error(e);
    }
  }

  /**
   * Deletes a preference from the Firestore "Preferences" collection
   * 
   * @param document a reference to the user's document
   * @param preference the user's preference
   */
  async deletePreference(document: DocumentReference, preference: string) {
    // delete a preference for a particular user
    try {
      const prefDocs = collection(document, "Preferences");
      const queryRes = query(prefDocs, where("preference", "==", preference))
      const querySnapshot = await getDocs(queryRes);
      deleteDoc(querySnapshot.docs[0].ref);
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
   * @returns the group's document OR false if an error occurred
   */
  async createGroup(name: string, creator: DocumentReference) {
    try {
      // generate a code for the new group
      // - this code is used to join the group. 
      // - It should be unique and not easily guessable.
      // - It should be a string of 5 characters (lower case letters and numbers).
      const code: string = this.generateGroupCode();

      // create group
      const groupRef = await addDoc(this.groupColl, { name: name, code: code, admin: creator, closed: false, timestamp: new Date(Date.now()).toLocaleString() });
      if (groupRef) {
        this.addUserToGroup(groupRef, creator); // add the creator to the group
        // get the current group's record in the user's document
        const currentGroup = query(collection(creator, "Groups"), where("group", "==", groupRef));
        const querySnapshot = await getDocs(currentGroup);
        // make the creator an admin of the group
        setDoc(querySnapshot.docs[0].ref, { isAdmin: true }, { merge: true }); 
      } 

      return groupRef; // return the actual data from the document, not the reference.
    }
    catch (e) {
      console.error(e);
      // no need to account for cases where the group name is not unique.
      // Even if two groups have the same name, they will have different codes.
      return false;
    }
  }  

  /**
   * deletes a group from the Firestore "Groups" collection
   * TODO: ensure that it deletes this data everywhere else it is stored
   * 
   * @param document a reference to the group's document
   */
  // deleteGroup(document: DocumentReference) {
  //   // delete a group
  //   try {
  //     deleteDoc(document);
  //   }
  //   catch (e) {
  //     console.error(e);
  //   }
  // }

  /**
   * Retrieves a group document based on its unique code
   * 
   * @param code a unique code for a group
   * @returns a reference to the group's document OR false if an error occurred
   */
  async getGroupByCode(code: string) {
    try {
      // get group by code
      const queryRes = query(this.groupColl, where("code", "==", code))
      const querySnapshot = await getDocs(queryRes);
      return querySnapshot.docs[0].ref;
    }
    catch (e) {
      console.error(e); //note: sometimes this error is intentional, such as when it is called by joinGroupByCode()
      return false;
    }
  }

  /**
   * Add a user to a group using the group's unique code
   * 
   * @param code the code used to join the group
   * @param user the user who is joining the group
   */
  joinGroupByCode(code: string, user: DocumentReference) {
    // join a group by its unique code
    try {
      this.getGroupByCode(code).then(group => {
        // if it was successful, add the user to the group
        if (group) {
          this.addUserToGroup(group, user);
          return true
        }
        else {
          console.error("Group not found.");
          return false;
        }
      });
    }
    catch (e) {
      console.error(e);
      return false;
    }
    return false;
  }

  /**
   * Gets the data of all of the groups a particular member is in.
   * @param user the user to get groups for
   * @returns an array of groups the user is in OR false if an error occurred
   */
  async getGroupsByUser(user: DocumentReference) {
    // get all groups a user is in
    try {
      const queryRes = query(collection(user, "Groups"));
      const querySnapshot = await getDocs(queryRes);
      return querySnapshot.docs.map(doc => doc.data());
    }
    catch (e) {
      console.error(e);
      return false;
    }
  }

  async getUsersByGroup(group: DocumentReference) {
    // get all users in a group
    try {
      const queryRes = query(collection(group, "Members"));
      const querySnapshot = await getDocs(queryRes);
      return querySnapshot.docs.map(doc => doc.data());
    }
    catch (e) {
      console.error(e);
      return false;
    }
  }


  /// GROUP MEMBERS ///
  /**
   * Adds a user to a group and adds the group to the user's list of groups
   * 
   * @param group a reference to the group's document
   * @param user a reference to the user's document
   */
  addUserToGroup(group: DocumentReference, user: DocumentReference) {
    try {
      addDoc(collection(group, "Members"), { member: user });
      addDoc(collection(user, "Groups"), { group: group });
    }
    catch (e) {
      console.error(e);
    }
  }

  /**
   * Removes a user from a group and 
   * removes the group from the user's list of groups
   * 
   * @param group a reference to the group's document
   * @param user a reference to the user's document
   */
  async removeUserFromGroup(group: DocumentReference, user: DocumentReference) {
    try {
      // remove user from group
      const queryRes = query(collection(group, "Members"), where("member", "==", user))
      const querySnapshot = await getDocs(queryRes);
      deleteDoc(querySnapshot.docs[0].ref);

      // remove group from user
      const userGroup = query(collection(user, "Groups"), where("group", "==", group))
      const userGroupSnapshot = await getDocs(userGroup);
      deleteDoc(userGroupSnapshot.docs[0].ref);
    }
    catch (e) {
      console.error(e);
    }
  }

  /**
   * Adds a user's match from a particular group to their document about that group
   * 
   * @param group a reference to the group's document
   * @param user a reference to the user's document
   * @param matchedUser a reference to the document of the user's match
   */
  async assignMatch(group: DocumentReference, user: DocumentReference, matchedUser: DocumentReference) {
    // assign a match to a user in a group
    try {
      // find the document in the user's grouop collection that matches the group
      const queryRes = query(collection(user, "Groups"), where("group", "==", group))
      // add the matched user to the document
      const querySnapshot = await getDocs(queryRes);
      const currentGroup = querySnapshot.docs[0].ref;
      setDoc(currentGroup, { match: matchedUser }, { merge: true });
    }
    catch (e) {
      console.error(e);
    }
  }

  /**
   * Gets a reference to a user's match in a group
   * 
   * @param group a reference to the group's document
   * @param user a reference to the user's document
   * @returns returns the user's match in the group OR false if an error occurred
   */
  async getMatch(group: DocumentReference, user: DocumentReference) {
    // get a user's match in a group
    try {
      // find the document in the user's grouop collection that matches the group
      const queryRes = query(collection(user, "Groups"), where("group", "==", group))
      // get the matched user from the document
      const querySnapshot = await getDocs(queryRes);
      const currentGroup = querySnapshot.docs[0].ref;
      const groupData = (await getDoc(currentGroup)).data();
      const match = groupData ? groupData['match'] : false;
      return match;
    }
    catch (e) {
      console.error(e);
      return false;
    }
  }

  /// MISC ///
  /**
   * Generates a unique, random code for a group
   * 
   * @returns a string of 5 characters (lower case letters and numbers)
   */
  private generateGroupCode(): string {
    // function from Copilot and https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    const code: string = Math.random().toString(36).substring(2, 7);

    // check if the code is unique
    this.getGroupByCode(code).then(group => {
      if (group) {
        // if the code is not unique, generate a new one
        return this.generateGroupCode();
      } else {
        return code;
      }
    });
    return code;
  }

  /**
   * display a toast with an error message to the user
   * @param errorString 
   */
  async showErrorToast(errorMessage: string, duration: number = 10000) {
    const toast = await this.toastController.create({
      message: errorMessage,
      duration: duration,
    });
    toast.present();
  }

}
