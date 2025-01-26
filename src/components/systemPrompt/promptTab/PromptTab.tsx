import Typo from 'components/general/Typo';
import { useAssistantContext } from 'contexts/AssistantProvider';
import { useBusinessContext } from 'contexts/BusinessProvider';
import { useKnowledgeContext } from 'contexts/KnowledgeProvider';
import { useRulesContext } from 'contexts/RulesProvider';
import { useEffect, useState } from 'react';
import { SERVICES } from 'services/index';
import {
  Entities,
  IAssistantEntity,
  IBusinessEntity,
  IKnowledge,
  IKnowledgeEntity,
  IRulesEntity,
} from 'types/dynamicSevicesTypes';
import { concatenateBullets } from 'utils/prompt/concatenateBullets';

const SystemPromptTab = () => {
  const [currentFullSystemPrompt, setCurrentFullSystemPrompt] = useState<string>('');
  const { currentBusiness } = useBusinessContext();
  const { currentAssistant } = useAssistantContext();
  const { currentRules } = useRulesContext();
  const { currentKnowledge } = useKnowledgeContext();

  const concatenateSystemPrompt = () => {
    // Construcción inicial del texto
    const firstElement =
      'Como contexto paso a explicarte cómo quiero que entiendas este prompt de sistema que te estoy dando. Se divide en los siguientes tipos de informaciones core:';

    // Inicializar una lista para agregar dinámicamente los aspectos core
    const coreAspects = [];

    // Verificar y agregar cada aspecto core solo si existe
    if (currentBusiness && currentBusiness?.features?.length > 0) {
      coreAspects.push('Negocio');
    }
    if (currentBusiness && currentBusiness?.services?.length > 0) {
      coreAspects.push('Servicios');
    }
    if (currentAssistant) {
      coreAspects.push('Asistente');
    }
    if (currentRules) {
      coreAspects.push('Reglas');
    }
    if (currentKnowledge) {
      coreAspects.push('Conocimiento');
    }

    // Generar las descripciones de cada aspecto core solo si existen
    const companyInformation = currentBusiness && concatenateBullets(currentBusiness.features);
    const assistantInformation = currentAssistant && concatenateBullets(currentAssistant.features);
    const rulesInformation = currentRules && concatenateBullets(currentRules.features);
    const knowledgeInformation = currentKnowledge && concatenateBullets(currentKnowledge.features);

    const servicesInformation =
      currentBusiness && currentBusiness?.services?.length > 0
        ? currentBusiness.services
            .map(
              (item, index) =>
                `Servicio ${index + 1}: Titulo: ${item.title}, Descripcion: ${
                  item.description
                }, Caracteristicas: ${item.items.map((item) => `${item.option}: ${item.text}`).join(', ')}`,
            )
            .join(', ')
        : '';

    // Concatenar todo en el prompt
    const prompt = `${firstElement} ${coreAspects.join(', ')}. ${
      currentBusiness && currentBusiness?.features?.length > 0
        ? `Negocio(paso a describir esta informacion core): ${companyInformation}.`
        : ''
    } ${
      currentBusiness && currentBusiness?.services?.length > 0
        ? `Servicios(paso a describir esta informacion core): ${servicesInformation}.`
        : ''
    } ${
      currentAssistant && currentAssistant?.features?.length > 0
        ? `Asistente(paso a describir esta informacion core): ${assistantInformation}.`
        : ''
    } ${
      currentRules && currentRules?.features?.length > 0
        ? `Reglas(paso a describir esta informacion core): ${rulesInformation}.`
        : ''
    } ${
      currentKnowledge && currentKnowledge?.features?.length > 0
        ? `Conocimiento(paso a describir esta informacion core): ${knowledgeInformation}.`
        : ''
    }`;

    return prompt;
  };

  const updateSystemPrompt = async () => {
    const payload = {
      currentSystemPrompt: concatenateSystemPrompt(),
    };

    await SERVICES.CMS.update(Entities.systemPrompt, 'global', payload);
  };

  useEffect(() => {
    setCurrentFullSystemPrompt(concatenateSystemPrompt());
    updateSystemPrompt();
  }, [currentAssistant, currentRules, currentKnowledge, currentBusiness]);

  const renderCompany = (currentBussines: IBusinessEntity) => {
    return (
      <>
        {currentBussines && (
          <div className="mb-8">
            <Typo type="title3Semibold" style={{ marginBottom: '10px' }}>
              NEGOCIO
            </Typo>
            <div>
              {currentBussines.features.map((item, index) => (
                <div key={index} className="p-1 flex gap-2">
                  <Typo type="body1Semibold">{item.option}:</Typo>
                  <Typo type="body2">{item.text}:</Typo>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderServices = (currentBussines: IBusinessEntity) => {
    return (
      <>
        {currentBussines &&
          currentBussines.services &&
          currentBussines.services.map((item, index) => (
            <div key={index} className="mb-8">
              <Typo type="title3Semibold" style={{ marginBottom: '10px' }}>
                SERVICIO {index + 1}
              </Typo>
              <div key={index} className="p-2 flex flex-col">
                <div key={index} className="p-1 flex gap-2">
                  <Typo type="body1Semibold">Nombre:</Typo>
                  <Typo type="body2">{item.title}:</Typo>
                </div>

                <div key={index} className="p-1 flex gap-2">
                  <Typo type="body1Semibold">Descripción:</Typo>
                  <Typo type="body2">{item.description}:</Typo>
                </div>

                {item.items.map((item, index) => (
                  <div key={index} className="p-1 flex gap-2">
                    <Typo type="body1Semibold">{item.option}:</Typo>
                    <Typo type="body2">{item.text}:</Typo>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </>
    );
  };

  const renderAssistant = (currentAssistant: IAssistantEntity) => {
    return (
      <>
        {currentAssistant && (
          <div className="mb-8">
            <Typo type="title3Semibold" style={{ marginBottom: '10px' }}>
              ASISTENTE
            </Typo>
            <div>
              {currentAssistant.features.map((item, index) => (
                <div key={index} className="p-1 flex gap-2">
                  <Typo type="body1Semibold">{item.option}:</Typo>
                  <Typo type="body2">{item.text}:</Typo>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderRules = (currentRules: IRulesEntity) => {
    return (
      <>
        {currentRules && (
          <div className="mb-8">
            <Typo type="title3Semibold" style={{ marginBottom: '10px' }}>
              REGLAS
            </Typo>
            <div className="space-y-2">
              <div>
                {currentRules.features.map((item, index) => (
                  <div key={index} className="p-1 flex gap-2">
                    <Typo type="body1Semibold">{item.option}:</Typo>
                    <Typo type="body2">{item.text}:</Typo>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderKnowledge = (currentKnowledge: IKnowledgeEntity) => {
    return (
      <>
        {currentKnowledge && (
          <div>
            <Typo type="title3Semibold" style={{ marginBottom: '10px' }}>
              CONTEXTO DE CONOCIMIENTO
            </Typo>
            <div className="space-y-2">
              {currentKnowledge.features.map((item, index) => (
                <div key={index} className="p-1 flex gap-2">
                  <Typo type="body1Semibold">{item.option}:</Typo>
                  <Typo type="body2">{item.text}:</Typo>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  useEffect(() => {
    currentAssistant && concatenateBullets(currentAssistant.features);
  }, [currentAssistant, currentRules, currentKnowledge]);

  return (
    <div className="p-4 h-full flex flex-col">
      <h1 className="text-xl font-bold text-center">PROMPT</h1>
      <div className="mt-4 overflow-y-auto scroll-custom">
        {/* Negocio */}
        {currentBusiness && currentBusiness.features && renderCompany(currentBusiness)}

        {/* Servicios */}
        {currentBusiness && currentBusiness.services && renderServices(currentBusiness)}

        {/* Asistente */}
        {currentAssistant && currentAssistant.features && renderAssistant(currentAssistant)}

        {/* Rules */}
        {currentRules && currentRules.features && renderRules(currentRules)}

        {/* Knowledge */}
        {currentKnowledge &&
          currentKnowledge.features &&
          renderKnowledge &&
          renderKnowledge(currentKnowledge)}

        <h1 className="text-xl font-bold text-center">PROMPT FINAL</h1>
        <Typo type="title3Semibold" style={{ marginBottom: '10px' }}>
          {currentFullSystemPrompt}
        </Typo>
      </div>
    </div>
  );
};

export default SystemPromptTab;
