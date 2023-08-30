import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.scss']
})
export class MovieInfoComponent implements OnInit {
constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string,
      Description: string,
    }
  ) { }

  /**
   * This function calls specified methods automatically straight after Component was mounted
   */
  ngOnInit(): void { }
}
