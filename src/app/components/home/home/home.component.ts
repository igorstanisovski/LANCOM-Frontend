import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';
import { Router,ActivatedRoute } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentWeather: any = {};
  lon: number;
  lat: number;
  forecast: any[] = [];
  dataIsAvailable: boolean = false;
  iconsForecast: any[] = [];
  forecastDates: any[] = [];

  constructor(private weatherService: WeatherService, private route:ActivatedRoute, private router:Router, private locationService:LocationService) { }

  ngOnInit(): void {
    if(!this.dataIsAvailable){
      this.currentWeather = JSON.parse(localStorage.getItem('currentWeather'));
      this.iconsForecast = JSON.parse(localStorage.getItem('iconsForecast'));
      this.dataIsAvailable = true;
    }
    this.getCurrentWeatherByName();
    this.getLocation();
    this.dataIsAvailable = true;
  }

  async getCurrentWeatherByName() {
    await this.weatherService.getCurrentWeather("maribor").subscribe(
      res => { 
        console.log(res);
        this.currentWeather = {
          "city": res['name'],
          "date": new Date,
          "temperature": Math.floor(res['main']['temp'] - 273.15),
          "maxTemperature": Math.floor(res['main']['temp_max'] - 273.15),
          "minTemperature": Math.floor(res['main']['temp_min'] - 273.15),
          "feelsLike": Math.floor(res['main']['feels_like'] - 273.15),
          "humidity": res['main']['humidity'],
          "pressure": res['main']['pressure'],
          "icon": res['weather'][0]['icon'],
          "clouds": res['clouds']['all'],
          "wind": res['wind']['speed']
        };
        localStorage.setItem('currentWeather',JSON.stringify(this.currentWeather));
      },
      err => { console.log(err) }
    )
  }
  async getWeatherByLocation(lon: any, lat: any) {
    await this.weatherService.getWeatherByLocation(lon,lat).subscribe(
      res => { 
        console.log(res);
        for(var i = 0;i < 5;i++){
          this.forecast.push(res['daily'][i]);
          this.iconsForecast.push(res['daily'][i]['weather'][0]['icon']);
          let date= new Date();
          this.forecastDates.push(date.setDate(date.getDate() + 1+ i));
        }
        //this.dataIsAvailable = true;
        localStorage.setItem('forecast',JSON.stringify(this.forecast));
        localStorage.setItem('iconsForecast',JSON.stringify(this.iconsForecast));
      },
      err => { console.log(err) }
    )
  }

  async getLocation() {
    await this.locationService.getPosition().then(pos => {
      this.getWeatherByLocation(pos.lon,pos.lat);
      this.lat = pos.lat;
      this.lon = pos.lon;
    })
  }

  async Refresh() {
    await this.getCurrentWeatherByName();
    this.forecast = [];
    await this.getWeatherByLocation(this.lon,this.lat);
  }
}
