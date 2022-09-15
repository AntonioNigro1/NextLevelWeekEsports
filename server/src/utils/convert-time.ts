export function convertHourMin(hourString: string) {
  const [hours, minutes] = hourString.split(":").map(Number);
  const minutesAmount = hours * 60 + minutes;

  return minutesAmount;
}

export function convertMinHour(minutesAmount:number) {
  const hours = Math.floor(minutesAmount/60);
  const minutes = minutesAmount % 60;
  
  return
}