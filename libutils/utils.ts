export const getDateAndTime = (timeString: Date) => {

    // Create a Date object
    const dateObject = new Date(timeString);
  
    // Extract date
    const date = dateObject.toLocaleDateString("en-US"); // Format: MM/DD/YYYY (default in en-US)
  
    // Extract time
    const time = dateObject.toLocaleTimeString("en-US"); // Format: HH:MM:SS AM/PM
  
    return `- ${time} on ${date}`
  }