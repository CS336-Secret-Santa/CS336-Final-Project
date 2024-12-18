
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
  public disbandButtons = [
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

  public matchButtons = [
    {
      text: 'No',
      role: 'cancel', // Dismisses the alert when clicked
    },
    {
      text: 'Yes',
      handler: () => {
        console.log('Group matched');
        this.matchGroup();
      },
    },
  ];

  // Method for disbanding group
  async disbandGroup() {
    console.log('Performing group disband action...');
    const groupRef = await this.firestore.getGroupRefByCode(this.groupCode);
    if (groupRef) {
      this.firestore.deleteGroup(groupRef);
      this.router.navigate(['/group']);
    }
  }
  
 
  async matchGroup() {
    console.log('Performing group match action...');
    const data = this.userList;
    if (data.length < 2) {
        throw new Error("Array must have at least two elements to create matches.");
    }
    // extract the document references stored in Group/this-group-id/Members/member-id
    // const data: DocumentReference[] = userData.map((doc) => { return doc.data['member']; });

    // Create a shuffled copy of the array
    const shuffled = [...data];
    shuffled.sort(() => Math.random() - 0.5);

    // Ensure no element is mapped to itself
    for (let i = 0; i < data.length; i++) {
        if (data[i] === shuffled[i]) {
            // Swap with the next element (or the first element if it's the last one)
            const swapIndex = (i + 1) % data.length;
            [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
        }
    }

    // save matches
    const groupRef = await this.firestore.getGroupRefByCode(this.groupCode);
    if (groupRef) {
      for (let i = 0; i < data.length; i++) {
        const userRef = data[i].ref;
        const matchRef = shuffled[i].ref;
        this.firestore.assignMatch(groupRef, userRef, matchRef);
      }
    }
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
              return {ref: userRef, data: userRefData};
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
