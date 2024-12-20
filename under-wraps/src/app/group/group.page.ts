import { Component, inject, OnInit } from '@angular/core';
import { collection, query, collectionData, DocumentData, DocumentReference, where  } from '@angular/fire/firestore';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {
  firestore: FirestoreService = inject(FirestoreService);
  auth: AuthService = inject(AuthService);
  router: Router = inject(Router);

  groupList: {ref: DocumentReference<DocumentData, DocumentData>, data:DocumentData}[] = [];
  currentUser = this.auth.currentUser;

  constructor() {
    // whenever the page is navigated to, update the group list
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getGroups();
      }
    });
  }

  /**
   * Update this.groupList to contain all the groups that the current user is a part of.
   * Similar to the getUsers method in main.page.ts
   */
  private async getGroups() {
    if (this.currentUser) {
      const groupQuery: DocumentData[] | false = await this.firestore.getGroupsByUser(this.currentUser);
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

  ngOnInit() {
    // this.getGroups();
    void 0;
  }

}
