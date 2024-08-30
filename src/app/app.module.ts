import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { ApiHeaderInterceptor } from './core/interceptors/api-header-interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: ApiHeaderInterceptor,
        multi: true,
      },
      // Other providers
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
