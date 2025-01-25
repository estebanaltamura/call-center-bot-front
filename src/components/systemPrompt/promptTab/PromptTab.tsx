import Typo from 'components/general/Typo';
import { useAssistantContext } from 'contexts/AssistantProvider';
import { useCompanyContext } from 'contexts/CompanyProvider';
import { useKnowledgeContext } from 'contexts/KnowledgeProvider';
import { useRulesContext } from 'contexts/RulesProvider';
import { useEffect } from 'react';

const SystemPromptTab = () => {
  const { currentBussines } = useCompanyContext();
  const { currentAssistant } = useAssistantContext();
  const { currentRules } = useRulesContext();
  const { currentKnowledge } = useKnowledgeContext();

  console.log(currentBussines);

  return (
    <div className="p-4 h-full flex flex-col">
      <h1 className="text-xl font-bold text-center">PROMPT</h1>
      <div className="mt-4 overflow-y-auto scroll-custom">
        {/*Negocio */}
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

        {/* Servicios */}

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

        {/* Asistente */}
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

        {/* Rules */}
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

        {/* Knowledge */}
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
      </div>
    </div>
  );
};

export default SystemPromptTab;
