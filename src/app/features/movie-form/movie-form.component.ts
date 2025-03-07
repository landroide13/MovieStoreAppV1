import { Component, inject, NO_ERRORS_SCHEMA, signal, ViewContainerRef } from '@angular/core'
import { NativeScriptCommonModule, NativeScriptFormsModule, NativeScriptRouterModule, RouterExtensions } from '@nativescript/angular'
import { ActionBarComponent } from '../../shared/action-bar/action-bar.component';
import { MovieService } from '../../core/services/movie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../core/models/models';

@Component({
    selector: 'ns-movie-form',
    templateUrl: './movie-form.component.html',
    // styleUrls: ['./cart.component.css'],
    imports: [NativeScriptCommonModule, 
            ActionBarComponent, 
            NativeScriptFormsModule,
            NativeScriptRouterModule],
    schemas: [NO_ERRORS_SCHEMA],
  }) 
  export class MovieFormComponent {

    movieService = inject(MovieService)
    movie: Movie = { name: '', description: '' }
    route = inject(ActivatedRoute)
    router = inject(RouterExtensions)
    movieName: string;

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id
        if(id >= 0){
            this.getDetails(id)
        }else{
            this.movie
        }
    }

    getDetails(id: number){
        this.movieService.getMovie(id).subscribe(
            res => this.movie = res,
            err => console.log(err)
        )
        this.movieName = this.movie.name
    }

    upDate(){
        this.movieService.updateMovie(this.movie.id, this.movie.name, this.movie.description).subscribe(
            result => this.router.navigate(['/movies'], { clearHistory: true }),
            err => console.log(err)
        )
    }

    create(){
        this.movieService.createMovie(this.movie.name, this.movie.description).subscribe(
            result => this.router.navigate(['/movies'], { clearHistory: true }),
            err => console.log(err.error)
        )
    }  

    delete(){
        this.movieService.deleteMovie(this.movie.id).subscribe(
            result => this.router.navigate(['/movies'], { clearHistory: true }),
            err => console.log(err)
        )
    }

    saveForm(){
       if(this.movie.id){
        this.upDate()
       }else{
        this.create()
       }
    }

  }