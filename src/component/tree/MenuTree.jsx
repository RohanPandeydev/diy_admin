import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MenuTree = ({ data }) => {
  const svgRef = useRef();

  const convertToHierarchy = (menuData) => {
    return {
      name: 'Root',
      children: menuData.map(mapNode)
    };
  };

  const mapNode = (node) => ({
    name: node.name,
    link: `/seo/${node.slug}`, // Assuming each node has a 'slug' property
    children: node.subMenu?.length ? node.subMenu.map(mapNode) : []
  });

  useEffect(() => {
    const hierarchyData = d3.hierarchy(convertToHierarchy(data));

    const width = 1200; // Increased width for better spacing
    const dx = 30; // Increased horizontal spacing
    const dy = 200; // Increased vertical spacing
    const tree = d3.tree().nodeSize([dx, dy]);

    const root = tree(hierarchyData);
    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, x1 - x0 + dx * 2])
      .style("font", "14px Arial, sans-serif")
      .style("user-select", "none");

    svg.selectAll("*").remove(); // clear previous render

    const g = svg.append("g")
      .attr("transform", `translate(60,${dx - x0})`);

    // Color scale for nodes
    const colorScale = d3.scaleOrdinal(d3.schemeSet2);

    const link = g.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))
      .attr("stroke", d => colorScale(d.source.depth)); // Color links based on source depth

    const node = g.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`);

    // Add gradient for nodes
    const defs = svg.append("defs");
    const gradient = defs.append("radialGradient")
      .attr("id", "nodeGradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%")
      .attr("fx", "30%")
      .attr("fy", "30%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#fff");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ccc");

    node.append("circle")
      .attr("fill", d => colorScale(d.depth)) // Color nodes based on depth
      .attr("r", 8)
      .attr("filter", "url(#nodeGradient)");

    node.each(function(d) {
      const nodeSelection = d3.select(this);
      // Check if the node is not in the last layer (i.e., it has children)
      if (d.data.link && d.children) {
        nodeSelection.append("a")
          .attr("xlink:href", d.data.link)
          .append("text")
          .attr("dy", "0.31em")
          .attr("x", d => d.children ? -10 : 10)
          .attr("text-anchor", d => d.children ? "end" : "start")
          .text(d => d.data.name)
          .style("fill", "#007bff") // Highlight text color for clickable nodes
          .style("font-weight", "bold")
          .style("background-color", "rgba(255, 255, 0, 0.3)") // Highlight background color
          .style("padding", "2px 5px")
          .style("border-radius", "5px")
          .style("border", "1px solid #007bff"); // Add border for emphasis
      } else {
        nodeSelection.append("text")
          .attr("dy", "0.31em")
          .attr("x", d => d.children ? -10 : 10)
          .attr("text-anchor", d => d.children ? "end" : "start")
          .text(d => d.data.name)
          .style("fill", "#333")
          .style("font-weight", "bold")
          .style("background-color", "rgba(255, 255, 255, 0.7)")
          .style("padding", "2px 5px")
          .style("border-radius", "5px");
      }
    });
  }, [data]);

  return (
    <div>
      <svg ref={svgRef} width="100%" height="800"></svg>
    </div>
  );
};

export default MenuTree;
