import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';
import { Router,ActivatedRoute } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  weatherByName: any = {};
  currentWeather: any = {};
  lon: number;
  lat: number;
  dataIsAvailable: boolean = false;

  constructor(private weatherService: WeatherService, private route:ActivatedRoute, private router:Router, private locationService:LocationService) { }

  ngOnInit(): void {
    if(!this.dataIsAvailable){
      this.weatherByName = JSON.parse(localStorage.getItem('weatherByName'));
      if(this.weatherByName != null || this.weatherByName != undefined){
        this.dataIsAvailable = true;
      }
    }
    this.getCurrentWeatherByName();
    this.getLocation();
  }

  async getCurrentWeatherByName() {
    await this.weatherService.getCurrentWeather("maribor").subscribe(
      res => { 
        //console.log(res);
        this.currentWeather = {
          "city": res['name'],
          "date": new Date(res['dt']*1000),
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
        this.weatherByName = JSON.parse(localStorage.getItem('weatherByName'));
        if(this.weatherByName == null || this.weatherByName == undefined){
          this.weatherByName = {
            "currentWeather": this.currentWeather
          }
        }
        else {
          this.weatherByName.currentWeather = this.currentWeather;
        }
        localStorage.setItem('weatherByName',JSON.stringify(this.weatherByName));
        
      },
      err => { console.log(err) }
    )
  }
  async getWeatherByLocation(lon: any, lat: any) {
    await this.weatherService.getWeatherByLocation(lon,lat).subscribe(
      res => { 
        //console.log(res);
        var forecast = [];
        var iconsForecast = [];
        for(var i = 1;i <= 5;i++){
          forecast.push(res['daily'][i]);
          iconsForecast.push(res['daily'][i]['weather'][0]['icon']);
        }
        this.weatherByName = {
          "currentWeather": this.currentWeather,
          "forecast": forecast,
          "iconsForecast": iconsForecast,
        };
        localStorage.setItem('weatherByName',JSON.stringify(this.weatherByName));
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
    await this.getCurrentWeatherByName();
    await this.getWeatherByLocation(this.lon,this.lat);
  }
}
