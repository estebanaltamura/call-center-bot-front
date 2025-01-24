export const timestampToDate = (lastMessageTimestamp: number): string => {
  const lastMesageInSeconsFormated = lastMessageTimestamp * 1000;
  const oneDayInMilliseconds = 86400000;
  const now = new Date();
  const nowTime = now.getTime();

  const todayMidnightTime = new Date(now.setHours(0, 0, 0, 0)).getTime();
  const yesterdayMidnightTime = todayMidnightTime - oneDayInMilliseconds;
  const mondayThisWeekTime = todayMidnightTime - now.getDay() * oneDayInMilliseconds;
  const mondayLastWeekTime = mondayThisWeekTime - 7 * oneDayInMilliseconds;
  const firstDayOfCurrentMonthTime = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const firstDayOfLastMonthTime = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();

  if (lastMesageInSeconsFormated >= todayMidnightTime) {
    const timeString = new Date(lastMesageInSeconsFormated).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `Hoy ${timeString} h`;
  }

  if (lastMesageInSeconsFormated >= yesterdayMidnightTime) {
    return 'Ayer';
  }

  if (lastMesageInSeconsFormated >= mondayThisWeekTime) {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dayNames[new Date(lastMesageInSeconsFormated).getDay()];
  }

  if (lastMesageInSeconsFormated >= mondayLastWeekTime) {
    return 'Semana pasada';
  }

  if (lastMesageInSeconsFormated >= firstDayOfCurrentMonthTime) {
    return 'Este mes';
  }

  if (lastMesageInSeconsFormated >= firstDayOfLastMonthTime) {
    return 'Mes pasado';
  }

  return 'Mensaje antiguo';
};
