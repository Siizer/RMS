const waveDisplay = d3.select("#waveDisplay");
const peakValueSlider = document.getElementById("peakValueSlider");
const rmsDisplay = document.getElementById("rmsDisplay");
const peakValueDisplay = document.getElementById("peakValueDisplay");
const toggleSquare = document.getElementById("toggleSquare");

const width = 600;
const height = 300;
const margin = { top: 30, right: 30, bottom: 30, left: 50 };

function drawWave(peakValue, showSquare) {
    waveDisplay.selectAll("*").remove();
    const svg = waveDisplay.append("svg")
        .attr("width", width)
        .attr("height", height);

    const xScale = d3.scaleLinear()
        .domain([0, 2 * Math.PI])
        .range([margin.left, width - margin.right]);

    // Adjusting the yScale domain based on whether the squared line is shown
    const yScale = d3.scaleLinear()
        .domain(showSquare ? [-peakValue * peakValue, peakValue * peakValue] : [-peakValue, peakValue])
        .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale).ticks(10);
    svg.append("g")
        .attr("transform", `translate(0,${height / 2})`)
        .call(xAxis);

    const yAxis = svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale).ticks(10));

    const line = d3.line()
        .x((d) => xScale(d))
        .y((d) => yScale(peakValue * Math.sin(d)));

    const squareLine = d3.line()
        .x((d) => xScale(d))
        .y((d) => yScale((peakValue * Math.sin(d)) ** 2));

    const data = d3.range(0, 2 * Math.PI, 0.01);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", line);

    if (showSquare) {
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-dasharray", "5,5")
            .attr("stroke-width", 2)
            .attr("d", squareLine);
    }

    const rmsValue = calculateRMS(peakValue);
    const rmsLine = yScale(rmsValue);
    svg.append("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", rmsLine)
        .attr("y2", rmsLine)
        .attr("stroke", "green")
        .attr("stroke-width", 2);
}

function calculateRMS(peakValue) {
    return (peakValue / Math.sqrt(2)).toFixed(2);
}

function updateVisualization() {
    const peakValue = peakValueSlider.value;
    const showSquare = toggleSquare.checked;
    peakValueDisplay.textContent = peakValue;
    drawWave(peakValue, showSquare);
    rmsDisplay.textContent = calculateRMS(peakValue);
}

updateVisualization();
peakValueSlider.addEventListener("input", updateVisualization);
toggleSquare.addEventListener("change", updateVisualization);
