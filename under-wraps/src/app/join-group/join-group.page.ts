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
  }

  createGroup() {
    // create a new group
    const creatorRef = this.authService.currentUser;
    if (creatorRef) {
      const groupRef = this.firestoreService.createGroup(this.groupName, creatorRef);
    }
    this.router.navigate(['/main']); // this page should also be restricted to authorized users
  }
  joinGroup() {
    // join an existing group
    const creatorRef = this.authService.currentUser;
    if (creatorRef) {
      const success = this.firestoreService.joinGroupByCode(this.groupCode, creatorRef);
    
      success ? this.router.navigate(['/main']) // this page should also be restricted to authorized users
      : this.firestoreService.showErrorToast(`Group with code "${this.groupCode}" not found.`); 
    } else {
      // When a user cannot be found based on the id found in the auth service
      console.log(`No user found. Current user: ${this.authService.currentUser}`);
      this.firestoreService.showErrorToast("ERROR: You must be logged in to join a group.");
    }
  }
}
