import { Component, inject, NO_ERRORS_SCHEMA, signal, ViewContainerRef } from '@angular/core'
import { NativeScriptCommonModule, NativeScriptFormsModule, NativeScriptRouterModule, RouterExtensions } from '@nativescript/angular'
import { ActionBarComponent } from '../../shared/action-bar/action-bar.component';
import { MovieService } from '../../core/services/movie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../core/models/models';
import { FormsModule } from '@angular/forms';

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
    movie = signal<Movie>({ name: '', description: '' })
    route = inject(ActivatedRoute)
    router = inject(Router)
    movieName: string;

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id
        if(id >= 0){
            this.getDetails(id)
        }else{
            this.movie()
        }
    }

    getDetails(id: number){
        this.movieService.getMovie(id)
        this.movieName = this.movie().name
    }

    updateMovieName(newName: string) {
        if (this.movie()) {
            this.movie.update(movie => ({ ...movie!, name: newName })); 
        }
    }

    updateMovieDescription(newDesc: string) {
        if (this.movie()) {
            this.movie.update(movie => ({ ...movie!, description: newDesc })); 
        }
    }

    upDate(){
        this.movieService.updateMovie(this.movie().id, this.movie().name, this.movie().description).subscribe(
            result => this.router.navigate(['/movies']),
            err => console.log(err)
        )
    }

    create(){
        this.movieService.createMovie(this.movie().name, this.movie().description).subscribe(
            result => this.router.navigate(['/movies']),
            err => console.log(err)
        )
    }

    delete(){
        this.movieService.deleteMovie(this.movie().id).subscribe(
            result => this.router.navigate(['/movies']),
            err => console.log(err)
        )
    }

    saveForm(){
       if(this.movie().id){
        this.upDate()
       }else{
        this.create()
       }
    }

  }