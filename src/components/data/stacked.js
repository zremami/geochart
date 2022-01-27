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
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        }
    },
    legend: {
        orient: "vertical",
        left: "left",
        data: []
    },
    grid: {
        left: '20%',
        right: '15%',
        bottom: '12%',
        containLabel: true
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
    xAxis: {
        type: 'value',
        name: '' /*'X Axis'*/ ,
    },
    yAxis: {
        type: 'category',
        data: [] /*['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']*/
    },
    series: []
};