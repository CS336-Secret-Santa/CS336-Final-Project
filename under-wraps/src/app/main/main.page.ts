
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentReference, DocumentData, getDocs } from '@angular/fire/firestore';
import { FirestoreService } from '../services/firestore.service';
import { collection, QuerySnapshot } from 'firebase/firestore';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  firestore: FirestoreService = inject(FirestoreService);
  auth: AuthService = inject(AuthService);

  groupCode: string = "code";
  groupData: DocumentData | false = false;
  isAdmin: boolean = false;
  userList: {ref: DocumentReference<DocumentData, DocumentData>, data:DocumentData}[] = [];
  router: Router = inject(Router);

  // Define the alert buttons as a class property
  public alertButtons = [
    {
      text: 'No',
      role: 'cancel', // Dismisses the alert when clicked
    },
    {
      text: 'Yes',
      handler: () => {
        console.log('Group disbanded');
        this.disbandGroup();
      },
    },
  ];

  // Method for disbanding group
  disbandGroup() {
    console.log('Performing group disband action...');
    // Add your disband logic here
  }


  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.groupCode = params['code'];
    });
    this.getUsers();
  }

  /**
   * Update this.userList to contain all the groups that the current user is a part of.
   * Similar to the getGroups method in group.page.ts
   */
  private async getUsers() {
    if (this.groupCode) {
      const groupQuery: DocumentData | false = await this.firestore.getGroupDataByCode(this.groupCode);
      if (groupQuery) {
        this.groupData = groupQuery;
        this.isAdmin = groupQuery['admin'].path === this.auth.currentUser?.path ? true : false;
        // create an array of user references (for this group)
        const groupRef: DocumentReference | false = await this.firestore.getGroupRefByCode(this.groupCode);
        if (groupRef) {
          const membersColl = collection(groupRef, 'Members');
          const memberSnapshot: QuerySnapshot = await getDocs(membersColl);
          // get objects with group references and data
          const userData = memberSnapshot.docs.map(async (doc) => {
            const userRef: DocumentReference = doc.data()['member'];
            
            if (userRef) {
              const userRefData = await this.firestore.convertRefToDocData(userRef);
              return {ref: doc.ref, data: userRefData};
            }
            return false;
          });
          // resolve promises to return either document data or false,
          // then filter out the false values 
          const filteredData = (await Promise.all(userData)).filter((doc) => {
            return doc !== false;
          });
          // For some reason, even after the filter, typescript was still uncertain about whether filteredData contained objects or "false" values.
          // Type assertion used to circumvent this issue
          this.userList = filteredData as {ref: DocumentReference<DocumentData, DocumentData>, data: DocumentData}[];
        }
      }   
    }
    else {
      console.log("No user logged in.");
      this.firestore.showErrorToast("No user logged in.");
    }
  }

}
