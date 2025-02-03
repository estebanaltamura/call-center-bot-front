import Typo from 'components/general/Typo';
import { useAssistantContext } from 'contexts/AssistantProvider';
import { useBusinessContext } from 'contexts/BusinessProvider';
import { useHatContext } from 'contexts/HatProvider';
import { useKnowledgeContext } from 'contexts/KnowledgeProvider';
import { useRulesContext } from 'contexts/RulesProvider';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICES } from 'services/index';
import {
  Entities,
  IAssistantEntity,
  IBusinessEntity,
  IHatEntity,
  IKnowledgeEntity,
  IRulesEntity,
} from 'types/dynamicSevicesTypes';

const HatViewer = ({ hatId }: { hatId: string }) => {
  const navigate = useNavigate();

  // Estados
  const [currentHat, setCurrentHat] = useState<IHatEntity | null>(null);
  const [currentBusiness, setCurrentBusiness] = useState<IBusinessEntity | null>(null);
  const [currentAssistant, setCurrentAssistant] = useState<IAssistantEntity | null>(null);
  const [currentRules, setCurrentRules] = useState<IRulesEntity | null>(null);
  const [currentKnowledge, setCurrentKnowledge] = useState<IKnowledgeEntity | null>(null);

  // Contextos
  const { allItemList: allItemListBusiness } = useBusinessContext();
  const { allItemList: allItemListAssistant } = useAssistantContext();
  const { allItemList: allItemListKnowledge } = useKnowledgeContext();
  const { allItemList: allItemListRules } = useRulesContext();
  const { allItemList: allItemListHat } = useHatContext();

  // Carga inicial del hat
  useEffect(() => {
    const foundHat = allItemListHat.find((h) => h.id === hatId) || null;
    setCurrentHat(foundHat);
  }, [allItemListHat, hatId]);

  // Cada vez que currentHat cambie, obtenemos las entidades relacionadas
  useEffect(() => {
    if (!currentHat) return;
    const bus = allItemListBusiness.find((b) => b.id === currentHat.businessId) || null;
    const asst = allItemListAssistant.find((a) => a.id === currentHat.assistantId) || null;
    const know = allItemListKnowledge.find((k) => k.id === currentHat.knowledgeId) || null;
    const rul = allItemListRules.find((r) => r.id === currentHat.ruleId) || null;
    setCurrentBusiness(bus);
    setCurrentAssistant(asst);
    setCurrentKnowledge(know);
    setCurrentRules(rul);
  }, [currentHat, allItemListBusiness, allItemListAssistant, allItemListKnowledge, allItemListRules]);

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex">
        <button onClick={() => navigate('/hats')} className="text-xl font-bold text-center gap-2 flex">
          <span className="relative top-[2px]">&#8617;</span>
          {`VOLVER`}
        </button>
      </div>

      <div className="mt-12 overflow-y-auto scroll-custom">
        <h1 className="text-xl font-bold text-center">PROMPT</h1>

        <div className="mb-6 mt-7">{/* <Typo type="body1">{firstElement}</Typo> */}</div>

        {currentBusiness && currentBusiness.features && currentBusiness.features.length > 0 && (
          <div className="mb-8">
            <Typo type="title3Semibold" style={{ marginBottom: '10px' }}>
              NEGOCIO
            </Typo>
            {currentBusiness.features.map((item, index) => (
              <div key={index} className="p-1 flex gap-2">
                <span>&bull;</span>
                <Typo type="body1Semibold">{item.option}:</Typo>
                <Typo type="body2">{item.text}</Typo>
              </div>
            ))}
          </div>
        )}

        {currentBusiness && currentBusiness.services && currentBusiness.services.length > 0 && (
          <div className="mb-8">
            <Typo type="title3Semibold" style={{ marginBottom: '10px' }}>
              SERVICIOS
            </Typo>
            {currentBusiness.services.map((serv, index) => (
              <div key={index} className="p-1 flex gap-2 flex-col">
                <Typo type="body1Semibold" style={{ marginBottom: '10px' }}>
                  Servicio {index + 1}:
                </Typo>
                <Typo type="body1" style={{ marginBottom: '10px' }}>
                  Nombre: {serv.title}:
                </Typo>
                <Typo type="body1" style={{ marginBottom: '10px' }}>
                  Descripcion: {serv.description}:
                </Typo>
                {serv.items.map((it, idx) => (
                  <div key={idx} className="p-1 flex gap-2">
                    <span>&bull;</span>
                    <Typo type="body1Semibold">{it.option}:</Typo>
                    <Typo type="body2">{it.text}</Typo>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {currentAssistant && currentAssistant.features && currentAssistant.features.length > 0 && (
          <div className="mb-8">
            <Typo type="title3Semibold" style={{ marginBottom: '10px' }}>
              ASISTENTE
            </Typo>
            {currentAssistant.features.map((item, index) => (
              <div key={index} className="p-1 flex gap-2">
                <span>&bull;</span>
                <Typo type="body1Semibold">{item.option}:</Typo>
                <Typo type="body2">{item.text}</Typo>
              </div>
            ))}
          </div>
        )}

        {currentKnowledge && currentKnowledge.features && currentKnowledge.features.length > 0 && (
          <div className="mb-8">
            <Typo type="title3Semibold" style={{ marginBottom: '10px' }}>
              CONOCIMIENTO
            </Typo>
            {currentKnowledge.features.map((item, index) => (
              <div key={index} className="p-1 flex gap-2">
                <span>&bull;</span>
                <Typo type="body1Semibold">{item.option}:</Typo>
                <Typo type="body2">{item.text}</Typo>
              </div>
            ))}
          </div>
        )}

        {currentRules && currentRules.features && currentRules.features.length > 0 && (
          <div className="mb-8">
            <Typo type="title3Semibold" style={{ marginBottom: '10px' }}>
              REGLAS
            </Typo>
            {currentRules.features.map((item, index) => (
              <div key={index} className="p-1 flex gap-2">
                <span>&bull;</span>
                <Typo type="body1Semibold">{item.option}:</Typo>
                <Typo type="body2">{item.text}</Typo>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HatViewer;
