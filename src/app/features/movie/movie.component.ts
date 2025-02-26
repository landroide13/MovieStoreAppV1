import { Component, inject, NO_ERRORS_SCHEMA, signal, ViewContainerRef } from '@angular/core'
import { NativeScriptCommonModule, NativeScriptRouterModule, RouterExtensions, NativeScriptHttpClientModule } from '@nativescript/angular'
import { ActionBarComponent } from '../../shared/action-bar/action-bar.component';
import { MovieService } from '../../core/services/movie.service';
import { Router } from '@angular/router';
import { Auth, Movie } from '~/app/core/models/models';
import { getString, setString, remove, clear } from '@nativescript/core/application-settings';

@Component({
    selector: 'ns-movie',
    templateUrl: './movie.component.html',
    // styleUrls: ['./cart.component.css'],
    imports: [NativeScriptCommonModule, ActionBarComponent, NativeScriptRouterModule, NativeScriptHttpClientModule],
    schemas: [NO_ERRORS_SCHEMA],
  })
  export class MovieComponent {

    movies: Movie[];
    router = inject(Router)
    routerEx = inject(RouterExtensions)
    public auth: Auth;

    constructor(private movieServ: MovieService){}

    ngOnInit(){
      const myToken = getString('mr-token');
      if(myToken){
        this.getMovies();
      }else{
        this.routerEx.navigate(['/auth'], { clearHistory: true, transition: { name: 'slideLeft' } })
      }
    }

    newMovie(){
      this.routerEx.navigate(['/edit', -1], { transition: { name: 'slideLeft' }})
    }

    logout(){
      remove('mr-token')
      clear()
      this.routerEx.navigate(['/auth'],  { clearHistory: true, transition: { name: 'slideLeft' } })
    }

    getMovies(){
      this.movieServ.getMovies().subscribe(
        (res: Movie[]) => { 
          console.log(`Movies: ${res}`)
          this.movies = res
        }
      )
    }

  }