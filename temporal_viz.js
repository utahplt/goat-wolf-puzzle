d3 = require('d3')
d3.selectAll("svg > *").remove();

STATE_HEIGHT = 80

states =
     d3.select(svg)
     // <g> is element for group in SVG
     // D3 is based on these "sandwich" calls:
     //   there's no <g> element yet, but there will be once the data is
     //   processed. Bind the data to those <g> elements...
     .selectAll('g')
     // Here's the data to bind. The map just makes sure we have the array index
     // Can use either old or new style anonymous functions
     .data(instances.map(function(d,i) {
        return {item: d, index: i}
     }))
     // Now, for every entry in that array...
     .enter()
     // Add a <g> (finally)
     .append('g')
     // Give it a class, for ease of debugging and possible use in future visualizations
     .classed('state', true)
     // Give it an 'id' attribute that's the state index (used later for labeling)
     .attr('id', d => d.index)

// Now, for each state <g>, add a <rect> to the group
states
    .append('rect')
    .attr('x', 10)
     .attr('y', function(d) {
         return 20 + STATE_HEIGHT * d.index
     })
    .attr('width', 300)
    .attr('height', STATE_HEIGHT)
    .attr('stroke-width', 2)
    .attr('stroke', 'black')
    .attr('fill', 'transparent');

states
    .append("text")
    .style("fill", "black")
     .attr('y', function(d) {
         return 40 + STATE_HEIGHT * d.index
     })
     .attr('x', 50)
     .text(d => "State "+d.index);

animalGroups =
    states
    // ...as before, we want to bind the sub-data (light values WITHIN a state)
    .selectAll('circle')
    .data( function(d) {
        inst = d.item
        goat = inst.signature('Goat').tuples()
        wolf = inst.signature('Wolf').tuples()
        animals = goat.concat(wolf)
        return animals.map( function (ld) {
            const animalType = ld._atoms[0]._id.slice(0,4)
            const indexAdd = animalType === 'Goat' ? 3 : 0
            return {
                state: d.index,
                side: ld._atoms[0].p._id === 'Near0' ? 'Near' : 'Far',
                type: animalType,
                index: Number(ld._atoms[0]._id.slice(4,5))// + indexAdd
            }
        })
    })
    // for each of them
    .enter()
    // Add a new sub-group
    .append('g')
    .classed('light', true)

    // Each light contains a circle...
animalGroups
    .append('circle')
    // useful for debugging in inspector
    .attr('index', d => d.index)
    .attr('state', d => d.state)
    .attr('item',  d => d.item)
    .attr('type',  d => d.type)
    .attr('side',  d => d.side)
    .attr('r', 20)
    .attr('cx', function(d) {
        return 50 + (d.index+(d.type==='Goat'?3:0)) * 50
    })
    .attr('cy', function(d) {
        return 80 + d.state * STATE_HEIGHT + (d.side==='Near'?-30:0)
    })
    .attr('stroke', 'gray')
    .attr('fill', function(ld){
        if(ld.side === 'Near') return 'yellow';
        else return 'gray';
    });

// ...and an index label
animalGroups
     .append('text')
     .attr('y', d => 85 + d.state * STATE_HEIGHT + (d.side==='Near'?-30:0))
     .attr('x', d => 40 + (d.index+(d.type==='Goat'?3:0)) * 50)
     .text(d=>d.type.slice(0,1)+d.index);
