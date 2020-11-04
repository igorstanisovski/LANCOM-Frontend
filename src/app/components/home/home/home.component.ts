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

  constructor(private weatherService: WeatherService, private route:ActivatedRoute, private router:Router, private locationService:LocationService) { }

  ngOnInit(): void {
    this.getLocation();
    this.getCurrentWeather();
    this.getForecast();
  }

  async getCurrentWeather() {
    await this.weatherService.getCurrentWeather("maribor").subscribe(
      res => { 
        console.log(res);
        this.dataIsAvailable = true;
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
  async getForecast() {
    await this.weatherService.getWeatherForUpcomingDays("maribor").subscribe(
      res => { 

      },
      err => { console.log(err) }
    )
  }

  async getLocation() {
    await this.locationService.getPosition().then(pos => {
      console.log(`Positon: ${pos.lon} ${pos.lat}`);
      this.lat = pos.lat;
      this.lon = pos.lon;
    })
  }
}
