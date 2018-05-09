import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.css']
})
export class AdvertisementComponent implements OnInit {

  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  onMoveHostSetting() {
    this.router.navigate(['/host'])
  }

  onMoveStoreSetting() {
    this.router.navigate(['/setting'])
  }

  onTurnOnDebug() {
  }
}
