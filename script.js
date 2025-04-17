async function getFullWeather(city) {
  const apiKey = 'YOUR_API_KEY';
  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
  const currentHour = new Date().getHours();

  // 1. Get current weather
  const currentRes = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
  const currentData = await currentRes.json();

  // 2. Get past weather from history endpoint
  const historyRes = await fetch(`http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${city}&dt=${today}`);
  const historyData = await historyRes.json();

  // 3. Get forecast (future) weather
  const forecastRes = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1`);
  const forecastData = await forecastRes.json();

  // 4. Extract required hours
  const pastHours = historyData.forecast.forecastday[0].hour
                    .filter(h => h.time.includes(today) && h.time_epoch * 1000 < Date.now())
                    .slice(-4);

  const currentHourData = currentData.current;

  const futureHours = forecastData.forecast.forecastday[0].hour
                    .filter(h => h.time.includes(today) && h.time_epoch * 1000 > Date.now())
                    .slice(0, 4);

  // 5. Display on UI
  console.log("Past 4 Hours:", pastHours);
  console.log("Current:", currentHourData);
  console.log("Next 4 Hours:", futureHours);
}
