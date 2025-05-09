import { Component, ViewChild } from '@angular/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import {
    ChartComponent,
    ApexNonAxisChartSeries,
    ApexChart,
    ApexLegend,
    ApexDataLabels,
    ApexTooltip,
    ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: any;
    dataLabels: ApexDataLabels;
    stroke: ApexStroke;
    colors: string[];
    tooltip: ApexTooltip;
    legend: ApexLegend;
};

@Component({
    selector: 'app-core',
    templateUrl: './core.component.html',
    styleUrl: './core.component.scss'
})
export class CoreComponent {

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService
    ) {
        this.chartOptions = {
            series: [55, 30, 10, 5],
            chart: {
                width: 355,
                type: "pie"
            },
            stroke: {
                width: 2,
                show: true
            },
            labels: [
                "Email", "Social", "Call", "Others"
            ],
            legend: {
                show: false
            },
            dataLabels: {
                enabled: false,
                style: {
                    fontSize: '14px'
                },
                dropShadow: {
                    enabled: false
                }
            },
            colors: [
                "#00cae3", "#0e7aee", "#796df6", "#ffb264"
            ],
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + "%";
                    }
                }
            }
        };
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

}