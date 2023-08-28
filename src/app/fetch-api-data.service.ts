import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

const apiUrl = 'https://myflix-20778.herokuapp.com/';
@Injectable({providedIn: 'root' })

export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }

 // Making the api call for the user registration endpoint
  userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
    catchError(this.handleError)
    );
  }

  userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
    catchError(this.handleError)
    );
  }
  
//api call for all movies
getAllMovies(): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get<Response>(apiUrl + 'movies', {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}
//api call for one movie endpoint
getMovies(title: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get<Response>(apiUrl + 'movies/' + title, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

//api call for one director endpoint
getDirector(directorName: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get<Response>(apiUrl + 'movies/director' + directorName, {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
      map(this.extractResponseData),
    catchError(this.handleError)
  );
}
//api call for one genre endpoint
getGenre(genreName: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get<Response>(apiUrl + 'movies/genre' + genreName, {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
      map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// api call for the get one user endpoint
getUser(): Observable<any> {
  const userObj = localStorage.getItem('user');
  const userJson = JSON.parse(userObj || "{}");
  const username = userJson.Username;
  const token = localStorage.getItem('token');
  return this.http.get<Response>(apiUrl + 'users/' + username, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// api call for the edit user endpoint
editUser(updatedUser: any): Observable<any> {
  const username = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  return this.http.get<Response>(apiUrl + 'users/' + updatedUser, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

//api call delete user endpoint
deleteUser(): Observable<any> {
  const userid = localStorage.getItem('userid');
  const token = localStorage.getItem('token');
  return this.http.get<Response>(apiUrl + 'users' + userid, {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
      map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// api call for favorite movie endpoint issue 127-143
addFavoriteMovie(movieId: string): Observable<any> {
    const userObj = localStorage.getItem('user');
    const userJson = JSON.parse(userObj || "{}");
    const username = userJson.Username;
    const token = localStorage.getItem('token');
    return this.http.post<Response>(apiUrl + 'users/' + username + '/movies/' + movieId,
      {},
      {
        headers: new HttpHeaders(
          {
            Authorization: 'Bearer ' + token,
          })
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  getFavoriteMovie(movieId: string): Observable<any> {
    const userObj = localStorage.getItem('user');
    const userJson = JSON.parse(userObj || "{}");
    const username = userJson.Username;
    const token = localStorage.getItem('token');
    return this.http.get<Response>(apiUrl + 'users/' + username, 
            {
        headers: new HttpHeaders(
          {
            Authorization: 'Bearer ' + token,
          })
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

isFavoriteMovie(movieID: string): boolean {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.FavoriteMovies.indexOf(movieID) >= 0;
}

//api call for favorite movie endpoint
deleteFavoriteMovie(movieId: string): Observable<any> {
  const userObj = localStorage.getItem('user');
    const userJson = JSON.parse(userObj || "{}");
    const username = userJson.Username;
    const token = localStorage.getItem('token');
    return this.http
    .delete<Response>(apiUrl + 'users/' + username + '/movies/' + movieId,
            {
        headers: new HttpHeaders(
          {
            Authorization: 'Bearer ' + token,
          })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

// Non-typed response extraction
private extractResponseData(res: Response): any {
  const body = res;
  return body || { };
}

private handleError(error: HttpErrorResponse): any {
  if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
  }
  else if (error.error.errors) {
    return throwError(() => new Error(error.error.errors[0].msg));
  }
  else {
    console.error(
      `Error Status code ${error.status}, ` +
      `Error body is: ${error.error}`);
  }
  return throwError(() => new Error('Something bad happened; please try again later.'));
}
}
