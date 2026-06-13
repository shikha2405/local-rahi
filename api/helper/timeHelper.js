function parseTimeToSql(time) {
  if (!time) return null;

  // Example: "10:30 AM" => "10:30:00"
  if (time.includes('AM') || time.includes('PM')) {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');

    hours = parseInt(hours, 10);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }

    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${minutes}:00`;
  }

  // Example: "10:30" => "10:30:00"
  const [hours, minutes] = time.split(':');

  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
}

module.exports = {
  parseTimeToSql,
};