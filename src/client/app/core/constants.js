(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('DriveOptions', {
            ENTER_TO_PARKING: 'ENTER_TO_PARKING',
            LEAVE_PARKING: 'LEAVE_PARKING'
        })
        .constant('TimeFormat', {
            rgFormat: /^([0-9]{2}:[0-9]{2})$/
        })
        .constant('Messages', {
            START_MESSAGE: 'Please select file to start.',
            FILE_IS_NOT_SELECTED: 'File is not selected.',
            FILE_IS_NOT_SUPPORTED: 'File is not supported. Text files supported only.',
            ANALIZE_SUCCESS: 'Analyze complete successfull.'
        })
        .constant('highchartConfig', {
            options: {
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
                },
                scrollbar : {
                    enabled : false
                },
                navigator: {
                    enabled: true,
                    adaptToUpdatedData: true
                },
                rangeSelector: {
                    inputEnabled: false,
                    buttonTheme: {
                        visibility: 'hidden'
                    },
                    labelStyle: {
                        visibility: 'hidden'
                    }
                }
            },
            yAxis: {
                plotLines: [{
                    value: 81,
                    color: 'red',
                    dashStyle: 'line',
                    width: 1,
                    label: {
                        text: 'Maximum cars count: 81'
                    }
                }],
                minorGridLineWidth: 0,
                gridLineWidth: 0,
                alternateGridColor: null
            },
            useHighStocks: true,
            series: [{
                name: 'Cars',
                data: [[1460973636622,65], [1460973736622,59], [1460973836622,80],
                       [1460973936622,81], [1460974036622,56], [1460974136622,55],
                       [1460974236622,40], [1460974336622,55], [1460974436622,66],
                       [1460974536622,22], [1460974636622,33], [1460974736622,0]],
                step: true
            }],
            title: {
                text: 'Dependency graph of cars count on time'
            }
        });
})();
