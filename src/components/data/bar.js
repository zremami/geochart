export default {
    title: {
        text: "" /*"Title"*/ ,
        left: "center",
        bottom: "bottom",
        textStyle: {
            fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
            fontSize: 14
        },
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        orient: "vertical",
        left: "left",
        data: []
    },
    grid: {
        left: '22%',
        right: '8%',
        bottom: '18%',
        containLabel: false
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            saveAsImage: { show: true }
        }
    },
    xAxis: [{
        type: 'category',
        axisTick: { show: false },
        data: [] /* [2012, 2013, 2014, 2015, 2016]*/
    }],
    yAxis: [{
        type: 'value',
        name: '' /*'Y Axis'*/ ,
    }],
    series: []
};