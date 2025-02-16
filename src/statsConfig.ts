import { Entities } from 'types/dynamicSevicesTypes';

export const initialDate = new Date(2024, 9, 30);

export const statEntityMapNames: Partial<{ [key in Entities]: string }> = {
  [Entities.stats_newConversations]: 'Nuevas conversaciones',
  [Entities.stats_returnedConversations]: 'Conversaciones retornadas',
  [Entities.stats_leads]: 'Leads',
  [Entities.stats_sales]: 'Ventas',
  [Entities.stats_whatsappApiCost]: 'Costo API Whatsapp',
  [Entities.stats_iaCost]: 'Costo IA operaciones',
  [Entities.stats_facebookAdsCost]: 'Costo de publicidad en Facebook',
  [Entities.stats_googleAdsCost]: 'Costo de publicidad en Google',
  [Entities.stats_iaCostPlatform]: 'Costo IA plataforma',
  [Entities.stats_firebaseCostPlatfrom]: 'Costo Firebase plataforma',
};

export const implementedSince: Partial<{ [key in Entities]: Date }> = {
  [Entities.stats_newConversations]: initialDate,
  [Entities.stats_returnedConversations]: initialDate,
  [Entities.stats_leads]: initialDate,
  [Entities.stats_sales]: initialDate,
  [Entities.stats_whatsappApiCost]: new Date(2025, 1, 13),
  [Entities.stats_iaCost]: new Date(2025, 1, 15),
  [Entities.stats_facebookAdsCost]: new Date(2025, 1, 15),
  [Entities.stats_googleAdsCost]: new Date(2025, 1, 15),
  [Entities.stats_iaCostPlatform]: new Date(2025, 1, 15),
  [Entities.stats_firebaseCostPlatfrom]: new Date(2025, 1, 15),
};
