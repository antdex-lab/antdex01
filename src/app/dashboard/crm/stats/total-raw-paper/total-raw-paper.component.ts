import {Component, Input, ViewChild} from '@angular/core';

import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexStroke,
    ApexYAxis,
    ApexLegend,
    ApexGrid
} from "ng-apexcharts";

import { series } from "./data";
import { CustomizerSettingsService } from '../../../../customizer-settings/customizer-settings.service';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
    yaxis: ApexYAxis;
    labels: string[];
    colors: string[];
    legend: ApexLegend;
};

@Component({
    selector: 'app-total-raw-paper',
    templateUrl: './total-raw-paper.component.html',
    styleUrl: './total-raw-paper.component.scss'
})
export class TotalRawPaperComponent {

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    @Input()
    data: any;

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService
    ) {
        this.chartOptions = {
            series: [
                {
                    name: "New Users",
                    data: series.users
                }
            ],
            chart: {
                type: "area",
                height: 100,
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false
                }
            },
            colors: [
                "#ffb264"
            ],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: "smooth",
                width: 2
            },
            labels: series.dates,
            xaxis: {
                type: "datetime",
                axisBorder: {
                    show: false,
                    color: '#e0e0e0'
                },
                axisTicks: {
                    show: false,
                    color: '#e0e0e0'
                },
                labels: {
                    show: false,
                    style: {
                        colors: "#919aa3",
                        fontSize: "14px"
                    }
                },
                tooltip: {
                    enabled: false
                }
            },
            yaxis: {
                labels: {
                    show: false,
                    style: {
                        colors: "#919aa3",
                        fontSize: "14px"
                    }
                }
            },
            legend: {
                show: false
            },
            grid: {
                show: false,
                strokeDashArray: 5,
                borderColor: "#e0e0e0"
            }
        };
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

}
