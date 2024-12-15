import { Component, inject, OnInit } from '@angular/core';
import { collection, query, collectionData } from '@angular/fire/firestore';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import { Observable, EMPTY } from 'rxjs';
import { DocumentData, DocumentReference, where } from 'firebase/firestore';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {
  firestore: FirestoreService = inject(FirestoreService);
  auth: AuthService = inject(AuthService);

  // groups$: Observable<DocumentData[]>;
  groupList: {ref: DocumentReference<DocumentData, DocumentData>, data:DocumentData}[] = [];
  currentUser = this.auth.currentUser;

  constructor() { 
    // if (this.currentUser) {
      
    //   const groupQuery = query(collection(this.currentUser, 'Groups'));
    //   this.groups$ = collectionData<DocumentData>(groupQuery);
    // }
    // else {
    //   console.log("No user logged in.");
    //   this.groups$ = EMPTY; // empty observable since no current user was found
    // }
  }

  /**
   * Update this.groupList to contain all the groups that the current user is a part of.
   */
  private async getGroups() {
    if (this.currentUser) {
      const groupQuery: DocumentData[] | false = await this.firestore.getGroupsByUser(this.currentUser);
      // const filteredGroups = groupQuery.filter((doc) => {
      //   if (doc) {
      //     return doc;
      //   }
      // });
      if (groupQuery) {
        // get objects with group references and data
        const queryRes = groupQuery.map(async (doc) => {
          const groupRef: DocumentReference = doc['group'];
          const groupData = await this.firestore.convertRefToDocData(groupRef);
          if (groupData) {
            return {ref: groupRef, data: groupData};
          }
          return false;
        });
        // resolve promises to return either document data or false,
        // then filter out the false values 
        const filteredData = (await Promise.all(queryRes)).filter((doc) => {
          return doc !== false;
        });
        // For some reason, even after the filter, typescript was still uncertain about whether filteredData contained objects or "false" values.
        // Type assertion used to circumvent this issue
        this.groupList = filteredData as {ref: DocumentReference<DocumentData, DocumentData>, data: DocumentData}[];
      }   
    }
    else {
      console.log("No user logged in.");
      this.firestore.showErrorToast("No user logged in.");
    }
  }

  // async fetchDocumentDataWithReferences(
  // ): Promise<{ ref: DocumentReference, data: DocumentData | null }[]> {
  //   const docArray: DocumentData[] | false = await this.firestore.getGroupsByUser(this.currentUser);
  //   // If docArray is false, return an empty array
  //   if (!docArray) return [];
  
  //   // Use Promise.all to resolve the references and fetch their data
  //   const result = await Promise.all(
  //     docArray.map(async (doc: DocumentData) => {
  //       // Extract the reference from the document data (assuming it is in the 'group' field)
  //       const groupRef = doc['group'] as DocumentReference;
  
  //       // Fetch the data from the referenced document (using your custom function)
  //       const groupData = await this.firestore.convertRefToDocData(groupRef);
  
  //       // Return an object with the reference and the referenced data
  //       return {
  //         ref: groupRef,
  //         data: groupData || null,  // return null if no data is found
  //       };
  //     })
  //   );
  
  //   this.groupList = result;//await this.fetchDocumentDataWithReferences();//this.getGroups();

  //   return result;
  // }
  

  ngOnInit() {
    this.getGroups();
  }

}
