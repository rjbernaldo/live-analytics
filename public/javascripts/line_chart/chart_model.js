function ChartModel(){
  this.xVal = 0
  this.dataLength = 300
  this.holder = []
  this.series0 = []
  this.series1 = []
  this.series2 = []
  this.series3 = []
  this.series4 = []
  this.series5 = []
  this.chartObject = {
    data: [
      {markerType: "none", type: "line", dataPoints: this.series0, visible: true, color: "#4099FF", lineThickness: 4},
      {markerType: "none", type: "line", dataPoints: this.series1, visible: false, color: "#87DBFA", lineThickness: 4},
      {markerType: "none", type: "line", dataPoints: this.series2, visible: false, color: "#BCDBFD", lineThickness: 4},
      {markerType: "none", type: "line", dataPoints: this.series3, visible: false, color: "#4F7EB3", lineThickness: 4},
      {markerType: "none", type: "line", dataPoints: this.series4, visible: false, color: "#87CACF", lineThickness: 4},
      {markerType: "none", type: "line", dataPoints: this.series5, visible: false, color: "#66FFFF", lineThickness: 4}
    ],
    axisY: {minimum: 0, maximum: 10000, interval: 100, lineThickness: 0, labelFontColor: "white", tickThickness: 0, gridThickness: 0 },
    axisX: {minimum: 0, interval: 1, lineThickness: 0, labelFontColor: "black", tickThickness: 2, tickLength: 3, tickColor: 'white' },
    toolTip: {content: "#{name}<br>Number of Tweets: {y}"},
    backgroundColor: "black"
  }
}

ChartModel.prototype = {
  streamToHolder: function(data){
    this.holder.push(data)
  },

  populateSeries: function(updateInterval){
    for(var i = 0; i < this.holder[0].length; i++){
      (function(i){
        eval('this.series'+i).push({
          x: this.xVal,
          y: this.holder[this.holder.length-1][i].value,
          name: this.holder[this.holder.length-1][i]._id
        })
      }.bind(this))(i)
    }
    this.xVal = this.xVal+(updateInterval/1000)
  },

  updateYAxis: function(){
    var defaults = []
    for(var i = 0; i < this.holder[0].length; i++){
      if(this.chartObject.data[i].visible){
        for (var j = 0; j < this.chartObject.data[i].dataPoints.length; j++){
          defaults.push(this.chartObject.data[i].dataPoints[j].y)
        }
      }
    }
    this.calculateYAxisValues(defaults);
  },

  calculateYAxisValues: function(defaults){
    var visibleAxes = this.countVisibleAxes();
    if(visibleAxes >= 4){
      this.chartObject.axisY.minimum = Math.max(0, Math.min.apply(Math, defaults)-1000)
      this.chartObject.axisY.maximum = Math.max.apply(Math, defaults)+1000
    }else if(visibleAxes >= 2 && visibleAxes <= 3){
      this.chartObject.axisY.minimum = Math.max(0, Math.min.apply(Math, defaults)-300)
      this.chartObject.axisY.maximum = Math.max.apply(Math, defaults)+300
    }else{
      this.chartObject.axisY.minimum = Math.max(0, Math.min.apply(Math, defaults)-50)
      this.chartObject.axisY.maximum = Math.max.apply(Math, defaults)+50
    }
    this.chartObject.axisY.interval = parseInt((this.chartObject.axisY.maximum-this.chartObject.axisY.minimum)/4)
  },

  countVisibleAxes: function(){
    var count = 0;
    for(var i=0; i < this.holder[0].length; i++){
      if(this.chartObject.data[i].visible){
        count++
      }
    }
    return count
  },

  updateXAxis: function(){
    firstSeries = this.chartObject.data[0].dataPoints
    minX = []
    if(firstSeries.length > this.dataLength){
      for (var i = 0; i < firstSeries.length; i++){
        minX.push((firstSeries[firstSeries.length-1].x)-(this.dataLength/50))
      }
      this.chartObject.axisX.minimum = Math.min.apply(Math, minX)
    }
  },

  cleanHolder: function(){
    if (this.holder.length > 5000){
      for(var i = 0; i < 2000; i++){
        this.holder.shift();
      }
    }
  },

  cleanSeries: function(){
    for(var i = 0; i < this.holder[0].length; i++){
      if (eval("this.series"+i).length > 500){
        debugger
        for(var j = 0; j < 200; j++){
          eval("this.series"+i).shift();
        }
      }
    }
  }
}
