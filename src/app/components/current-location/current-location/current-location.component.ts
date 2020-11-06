import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';
import { Router,ActivatedRoute } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-current-location',
  templateUrl: './current-location.component.html',
  styleUrls: ['./current-location.component.scss']
})
export class CurrentLocationComponent implements OnInit {
  weatherByLocation: any = {};
  lon: number;
  lat: number;
  dataIsAvailable: boolean = false;
  constructor(private weatherService: WeatherService, private route:ActivatedRoute, private router:Router, private locationService:LocationService) { }

  ngOnInit(): void {
    if(!this.dataIsAvailable){
      this.weatherByLocation = JSON.parse(localStorage.getItem('weatherByName'));
      if(this.weatherByLocation != null || this.weatherByLocation != undefined){
        this.dataIsAvailable = true;
      }
    }
    this.getLocation();
  }

  async getWeatherByLocation(lon: any, lat: any) {
    await this.weatherService.getWeatherByLocation(lon,lat).subscribe(
      res => { 
        console.log(res);
        var timezone = res['timezone'];
        var forecast = [];
        var iconsForecast = [];
        for(var i = 1;i <= 5;i++){
          forecast.push(res['daily'][i]);
          iconsForecast.push(res['daily'][i]['weather'][0]['icon']);
        }
        var currentWeather = {
          "date": new Date(res['current']['dt']*1000),
          "temperature": Math.floor(res['current']['temp'] - 273.15),
          "maxTemperature": Math.floor(res['daily'][0]['temp']['max'] - 273.15),
          "minTemperature": Math.floor(res['daily'][0]['temp']['min'] - 273.15),
          "feelsLike": Math.floor(res['current']['feels_like'] - 273.15),
          "humidity": res['current']['humidity'],
          "pressure": res['current']['pressure'],
          "icon": res['current']['weather'][0]['icon'],
          "clouds": res['current']['clouds'],
          "wind": res['current']['wind_speed']
        };
        this.weatherByLocation = {
          "currentWeather": currentWeather,
          "forecast": forecast,
          "iconsForecast": iconsForecast,
          "timezone": timezone
        };
        localStorage.setItem('weatherByLocation',JSON.stringify(this.weatherByLocation));
        this.dataIsAvailable = true;
      },
      err => { console.log(err) }
    )
  }

  async getLocation() {
    await this.locationService.getPosition().then(async pos => {
      await this.getWeatherByLocation(pos.lon,pos.lat);
      this.lat = pos.lat;
      this.lon = pos.lon;
    })
  }

  async Refresh() {
    await this.getWeatherByLocation(this.lon,this.lat);
  }
}
