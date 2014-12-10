

var custom_bubble_chart = (function(d3, CustomTooltip) {
  "use strict";
 
  var width = 700,
      height = 700,
      tooltip = null,//CustomTooltip("gates_tooltip", 240),
      layout_gravity = -0.01,
      damper = 0.1,
      nodes = [],
      vis, force, circles, radius_scale;
 
  var center = {x: width / 2, y: height / 2};

  var fill_color;

  function my_custom_chart(data, vis_id, Tags) {

    fill_color = d3.scale.ordinal()
                  .domain(Tags)
                  .range(["#75b35b", "#a4d68e", "#28680d", "#144400", "#488d2a", "#cbefbc", "#85c56a", "#1f5906", "#428724", "#123c00"]);

    var max_amount = d3.max(data, function(d) { return parseInt(d.amount, 10); });
    radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2,85]);

    var max_rad = radius_scale(parseInt(max_amount))

      console.log(Tags);

    data.forEach(function(d) {

      var rad = radius_scale(parseInt(d.amount, 10));

      var node = {
        id : d.transaction,
        radius: rad,
        value: d.amount,
        name: d.transaction,
        date: d.details.date,
        transactionid: d._id,
        tag: d.tags,
        x: Math.random() * 700,
        y: Math.random() * 700
      }

      nodes.push(node);
    });

    nodes.sort(function(a, b) {return b.value- a.value; });
 
    $("#svg_vis").remove();

    vis = d3.select("#" + vis_id).append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("id", "svg_vis");
 

    circles = vis.selectAll("circle")
                 .data(nodes, function(d) { return d.id ;});
 
    circles.enter().append("circle")
      .attr("r", 0)
      .attr("fill", function(d) { return fill_color(d.tag) ;})
      .attr("stroke-width", 2)
      .attr("stroke", function(d) {return d3.rgb(fill_color(d.tag)).darker();})
      .attr("id", function(d) { return  "bubble_" + d.id; })
      .on("mouseover", function(d, i) {show_details(d, i, this);} )
      .on("mouseout", function(d, i) {hide_details(d, i, this);} )
      .on("click", function(d,i) {window.location.href = '/#/Split/' + d.transactionid});
 
    circles.transition().duration(2000).attr("r", function(d) { return d.radius; });

  }
 
  function charge(d) {
    return -Math.pow(d.radius, 2.0) / 8;
  }
 
  function start() {
    force = d3.layout.force()
            .nodes(nodes)
            .size([width, height]);
  }
 
  function display_group_all() {
    force.gravity(layout_gravity)
         .charge(charge)
         .friction(0.9)
         .on("tick", function(e) {
            circles.each(move_towards_center(e.alpha))
                   .attr("cx", function(d) {return d.x;})
                   .attr("cy", function(d) {return d.y;});
         });
    force.start();
  }
 
  function move_towards_center(alpha) {
    return function(d) {
      d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
      d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
    };
  } 
 
 
  function show_details(data, i, element) {
    d3.select(element).attr("stroke", "black");
    var content = "<span class=\"name\">Transaction:</span><span class=\"value\"> " + data.name + "</span><br/>";
    content +="<span class=\"name\">Amount:</span><span class=\"value\"> $" + data.value + "</span><br/>";
    content +="<span class=\"name\">Date:</span><span class=\"value\"> " + data.date + "</span><br/>";
    content +="<span class=\"name\">Tag:</span><span class=\"value\"> " + data.tag + "</span><br/>";
    tooltip.showTooltip(content, d3.event);
  }
 
  function hide_details(data, i, element) {
    d3.select(element).attr("stroke", function(d) { return d3.rgb(fill_color(d.group)).darker();} );
    tooltip.hideTooltip();
  }
 
  var my_mod = {};
  my_mod.init = function (_data, vis_id, Tags) {

    $("#gates_tooltip").remove();

    tooltip = CustomTooltip("gates_tooltip", 240);

    my_custom_chart(_data, vis_id, Tags);

    start();
	 display_group_all();
  };
 
  my_mod.display_all = display_group_all;
 
  return my_mod;
})(d3, CustomTooltip);



