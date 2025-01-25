import { IOptionTextItem } from 'types';

export const concatenateBullets = (bullets: IOptionTextItem[]) => {
  if (!Array.isArray(bullets)) throw new Error('El argumento pasado tiene que ser un array');

  bullets.forEach((bullet) => {
    if (typeof bullet.option !== 'string' || typeof bullet.text !== 'string') {
      throw new Error('Cada elemento debe tener propiedades option y text de tipo string');
    }
  });

  const bulletsConcatenated = bullets.map((item) => `${item.option}: ${item.text}`).join(',');

  return `Características: ${bulletsConcatenated}`;
};
