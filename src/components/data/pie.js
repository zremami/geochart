export default {
  textStyle: {
    fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
    fontSize: 10
  },
  title: {
    text: "" /*"Title"*/,
    left: "center",
    bottom: "bottom",
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)"  /*"Tooltip"*/
  },
  legend: {
    orient: "vertical",
    left: "left",
    data: [] /*["Direct", "Email", "Ad Networks", "Video Ads", "Search Engines"]*/
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
  series: [
    {
      name: "" /*"Traffic Sources"*/,
      type: "pie",
      center: ["60%", "50%"],
      data: [] /*[
        { value: 335, name: "Direct" },
        { value: 310, name: "Email" },
        { value: 234, name: "Ad Networks" },
        { value: 135, name: "Video Ads" },
        { value: 1548, name: "Search Engines" }
      ]*/,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
};
