import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { doc, collection, DocumentData, DocumentReference } from '@angular/fire/firestore';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-gift',
  templateUrl: './gift.page.html',
  styleUrls: ['./gift.page.scss'],
})
export class GiftPage implements OnInit {
  firestore: FirestoreService = inject(FirestoreService);
  auth: AuthService = inject(AuthService);
  router: Router = inject(Router);

  userId: string = "";
  giftInput: string = "";

  currentUser: DocumentReference | false = false;
  giftList: DocumentData[] = [];

  constructor(private route: ActivatedRoute) { 
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.currentUser = doc(collection(this.firestore.firestore, 'Users'), this.userId);
    });
    // whenever the page is navigated to, update the gift list
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // api call to get the gift list
        this.updateGiftList();
      }
    });
  }

  private updateGiftList() {
    if (this.currentUser) {
      const preferencesResult = this.firestore.getPreferences(this.currentUser);
      if (preferencesResult) {
        preferencesResult.then((doc) => {
          if (doc) {
            // if the result returned successfully, update the gift list
            this.giftList = doc;
          }
        });
      }
    }
  }

  addGift() {
    if (this.currentUser) {
      this.firestore.addPreference(this.currentUser, this.giftInput);
      this.giftInput = "";
      this.updateGiftList();
    }
  }

  ngOnInit() {
    void 0;
  }

}
