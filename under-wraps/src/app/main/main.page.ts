import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  // Define the alert buttons as a class property
  public alertButtons = [
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

  // Method for disbanding group
  disbandGroup() {
    console.log('Performing group disband action...');
    // Add your disband logic here
  }


  constructor() { }

  ngOnInit() {
    void 0; // do nothing
  }

}
