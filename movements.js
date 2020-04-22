//used to preprocess art movement data
function movementDataPreprocessor(row) {
    return {
        movement: row.movement,
        start_year: +row.start_year,
        end_year: +row.end_year,
        group: +row.group,
        description: row.description,
        artists: row.artists,
        artworks: row.artworks,
        source: row.source
    };
}

//used to preprocess specific events data
function eventsDataPreprocessor(row) {
    return {
        title: row.title,
        subtitle: row.subtitle,
        type: row.type,
        event_start: +row.event_start,
        event_end: +row.event_end,
        description: row.description
    };
}

function splitchartPreprocessor(row) {
    return {
        ID: +row.ID,
        paintCount: +row.paintCount,
        drawCount: +row.drawCount,
        photoCount: +row.photoCount,
        sculptCount: +row.sculptCount,
        totalCount: +row.totalCount
    }
}


var svg = d3.select('svg');

var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

//sets padding at top, bottom, left, and right
var padding = {t: 100, r: 200, b: 20, l: 40};

//computes chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Compute the spacing for bar bands based on all movement bar groups
var barBand = chartHeight / 46;
var barHeight = barBand * 0.7;

var barHeightScale = d3.scaleLinear()
	.domain([46, 0])
	.range([chartHeight, 0]);

//create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

//array of colors for bars' fill coloring and meanings
var colors = [
    ['#ED5564', '0 - 10 years'],
    ['#FFCE54', '11 - 20 years'],
    ['#A0D568', '21 - 50 years'],
    ['#4FC1E8', '51 - 100 years'],
    ['#AC92EB', '100+ years']
];

//function to chose movement bar color based on movement duration
function barColorFill(start_year, end_year) {
    if ((end_year - start_year) <= 10) {
        return colors[0][0];
    } else if (((end_year - start_year) >= 11)
        && ((end_year - start_year) <= 20)) {
        return colors[1][0];
    } else if (((end_year - start_year) >= 21)
        && ((end_year - start_year) <= 50)) {
        return colors[2][0];
    } else if (((end_year - start_year) >= 51)
        && ((end_year - start_year) <= 100)) {
        return colors[3][0];
    } else {
        return colors[4][0];
    }
}

Promise.all([
	d3.csv('movements.csv', movementDataPreprocessor),
    d3.csv('revolution_data.csv', eventsDataPreprocessor),
    d3.csv('splitchart.csv', splitchartPreprocessor)
]).then(function(dataset) {
	console.log("Data has been loaded in");

	movementData = dataset[0];
    eventsData = dataset[1];
    splitchartData = dataset[2];

/*            --------- Movement Visualisation start -----------          */

	//returns the earliest year in the dataset
	var yearMin = d3.min(movementData, function(d) {
    	return +d['start_year'];
    });

	//returns the most recent year in the dataset
    var yearMax = d3.max(movementData, function(d) {
    	return +d['end_year'];
    });

    timelineRange = d3.scaleLinear()
    	.domain([yearMin, yearMax])
        .range([0, chartWidth]);

    //creates timeline at the bottom
    var timeline =      d3.axisBottom(timelineRange).ticks(30).tickFormat(d3.format("d"));

    //appends timeline
    svg.append('g')
        .attr('class', 'xAxis')
        .attr('transform', 'translate('+[padding.l, svgHeight - padding.b]+')')
        .call(timeline);

    //updates chart after filters are applied
    updateChart('all-movements')

    //adding movement legend title to the right side
    svg.append("text")
        .attr("x", (svgWidth - (padding.r * 0.9)))
        .attr("y", (svgHeight * 0.4))
        .style("font-size", "20px")
        .style("font-weight", 600)
        .text("Movement Length")

    //appending movement legend circles
    svg.selectAll('circle')
        .data(colors)
        .enter()
        .append('circle')
        .attr('class', 'colors')
        .attr('cx', (svgWidth - (padding.r * 0.75)))
        .attr('cy', function(d, i) {return ((svgHeight * 0.42) + (i * 30));})
        .attr('r', 9)
        .style('fill', function(d, i) {return colors[i][0];});

    //adding all the movement legend labels
    svg.append("text")
        .attr("x", (svgWidth - (padding.r * 0.65)))
        .attr("y", ((svgHeight * 0.4253) + (0 * 30)))
        .style("font-size", "17px")
        .style('fill', 'gray')
        .text(colors[0][1])

    svg.append("text")
        .attr("x", (svgWidth - (padding.r * 0.65)))
        .attr("y", ((svgHeight * 0.4253) + (1 * 30)))
        .style("font-size", "17px")
        .style('fill', 'gray')
        .text(colors[1][1])

    svg.append("text")
        .attr("x", (svgWidth - (padding.r * 0.65)))
        .attr("y", ((svgHeight * 0.4253) + (2 * 30)))
        .style("font-size", "17px")
        .style('fill', 'gray')
        .text(colors[2][1])

    svg.append("text")
        .attr("x", (svgWidth - (padding.r * 0.65)))
        .attr("y", ((svgHeight * 0.4253) + (3 * 30)))
        .style("font-size", "17px")
        .style('fill', 'gray')
        .text(colors[3][1])

    svg.append("text")
        .attr("x", (svgWidth - (padding.r * 0.65)))
        .attr("y", ((svgHeight * 0.4253) + (4 * 30)))
        .style("font-size", "17px")
        .style('fill', 'gray')
        .text(colors[4][1])

	//adding title to the top
	svg.append("text")
        .attr("x", (padding.l))
        .attr("y", (padding.t / 2))
        .style("font-size", "30px")
        .style("font-weight", 600)
        .text("The Art of War")

    //adding description to the top
    svg.append("text")
        .attr("x", (svgWidth * 0.56))
        .attr("y", (padding.t / 2))
        .style("font-size", "20px")
        .style('fill', 'gray')
		.text("A timeline of art movements across periods of war.")

    //create popups for movements and years
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", 10)
        .style("opacity", 0);

    //updates chart with filter changes
    function updateChart(filterkey) {
        console.log('Called updateChart');


        //processing specific events data
        var filteredEvents = eventsData;
        var lines = chartG.selectAll('.line')
            .data(filteredEvents);

        var linesEnter = lines.enter()
            .append('g')
            .attr('class', 'line')
            .on('mouseover', function(d) {
                //highlight line on hover
                var hoveredLine = d3.select(this);
                hoveredLine.classed('hovered', true);
            })
            .on('mouseout', function(d) {
                //clean up actions after moving off of lines
                var hoveredLine = d3.select(this);
                hoveredLine.classed('hovered', false);
            })
            .on('click', function(d) {
                //shows information popup when you click on the specific event
                tooltip.transition().duration(150)
                    .style("top", (d3.event.pageY) + "px")
                    .style("left", (d3.event.pageX) + "px")
                    .style("opacity", 0.75);
                if (d.type == "regime") {
                    tooltip.html("<b>" + d.title + "</b> <i>("
                        + d.event_start + " - " + d.event_end
                        + ")</i><br/>Regime Leader: " + d.subtitle
                        + "<br/><br/><u>Regime Changes</u><br/>"
                        + d.description);
                } else {
                    tooltip.html("<b>" + d.title + "</b> <i>("
                        + d.event_start + " - " + d.event_end
                        + ")</i><br/>Conflict Type: " + d.subtitle
                        + "<br/><br/><u>Reason for Conflict</u><br/>"
                        + d.description);
                };
                d3.event.stopPropagation();
            });

        lines.merge(linesEnter);

        //append specific events in lines to timeline
        linesEnter.append('line')
            .style('stroke', 'lightgray')
            .style('stroke-linecap', 'round')
            .attr('x1', function(d) {return (timelineRange(d.event_start));})
            .attr('x2', function(d) {return (timelineRange(d.event_start));})
            .attr('y1', barHeightScale(1) - 40)
            .attr('y2', barHeightScale(46));


        linesEnter.append('line')
            .style('stroke', 'lightgray')
            .style('stroke-linecap', 'round')
            .attr('x1', function(d) {return (timelineRange(d.event_end));})
            .attr('x2', function(d) {return (timelineRange(d.event_end));})
            .attr('y1', barHeightScale(1) - 40)
            .attr('y2', barHeightScale(46));


        //processing art movement data
        var filteredMovements = movementData;
        console.log(filteredMovements);
        var bars = chartG.selectAll('.bar')
            .data(filteredMovements);

        var barsEnter = bars.enter()
            .append('g')
            .attr('class', 'bar')
            .on('mouseover', function(d) {
                // Use this to select the hovered element
                var hovered = d3.select(this);
                // add hovered class to style the group
                hovered.classed('hovered', true);
                // add a new text value element to the group
                hovered.append('text')
                    .attr('class', 'value')
                    .text(d.movement)
                    .attr('x', function(d) {
                        return (timelineRange(d.start_year));
                    })
                    .attr('y', function(d) {
                        return (barHeightScale(d.group) - 42);
                    });
                hovered.raise();
            })
            .on('mouseout', function(d) {
                // Clean up the actions that happened in mouseover
                var hovered = d3.select(this);
                hovered.classed('hovered', false)
                hovered.select('text.value').remove();
            })
            .on('click', function(d) {
                //shows information popup when you click on the movement bar
                tooltip.transition().duration(150)
                    .style("top", (d3.event.pageY) + "px")
                    .style("left", (d3.event.pageX) + "px")
                    .style("opacity", 0.75)
                tooltip.html("<b>" + d.movement + "</b> <i>("
                    + d.start_year + " - " + d.end_year
                    + ")</i><br/><br/>" + d.description + "<br/><br/>"
                    + "<u>Famous Artists</u><br/>" + d.artists + "<br/><br/>"
                    + "<u>Famous Artworks</u><br/>" + d.artworks);

                d3.event.stopPropagation();
            });

        //listener to reset popup when you click off of the movement bar
        d3.select('body').on('click', resetTooltip);

        //hides popup
        function resetTooltip() {
            tooltip.transition().duration(150)
                .style("opacity", 0);
        }

        bars.merge(barsEnter);

        //append movement bars to timeline
        barsEnter.append('rect')
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('height', barHeight)
            .attr('width', function(d) {return ((timelineRange(d.end_year)) - (timelineRange(d.start_year)));})
            .attr('x', function(d) {return (timelineRange(d.start_year));})
            .attr('y', function(d) {return (barHeightScale(d.group) - 40);})
            //fill bar color based on movement duration in years
            .style('fill', function(d) {return (barColorFill(d.start_year, d.end_year));});

    }

/*            --------- Movement Visualisation End -----------          */

/*            --------- splitChart Data Visualisation Start -----------          */

    // calls on the svg element with the class called "splitChart"
    var splitSVG = d3.select('.splitChart');

    var splitSVGwidth = +splitSVG.attr('width');
    var splitSVGheight = +splitSVG.attr('height');

    var splitPadding = {t: 100, r: 200, b: 0, l: 40};
    
    // Computing chart dimensions
    var splitCWidth = splitSVGwidth - splitPadding.l - splitPadding.r;
    var splitCHeight = splitSVGheight - splitPadding.t - splitPadding.b;

    // calculates the max total count
    var maxTotal = d3.max(splitchartData, function(d) {
        return +d['totalCount'];
    });

    // x and y Scales for the stacked/split bar chart
    var x = d3.scaleBand()
        .domain(splitchartData.map(function(d) {return d.ID;} ))
        .range([0, splitCWidth])
        
    var y = d3.scaleLinear()
        .domain([0, maxTotal])
        .range([0, splitCHeight]);

    // holds a domain of colors
    var splitColors = d3.scaleOrdinal(d3.schemeCategory10);
    splitColors.domain(splitchartData.columns.slice(1,5));

    var stack = d3.stack();


    // appending the a group element that will hold the other group elements(these group elements holds the bars)
    // Additionally the hover on and hover off functionality of the stack chart is held here
    var splitG = splitSVG.append('g');
    var serie = splitG.selectAll('.serie')
    .data(splitchartData)
        /*.data(stack.keys(splitchartData.columns.slice(1,5))(splitchartData))*/
        .enter().append('g')
            .attr('class', 'serie')
            .attr('fill', function(d) {return splitColors(d.key);})
            .on('mouseover', function(d) {
                var hover = d3.select(this);

                hover.classed('hover', true);

                hover.append('text')
                .style('padding-bottom', '200px')
                .style('font-size', '15px')
                .text("Total: " + d.totalCount)
                .attr('y', 200)
                .attr('x', 1320)
                .attr('fill', '#000000');

                hover.append('text')
                .style('padding-bottom', '200px')
                .style('font-size', '15px')
                .text("Number of Paintings: " + d.paintCount)
                .attr('y', 225)
                .attr('x', 1320)
                .attr('fill', '#6be069');

                hover.append('text')
                .style('padding-bottom', '200px')
                .style('font-size', '15px')
                .text("Number of Drawings: " + d.drawCount)
                .attr('y', 250)
                .attr('x', 1320)
                .attr('fill', '#a1eddb');

                hover.append('text')
                .style('padding-bottom', '200px')
                .style('font-size', '15px')
                .text("Number of Photos: " + d.photoCount)
                .attr('y', 275)
                .attr('x', 1320)
                .attr('fill', '#8ec5e8');

                hover.append('text')
                .style('padding-bottom', '200px')
                .style('font-size', '15px')
                .text("Number of Sculptures: " + d.sculptCount)
                .attr('y', 300)
                .attr('x', 1320)
                .attr('fill', '#8e99e8');

            })
            .on('mouseout', function(d) {
                var hover = d3.select(this);
                hover.classed('text', false);
                hover.select('text').remove();
                hover.select('text').remove();
                hover.select('text').remove();
                hover.select('text').remove();
                hover.select('text').remove();
            });

    // Appending bars by art piece type, each of these appends places all the bars for the corresponding art piece type
            // first = count of paintings
            // second = count of drawings
            // third = count of photographs
            // fourth = count of sculptures
    serie.append('rect')
        .attr('class', 'splitBarsTopRound')
        .attr('fill','#6be069')
        .attr('x', function(d) {
            return x(d.ID) + 43; })
        .attr('y', function(d) { return 0; } )
        .attr('height', function(d) { return y(d.paintCount); })
        .attr('width', 40/*x.bandWidth()*/);

    serie.append('rect')
        .attr('class', 'splitBars')
        .attr('fill','#a1eddb')
        .attr('x', function(d) {
            return x(d.ID) + 43; })
        .attr('y', function(d) { return y(d.paintCount); } )
        .attr('height', function(d) { return y(d.drawCount); })
        .attr('width', 40/*x.bandWidth()*/); // .bandwith()
    
    serie.append('rect')
        .attr('class', 'splitBars')
        .attr('fill','#8ec5e8')
        .attr('x', function(d) {
            return x(d.ID) + 43; })
        .attr('y', function(d) { return y(d.paintCount + d.drawCount); } )
        .attr('height', function(d) { return y(d.photoCount); })
        .attr('width', 40/*x.bandWidth()*/); // .bandwith()

    serie.append('rect')
        .attr('class', 'splitBars')
        .attr('fill','#8e99e8')
        .attr('x', function(d) {
            return x(d.ID) + 43; })
        .attr('y', function(d) { return y(d.paintCount + d.drawCount + d.photoCount); } )
        .attr('height', function(d) { return y(d.sculptCount); })
        .attr('width', 40/*x.bandWidth()*/); // .bandwith()

// ----- legend for the stack chart -----
    
    var colorList = ['#6be069', '#a1eddb', '#8ec5e8','#8e99e8'];

    //padding stack chart legend title to the right side
    splitSVG.append("text")
        .attr("x", (svgWidth - (padding.r * 0.9)))
        .attr("y", (svgHeight * 0.4) - 425)
        .style("font-size", "20px")
        .style("font-weight", 600)
        .text("Type of Art Piece")

    //appending stack chart legend circles
    splitSVG.selectAll('circle')
        .data(colorList)
        .enter()
        .append('circle')
        .attr('class', 'colors')
        .attr('cx', (svgWidth - (padding.r * 0.75)))
        .attr('cy', function(d, i) {return ((svgHeight * 0.42) + (i * 30) - 425);})
        .attr('r', 9)
        .style('fill', function(d, i) {return colorList[i];});

    //adding all the stack chart legend labels
    splitSVG.append("text")
        .attr("x", (svgWidth - (padding.r * 0.65)))
        .attr("y", ((svgHeight * 0.4253) + (0 * 30) - 426))
        .style("font-size", "17px")
        .style('fill', 'gray')
        .text('Paintings');

        splitSVG.append("text")
        .attr("x", (svgWidth - (padding.r * 0.65)))
        .attr("y", ((svgHeight * 0.4253) + (1 * 30) - 426))
        .style("font-size", "17px")
        .style('fill', 'gray')
        .text('Drawings');

        splitSVG.append("text")
        .attr("x", (svgWidth - (padding.r * 0.65)))
        .attr("y", ((svgHeight * 0.4253) + (2 * 30) - 426))
        .style("font-size", "17px")
        .style('fill', 'gray')
        .text("Photographs");

        splitSVG.append("text")
        .attr("x", (svgWidth - (padding.r * 0.65)))
        .attr("y", ((svgHeight * 0.4253) + (3 * 30) - 426))
        .style("font-size", "17px")
        .style('fill', 'gray')
        .text("Sculptures");

/*            --------- splitChart data Visualisation end -----------          */

});
