import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  groupCode: string = "code";

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


  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.groupCode = params['code'];
    });

  }

}
