import { RoomWithRadiators, Tariff } from '@/types/database';

export interface HeatingMonthlyBreakdown {
  year: number;
  month: number;
  monthName: string;
  totalUnits: number;
  roomBreakdown: {
    roomId: string;
    roomName: string;
    units: number;
    radiators: {
      radiatorId: string;
      radiatorName: string;
      units: number;
    }[];
  }[];
  cost: number;
  abschlag: number;
  difference: number;
  status: 'saved' | 'over' | 'neutral';
}

export interface HeatingMonthlyResult {
  months: HeatingMonthlyBreakdown[];
  totalUnits: number;
  totalCost: number;
  totalAbschlag: number;
  totalDifference: number;
  overallStatus: 'saved' | 'over' | 'neutral';
}

const germanMonthNames = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

/**
 * Calculate monthly breakdown from heating radiator readings
 * Groups readings by month and calculates consumption per room/radiator
 */
export function calculateHeatingMonthlyBreakdown(
  rooms: RoomWithRadiators[],
  tariff: Tariff | null
): HeatingMonthlyResult | null {
  // Collect all readings with room/radiator info
  const allReadings: {
    roomId: string;
    roomName: string;
    radiatorId: string;
    radiatorName: string;
    date: Date;
    value: number;
  }[] = [];

  for (const room of rooms) {
    for (const radiator of room.radiators) {
      // Sort readings by date
      const sortedReadings = [...radiator.readings].sort(
        (a, b) => new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime()
      );

      // Calculate consumption between readings
      for (let i = 1; i < sortedReadings.length; i++) {
        const prevReading = sortedReadings[i - 1];
        const currReading = sortedReadings[i];
        const consumption = currReading.value - prevReading.value;

        if (consumption > 0) {
          const startDate = new Date(prevReading.reading_date);
          const endDate = new Date(currReading.reading_date);
          const totalDays = Math.max(1, Math.round(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          ));
          const dailyAverage = consumption / totalDays;

          // Distribute across months
          let currentDate = new Date(startDate);
          while (currentDate < endDate) {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const monthStart = new Date(year, month, 1);
            const monthEnd = new Date(year, month + 1, 0);

            const periodStart = currentDate > monthStart ? currentDate : monthStart;
            const periodEnd = endDate < monthEnd ? endDate : monthEnd;

            const daysInPeriod = Math.max(1, Math.round(
              (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)
            ));

            const monthConsumption = dailyAverage * daysInPeriod;

            allReadings.push({
              roomId: room.id,
              roomName: room.name,
              radiatorId: radiator.id,
              radiatorName: radiator.name,
              date: new Date(year, month, 15), // Middle of month for grouping
              value: monthConsumption,
            });

            currentDate = new Date(year, month + 1, 1);
          }
        }
      }
    }
  }

  if (allReadings.length === 0) {
    return null;
  }

  // Group by month
  const monthlyMap = new Map<string, typeof allReadings>();
  for (const reading of allReadings) {
    const key = `${reading.date.getFullYear()}-${reading.date.getMonth()}`;
    const existing = monthlyMap.get(key) || [];
    existing.push(reading);
    monthlyMap.set(key, existing);
  }

  // Build monthly breakdown
  const abschlag = tariff?.abschlag || 0;
  const pricePerUnit = tariff?.arbeitspreis || 0;
  const grundpreis = tariff?.grundpreis || 0;

  const months: HeatingMonthlyBreakdown[] = [];

  const sortedKeys = Array.from(monthlyMap.keys()).sort((a, b) => {
    const [yearA, monthA] = a.split('-').map(Number);
    const [yearB, monthB] = b.split('-').map(Number);
    return yearA !== yearB ? yearA - yearB : monthA - monthB;
  });

  for (const key of sortedKeys) {
    const [year, month] = key.split('-').map(Number);
    const readings = monthlyMap.get(key)!;

    // Group by room
    const roomMap = new Map<string, { roomName: string; radiators: Map<string, { name: string; units: number }> }>();

    for (const reading of readings) {
      let room = roomMap.get(reading.roomId);
      if (!room) {
        room = { roomName: reading.roomName, radiators: new Map() };
        roomMap.set(reading.roomId, room);
      }

      let radiator = room.radiators.get(reading.radiatorId);
      if (!radiator) {
        radiator = { name: reading.radiatorName, units: 0 };
        room.radiators.set(reading.radiatorId, radiator);
      }
      radiator.units += reading.value;
    }

    // Calculate totals
    let totalUnits = 0;
    const roomBreakdown: HeatingMonthlyBreakdown['roomBreakdown'] = [];

    for (const [roomId, room] of roomMap) {
      let roomUnits = 0;
      const radiators: { radiatorId: string; radiatorName: string; units: number }[] = [];

      for (const [radiatorId, radiator] of room.radiators) {
        const units = Math.round(radiator.units * 100) / 100;
        roomUnits += units;
        radiators.push({
          radiatorId,
          radiatorName: radiator.name,
          units,
        });
      }

      totalUnits += roomUnits;
      roomBreakdown.push({
        roomId,
        roomName: room.roomName,
        units: Math.round(roomUnits * 100) / 100,
        radiators,
      });
    }

    const cost = (totalUnits * pricePerUnit) + grundpreis;
    const difference = abschlag - cost;

    let status: 'saved' | 'over' | 'neutral' = 'neutral';
    if (abschlag > 0) {
      if (difference > 1) status = 'saved';
      else if (difference < -1) status = 'over';
    }

    months.push({
      year,
      month,
      monthName: germanMonthNames[month],
      totalUnits: Math.round(totalUnits * 100) / 100,
      roomBreakdown,
      cost: Math.round(cost * 100) / 100,
      abschlag,
      difference: Math.round(difference * 100) / 100,
      status,
    });
  }

  // Calculate totals
  const totalUnits = months.reduce((sum, m) => sum + m.totalUnits, 0);
  const totalCost = months.reduce((sum, m) => sum + m.cost, 0);
  const totalAbschlag = months.reduce((sum, m) => sum + m.abschlag, 0);
  const totalDifference = totalAbschlag - totalCost;

  let overallStatus: 'saved' | 'over' | 'neutral' = 'neutral';
  if (totalAbschlag > 0) {
    if (totalDifference > 1) overallStatus = 'saved';
    else if (totalDifference < -1) overallStatus = 'over';
  }

  return {
    months,
    totalUnits: Math.round(totalUnits * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    totalAbschlag: Math.round(totalAbschlag * 100) / 100,
    totalDifference: Math.round(totalDifference * 100) / 100,
    overallStatus,
  };
}
