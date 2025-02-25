import { Component, inject, NO_ERRORS_SCHEMA, signal, ViewContainerRef } from '@angular/core'
import { NativeScriptCommonModule, NativeScriptRouterModule, RouterExtensions } from '@nativescript/angular'
import { ActionBarComponent } from '../../../shared/action-bar/action-bar.component';
import { MovieService } from '~/app/core/services/movie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '~/app/core/models/models';

@Component({
    selector: 'ns-movie-detail',
    templateUrl: './movie-detail.component.html',
    // styleUrls: ['./cart.component.css'],
    imports: [NativeScriptCommonModule, ActionBarComponent, NativeScriptRouterModule],
    schemas: [NO_ERRORS_SCHEMA],
  })
  export class MovieDetailComponent {

    //movieService = inject(MovieService)
    route = inject(ActivatedRoute)
    router = inject(Router)
    movie = signal<Movie>(null)
    highLight: number


    constructor(private movieServ: MovieService){}

    ngOnInit(): void {
      const id = +this.route.snapshot.params.id
      //this.movie.set(this.movieService.getMovie(id))
      this.getDetails(id)
      this.highLight = 0
    }

    setHighLight(rate: number){
      this.highLight = rate
    }
    
    rateBtn(){
      this.movieServ.rateMovie(this.highLight, this.movie().id).subscribe(
        result => this.getDetails(this.movie().id),
        err => console.log(err)
      )
    }

    getDetails(id: number){
      this.movieServ.getMovie(id)
    }

    editRate(){
      this.router.navigate(['/edit', this.movie().id])
    }

  }