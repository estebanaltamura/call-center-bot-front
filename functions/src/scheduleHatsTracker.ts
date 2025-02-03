import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';

admin.initializeApp();

export const scheduleHatsTracker = onSchedule('* * * * *', async (event) => {
  try {
    // 1. Obtener todos los documentos de la colección 'hats'
    const hatsSnapshot = await admin.firestore().collection('hats').get();

    // 2. Extraer los IDs de los documentos
    const hatIds = hatsSnapshot.docs.map((doc) => doc.id);

    // 3. Crear documento en la colección 'stats'
    await admin.firestore().collection('stats').add({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      data: hatIds,
    });

    logger.log(`Registro creado con ${hatIds.length} IDs`);
  } catch (error) {
    logger.error('Error en la tarea:', error);
  }
});
