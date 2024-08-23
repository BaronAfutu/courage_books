// Sample data - replace this with your actual data
const data = [
    { reference: 'Glocometer-1', lrl: 2.6, url: 7.1 },
    { reference: 'Glocometer-2', lrl: 2.9, url: 6.8 },
    { reference: 'Glocometer Accu Gold-1', lrl: 2.8, url: 5.2 },
    { reference: 'On call plus-1', lrl: 3.3, url: 7.5 },
    { reference: 'Mindray-1', lrl: 3.1, url: 9 },
    { reference: 'Mindray-2', lrl: 3.0, url: 8 },
    { reference: 'Midray BS 240-1', lrl: 3.5, url: 9 },
    { reference: 'Stat lab-1', lrl: 4.1, url: 7.8 },
    { reference: 'Glocometer-3', lrl: 2.7, url: 5.1 },
    { reference: 'ERBA X L-200-1', lrl: 4.0, url: 5.2 },
    { reference: 'Response 910-1', lrl: 3.5, url: 8.1 }
];


const plot = (plotLocationId, labels, lowerData, upperData) => {
    const ctx = document.getElementById(plotLocationId).getContext('2d');
    console.log(labels.length)
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'L.L',
                    data: lowerData,
                    backgroundColor: 'black',
                    stack: 'Stack 0'
                },
                {
                    label: 'U.L',
                    data: upperData,
                    backgroundColor: 'black',
                    stack: 'Stack 0'
                }/*,
            {
                label: 'Mean L.L',
                data: [{ x: meanLL, y: '' }],
                borderColor: 'blue',
                borderWidth: 2,
                type: 'line',
                fill: false,
                showLine: true,
                pointRadius: 0,
                pointHoverRadius: 0
            },
            {
                label: 'Mean U.L',
                data: [{ x: meanUL, y: '' }],
                borderColor: 'red',
                borderWidth: 2,
                type: 'line',
                fill: false,
                showLine: true,
                pointRadius: 0,
                pointHoverRadius: 0
            }*/
            ]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: 12,
                    title: {
                        display: true,
                        text: 'Values'
                    }
                },
                y: {
                    type: 'category',
                    labels: labels,
                    title: {
                        display: true,
                        text: 'references'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Chart.js Bar Chart - Stacked'
                },
            },
            responsive: true,
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    stacked: false,
                },
                y: {
                    stacked: true
                }
            }
        }
    });
}


const drawPlot = (data, plotLocationId) => {

    // Extract L.L and U.L values for calculation
    const lowerLimits = data.map(d => d.lrl);
    const upperLimits = data.map(d => d.url);

    data.forEach(d => { d['M_L'] = Math.floor(((d.lrl + d.url) / 2) * 100) / 100 });

    // Calculate mean and standard deviation
    const meanLL = lowerLimits.reduce((a, b) => a + b) / lowerLimits.length;
    const sdLL = Math.sqrt(lowerLimits.reduce((sq, n) => sq + Math.pow(n - meanLL, 2), 0) / lowerLimits.length);
    const meanUL = upperLimits.reduce((a, b) => a + b) / upperLimits.length;
    const sdUL = Math.sqrt(upperLimits.reduce((sq, n) => sq + Math.pow(n - meanUL, 2), 0) / upperLimits.length);

    // console.log(`Mean L.L: ${meanLL}, SD L.L: ${sdLL}`);
    // console.log(`Mean U.L: ${meanUL}, SD U.L: ${sdUL}`);

    // Prepare data for chart.js

    const labels = data.map(d => d.reference);
    const lowerData = data.map(d => ({ x: [d.lrl, d.M_L], y: d.reference }));
    const upperData = data.map(d => ({ x: [d.M_L, d.url], y: d.reference }));

    plot(plotLocationId, labels, lowerData, upperData);
}


// document.onload = drawPlot(data, 'myChart');