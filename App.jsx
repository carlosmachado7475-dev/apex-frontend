import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Wallet, History, ShieldCheck, Mail, Lock, ArrowRight, Zap, Timer, UserPlus, LogOut, User } from 'lucide-react';

// ================= LISTA DE ATIVOS =================
const FOREX = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'NZD/USD', 'USD/CAD',
  'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'EUR/CHF', 'AUD/JPY', 'CAD/JPY', 'CHF/JPY',
  'EUR/AUD', 'EUR/CAD', 'GBP/CHF', 'GBP/AUD', 'GBP/CAD', 'AUD/CAD', 'AUD/CHF',
  'NZD/JPY', 'USD/MXN', 'USD/ZAR', 'USD/TRY', 'USD/SGD', 'USD/NOK', 'USD/SEK',
  'EUR/NOK', 'EUR/SEK', 'EUR/PLN', 'USD/PLN', 'USD/THB', 'USD/INR', 'USD/KRW', 'USD/CNH'
];

const CRYPTO = [
  'BTC/USD', 'ETH/USD', 'XRP/USD', 'LTC/USD', 'BCH/USD', 'ADA/USD', 'DOGE/USD',
  'SOL/USD', 'DOT/USD', 'LINK/USD', 'AVAX/USD', 'MATIC/USD', 'UNI/USD', 'ATOM/USD',
  'XLM/USD', 'EOS/USD', 'TRX/USD', 'FIL/USD', 'NEAR/USD', 'SHIB/USD'
];

const INDICES = ['US30', 'NAS100', 'SPX500', 'GER40', 'UK100', 'JPN225', 'FRA40', 'AUS200', 'EU50', 'ESP35'];

const COMMODITIES = ['XAU/USD', 'XAG/USD', 'XPT/USD', 'XPD/USD', 'WTI', 'BRENT', 'NATGAS', 'COPPER'];

const STOCKS = [
  'AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC',
  'IBM', 'ORCL', 'KO', 'PEP', 'JPM', 'BAC', 'DIS', 'BA', 'V', 'MA', 'PYPL', 'UBER',
  'SBUX', 'NKE', 'PFE', 'MRNA', 'JNJ', 'WMT', 'TGT', 'XOM', 'CVX', 'GM', 'F', 'GE',
  'CAT', 'HD', 'LOW', 'COST', 'T', 'VZ', 'CSCO', 'QCOM', 'CRM', 'ADBE'
];

const MARKET_ASSETS = {
  'Mercado Aberto': [...FOREX, ...CRYPTO, ...INDICES, ...COMMODITIES, ...STOCKS],
  'OTC': [
    'EUR/USD OTC', 'GBP/USD OTC', 'USD/JPY OTC', 'USD/CHF OTC', 'AUD/USD OTC',
    'NZD/USD OTC', 'USD/CAD OTC', 'EUR/GBP OTC', 'EUR/JPY OTC', 'GBP/JPY OTC',
    'XAU/USD OTC', 'XAG/USD OTC', 'BTC/USD OTC', 'ETH/USD OTC', 'SOL/USD OTC',
    'DOGE/USD OTC', 'US30 OTC', 'NAS100 OTC', 'SPX500 OTC', 'GER40 OTC'
  ]
};

// ================= CADASTRO / LOGIN (localStorage) =================
const USERS_KEY = 'aiTrader_users';
const SESSION_KEY = 'aiTrader_session';

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
};

const saveSession = (email) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

// ================= CONFLUÊNCIAS E UTILITÁRIOS =================
const CONFLUENCES = [
  'TRIX Cruzado Positivo', 'RSI Sobrevendido (28)', 'Suporte M15 Confirmado',
  'Média Móvel 50 Alta', 'MACD Histograma Positivo', 'Estocástico Cruzado',
  'Bandas de Bollinger Apertadas', 'Volume em Alta'
];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatClock = (date) =>
  date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

function generateSignal(market) {
  const assets = MARKET_ASSETS[market];
  const asset = assets[rand(0, assets.length - 1)];
  const accuracy = rand(78, 95);
  const direction = Math.random() < 0.5 ? 'CALL' : 'PUT';
  const expiry = accuracy >= 85 ? 1 : 5;
  const confs = [...new Set([
    CONFLUENCES[rand(0, CONFLUENCES.length - 1)],
    CONFLUENCES[rand(0, CONFLUENCES.length - 1)],
    CONFLUENCES[rand(0, CONFLUENCES.length - 1)]
  ])].slice(0, 3);
  return { asset, accuracy, direction, expiry, confs };
}

// ================= APP PRINCIPAL =================
export default function App() {
  const [sessionUser, setSessionUser] = useState(() => {
    const s = getSession();
    if (!s) return null;
    const users = getUsers();
    return users.find((u) => u.email === s.email) || null;
  });
  const [authMode, setAuthMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [market, setMarket] = useState('Mercado Aberto');
  const [signal, setSignal] = useState(() => generateSignal('Mercado Aberto'));
  const [timeLeft, setTimeLeft] = useState(420);
  const [bankroll, setBankroll] = useState(1000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [history, setHistory] = useState([
    { id: 1, time: '10:15', asset: 'EUR/USD', type: 'CALL', result: 'WIN' },
    { id: 2, time: '10:00', asset: 'GBP/JPY', type: 'PUT', result: 'WIN' },
    { id: 3, time: '09:45', asset: 'BTC/USD', type: 'CALL', result: 'LOSS' }
  ]);

  const isAuthenticated = !!sessionUser;
  const entryAmount = (bankroll * (riskPercent / 100)).toFixed(2);
  const wins = history.filter((h) => h.result === 'WIN').length;
  const losses = history.filter((h) => h.result === 'LOSS').length;

  const nextSignalClock = () => {
    const d = new Date();
    d.setSeconds(d.getSeconds() + timeLeft);
    return formatClock(d);
  };

  const entryClock = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + signal.expiry);
    return formatClock(d);
  };

  const changeMarket = (m) => {
    setMarket(m);
    setSignal(generateSignal(m));
    setTimeLeft(420);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    if (password.length < 4) {
      setError('A senha precisa ter pelo menos 4 caracteres.');
      return;
    }
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setError('Este e-mail já está cadastrado. Faça login.');
      return;
    }
    users.push({ name: name.trim(), email: email.trim().toLowerCase(), password });
    saveUsers(users);
    setSuccess('Cadastro realizado! Agora faça login.');
    setName('');
    setEmail('');
    setPassword('');
    setAuthMode('login');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) {
      setError('E-mail ou senha incorretos. Se ainda não tem conta, cadastre-se.');
      return;
    }
    saveSession(user.email);
    setSessionUser(user);
  };

  const handleLogout = () => {
    clearSession();
    setSessionUser(null);
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || timeLeft !== 0) return;
    const result = Math.random() * 100 < signal.accuracy ? 'WIN' : 'LOSS';
    setHistory((h) => [
      { id: Date.now(), time: formatClock(new Date()), asset: signal.asset, type: signal.direction, result },
      ...h
    ].slice(0, 12));
    setSignal(generateSignal(market));
    setTimeLeft(420);
  }, [timeLeft, isAuthenticated, market, signal]);

  // ================= TELA DE LOGIN / CADASTRO =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-xl mb-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              AI TRADER
            </h1>
            <p className="text-xs text-slate-400 mt-1">Análise Preditiva de Alta Confluência</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-3 mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg p-3 mb-4">
              {success}
            </div>
          )}

          {authMode === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nome Completo</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Senha</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition-colors"
              >
                <UserPlus className="w-4 h-4" /> Criar Conta
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">E-mail de Acesso</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Senha</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition-colors"
              >
                Entrar na Plataforma <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
            className="w-full text-center text-xs text-slate-400 hover:text-emerald-400 transition-colors mt-5"
          >
            {authMode === 'login' ? "Não possui uma conta? Cadastre-se" : "Já possui uma conta? Fazer login"}
          </button>

          <p className="text-[11px] text-slate-500 text-center mt-4">
            Acesso restrito. Cada usuário cria a própria conta.
          </p>
        </div>
      </div>
    );
  }

  // ================= DASHBOARD =================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6">
      <header className="max-w-7xl mx-auto mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            AI TRADER
          </h1>
          <p className="text-xs text-slate-400">Análise Preditiva de Alta Confluência (7 Min)</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
            {Object.keys(MARKET_ASSETS).map((m) => (
              <button
                key={m}
                onClick={() => changeMarket(m)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  market === m
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {market} | Conexão Ativa
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-sm">
            <User className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">{sessionUser.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 ml-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400" />
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div>
                <p className="text-xs text-slate-400 mb-1">Ativo Selecionado</p>
                <h2 className="text-3xl font-extrabold text-white">{signal.asset}</h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-1">Próxima troca em</p>
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-xl font-bold">
                  <Clock className="w-5 h-5" />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 border-t border-slate-800/60 pt-6">
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-1">Sinal</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                  signal.direction === 'CALL'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-red-500/15 text-red-400'
                }`}>
                  {signal.direction === 'CALL' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  {signal.direction === 'CALL' ? 'COMPRA (CALL)' : 'VENDA (PUT)'}
                </div>

                <div className="mt-4">
                  <p className="text-xs text-slate-400 mb-1">Horário da próxima operação</p>
                  <div className="flex items-center gap-2 text-white font-mono text-xl font-bold">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    {entryClock()}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto text-center md:text-right border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                <p className="text-xs text-slate-400 mb-1">Acertividade da IA</p>
                <div className="text-3xl font-extrabold text-white">{signal.accuracy}%</div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden md:w-40 ml-auto">
                  <div
                    className={`h-full rounded-full ${signal.accuracy >= 85 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    style={{ width: `${signal.accuracy}%` }}
                  ></div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-slate-400 mb-1">Expiração</p>
                  <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 px-3 py-1.5 rounded-lg font-mono font-bold text-sm">
                    <Timer className="w-4 h-4" />
                    {signal.expiry}m
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/60">
              <p className="text-xs text-slate-400 mb-2">Confluências Detectadas:</p>
              <div className="flex flex-wrap gap-2">
                {signal.confs.map((c) => (
                  <span key={c} className="bg-slate-800/60 text-slate-300 text-xs px-2.5 py-1 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400">
            <p>
              O sinal é atualizado automaticamente a cada 7 minutos. A expiração (1m ou 5m) é definida pela acertividade: acertividade alta (85% ou mais) indica expiração curta (1m); abaixo disso, 5m.
            </p>
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

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Risco por Operação: {riskPercent}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400">Entrada Recomendada</p>
                  <p className="text-lg font-bold text-emerald-400 font-mono">R$ {entryAmount}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Acertividade</p>
                  <p className="text-lg font-bold text-white font-mono">{signal.accuracy}%</p>
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
              <span className="text-xs">{wins} WIN / {losses} LOSS</span>
            </div>

            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{item.time}</span>
                    <span className="text-slate-200 font-medium">{item.asset}</span>
                    <span className={item.type === 'CALL' ? 'text-emerald-400' : 'text-red-400'}>{item.type}</span>
                  </div>
                  <span className={`font-bold ${item.result === 'WIN' ? 'text-emerald-400' : 'text-red-400'}`}>
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
