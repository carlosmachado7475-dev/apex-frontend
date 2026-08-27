import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Wallet, History, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados do Dashboard
  const [asset, setAsset] = useState('EUR/USD');
  const [direction, setDirection] = useState('CALL');
  const [accuracy, setAccuracy] = useState(89);
  const [timeLeft, setTimeLeft] = useState(420);
  const [bankroll, setBankroll] = useState(1000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [history, setHistory] = useState([
    { id: 1, time: '10:15', asset: 'EUR/USD', type: 'CALL', result: 'WIN' },
    { id: 2, time: '10:00', asset: 'GBP/JPY', type: 'PUT', result: 'WIN' },
    { id: 3, time: '09:45', asset: 'BTC/USD', type: 'CALL', result: 'LOSS' },
  ]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 420));
    }, 1000);
    return () => clearInterval(timer);
  }, [isAuthenticated]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const entryAmount = (bankroll * (riskPercent / 100)).toFixed(2);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-xl mb-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              APEX AI PRO
            </h1>
            <p className="text-xs text-slate-400 mt-1">Análise Preditiva de Alta Confluência</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">E-mail de Acesso</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10 mt-6"
            >
              Entrar no Sistema
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-6 font-sans">
      <header className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            APEX PREDICATIVE AI
          </h1>
          <p className="text-xs text-slate-400">Análise Preditiva de Alta Confluência (7 Min)</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-300">Mercado Aberto | Conexão Ativa</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ativo Selecionado</span>
                <h2 className="text-3xl font-extrabold text-white">{asset}</h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Janela de Tempo</span>
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-xl font-bold">
                  <Clock className="w-5 h-5" />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
              direction === 'CALL' 
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400' 
                : 'bg-rose-950/40 border-rose-500/50 text-rose-400'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${direction === 'CALL' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                  {direction === 'CALL' ? <TrendingUp className="w-10 h-10" /> : <TrendingDown className="w-10 h-10" />}
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest opacity-80">Ordem Sugerida</span>
                  <h3 className="text-4xl font-black">{direction === 'CALL' ? 'COMPRA (CALL)' : 'VENDA (PUT)'}</h3>
                </div>
              </div>

              <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                <span className="text-xs uppercase font-bold text-slate-400">Convicção da IA</span>
                <div className="text-3xl font-extrabold text-white">{accuracy}%</div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden w-32 mx-auto md:ml-auto">
                  <div className="bg-emerald-400 h-full" style={{ width: `${accuracy}%` }}></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/60">
              <span className="text-xs font-medium text-slate-400 block mb-2">Confluências Detectadas:</span>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">TRIX Cruzado Positivo</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">RSI Sobrevendido (28)</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">Suporte M15 Confirmado</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4 text-slate-200">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold">Gerenciamento de Banca</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Sua Banca Atual (R$)</label>
                <input 
                  type="number" 
                  value={bankroll} 
                  onChange={(e) => setBankroll(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block">Risco por Operação</span>
                  <span className="text-sm font-semibold text-slate-200">{riskPercent}% da Banca</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Entrada Recomendada</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">R$ {entryAmount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4 text-slate-200">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold">Histórico do Dia</h3>
              </div>
              <span className="text-xs text-emerald-400 font-bold">2 WIN / 1 LOSS</span>
            </div>

            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono">{item.time}</span>
                    <span className="font-bold text-slate-300">{item.asset}</span>
                    <span className={`font-semibold ${item.type === 'CALL' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.type}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    item.result === 'WIN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {item.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
