import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  favoriteMovies: any[] = [];
  @Input() userData = { Name: '', Username: '', Password: '', Email: '', Birthday: '', };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

 /**
  *  get user will get all of the users data so we can display it. 
  *  get all movies will filter all of the movies id that are in the favorite movies array. 
 */
getUser(): void {
  this.fetchApiData.getUser().subscribe((response: any) => {
    console.log(this.user);
    this.user = response;
    this.userData.Username = this.user.Username;
    this.userData.Email = this.user.Email;
    try {
      this.user.Birthday = formatDate(this.user.Birthday, 'yyyy-MM-dd', 'en-US', 'UTC+0');
    } catch(e) {
      console.log(e);
    }
    // this.favoriteMovies(this.user.Movies)
    this.fetchApiData.getAllMovies().subscribe((response: any) => {
      this.favoriteMovies = response.filter((m: {_id: any }) => this.user.FavoriteMovies.indexOf(m._id) >= 0)
    })
  })
}

  /**
   * edit user will take the new user data and send it back to the db and set the localstorage 
   */
  editUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((data) => {
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('Username', data.Username);
      console.log(data);
      this.snackBar.open('User has been updated', 'OK', {
        duration: 2000
      })
      window.location.reload();
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      })
    });
  }


  
  /**
   *  delete user will delete their account permanently and be sent back to the welcome screen
   */
  deleteUser(): void {
    if (confirm('are you sure?')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'You have successfully deleted your account',
          'OK',
          {
            duration: 2000,
          }
        );
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
        localStorage.clear();
      });
    }
  }
}
