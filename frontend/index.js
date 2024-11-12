import { backend } from "declarations/backend";

let chart;
const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

async function fetchICPPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd&include_24hr_change=true');
        const data = await response.json();
        return {
            price: data['internet-computer'].usd,
            change: data['internet-computer'].usd_24h_change
        };
    } catch (error) {
        console.error('Error fetching ICP price:', error);
        return null;
    }
}

function updatePriceDisplay(price, change) {
    const priceElement = document.getElementById('currentPrice');
    const changeElement = document.getElementById('priceChange');
    
    priceElement.textContent = `$${price.toFixed(2)}`;
    changeElement.textContent = `${change.toFixed(2)}%`;
    changeElement.className = change >= 0 ? 'text-success' : 'text-danger';
}

function initChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'ICP Price (USD)',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function updateChart(timestamp, price) {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    chart.data.labels.push(date.toLocaleTimeString());
    chart.data.datasets[0].data.push(price);
    
    // Keep only last 100 data points
    if (chart.data.labels.length > 100) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    
    chart.update();
}

async function updateData() {
    const priceData = await fetchICPPrice();
    if (priceData) {
        updatePriceDisplay(priceData.price, priceData.change);
        await backend.addPriceData(priceData.price);
        updateChart(BigInt(Date.now()) * BigInt(1000000), priceData.price);
    }
}

async function initialize() {
    document.getElementById('loading').style.display = 'inline-block';
    
    initChart();
    
    // Load historical data
    const history = await backend.getPriceHistory();
    history.forEach(entry => {
        updateChart(entry.timestamp, entry.price);
    });
    
    // Initial update
    await updateData();
    
    // Hide loading spinner
    document.getElementById('loading').style.display = 'none';
    
    // Set up periodic updates
    setInterval(updateData, FETCH_INTERVAL);
}

// Initialize when the page loads
window.addEventListener('load', initialize);
