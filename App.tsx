import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenerativeAI } from "@google/genai";

// --- 1. DEFINIÇÕES DE TIPOS (TYPES) ---
export enum AppState { IDLE, SUBMITTING, SUCCESS, ERROR }

export interface UserData {
  id: string;
  timestamp: number;
  operador: string;
  tipo: string[];
  tkt: string;
  localizador: string;
  dataVoo: string;
  bio: string;
}

export interface AIAnalysis {
  summary: string;
  sentiment?: string;
  priority?: string;
}

// --- 2. SERVIÇO GEMINI (INLINE) ---
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

async function enhanceUserProfile(userData: UserData): Promise<AIAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analise este atendimento de aviação: Operador: ${userData.operador}, PNR: ${userData.localizador}, Relato: ${userData.bio}. Forneça um resumo técnico curto para o histórico do cliente.`;
    const result = await model.generateContent(prompt);
    return { summary: result.response.text() };
  } catch (error) {
    return { summary: "Análise indisponível no momento." };
  }
}

// --- 3. COMPONENTES DE INTERFACE (UI COMPONENTS) ---

const InputField = ({ label, icon, placeholder, value, onChange, required, textarea, rows }: any) => (
  <div className="w-full">
    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">{label}</label>
    <div className="relative">
      <div className="absolute left-5 top-5 text-gray-400 z-10"><i className={`fas ${icon}`}></i></div>
      {textarea ? (
        <textarea rows={rows} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[#121B33] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-semibold text-sm" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
      ) : (
        <input className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[#121B33] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-semibold text-sm" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
      )}
    </div>
  </div>
);

const DateInputField = ({ label, value, onChange, required }: any) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 8) val = val.slice(0, 8);
    let masked = val;
    if (val.length > 2) masked = `${val.slice(0, 2)}/${val.slice(2)}`;
    if (val.length > 4) masked = `${masked.slice(0, 5)}/${val.slice(4)}`;
    onChange(masked);
  };
  return (
    <div className="w-full">
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">{label}</label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10"><i className="fas fa-calendar-alt"></i></div>
        <input maxLength={10} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[#121B33] outline-none font-semibold text-sm" placeholder="DD/MM/AAAA" value={value} onChange={handleDateChange} required={required} />
      </div>
    </div>
  );
};

const MultiSelectField = ({ label, options, selectedValues, onChange }: any) => (
  <div className="w-full">
    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-4">{label}</label>
    <div className="grid grid-cols-3 gap-4">
      {options.map((opt: any) => {
        const isSelected = selectedValues.includes(opt.value);
        return (
          <button key={opt.value} type="button" onClick={() => isSelected ? onChange(selectedValues.filter((v:any) => v !== opt.value)) : onChange([...selectedValues, opt.value])}
            className={`flex flex-col items-center p-5 rounded-[1.5rem] border-2 transition-all gap-2 ${isSelected ? 'bg-[#FF671B] border-[#FF671B] text-white shadow-lg' : 'bg-white border-gray-50 text-gray-400'}`}>
            <i className={`fas ${opt.icon} text-xl`}></i>
            <span className="text-[10px] font-black uppercase">{opt.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

// --- 4. APLICAÇÃO PRINCIPAL (MAIN APP) ---
export default function App() {
  const [formData, setFormData] = useState({ operador: '', tipo: [] as string[], tkt: '', localizador: '', dataVoo: '', bio: '' });
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [view, setView] = useState<'OPERATOR' | 'ADMIN'>('OPERATOR');
  const [aiResult, setAiResult] = useState<AIAnalysis | null>(null);
  const [registrations, setRegistrations] = useState<UserData[]>([]);
  const [passInput, setPassInput] = useState('');
  const [showPassModal, setShowPassModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('smiles_registrations');
    if (saved) setRegistrations(JSON.parse(saved));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(AppState.SUBMITTING);
    const userData: UserData = { ...formData, id: crypto.randomUUID(), timestamp: Date.now() };
    const analysis = await enhanceUserProfile(userData);
    const updated = [userData, ...registrations];
    setRegistrations(updated);
    localStorage.setItem('smiles_registrations', JSON.stringify(updated));
    setAiResult(analysis);
    setState(AppState.SUCCESS);
  };

  const resetForm = () => {
    setFormData({ operador: '', tipo: [], tkt: '', localizador: '', dataVoo: '', bio: '' });
    setState(AppState.IDLE);
    setAiResult(null);
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7F9] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#121B33] flex flex-col fixed h-full p-6">
        <img src="https://upload.wikimedia.org/wikipedia/pt/2/23/Logotipo_Smiles.png" alt="Smiles" className="w-32 mb-12 brightness-0 invert mx-auto" />
        <nav className="space-y-4">
          <button onClick={() => setView('OPERATOR')} className={`w-full text-left p-4 rounded-xl font-bold uppercase text-[10px] tracking-widest ${view === 'OPERATOR' ? 'bg-[#FF671B] text-white' : 'text-gray-400'}`}>Novo Registro</button>
          <button onClick={() => setShowPassModal(true)} className={`w-full text-left p-4 rounded-xl font-bold uppercase text-[10px] tracking-widest ${view === 'ADMIN' ? 'bg-[#FF671B] text-white' : 'text-gray-400'}`}>Painel Admin</button>
        </nav>
      </aside>

      <main className="flex-1 ml-64 p-10">
        <div className="max-w-4xl mx-auto">
          {view === 'OPERATOR' ? (
            state !== AppState.SUCCESS ? (
              <div className="bg-white rounded-[3rem] p-12 shadow-xl border-t-8 border-[#FF671B]">
                <h2 className="text-2xl font-black text-[#121B33] uppercase mb-10">Registro de Atendimento</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <InputField label="Agente" icon="fa-user" placeholder="Nome" value={formData.operador} onChange={(v:any) => setFormData({...formData, operador: v})} required />
                    <DateInputField label="Data do Voo" value={formData.dataVoo} onChange={(v:any) => setFormData({...formData, dataVoo: v})} required />
                  </div>
                  <MultiSelectField label="Impacto" options={[{value:'FF', label:'FF', icon:'fa-star'}, {value:'BAG', label:'Bagagem', icon:'fa-suitcase'}]} selectedValues={formData.tipo} onChange={(v:any) => setFormData({...formData, tipo: v})} />
                  <InputField label="Relato" textarea rows={4} icon="fa-comment" placeholder="Detalhes..." value={formData.bio} onChange={(v:any) => setFormData({...formData, bio: v})} required />
                  <button type="submit" className="w-full py-6 bg-[#FF671B] text-white rounded-2xl font-black tracking-widest uppercase hover:bg-[#e55d18] transition-all">
                    {state === AppState.SUBMITTING ? 'Processando...' : 'Transmitir Dados'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center bg-white p-16 rounded-[3rem] shadow-xl">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl"><i className="fas fa-check"></i></div>
                <h2 className="text-3xl font-black mb-4">Sincronizado!</h2>
                <p className="text-gray-500 mb-8 font-bold italic">"{aiResult?.summary}"</p>
                <button onClick={resetForm} className="px-10 py-4 bg-[#121B33] text-white rounded-xl font-black">NOVO REGISTRO</button>
              </div>
            )
          ) : (
            <div className="bg-white p-10 rounded-3xl shadow-xl">
              <h2 className="text-xl font-black mb-6">FILA DE ATENDIMENTO ({registrations.length})</h2>
              {registrations.map(reg => (
                <div key={reg.id} className="border-b py-4 flex justify-between items-center">
                  <div>
                    <p className="font-black text-[#121B33]">{reg.localizador} - {reg.operador}</p>
                    <p className="text-xs text-gray-400">{reg.dataVoo}</p>
                  </div>
                  <button className="text-[#FF671B] font-bold text-xs uppercase">Ver Detalhes</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Senha */}
      {showPassModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-[100]">
          <div className="bg-white p-10 rounded-[2rem] text-center w-80">
            <h3 className="font-black mb-6 uppercase">Acesso Restrito</h3>
            <input type="password" placeholder="Senha" className="w-full p-4 border rounded-xl mb-6 text-center" value={passInput} onChange={(e)=>setPassInput(e.target.value)} />
            <button onClick={() => {if(passInput==='jeff123'){setView('ADMIN'); setShowPassModal(false)} else {alert('Erro')}}} className="w-full py-4 bg-[#FF671B] text-white rounded-xl font-black">ENTRAR</button>
          </div>
        </div>
      )}
    </div>
  );
}