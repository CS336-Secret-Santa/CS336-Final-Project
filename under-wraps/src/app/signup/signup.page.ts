import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  authService: AuthService = inject(AuthService);

  username: string = "";
  bio: string = "";
  email: string = "";
  password: string = "";

  constructor() { }

  ngOnInit() {
    void 0; // do nothing
  }

  validateSignup() {
    if (this.username === "") {
      this.authService.showAuthError("Please enter a username.");
      return;
    } else if (this.bio === "") {
      this.authService.showAuthError("Please enter a bio.");
      return;
    } else if (this.email === "") {
      this.authService.showAuthError("Please enter an email address.");
      return;
    } else if (this.password === "") {
      this.authService.showAuthError("Please enter a password.");
    } else {
      this.authService.signup(this.email, this.password, this.username, this.bio);
    }
  }
}
