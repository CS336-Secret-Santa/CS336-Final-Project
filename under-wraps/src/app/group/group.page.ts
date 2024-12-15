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

  groups$: Observable<DocumentData[]>;
  groupList: DocumentReference[] = [];
  currentUser = this.auth.currentUser;

  constructor() { 
    if (this.currentUser) {
      
      const groupQuery = query(collection(this.currentUser, 'Groups'));
      this.groups$ = collectionData<DocumentData>(groupQuery);
    }
    else {
      console.log("No user logged in.");
      this.groups$ = EMPTY; // empty observable since no current user was found
    }
  }

  private async getGroups() {
    if (this.currentUser) {
      const groupQ = await this.firestore.getGroupsByUser(this.currentUser);
      if (groupQ) this.groupList = groupQ.map((doc) => {return doc['group']});
    }
  }

  ngOnInit() {
    this.getGroups();
  }

}
