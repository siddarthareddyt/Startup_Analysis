/**
 * Created by Siddartha on 4/8/2017.
 */

var selectedCounty = "All", selectedCategory = "All";
    //----------------------------------------------------new final code---------------------------------------------------------//
    //----------------------------------------------------filter options---------------------------------------------------------//

$( "#fundingSlider" ).slider({
	animate: "fast",
    min: 1,
    max:100,
    value: 10,
    create: function( event, ui ) {
        $( "#fundingAmount" ).val( "$" + 30 +"M");
    },
    slide: function( event, ui ) {
        $( "#fundingAmount" ).val( "$" + ui.value+"M");
    }

});

/*$( "#fundingSlider" ).slider( "option", "max", 100 );
$( "#fundingSlider" ).slider( "option", "min", 10 );
$( "#fundingSlider" ).slider( "option", "value", 50 );*/


$( "#dateRangeSlider" ).slider({
	animate: "fast",
    range:true,
    min:1980,
    max: 2015,
    values: [2000, 2010],
    create: function( event, ui ) {
        $( "#fromDateId" ).val(2000);
        $( "#toDateId" ).val(2010);
    },
    slide: function( event, ui ) {
        $( "#fromDateId" ).val(ui.values[0]);
        $( "#toDateId" ).val(ui.values[1]);
    }

});

function companyStatusChange(){
      var thresholdFund = $( "#fundingSlider" ).slider( "value" );
      var county = selectedCounty;
      var status = $("#statusFilter").val();
      var fromYear = $( "#dateRangeSlider" ).slider( "values", 0 );
      var toYear = $( "#dateRangeSlider" ).slider( "values", 1 );
      var category = selectedCategory;

      updateChoropleth(category, thresholdFund, status, fromYear, toYear);
      updateBarGraph(thresholdFund, status, county, fromYear, toYear);
      updateScatterPlot(category,status,county,fromYear,toYear);

}

function onThresholdChange(event, ui) {
      var thresholdFund = $( "#fundingSlider" ).slider( "value" );
      var county = selectedCounty;
      var status = $("#statusFilter").val();
      var fromYear = $( "#dateRangeSlider" ).slider( "values", 0 );
      var category = selectedCategory;
      var toYear = $( "#dateRangeSlider" ).slider( "values", 1 );

      updateChoropleth(thresholdFund, category, status, fromYear, toYear);
      updateBarGraph(thresholdFund, status, county, fromYear, toYear);
      updateScatterPlot(category, status, county, fromYear, toYear);


}

function onDatesChange(event, ui){
      var thresholdFund = $( "#fundingSlider" ).slider( "value" );
      var county = selectedCounty;
      var status = $("#statusFilter").val();
      var fromYear = $( "#dateRangeSlider" ).slider( "values", 0 );
      var category = selectedCategory;
      var toYear = $( "#dateRangeSlider" ).slider( "values", 1 );

      updateChoropleth(thresholdFund, category, status, fromYear, toYear);
      updateBarGraph(thresholdFund, status, county, fromYear, toYear);
      updateScatterPlot(category, status, county, fromYear, toYear);
}

function createGraphs(){
      var thresholdFund = $( "#fundingSlider" ).slider( "value" );
      var county = selectedCounty;
      var status = $("#statusFilter").val();
      var fromYear = $( "#dateRangeSlider" ).slider( "values", 0 );
      var toYear = $( "#dateRangeSlider" ).slider( "values", 1 );
      var category = selectedCategory;

      renderChoropleth(thresholdFund, category, status, fromYear, toYear);
      renderScatterPlot(category, status, county, fromYear, toYear);
      renderBarChart(thresholdFund, status, county, fromYear, toYear);

      $( "#fundingSlider" ).on( "slidechange", onThresholdChange);
      $( "#dateRangeSlider" ).on( "slidechange", onDatesChange);
}
//----------------------------------------------------new final code---------------------------------------------------------//
//-----------------------------------------------------javscript code for scatterplot........................................//


function renderScatterPlot(category, status, county, fromYear, toYear)
{
    var query = "/startupviz/graphs/companies/?category="+category+"&status="+status+"&county="+county+"&fromYear="+fromYear+"&toYear="+toYear;
    queue().defer(d3.json, query)
               .await(createScatterPlot);
}
function updateScatterPlot(category,status,county,fromYear,toYear)
{

    console.log("updating scatter plot");
    queue().defer(d3.json, "/startupviz/graphs/companies/?category="+category+"&status="+status+"&county="+county+"&fromYear="+fromYear+"&toYear="+toYear)
               .await(createScatterPlot);
    }
function createScatterPlot(error, data)
{
  color_navigator = 'true';
  d3.select('#scatterplot_id').remove();
	var margin = { top: 0, right: 5, bottom: 30, left: 100 },
    outerWidth = 860,
    outerHeight = 300,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;
var x = d3.scaleLinear()
    .range([0, width]).nice();

var y = d3.scaleLinear()
    .range([height, 0]).nice();

var xlabel = "funding_rounds",
	scatterp_size = "Number_of_Investors",
	ylabel = "funding_total_usd"
	category = "category_list";

	data.forEach(function(d) {
  	d.Number_of_Investors = +d.Number_of_Investors;
    d.funding_rounds = +d.funding_rounds;
    d["funding_total_usd"] = +d["funding_total_usd"];
  });

var xValue = function(d){ return d.funding_rounds;};
	yValue = function(d){ return d.funding_total_usd;};

var xMin = d3.min(data, xValue)* (-1),
	xMax = d3.max(data, xValue)*1.05,
	yMin = d3.min(data, yValue) * (-1.5),
	yMax = d3.max(data, yValue)*1.05;

  x.domain([xMin , xMax]);
  y.domain([yMin, yMax]);


  var xAxis = d3.axisBottom()
      .scale(x)
      .tickSize(-height);

  var yAxis = d3.axisLeft()
      .scale(y)
      .tickSize(-width);

   var color = d3.scaleOrdinal(d3.schemeCategory20);

  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "<b>Name" + ": </b>" + d.name + "<br>" +
				"<b>Funding Amount: </b>" + d.funding_total_usd + "<br>" +
				"<b>Funding rounds: </b>" + d.funding_rounds + "<br>" +
				"<b>Inverstors: </b>" + d.Investors + "<br>" +
				"<b>Number of Investors: </b>" + d.Number_of_Investors;
      });


var zoom = d3.zoom()
    .scaleExtent([0.2, 10])
    .on("zoom", zoomFunction);

var scatterSvg = d3.select(".scatterchart")
                     .append("svg");

    scatterSvg.attr('id', 'scatterplot_id')
      .attr("width", outerWidth)
      .attr("height", outerHeight)
      .style("background-color",'white')
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom);

    scatterSvg.call(tip);

  scatterSvg.append("rect")
      .attr("width", width)
      .attr("height", height)
            .style("fill", "#E9E9E9");


  scatterSvg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class","label")
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .attr("fill", "black")
      .text(xlabel);

  scatterSvg.append("g")
      .classed("y axis", true)
      .call(yAxis)
	  .append("text")
      .attr("class","label")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(ylabel)
      .attr("fill", "black")
	  .selectAll("text")
            .style("text-anchor", "end")
            //.style("fill",'white')
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)"
                });

    var objects = scatterSvg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);


  sdot = objects.selectAll(".dot")
      .data(data)
    .enter().append('g');

    sdot.append("circle")
      .classed("dot", true)
      .attr("r", function (d) { return 10 * Math.sqrt(d[scatterp_size] / Math.PI); })
      .attr("transform", transform)
      .style("fill", function(d) { return color(d[category]); })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
      .on("click", function(d)
      {
        tip.hide(d);
        if(color_navigator == 'true')
        {
        d3.selectAll('circle.dot')
          .style('fill','#9cc1e5');
          d3.select(this)
          .style('fill','#0F5598');
          color_navigator = 'false';
          //console.log(color_navigator+" first block");

            var thresholdFund = $( "#fundingSlider" ).slider( "value" );
            selectedCategory = d.category_list;
      var county = d.county;
      var status = $("#statusFilter").val();
      var fromYear = $( "#dateRangeSlider" ).slider( "values", 0 );
      var toYear = $( "#dateRangeSlider" ).slider( "values", 1 );

          updateChoropleth(selectedCategory, thresholdFund, status, fromYear, toYear);
        }
        else
        {
          d3.selectAll('circle.dot')
          .style("fill", function(d) { return color(d[category]); });
          color_navigator = 'true';


            var thresholdFund = $( "#fundingSlider" ).slider( "value" );
                      selectedCategory = "All";
      var status = $("#statusFilter").val();
      var fromYear = $( "#dateRangeSlider" ).slider( "values", 0 );
      var toYear = $( "#dateRangeSlider" ).slider( "values", 1 );

          updateChoropleth(selectedCategory, thresholdFund, status, fromYear, toYear);
        }
      })
      .append("text")
      .text(function(d){return d.name;})
      .attr('x', function(d){
       // console.log(x(d.funding_rounds));
          return x(d.funding_rounds);})
      .attr('y', function(d){return y(d["funding_total_usd"])});

        function zoomFunction() {
    var transform = d3.zoomTransform(this);
    scatterSvg.select(".x.axis").call(xAxis.scale(d3.event.transform.rescaleX(x)));
    scatterSvg.select(".y.axis").call(yAxis.scale(d3.event.transform.rescaleY(y)));
    d3.selectAll(".dot")
        .attr("transform", transform);
   // console.log(x);
    }
	function transform(d) {
    //return  "translate(" + x(d.funding_rounds) + "," + y(d.funding_total_usd) + ") scale(" + d.k + ")";
        console.log( "hello");
      return "translate(" + x(d.funding_rounds) + "," + y(d.funding_total_usd) + ")";
  }
}

//----------------------------------------------------new final code---------------------------------------------------------//
//----------------------------------------------------javascript code for bar chart------------------------------------------//

var width = 500, barHeight = 25, barPadding = 3, textY = 16;

var margins = {
                top:0,
                bottom:0,
                left:140,
                right:0
              };

  var x = d3.scaleLinear()
          .range([0,width - margins.left])
          .domain([0,100]);

var percentKeys = [], countKeys = [];

var colors = ['#588E98','#709875'];
var brightColors = ['#0F5598', '#2A9827'];
var color_all = true;
var barSvg;


function renderBarChart(threshold, status, county, fromYear, toYear){

barSvg = d3.select(".chart")
            .append("svg");
        var query = "/startupviz/barchart/categories/?threshold="+threshold+"&status="+status+"&county="+county+"&fromYear="+fromYear+"&toYear="+ toYear;
        queue().defer(d3.json, query)
               .await(createBarChart);
}

function updateBarGraph(threshold, status, county, fromYear, toYear){
  percentKeys = [];
  countKeys = [];

  barSvg.remove();
  $('.swatch').remove();
  barSvg = d3.select(".chart")
            .append("svg");
  queue().defer(d3.json, "/startupviz/barchart/categories/?threshold="+threshold+"&status="+status+"&county="+county+"&fromYear="+fromYear+"&toYear="+toYear)
               .await(createBarChart);
}

function createBarChart(error, data){
//d3.select('#barchart_id').remove();
  data = getPercentages(data);

  data = addAll(data, countKeys);

  data = sortData(data, percentKeys);

    barSvg.attr("width", width)
            .attr('id','barchart_id')
            .style('fill', 'black');


  $('.legend').css('margin-left', margins.left);
  countKeys.forEach(function(countKey,i){
    $('.legend').append('<div class="swatch" style="background:' + colors[i] + '"></div>' + countKey);
  });

  // now that the data is ready, calculate the height
  var height = (data.length * barHeight) + (barPadding * 3);

  barSvg.attr("height", height);

  barSvg.selectAll('.label')
     .data(data,function(d) {
                    return d.category_list;
          })
     .enter()
     .append('text')
     .attr('class', function(d){
                       var label;
                       d.category_list == 'total' ? label = 'label strong' : label = 'label';
                       return label;
                    })
     .attr('x', margins.left)
     .attr('y', function(d,i){ return padding(d,i); })
     .attr('dy', textY)
     .attr('text-anchor', 'end')
      .style('font', 'bold 15px sans-serif')
     .text(function(d){ return d.category_list.charAt(0).toUpperCase() + d.category_list.slice(1); });

    var tip = d3.select("#barChart")
              .append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);

  percentKeys.forEach(function(key,i){

    barSvg.selectAll('.bar .' + key)
       .data(data,function(d) {
                    return d.category_list;
          })
       .enter()
       .append('rect')
       .attr('class', 'bar ' + key)
       .attr('width', function(d,i){ return x(d[key]); })
       .attr('height', barHeight - barPadding)
       .attr('x', function(d){ return widths(percentKeys,key,d); })
       .attr('y', function(d,i){ return padding(d,i); })
       .on("mouseover", function(d) {
                        if(color_all){
                                d3.select(this)
                                  .style('fill', brightColors[i]);
                        }
                            barSvg.selectAll('.label')
                               .filter(function(text) {
                                   return text.category_list===d.category_list.charAt(0).toUpperCase() + d.category_list.slice(1);
                               })
                               .transition().duration(100).style('font','bold 20px sans-serif');
       }).on("mouseout", function(d) {
                    if(color_all) {
                        d3.select(this)
                            .transition()
                            .duration(250)
                            .style("fill", colors[i]);
                    }
                              barSvg.selectAll('.label')
                               .filter(function(text) {
                                   return text.category_list===d.category_list.charAt(0).toUpperCase() + d.category_list.slice(1);
                               })
                               .transition().duration(100).style('font','bold 15px sans-serif');
       }).on("click", function(d){
        if(color_all == true)
       {

         d3.select(this)
         .style('fill', brightColors[i]);

         color_all = false;

                selectedCategory = d.category_list;

      var thresholdFund = $( "#fundingSlider" ).slider( "value" );
      var county = selectedCounty;
      var status = $("#statusFilter").val();
      var fromYear = $( "#dateRangeSlider" ).slider( "values", 0 );
      var toYear = $( "#dateRangeSlider" ).slider( "values", 1 );
        console.log("clicked bar");
          updateChoropleth(selectedCategory, thresholdFund, status, fromYear, toYear);
      updateScatterPlot(selectedCategory,status,county,fromYear,toYear);

       }
       else
       {

         d3.selectAll('rect.bar.belowpercent')
         .style("fill", colors[0]);
         d3.selectAll('rect.bar.abovepercent')
         .style("fill", colors[1]);
         color_all = true;

               var thresholdFund = $( "#fundingSlider" ).slider( "value" );
      var county = selectedCounty;
      var status = $("#statusFilter").val();
      var fromYear = $( "#dateRangeSlider" ).slider( "values", 0 );
      var toYear = $( "#dateRangeSlider" ).slider( "values", 1 );

          updateChoropleth("All", thresholdFund, status, fromYear, toYear);
      updateScatterPlot("All",status,county,fromYear,toYear);
       }





       });

    d3.selectAll('.' + key)
      .style('fill', colors[i]);

    barSvg.selectAll('.bar-label .' + key)
       .data(data,function(d) {
                    return d.category_list;
          })
       .enter()
       .append('text')
       .attr('class', 'bar-label ' + key)
       .attr('x', function(d){
                        var barX;
                        key !== percentKeys[percentKeys.length-1] ? barX = widths(percentKeys,key,d) + 5 : barX = width - 5;
                        return barX;
            })
       .attr('dy', textY)
       .attr('y', function(d,i){ return padding(d,i); })
       .attr('text-anchor', function(d){
                                var ta;
                                key == percentKeys[percentKeys.length-1] ? ta = 'end' : ta = 'start';
                                return ta;
            })
       .text(function(d){
                    var text;
                    d[key] < 5 ? text = '' : text = Math.round(d[key]) + pct(d, data[0].category_list, data[data.length-1].category_list);
                    return text;
        });

  });

}


function padding(d,i){
  var barI;
  d.category_list == 'total' ? barI = i * barHeight + (barPadding * 2) : barI = i * barHeight;
  return barI;
}

function pct(d, first, last){
  var extra;
  d.category_list == first || d.category_list == last ? extra = '%' : extra = '';
  return extra;
}

function widths(keys,key,d){

  if (key == keys[0]) {
    return margins.left+20;
  } else if (key == keys[1]){
    return margins.left +20+ x(d[keys[0]]);
  }

}

function getPercentages(data) {
   for(var m =0; m<data.length;m++){
        arra=[];
        _.keys(data[m]).forEach(function(d,i){
        if (i!==2){
            arra.push(+data[m][d]);
            data[d] = +data[d];
        }
    });
   var sum = arra.reduce(function(a,b){return a+b}, 0);

    _.keys(data[m]).forEach(function(k,i){
                        i !== 2 ? data[m][k + 'percent'] = +data[m][k]/sum*100 : null;
                    });
    }


  _.keys(data[0]).forEach(function(d,i){
    if (d !="category_list"){
        d.includes('percent') ? percentKeys.push(d) : countKeys.push(d);
    }
  });
    return data;
}

function sortData(data, percentKeys) {
  var sortedData = _.sortBy(data,percentKeys[0]).reverse(), total = _.where(sortedData,{category_list:'total'}), rem = _.reject(sortedData,{category_list:'total'}), dat = [];
  rem.forEach(function(r){ dat.push(r); });
  dat.push(total[0]);
  return dat;
}

function addAll(data,keys){

  var total = {};
  var arrayA = [];
  keys.forEach(function(key){
    var arrayB = [];
    data.forEach(function(d){
      arrayB.push(d[key]);
    })
    var sumB = arrayB.reduce(function(a,b){ return a+b }, 0);
    total[key] = sumB;
    arrayA.push(sumB);
  })

  var sumA = arrayA.reduce(function(a,b){ return a+b }, 0);

  keys.forEach(function(key){
    total[key + 'percent'] = total[key] / sumA * 100;
  });

  total.category_list = 'total';

  data.push(total);

  return data;
}

//----------------------------------------------------javascript code for choropleth graph------------------------------------------//

var net_worth_thresh;
var prev_county_color;
var prev_county_color_clicked;

var active = d3.select(null);
var isFocused = false;
var chosenEl;

var choroSvg;
var choroPath;
var choroColor;
var choroMap;
var choroWidth=900;
var choroHeight=500;

var chorog;
var globalJson;
var statenums=[];


function renderChoropleth(threshold, category, status, fromYear, toYear){

    choroMap = d3.select("#choroPleth")
            .append("svg");

    choroColor = d3.scaleQuantize()
                    .range(["rgba(225,0,12,0.2)", "rgba(240,115,134,0.2)",
                     "rgba(208,205,229,0.2)", "rgba(133,168,208,0.2)", "rgba(9,92,162,0.2)"]);
    net_worth_thresh = threshold;

    var query = "/startupviz/graphs/companies/?category="+category+"&status="+status+"&county=All&fromYear="+fromYear+"&toYear="+toYear;
            queue().defer(d3.json, query)
                .defer(d3.json, "/startupviz/statenums")
                .defer(d3.json, "/startupviz/uscounties")
                .await(createChoropleth);
}

function updateChoropleth(threshold, category, status, fromYear, toYear){
    choroMap.remove();
    choroMap = d3.select("#choroPleth")
            .append("svg");


    choroColor = d3.scaleQuantize()
                    .range(["rgba(225,0,12,0.2)", "rgba(240,115,134,0.2)",
                     "rgba(208,205,229,0.2)", "rgba(133,168,208,0.2)", "rgba(9,92,162,0.2)"]);

    net_worth_thresh = threshold;
    active = d3.select(null);
    isFocused = false;
    chosenEl = null;
    var query = "/startupviz/graphs/companies/?category="+category+"&status="+status+"&county=All&fromYear="+fromYear+"&toYear="+toYear;
    queue().defer(d3.json, query)
           .await(updateChoro);
}

function updateChoro(error, dat){


data=[];

dat.forEach(function(d){
    if(d.Coordinates == "-1") {
        var lat = 0;
        var lon = 0;
    } else {
        var lat = d.Coordinates.split(":")[0];
        var lon = d.Coordinates.split(":")[1];
    }
    var obj= {
        name: d.name,
        category: d.category_list,
        status: d.status,
        state: d.state_code,
        city: d.city,
        networth: +d.funding_total_usd,
        founded: +d.founded_at,
        county: d.county,
        lat: +lat,
        lon: +lon
    };
    data.push(obj);
});

var county_freq=[];
var county_averages=[];

console.log("update choro:", data);

var projection = d3.geoAlbersUsa()
    .translate([choroWidth/2,choroHeight/2])
                   .scale(1000);


    choroMap.attr("height", choroHeight)
            .attr("width",choroWidth)
            .on("click", stopped, true)

choroPath = d3.geoPath().projection(projection);
choroSvg = d3.select("#choroPleth")
            .select("svg");

choroSvg.append("rect")
    .attr("class", "background")
    .attr("width",choroWidth)
    .attr("height",choroHeight)
    .on("click", reset);

chorog = choroSvg.append("g")
    .style("stroke-width", "1.5px");

var panel = d3.select("#choroPleth")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity",0);


for(i=0; i<data.length; i++) {
    var val = county_freq.find(function (curr_val) {
        return (curr_val.countyName == data[i].county) && (curr_val.state == data[i].state);
    });
    if (val != undefined) {
        val.num++;
    } else {
        county_freq.push({countyName: data[i].county, state: data[i].state, num: "1"});
    }
}

    for(i=0; i<data.length; i++) {
        var val = county_averages.find(function(curr_val) {
            return (curr_val.countyName == data[i].county) && (curr_val.state ==  data[i].state);
        });
        if(val != undefined) {
            val.networths.push(data[i].networth);
        } else {
            county_averages.push({countyName:data[i].county, state:data[i].state, networths:[data[i].networth]});
        }
    }

        for(i=0; i<county_averages.length; i++) {
        var sum=0;
        for(j=0; j<county_averages[i].networths.length; j++) {
            sum+=county_averages[i].networths[j];
        }
        county_averages[i].average_val = sum/county_averages[i].networths.length;
        delete county_averages[i].networths;
    }
    choroColor.domain([
        d3.min(county_averages, function(d) { return d.average_val}),
        net_worth_thresh,
        d3.max(county_averages, function(d) { return d.average_val})
    ]);



for (var i = 0; i < county_averages.length; i++) {
            //Grab state name
            var county_name = county_averages[i].countyName;
            var state_name = county_averages[i].state;

            //Find the corresponding state inside the GeoJSON
            for (var j = 0; j < globalJson[0].features.length; j++) {
                var jsonCounty = globalJson[0].features[j].properties.NAME;
                var jsonState = globalJson[0].features[j].properties.STATE;
                if (county_name == jsonCounty && state_name == jsonState) {
                    //Copy the data value into the JSON
                    globalJson[0].features[j].properties.value = county_averages[i].average_val;
                    //Stop looking through the JSON
                    break;
                }
            }
        }

        chorog.selectAll("path")
            .data(globalJson[0].features)
            .enter()
            .append("path")
            .attr("d",choroPath)
            //.attr("class", "feature")
            .style("fill", function(d) {
                return (d.properties.value?choroColor(d.properties.value):"#eee");
            })
            .on("click", clicked)
            .on("mouseover", function(d) {
                var sel = d3.select(this);
                prev_county_color = (d.properties.value ? choroColor(d.properties.value): "#eee");

                //change color so opacity is higher
                var temp = prev_county_color.split(",");
                temp[temp.length-1] = "0.9)";
                if(!isFocused) {
                    if(prev_county_color != "#eee") {
                        sel.style("fill",temp.join(","));
                    } else {
                        sel.style("fill","#ccc");
                    }
                } else {
                    if(chosenEl != this) {
                        if(prev_county_color != "#eee") {
                            sel.style("fill",temp.join(","));
                        } else {
                            sel.style("fill","#ccc");
                        }
                    }
                }


                //get county name, state, county average, number of companies in county, and (todo) categories in county
                var cName = d.properties.NAME;
                var state = d.properties.STATE;
                var compfreq;
                var networthavg;

                var freqval = county_freq.find(function (curr_val) {
                         return (curr_val.countyName == cName) && (curr_val.state == state);
                })
                if(freqval != undefined) {
                    compfreq = freqval.num;
                } else {
                    compfreq = "undefined";
                }

                var avgval = county_averages.find(function (curr_val) {
                         return (curr_val.countyName == cName) && (curr_val.state == state);
                });

                if(avgval != undefined) {
                    networthavg = avgval.average_val;
                } else {
                    networthavg = "undefined";
                }

                //show tooltip for each county
                panel.transition()
                    .duration(200)
                    .style("opacity", 0.8);
                panel.html("<h5>"+cName+", "+state+"</h5>" +
                        "<i>Average Total Funding: $</i>"+networthavg + "<br/>" +
                           +compfreq + " startups <br/>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px")
            })
            .on("mouseout", function(d) {
                //set back the previous color
                var sel = d3.select(this);
                var temp = prev_county_color.split(",");
                temp[temp.length-1] = "0.9)";

                if(!isFocused) {
                    sel.style("fill", prev_county_color);
                } else {
                    if(chosenEl == this) {
                        sel.style("fill", temp.join(","));
                    } else {
                        sel.style("fill", prev_county_color);
                    }
                }

                //turn off tooltip
                panel.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        chorog.selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("cx", function(d) {
               if(d.lon == 0 || d.lat == 0) {
                   return 0;
               } else {
                   return projection([d.lon, d.lat])[0];
               }
           })
           .attr("cy", function(d) {
                if(d.lon == 0 || d.lat == 0) {
                   return 0;
               } else {
                   return projection([d.lon, d.lat])[1];
               }
           })
           .attr("r", 2)
           .style("fill", function(d) {
               return (net_worth_thresh > d.networth ? "rgb(154,154,154)" : "rgb(255, 251, 155)");
           })
           .style("opacity", 0.9);

}




function createChoropleth(error, dat, statenumsData, json){

data=[];

dat.forEach(function(d){
    if(d.Coordinates == "-1") {
        var lat = 0;
        var lon = 0;
    } else {
        var lat = d.Coordinates.split(":")[0];
        var lon = d.Coordinates.split(":")[1];
    }
    var obj= {
        name: d.name,
        category: d.category_list,
        status: d.status,
        state: d.state_code,
        city: d.city,
        networth: +d.funding_total_usd,
        founded: +d.founded_at,
        county: d.county,
        lat: +lat,
        lon: +lon
    };
    data.push(obj);
});

statenumsData.forEach(function (d) {
    var obj = {
        state: d.State,
        number: d.Number
    };
    statenums.push(obj);
});

var county_freq=[];
var county_averages=[];

console.log("create choro:", data);

var projection = d3.geoAlbersUsa()
    .translate([choroWidth/2,choroHeight/2])
                   .scale(1000);


            choroMap.attr("height", choroHeight)
            .attr("width",choroWidth)
            .on("click", stopped, true)

choroPath = d3.geoPath().projection(projection);
choroSvg = d3.select("#choroPleth")
            .select("svg");

choroSvg.append("rect")
    .attr("class", "background")
    .attr("width",choroWidth)
    .attr("height",choroHeight)
    .on("click", reset);

chorog = choroSvg.append("g")
    .style("stroke-width", "1.5px");

var panel = d3.select("#choroPleth")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity",0);


for(i=0; i<data.length; i++) {
    var val = county_freq.find(function (curr_val) {
        return (curr_val.countyName == data[i].county) && (curr_val.state == data[i].state);
    });
    if (val != undefined) {
        val.num++;
    } else {
        county_freq.push({countyName: data[i].county, state: data[i].state, num: "1"});
    }
}

    for(i=0; i<data.length; i++) {
        var val = county_averages.find(function(curr_val) {
            return (curr_val.countyName == data[i].county) && (curr_val.state ==  data[i].state);
        });
        if(val != undefined) {
            val.networths.push(data[i].networth);
        } else {
            county_averages.push({countyName:data[i].county, state:data[i].state, networths:[data[i].networth]});
        }
    }

        for(i=0; i<county_averages.length; i++) {
        var sum=0;
        for(j=0; j<county_averages[i].networths.length; j++) {
            sum+=county_averages[i].networths[j];
        }
        county_averages[i].average_val = sum/county_averages[i].networths.length;
        delete county_averages[i].networths;
    }

    choroColor.domain([
        d3.min(county_averages, function(d) { return d.average_val}),
        net_worth_thresh,
        d3.max(county_averages, function(d) { return d.average_val})
    ]);

for (var i = 0; i < json[0].features.length; i++) {
            var statenum = json[0].features[i].properties.STATE;
            var foundval = statenums.find(function(curr_val) {
                return curr_val.number == statenum;
            });

            if(foundval != undefined) {
                json[0].features[i].properties.STATE = foundval.state;
            }
            var state = json[0].features[i].properties.STATE;

}

for (var i = 0; i < county_averages.length; i++) {
            //Grab state name
            var county_name = county_averages[i].countyName;
            var state_name = county_averages[i].state;

            //Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json[0].features.length; j++) {
                var jsonCounty = json[0].features[j].properties.NAME;
                var jsonState = json[0].features[j].properties.STATE;
                if (county_name == jsonCounty && state_name == jsonState) {
                    //Copy the data value into the JSON
                    json[0].features[j].properties.value = county_averages[i].average_val;
                    //Stop looking through the JSON
                    break;
                }
            }
        }

        globalJson = json;

        chorog.selectAll("path")
            .data(json[0].features)
            .enter()
            .append("path")
            .attr("d",choroPath)
            //.attr("class", "feature")
            .style("fill", function(d) {
                return (d.properties.value?choroColor(d.properties.value):"#eee");
            })
            .on("click", clicked)
            .on("mouseover", function(d) {
                var sel = d3.select(this);
                prev_county_color = (d.properties.value ? choroColor(d.properties.value): "#eee");

                //change color so opacity is higher
                var temp = prev_county_color.split(",");
                temp[temp.length-1] = "0.9)";
                if(!isFocused) {
                    if(prev_county_color != "#eee") {
                        sel.style("fill",temp.join(","));
                    } else {
                        sel.style("fill","#ccc");
                    }
                } else {
                    if(chosenEl != this) {
                        if(prev_county_color != "#eee") {
                            sel.style("fill",temp.join(","));
                        } else {
                            sel.style("fill","#ccc");
                        }
                    }
                }


                //get county name, state, county average, number of companies in county, and (todo) categories in county
                var cName = d.properties.NAME;
                var state = d.properties.STATE;
                var compfreq;
                var networthavg;

                var freqval = county_freq.find(function (curr_val) {
                         return (curr_val.countyName == cName) && (curr_val.state == state);
                })
                if(freqval != undefined || typeof(freqval) == NaN) {
                    compfreq = freqval.num;
                } else {
                    compfreq = "No startups";
                }

                var avgval = county_averages.find(function (curr_val) {
                         return (curr_val.countyName == cName) && (curr_val.state == state);
                });

                if(avgval != undefined || typeof(avgval) == NaN) {
                    networthavg = avgval.average_val;
                } else {
                    networthavg = "";
                }

                //show tooltip for each county
                panel.transition()
                    .duration(200)
                    .style("opacity", 0.8);
                if(avgval == "undefined" || typeof(avgval)==NaN) {
                    panel.html("<h5>" + cName + ", " + state + "</h5>" +
                         + "<br/>0 startups <br/>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px")
                } else {
                    panel.html("<h5>" + cName + ", " + state + "</h5>" +
                        "<i>Average Total Funding: $</i>" + networthavg + "<br/>" + +compfreq + " startups <br/>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px")
                }
            })
            .on("mouseout", function(d) {
                //set back the previous color
                var sel = d3.select(this);
                var temp = prev_county_color.split(",");
                temp[temp.length-1] = "0.9)";

                if(!isFocused) {
                    sel.style("fill", prev_county_color);
                } else {
                    if(chosenEl == this) {
                        sel.style("fill", temp.join(","));
                    } else {
                        sel.style("fill", prev_county_color);
                    }
                }

                //turn off tooltip
                panel.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        chorog.selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("cx", function(d) {
               if(d.lon == 0 || d.lat == 0) {
                   return 0;
               } else {
                   return projection([d.lon, d.lat])[0];
               }
           })
           .attr("cy", function(d) {
                if(d.lon == 0 || d.lat == 0) {
                   return 0;
               } else {
                   return projection([d.lon, d.lat])[1];
               }
           })
           .attr("r", 2)
           .style("fill", function(d) {
               return (net_worth_thresh > d.networth ? "rgb(154,154,154)" : "rgb(255, 251, 155)");
           })
           .style("opacity", 0.9);
}

function zoomed() {
    choroMap.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    choroMap.attr("transform", d3.event.transform);
}


function clicked(d) {
    //change color of clicked county
    var sel = d3.select(this);
    prev_county_color_clicked = (d.properties.value ? choroColor(d.properties.value): "#eee");
    //change color so opacity is higher
    var temp = prev_county_color_clicked.split(",");
    temp[temp.length-1] = "0.9)";

    if(!isFocused) {
        sel.style("fill",temp.join(","));
        isFocused = true;
        chosenEl = this;
    } else {
        if(chosenEl == this) {
              sel.style("fill",prev_county_color_clicked);
              isFocused = false;
        } else {
            sel.style("fill",temp.join(","));
            var prev = d3.select(chosenEl);
            prev.style("fill",prev_county_color_clicked);
            isFocused = true;
            chosenEl = this;
        }
    }


    if (active.node() === this) return reset();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var bounds = choroPath.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        //scale = .9 / Math.max(dx / choroWidth, dy / choroHeight),
        scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / choroWidth, dy / choroHeight))),
        translate = [choroWidth / 2 - scale * x, choroHeight / 2 - scale * y];

      chorog.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

   /* choroSvg.transition()
      .duration(700)
      .call(choroZoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale));*/
}

function reset() {
    active.classed("active", false);
    active = d3.select(null);

    /*chorog.transition()
      .duration(750)
      .call( choroZoom.transform, d3.zoomIdentity );*/

    chorog.transition()
      .duration(750)
      .style("stroke-width", "1.5px")
      .attr("transform", "");
}

function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

