import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MenuTree = ({ data, isCategoryLoad }) => {
  const svgRef = useRef();

  const convertToHierarchy = (menuData) => {
    return {
      name: 'Root',
      children: [
        {
          name: 'SEO',
          children: menuData.map(mapNode)
        },
        {
          name: 'Blog',
          children: [
            {
              name: 'Blog',
              link: '/blog',
              children: []
            }
          ]
        }
      ]
    };
  };

  const mapNode = (node, parentSlug = '') => {
    const currentSlug = node.slug ? node.slug : '';
    const fullLink = isNaN(parentSlug) ? `${parentSlug}/${currentSlug}` : currentSlug;
    return {
      name: node.name,
      link: `/seo/${fullLink}`,
      children: node.subMenu?.length ? node.subMenu.map(subNode => mapNode(subNode, fullLink)) : []
    };
  };

  useEffect(() => {
    const hierarchyData = d3.hierarchy(convertToHierarchy(data));

    // Store original children in _children for toggling
    hierarchyData.descendants().forEach(d => {
      if (d.children) {
        d._children = d.children;
      }
    });

    const renderTree = (source) => {
      const width = 1200;
      const dx = 30;
      const dy = 200;
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

      svg.selectAll("*").remove();

      const g = svg.append("g")
        .attr("transform", `translate(60,${dx - x0})`);

      const colorScale = d3.scaleOrdinal(d3.schemeSet2);

      g.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 2)
        .selectAll("path")
        .data(root.links())
        .join("path")
        .attr("d", d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x))
        .attr("stroke", d => colorScale(d.source.depth));

      const node = g.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .on("click", function (event, d) {
          // Toggle children on click
          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
          renderTree(d); // Re-render from clicked node
        });

      const defs = svg.append("defs");
      const gradient = defs.append("radialGradient")
        .attr("id", "nodeGradient")
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%")
        .attr("fx", "30%")
        .attr("fy", "30%");

      gradient.append("stop").attr("offset", "0%").attr("stop-color", "#fff");
      gradient.append("stop").attr("offset", "100%").attr("stop-color", "#ccc");

      node.append("circle")
        .attr("fill", d => colorScale(d.depth))
        .attr("r", 8)
        .attr("filter", "url(#nodeGradient)");

      node.each(function (d) {
        const nodeSelection = d3.select(this);
        const nodeData = d.data;
        const shouldHaveLink = nodeData.link && !['SEO', 'Blog'].includes(nodeData.name);

        const textElement = shouldHaveLink
          ? nodeSelection.append("a")
            .attr("xlink:href", nodeData.link)
            .attr("target", "_blank")
            .append("text")
          : nodeSelection.append("text");

        textElement
          .attr("dy", "0.31em")
          .attr("x", d => d.children ? -10 : 10)
          .attr("text-anchor", d => d.children ? "end" : "start")
          .text(d => d.data.name)
          .style("fill", shouldHaveLink ? "#007bff" : "#333")
          .style("font-weight", "bold")
          .style("background-color", shouldHaveLink ? "rgba(255, 255, 0, 0.3)" : "transparent")
          .style("padding", shouldHaveLink ? "2px 5px" : "0")
          .style("border-radius", shouldHaveLink ? "5px" : "0")
          .style("border", shouldHaveLink ? "1px solid #007bff" : "none");
      });
    };

    renderTree(hierarchyData);

  }, [data, isCategoryLoad]);

  return (
    <div>
      <svg ref={svgRef} width="100%" height="800"></svg>
    </div>
  );
};

export default MenuTree;
