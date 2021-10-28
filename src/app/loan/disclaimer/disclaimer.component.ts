import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent implements OnInit {


  accept: boolean = false;
  constructor(private dataSrv: DataService, private router: Router) { }

  ngOnInit(): void {
  }

  send() {
    if (!this.accept) {
      return;
    }
    this.dataSrv.disclaimerAccepted = true;
    this.router.navigate(['/loan']);
  }
}
