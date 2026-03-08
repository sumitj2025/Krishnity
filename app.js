const form = document.getElementById("tracking-form");
const courierInput = document.getElementById("courier");
const trackingNumberInput = document.getElementById("tracking-number");
const result = document.getElementById("result");
const summary = document.getElementById("summary");
const route = document.getElementById("route");

const routes = [
  ["Shanghai, CN", "Incheon, KR", "Anchorage, US", "Chicago, US", "Toronto, CA"],
  ["Shenzhen, CN", "Hong Kong, HK", "Leipzig, DE", "Paris, FR", "Madrid, ES"],
  ["Mumbai, IN", "Dubai, AE", "Istanbul, TR", "Frankfurt, DE", "Amsterdam, NL"],
  ["São Paulo, BR", "Miami, US", "New York, US", "London, GB", "Dublin, IE"],
];

const statusMessages = [
  "Shipment information received",
  "Collected from sender",
  "Arrived at export facility",
  "Customs cleared",
  "In transit to destination",
  "Out for delivery",
  "Delivered",
];

function hash(text) {
  return [...text].reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function buildTimeline(courier, trackingNumber) {
  const seed = hash(`${courier}-${trackingNumber.toUpperCase()}`);
  const selectedRoute = routes[seed % routes.length];
  const progress = (seed % selectedRoute.length) + 1;
  const now = new Date();

  return selectedRoute.map((location, index) => {
    const done = index < progress;
    const timestamp = new Date(now.getTime() - (selectedRoute.length - index) * 6 * 60 * 60 * 1000);

    return {
      location,
      status: statusMessages[Math.min(index + 2, statusMessages.length - 1)],
      timestamp,
      done,
    };
  });
}

function renderTimeline(courier, trackingNumber) {
  const timeline = buildTimeline(courier, trackingNumber);

  summary.textContent = `${courier} • ${trackingNumber.toUpperCase()}`;
  route.innerHTML = "";

  timeline.forEach((stop) => {
    const item = document.createElement("article");
    item.className = `stop ${stop.done ? "done" : ""}`;
    item.innerHTML = `
      <strong>${stop.status}</strong>
      <div>${stop.location}</div>
      <div class="meta">${stop.timestamp.toLocaleString()}</div>
    `;
    route.appendChild(item);
  });

  result.classList.remove("hidden");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const courier = courierInput.value;
  const trackingNumber = trackingNumberInput.value.trim();

  if (!courier || trackingNumber.length < 8) {
    return;
  }

  renderTimeline(courier, trackingNumber);
});
