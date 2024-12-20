import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { HomePage } from './home/home.page';
import { LoginPage } from './login/login.page';
import { GroupPage } from './group/group.page';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp({"projectId":"final-project-9a82e","appId":"1:438762030162:web:449690fc0ba9cd298f0b8b","storageBucket":"final-project-9a82e.firebasestorage.app","apiKey":"AIzaSyD_3UmErbnt4roCM7Bb9SubcNdbe-oaLIQ","authDomain":"final-project-9a82e.firebaseapp.com","messagingSenderId":"438762030162","measurementId":"G-YX8QD45LKP"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())],
  bootstrap: [AppComponent],
})
export class AppModule {}
