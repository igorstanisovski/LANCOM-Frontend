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
  cityName: string;
  date: Date;
  currentTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  feelsLikeTemperature: number;
  currentHumidity: number;
  currentPressure: number;
  dataIsAvailable: boolean = false;
  weatherIcon: string;
  lon: number;
  lat: number;
  forecast: any[] = [];

  constructor(private weatherService: WeatherService, private route:ActivatedRoute, private router:Router, private locationService:LocationService) { }

  ngOnInit(): void {
    this.getCurrentWeatherByName();
    this.getLocation();
  }

  async getCurrentWeatherByName() {
    await this.weatherService.getCurrentWeather("maribor").subscribe(
      res => { 
        console.log(res);
        this.cityName = res['name'];
        this.date = new Date;
        this.currentTemperature = Math.floor(res['main']['temp'] - 273.15);
        this.maxTemperature = Math.floor(res['main']['temp_max'] - 273.15);
        this.minTemperature = Math.floor(res['main']['temp_min'] - 273.15);
        this.feelsLikeTemperature = Math.floor(res['main']['feels_like'] - 273.15);
        this.currentHumidity = res['main']['humidity'];
        this.currentPressure = res['main']['pressure'];
        this.weatherIcon = res['weather'][0]['icon'];
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
        }
        this.dataIsAvailable = true;
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
    this.dataIsAvailable = false;
    await this.getCurrentWeatherByName();
    this.forecast = [];
    await this.getWeatherByLocation(this.lon,this.lat);
  }
}
