import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideServerRendering } from '@angular/platform-server';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

export default function bootstrap() {
  return bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),                          // Router
      provideHttpClient(withInterceptorsFromDi()),    // HttpClient
      provideServerRendering()
    ]
  });
}
