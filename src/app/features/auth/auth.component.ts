import { Component, NO_ERRORS_SCHEMA, inject } from '@angular/core'
import { NativeScriptCommonModule, NativeScriptFormsModule, NativeScriptRouterModule, RouterExtensions } from '@nativescript/angular'
import { Page } from '@nativescript/core'
import { Auth } from '~/app/core/models/models'
import { MovieService } from '~/app/core/services/movie.service';
import * as appSettings from '@nativescript/core/application-settings';
import { ActionBarComponent } from '../../shared/action-bar/action-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'ns-auth',
  templateUrl: './auth.component.html',
  imports: [NativeScriptCommonModule,NativeScriptRouterModule, ActionBarComponent, NativeScriptFormsModule],
  schemas: [NO_ERRORS_SCHEMA],
})

export class AuthComponent {

  public auth: Auth;
  public registerMode: boolean;
  routerA = inject(Router)

  constructor(private router: RouterExtensions, 
    private page: Page,
    private movieServ: MovieService
  ){}
    
    ngOnInit() {
      const myToken = appSettings.getString('mr-token');
      this.registerMode = false;
      if(myToken){
        this.router.navigate(['/movies'], { clearHistory: true })
      }else{
        this.auth = { username: '', password: '' , email: ''}
        console.log(`No token: ${JSON.stringify(this.auth)}`)
      }
    }

    changeMode(){
      this.registerMode = !this.registerMode
    }

    submit(){
      if(this.registerMode){
        this.movieServ.registerUser(this.auth).subscribe(
          (res: any) => {
            console.log(`Submit: ${res}`)
            this.loginFunction()
          },
          err => console.log(err.error)
        )
      }else{
       this.loginFunction();
      }
    }

    loginFunction(){
      this.movieServ.loginUser(this.auth).subscribe(
        (res: any) => {
          console.log(`Login`)
          appSettings.setString('mr-token', res.token),
          this.router.navigate(['/movies'], { clearHistory: true, transition: { name: 'slideLeft' } })
        },
        err => console.log(`ERROR: ${JSON.stringify(err)}`)
      )
    }
}