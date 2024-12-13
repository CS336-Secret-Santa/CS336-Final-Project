import { Component, OnInit, inject } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service'; // to retreive the currently logged in user

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

  constructor() { }

  ngOnInit() {
  }

  createGroup() {
    // create a new group
    const creatorRef = this.authService.currentUser;
    if (creatorRef) {
      const groupRef = this.firestoreService.createGroup(this.groupName, creatorRef);
    }
  }
  joinGroup() {
    // join an existing group
    // create a new group
    const creatorRef = this.authService.currentUser;
    if (creatorRef) {
      const groupRef = this.firestoreService.joinGroupByCode(this.groupCode, creatorRef);
    }
  }
}
