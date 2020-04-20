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
var padding = {t: 100, r: 40, b: 100, l: 40};

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

d3.csv('movements.csv', dataPreprocessor).then(function(dataset) {
	console.log(dataset);
    movements = dataset;

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

    updateChart('all-movements')

	//adding title to the top
	svg.append("text")
        .attr("x", (padding.l))
        .attr("y", (padding.t / 2))
        .style("font-size", "30px")
        .text("The Art of War")

    //adding description to the top
    svg.append("text")
        .attr("x", (svgWidth * .68))
        .attr("y", (padding.t / 2))
        .style("font-size", "20px")
        .text("A timeline of art movements across periods of war.")

	});

function updateChart(filterkey) {
    var filteredMovements = movements.filter(function(d){
        if(d.group < 100) {
            return d
        }
    });
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
                    return (timelineRange(d.start_year) + padding.l);
                })
                .attr('y', function(d) {
                    return (barHeightScale(d.group) + padding.t - 40);
                });
        })
        .on('mouseout', function(d) {
            // Clean up the actions that happened in mouseover
            var hovered = d3.select(this);
            hovered.classed('hovered', false)
            hovered.select('text.value').remove();
        });

    bars.merge(barsEnter);

    barsEnter.append('rect')
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('height', barHeight)
        .attr('width', function(d) {return ((timelineRange(d.end_year)) - (timelineRange(d.start_year)));})
        .attr('x', function(d) {return (timelineRange(d.start_year) + padding.l);})
        .attr('y', function(d) {return (barHeightScale(d.group) + padding.t - 35);});

}