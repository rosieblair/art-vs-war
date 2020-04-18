//used to convert years and movement groups from strings to ints
function dataPreprocessor(row) {
    return {
        movement: row.movement,
        start_year: +row.start_year,
        end_year: +row.end_year ,
        group: +row.group
    };
}

var svg = d3.select('svg');

var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

//sets padding at top, bottom, left, and right
var padding = {t: 100, r: 200, b: 100, l: 40};

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

d3.csv('movements.csv', dataPreprocessor).then(function(dataset) {
	console.log(dataset);

	//returns the earliest year in the dataset
	var yearMin = d3.min(dataset, function(d) {
    	return +d['start_year'];
    });

	//returns the most recent year in the dataset
    var yearMax = d3.max(dataset, function(d) {
    	return +d['end_year'];
    });

    timelineRange = d3.scaleLinear()
    	.domain([yearMin, yearMax])
        .range([0, chartWidth]);

    //creates timeline at the bottom
    var timeline = d3.axisBottom(timelineRange).ticks(20).tickFormat(d3.format("d"));

    //appends timeline
    svg.append('g')
        .attr('class', 'xAxis')
        .attr('transform', 'translate('+[padding.l, svgHeight - padding.b]+')')
        .call(timeline);

    //appends all bars to the timeline
	svg.append('g')
		.selectAll('rect')
		.data(dataset)
		.enter()
		.append('rect')
		.attr('class', 'bar')
		.attr('x', function(d) {return (timelineRange(d.start_year) + padding.l);})
		.attr('y', function(d) {return (barHeightScale(d.group) + padding.t - 35);})
		.attr('rx', 5)
		.attr('ry', 5)
		.attr('width', function(d) {return ((timelineRange(d.end_year)) - (timelineRange(d.start_year)));})
		.attr('height', barHeight)
		.style('fill', function(d) { //fill bar color based on movement duration
            if ((d.end_year - d.start_year) <= 10) {
                return colors[0][0];
            } else if (((d.end_year - d.start_year) >= 11)
                && ((d.end_year - d.start_year) <= 20)) {
                return colors[1][0];
            } else if (((d.end_year - d.start_year) >= 21)
                && ((d.end_year - d.start_year) <= 50)) {
                return colors[2][0];
            } else if (((d.end_year - d.start_year) >= 51)
                && ((d.end_year - d.start_year) <= 100)) {
                return colors[3][0];
            } else {
                return colors[4][0];
            }
        });

	//appends movement names to each bar
	svg.append('g')
		.selectAll('bar')
		.data(dataset)
		.enter()
		.append('text')
		.text(function(d) {return d.movement;})
		.attr('x', function(d) {return (timelineRange(d.start_year) + padding.l);})
		.attr('y', function(d) {return (barHeightScale(d.group) + padding.t - 35);})
		.style('opacity', 0); //currently set to 0 to not show labels, trying to figure out how to show
		//them only when you over over the bar

    //adding color legend title to the right side
    svg.append("text")
        .attr("x", (svgWidth - (padding.r * 0.9)))
        .attr("y", (svgHeight * 0.35))
        .style("font-size", "20px")
        .text("Movement Length")

    //appending color legend circles
    svg.selectAll('circle')
        .data(colors)
        .enter()
        .append('circle')
        .attr('cx', (svgWidth - (padding.r * 0.75)))
        .attr('cy', function(d, i) {return ((svgHeight * 0.38) + (i * 30));})
        .attr('r', 9)
        .style('fill', function(d, i) {return colors[i][0];});

    //adding all the color legend labels
    svg.append("text")
        .attr("x", (svgWidth - (padding.r * 0.65)))
        .attr("y", ((svgHeight * 0.3853) + (0 * 30)))
        .style("font-size", "17px")
        .text(colors[0][1])

    svg.append("text")
        .attr("x", (svgWidth - (padding.r * 0.65)))
        .attr("y", ((svgHeight * 0.3853) + (1 * 30)))
        .style("font-size", "17px")
        .text(colors[1][1])

    svg.append("text")
        .attr("x", (svgWidth - (padding.r * 0.65)))
        .attr("y", ((svgHeight * 0.3853) + (2 * 30)))
        .style("font-size", "17px")
        .text(colors[2][1])

    svg.append("text")
        .attr("x", (svgWidth - (padding.r * 0.65)))
        .attr("y", ((svgHeight * 0.3853) + (3 * 30)))
        .style("font-size", "17px")
        .text(colors[3][1])

    svg.append("text")
        .attr("x", (svgWidth - (padding.r * 0.65)))
        .attr("y", ((svgHeight * 0.3853) + (4 * 30)))
        .style("font-size", "17px")
        .text(colors[4][1])

	//adding title to the top
	svg.append("text")
        .attr("x", (padding.l))
        .attr("y", (padding.t / 2))
        .style("font-size", "30px")
        .text("The Art of War")

    //adding description to the top
    svg.append("text")
        .attr("x", (svgWidth * 0.56))
        .attr("y", (padding.t / 2))
        .style("font-size", "20px")
        .text("A timeline of art movements across periods of war.")

	});
