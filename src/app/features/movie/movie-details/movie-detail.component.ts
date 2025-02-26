import { Component, inject, NO_ERRORS_SCHEMA, signal, ViewContainerRef } from '@angular/core'
import { NativeScriptCommonModule, NativeScriptRouterModule, RouterExtensions } from '@nativescript/angular'
import { ActionBarComponent } from '../../../shared/action-bar/action-bar.component';
import { MovieService } from '~/app/core/services/movie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '~/app/core/models/models';
import { getString } from '@nativescript/core/application-settings';
import { Dialogs } from '@nativescript/core';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
    selector: 'ns-movie-detail',
    templateUrl: './movie-detail.component.html',
    // styleUrls: ['./cart.component.css'],
    imports: [NativeScriptCommonModule, ActionBarComponent, NativeScriptRouterModule],
    schemas: [NO_ERRORS_SCHEMA],
  })
  export class MovieDetailComponent {

    route = inject(ActivatedRoute)
    router = inject(Router)
    movie: Movie
    highLight: number

    constructor(private movieServ: MovieService){}

    ngOnInit(): void {
      const myToken = getString('mr-token');
      console.log(myToken)
      if(myToken){
        const id = +this.route.snapshot.params.id
        this.getDetails(id)
        this.highLight = 0
      }else{
        this.getDialog('No credentials')
      }
    }

    setHighLight(rate: number){
      this.highLight = rate 
    }
    
    rateBtn(){
      this.movieServ.rateMovie(this.highLight, this.movie.id).pipe(
        map((res: any) => {
          return res.Result
        }),
        catchError(err => {
          console.error('Error occurred:', err);
          return throwError(() => new Error('Something went wrong!'));
        })
      ).subscribe(
        data => {
          this.movie = data
          this.getDetails(this.movie.id)
          console.log('Movie Id:', this.movie.id);
        },
        error => {
          console.error('Error in subscription:', error);
        }
      )
    }

    getDetails(id: number){
      this.movieServ.getMovie(id).subscribe(
        res => this.movie = res,
        //res => console.log(res),
        err => console.log(`Get Details: ${err.error.detail}`)
      )
    }

    editRate(){
      this.router.navigate(['/edit', this.movie.id])
    } 
 
    getDialog(message: string){
      Dialogs.alert({
        title: 'Alert!',
        message: `${message}`,
        okButtonText: 'OK',
        cancelable: true,
      })
    }

  }