// Function to generate realistic temperature, pressure, and humidity
const generate = (temperature = 20, pressure = 1013, humidity = 50) => {
    // Define realistic fluctuation factors
    const tempVariation = (Math.random() * 2 - 1).toFixed(2); // ±1 degree variation
    const pressureVariation = (Math.random() * 0.5 - 0.25).toFixed(2); // ±0.25 hPa variation
    const humidityVariation = (Math.random() * 5 - 2.5).toFixed(2); // ±2.5% variation
  
    // Update the values
    temperature = parseFloat((temperature + parseFloat(tempVariation)).toFixed(2));
    pressure = parseFloat((pressure + parseFloat(pressureVariation)).toFixed(2));
    humidity = Math.min(100, Math.max(0, parseFloat((humidity + parseFloat(humidityVariation)).toFixed(2)))); // Keep humidity between 0-100%
  
    
    // Call the function again after 2 seconds
  
    // Return the current values
    return { temperature, pressure, humidity };
  };
  
  // Export the function
  module.exports = {
    generate
  };
  
  // Call the function once to start the process

  