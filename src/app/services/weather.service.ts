import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError , tap} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(public http:HttpClient) { }

  getCurrentWeather(cityName: string): Observable<string> {
    return this.http.get<string>(environment.API+'/weather?q='+cityName+'&APPID='+ environment.apiKey)
    .pipe(
      tap(_ => console.log("fetched data for current weather"))
    );
  }

  getWeatherByLocation(lon: any,lat:any): Observable<string> {
    return this.http.get<string>(environment.API+'/onecall?lat='+lat+'&lon='+lon+'&exclude=hourly,minutely&APPID='+environment.apiKey)
    .pipe(
      tap(_ => console.log("fetched location data"))
    );
  }
}
