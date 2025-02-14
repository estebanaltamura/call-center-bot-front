import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';

admin.initializeApp();

export const dailyStatsAggregator = onSchedule(
  {
    schedule: '0 0 * * *', // Se ejecuta a la medianoche (00:00) cada día
    timeZone: 'America/Argentina/Buenos_Aires',
  },
  async (event) => {
    try {
      // Usar el scheduleTime del evento para tener el tiempo programado
      const now = new Date(event.scheduleTime);

      // Como la función se dispara a las 00:00, analizamos el día anterior.
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      // Definir el rango completo del día anterior:
      // Inicio: 00:00:00.000, Fin: 23:59:59.999
      const start = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0);
      const end = new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate(),
        23,
        59,
        59,
        999,
      );

      // Formatear la fecha en "YYYY-MM-DD" para usarla como ID del documento
      const year = start.getFullYear();
      const month = String(start.getMonth() + 1).padStart(2, '0');
      const day = String(start.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      logger.log(`Procesando estadísticas para el día: ${start.toISOString()} - ${end.toISOString()}`);

      const db = admin.firestore();

      // 1. Nuevas conversaciones: creadas durante el día anterior
      const newConversationsSnap = await db
        .collection('conversations')
        .where('createdAt', '>=', start)
        .where('createdAt', '<=', end)
        .get();
      const newConversationsCount = newConversationsSnap.size;

      // 2. Conversaciones retomadas: aquellas que fueron creadas antes del día anterior, pero que
      // registraron un mensaje (lastMessageDate) durante el día anterior
      const returnedConversationsSnap = await db
        .collection('conversations')
        .where('lastMessageDate', '>=', start)
        .where('lastMessageDate', '<=', end)
        .where('createdAt', '<', start)
        .get();
      const returnedConversationsCount = returnedConversationsSnap.size;

      // 5. Guardar los resultados en las colecciones de estadísticas utilizando batch writes
      const batch = db.batch();
      const statsData = {
        value: 0,
        date: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Estadísticas de nuevas conversaciones
      const newConversationsDoc = db.collection('stats_newConversations').doc(dateKey);
      batch.set(newConversationsDoc, { ...statsData, data: newConversationsCount });

      // Estadísticas de conversaciones retomadas
      const returnedConversationsDoc = db.collection('stats_returnedConversations').doc(dateKey);
      batch.set(returnedConversationsDoc, { ...statsData, data: returnedConversationsCount });

      await batch.commit();

      logger.log(
        `Estadísticas del día ${dateKey}: nuevas=${newConversationsCount}, retomadas=${returnedConversationsCount}`,
      );
    } catch (error) {
      logger.error('Error al agregar las estadísticas diarias:', error);
    }
  },
);
