// Financial Terms Explainer Modal for Farmers (English & Tamil Plain Language)

import React from 'react';
import { Modal } from './Modal';
import { FINANCIAL_TERMS_EXPLANATIONS } from '../../utils/loanCalculations';
import { BookOpen, Lightbulb, ShieldCheck } from 'lucide-react';

interface FinancialGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinancialGlossaryModal: React.FC<FinancialGlossaryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const terms = Object.values(FINANCIAL_TERMS_EXPLANATIONS);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agricultural Loan & Finance Terms Guide"
      subtitle="Plain-language definitions designed to help farmers avoid hidden fees and unfair credit terms."
      maxWidth="3xl"
    >
      <div className="space-y-4">
        <div className="p-4 bg-farm-50 rounded-2xl border border-farm-200/80 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-farm-700 shrink-0 mt-0.5" />
          <p className="text-xs text-farm-900 leading-relaxed">
            Understanding these 9 terms protects you against predatory private lending rates. Never sign blank cheques or mortgage agricultural land without clear written sanction terms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {terms.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-farm-300 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-md bg-farm-100 text-farm-800 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.term}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {item.simple}
                </p>
              </div>

              <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-start gap-2 text-[11px] text-amber-900">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{item.farmerTip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
