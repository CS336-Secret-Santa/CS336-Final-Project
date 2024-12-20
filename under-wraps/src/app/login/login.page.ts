import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  email: string = "";
  password: string = "";

  constructor() { }

  ngOnInit() {
    void 0; // do nothing
  }
}
