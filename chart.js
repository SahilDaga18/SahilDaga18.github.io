const roles = [
  { company: "Cricziner",      role: "Software Engineering Intern", start: "2024-04-01", end: "2024-05-31", area: "Software Engineering" },
  { company: "TechPaathshala", role: "Data Analytics Intern",       start: "2025-07-01", end: "2025-08-29", area: "Data Analytics" },
  { company: "VaultSpeed",     role: "Solutions Engineering Co-op", start: "2026-01-05", end: "2026-06-30", area: "Data Engineering/Automation" },
  { company: "ProfitGate",     role: "Equity Research Intern",      start: "2026-07-06", end: "2026-08-28", area: "Finance" }
];

const parse = d3.timeParse("%Y-%m-%d");
roles.forEach(d => { d.start = parse(d.start); d.end = parse(d.end); });

const margin = { top: 50, right: 30, bottom: 40, left: 130 };
const width = 860 - margin.left - margin.right;
const height = 290 - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleTime()
  .domain([parse("2024-01-01"), parse("2026-12-31")])
  .range([0, width]);

const y = d3.scaleBand()
  .domain(roles.map(d => d.company))
  .range([0, height])
  .padding(0.35);

const areas = ["Software Engineering", "Data Analytics", "Data Engineering/Automation", "Finance"];

const color = d3.scaleOrdinal()
  .domain(areas)
  .range(["#8A99AD", "#4A6FA5", "#1B2A41", "#C8102E"]);

svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x).ticks(d3.timeMonth.every(6)).tickFormat(d3.timeFormat("%b %Y")));

svg.append("g")
  .call(d3.axisLeft(y))
  .selectAll("text")
  .style("font-size", "13px");

const tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "#1B2A41")
  .style("color", "#FFFFFF")
  .style("padding", "6px 10px")
  .style("border-radius", "6px")
  .style("font-size", "14px")
  .style("pointer-events", "none")
  .style("opacity", 0);

const fmt = d3.timeFormat("%b %Y");

svg.selectAll("rect.bar")
  .data(roles)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", d => x(d.start))
  .attr("y", d => y(d.company))
  .attr("width", d => x(d.end) - x(d.start))
  .attr("height", y.bandwidth())
  .attr("rx", 5)
  .attr("fill", d => color(d.area))
  .on("mouseover", (event, d) => {
    tooltip.style("opacity", 1)
      .html(`<strong>${d.role}</strong><br>${d.company}<br>${d.area}<br>${fmt(d.start)} to ${fmt(d.end)}`);
  })
  .on("mousemove", event => {
    tooltip.style("left", (event.pageX + 12) + "px")
           .style("top", (event.pageY - 28) + "px");
  })
  .on("mouseout", () => tooltip.style("opacity", 0));

// Legend for all four areas, placed above the chart
const legend = svg.append("g").attr("transform", "translate(0, -35)");
let offset = 0;
areas.forEach(area => {
  const item = legend.append("g").attr("transform", `translate(${offset}, 0)`);
  item.append("rect").attr("width", 12).attr("height", 12).attr("fill", color(area));
  item.append("text").attr("x", 18).attr("y", 11).text(area).style("font-size", "13px");
  offset += area.length * 7.5 + 34;
});
