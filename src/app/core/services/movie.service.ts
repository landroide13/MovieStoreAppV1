import { Injectable, signal } from '@angular/core'
import { Auth, Movie } from '../models/models'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { getString } from '@nativescript/core/application-settings';

@Injectable({
  providedIn: 'root',
})
export class MovieService {

    port2 = 8000;
    baseUrl = `http://127.0.0.1:${this.port2}/`;
    baseMovieUrl = `${this.baseUrl}api`;
    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    constructor(
        private httpClient: HttpClient,
        //private cookieService: CookieService
    ) { }

    getMovies() {
        return this.httpClient.get<Movie[]>(`${this.baseMovieUrl}/movies/`, {headers: this.getAuthHeaders()});
    }
    
    getMovie(id: number) {
        return this.httpClient.get<Movie>(`${this.baseMovieUrl}/movies/${id}/`, {headers: this.getAuthHeaders()});
    }

    createMovie(name: string, description: string) {
        const body = JSON.stringify({name, description});
        return this.httpClient.post(`${this.baseMovieUrl}/movies/`, body, {headers: this.getAuthHeaders()});
    }

    updateMovie(id: number, name: string, description: string) {
        const body = JSON.stringify({name, description});
        return this.httpClient.put(`${this.baseMovieUrl}/movies/${id}/`, body, {headers: this.getAuthHeaders()});
    }

    deleteMovie(id: number) {
        return this.httpClient.delete(`${this.baseMovieUrl}/movies/${id}/`, {headers: this.getAuthHeaders()});
    }
    
    rateMovie(rate: number, movieId: number) {
        const body = JSON.stringify({stars: rate});
        return this.httpClient.post(`${this.baseMovieUrl}/movies/${movieId}/rate_movie/`, body, {headers: this.getAuthHeaders()});
    }
    
    loginUser(authData: Auth) {
        const body = JSON.stringify(authData);
        return this.httpClient.post(`${this.baseUrl}auth/`, body, {headers: this.getAuthHeaders()});
    }
    
    registerUser(authData: Auth) {
        const body = JSON.stringify(authData);
        return this.httpClient.post(`${this.baseUrl}api/users/`, body, {headers: this.getAuthHeaders()});
    }
    
    getAuthHeaders() {
        const token = getString('mr-token');
        return new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        });
    }

}