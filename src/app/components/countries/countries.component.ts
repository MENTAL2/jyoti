import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data : GlobalDataSummary[];
  countries : string[] = [];

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  dataTable = [];
  selectedCountryData : DateWiseData[];
  dateWiseData;
  chart = {
    LineChart: "LineChart",
    height : 500,
    options : {
      animation : {
        duration : 1000,
        easing : "out"
      },
      is3D: true
    }
  }
 

  constructor(private service : DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.service.getDateWiseData().pipe(
        map(result =>{
          this.dateWiseData = result;
          
        })
      ),
      this.service.getGlobalData().pipe(
        map((result: GlobalDataSummary[])  =>{
          this.data = result;
          this.data.forEach(cs => {
            this.countries.push(cs.country);
          })
        })
      )
    ).subscribe(
      {
        complete: () => {
         this.updateValues("Afghanistan");
        }
      }
    )
  }


updateChart(){
  this.dataTable = [];
  // dataTable.push(["Date", "Cases"])
  this.selectedCountryData.forEach(cs => {
    this.dataTable.push([cs.date, cs.cases])
  })
}

updateValues(country : string) {
  console.log(country);
  this.data.forEach(cs => {
    if(cs.country == country) {
      this.totalActive = cs.active;
      this.totalConfirmed = cs.confirmed;
      this.totalDeaths = cs.deaths;
      this.totalRecovered = cs.recovered;
    }
  })

  this.selectedCountryData = this.dateWiseData[country]
  this.selectedCountryData.reverse()
  this.updateChart();
  }

}