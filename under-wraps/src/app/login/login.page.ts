import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  authService: AuthService = inject(AuthService);

  email: string = "";
  password: string = "";

  constructor() { }

  ngOnInit() {
    void 0; // do nothing
  }
}