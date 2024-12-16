import { Component, OnInit, inject } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service'; // to retreive the currently logged in user
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-group',
  templateUrl: './join-group.page.html',
  styleUrls: ['./join-group.page.scss'],
})
export class JoinGroupPage implements OnInit {
  firestoreService: FirestoreService = inject(FirestoreService);
  authService: AuthService = inject(AuthService);

  groupName: string = "";
  groupCode: string = "";

  constructor(private router: Router) { }

  ngOnInit() {
    void 0; // do nothing
  }

  async createGroup() {
    // create a new group
    const creatorRef = this.authService.currentUser;
    if (creatorRef) {
      const groupRef = await this.firestoreService.createGroup(this.groupName, creatorRef);
      if (groupRef) {
        const groupData = await this.firestoreService.convertRefToDocData(groupRef);
        if (groupData) {
          this.router.navigate([`/main/${groupData['code']}`]); // this page should also be restricted to authorized users
        } else {
          console.log("Group data not found.");
        }
      } else {
        console.log("Group reference not found.");
      }
    } else {
      // When a user cannot be found based on the id found in the auth service
      console.log(`No user found. Current user: ${this.authService.currentUser}`);
      this.firestoreService.showErrorToast("You must be logged in to create a group.");
    }
  }
  async joinGroup() {
    // join an existing group
    const creatorRef = this.authService.currentUser;
    if (creatorRef) {
      const success = await this.firestoreService.joinGroupByCode(this.groupCode, creatorRef);
      if (success) this.router.navigate([`/main/${this.groupCode}`]) // this page should also be restricted to authorized users
    } else {
      // When a user cannot be found based on the id found in the auth service
      console.log(`No user found. Current user: ${this.authService.currentUser}`);
      this.firestoreService.showErrorToast("You must be logged in to join a group.");
    }
  }
}
