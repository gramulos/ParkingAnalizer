/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('toastr', toastr)
        .constant('moment', moment)
        .constant('driveOptions', {
            ENTER_TO_PARKING: 'ENTER_TO_PARKING',
            LEAVE_PARKING: 'LEAVE_PARKING'
        })
        .constant('highchartConfig', {
            options: {
              chart: {
                type: 'spline'
              },
              plotOptions: {
                  spline: {
                      lineWidth: 2,
                      states: {
                          hover: {
                              lineWidth: 3
                          }
                      },
                      marker: {
                          enabled: false
                      }
                  }
              }
            },
            xAxis: {
                categories: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']
            },
            yAxis: {
                title: {
                    text: 'Count'
                },
                minorGridLineWidth: 0,
                gridLineWidth: 0,
                alternateGridColor: null
            },
            series: [{
                name: 'Cars',
                data: [65, 59, 80, 81, 56, 55, 40, 55, 66, 22, 0, 33]
            }],
            title: {
              text: 'Dependency graph of cars count on time'
            },
            credits: {
              enabled: true
            },
            loading: false,
            size: {}
        });
})();
