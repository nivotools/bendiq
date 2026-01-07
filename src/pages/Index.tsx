// BendIQ - Professional Conduit Bending Calculator
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import {
  Compass, RefreshCw, AlertCircle, ShieldCheck, Move, CornerDownRight, Save,
  FolderInput, Trash2, Package, Download, X, Pencil, FileText, Loader2, 
  Sun, Moon, HardHat, Plus, RotateCcw, CheckCircle2, AlertTriangle, Settings, 
  Mic, Type, MousePointerClick, Flashlight, Share2, LogOut
} from 'lucide-react';

// Schema for validating project data from localStorage
const projectDataSchema = z.object({
  h: z.number().optional(),
  a: z.number().min(0).max(90).optional(),
  w: z.number().optional(),
  r: z.number().optional(),
  n: z.number().optional(),
  offsetR: z.number().optional(),
  offsetO: z.number().optional(),
  s: z.number().optional(),
  numPipes: z.number().optional(),
  bendType: z.string().optional(),
  mat: z.string().optional(),
});

const projectSchema = z.object({
  id: z.number(),
  t: z.string().max(200),
  d: z.string().max(500),
  dt: z.string(),
  data: projectDataSchema,
});

const projectsArraySchema = z.array(projectSchema);

const WIRE_DATA: any = {
  "THHN": { 
    "14": { area: 0.0097, diam: 0.111 }, 
    "12": { area: 0.0133, diam: 0.130 }, 
    "10": { area: 0.0211, diam: 0.164 }, 
    "8": { area: 0.0366, diam: 0.216 }, 
    "6": { area: 0.0507, diam: 0.254 } 
  }
};

const CONDUIT_DATA: any = {
  "EMT": { 
    "0.5": { area: 0.304, id: 0.622 }, 
    "0.75": { area: 0.533, id: 0.824 }, 
    "1": { area: 0.864, id: 1.049 }, 
    "1.25": { area: 1.496, id: 1.380 }, 
    "1.5": { area: 2.036, id: 1.610 }, 
    "2": { area: 3.356, id: 2.067 } 
  },
  "RMC": { 
    "0.5": { area: 0.355, id: 0.672 }, 
    "0.75": { area: 0.549, id: 0.836 }, 
    "1": { area: 0.887, id: 1.063 } 
  }
};

const BOX_DATA = [
  { label: "4x1-1/2 Sq", vol: 21.0 }, 
  { label: "4x2-1/8 Sq", vol: 30.3 }, 
  { label: "4-11/16 Sq", vol: 42.0 }, 
  { label: "Handy Box", vol: 13.0 }
];

const CONDUIT_TYPES: any = {
  "EMT": { label: "EMT", springback: 0.05 },
  "IMC": { label: "IMC", springback: 0.03 },
  "RMC": { label: "Rigid", springback: 0.02 }
};

const toRad = (deg: number) => (deg * Math.PI) / 180;
const format = (n: number) => parseFloat(String(n)).toFixed(2);
const vibrate = (ms: number) => { if (navigator.vibrate) navigator.vibrate(ms); };

const getRoundedPath = (points: any[], radius = 15) => {
  if (!points || points.length < 2) return "";
  let d = `M ${points[0].x} ${-points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const p0 = points[i-1], p1 = points[i], p2 = points[i+1];
    const v1 = { x: p0.x - p1.x, y: -(p0.y - p1.y) }, v2 = { x: p2.x - p1.x, y: -(p2.y - p1.y) };
    const l1 = Math.sqrt(v1.x*v1.x + v1.y*v1.y), l2 = Math.sqrt(v2.x*v2.x + v2.y*v2.y);
    const r = Math.min(radius, l1/2.2, l2/2.2);
    const u1 = { x: v1.x/l1, y: v1.y/l1 }, u2 = { x: v2.x/l2, y: v2.y/l2 };
    d += `L ${p1.x + u1.x*r} ${-p1.y + u1.y*r} Q ${p1.x} ${-p1.y} ${p1.x + u2.x*r} ${-p1.y + u2.y*r}`;
  }
  d += `L ${points[points.length-1].x} ${-points[points.length-1].y}`;
  return d;
};

const getSuggestedAngle = (h: number, currentSize: string) => {
  const hVal = parseFloat(String(h));
  const sizeVal = parseFloat(currentSize);
  if (sizeVal > 1.25) return 30;
  if (hVal <= 2) return 10;
  if (hVal <= 5) return 22.5;
  if (hVal <= 12) return 30;
  if (hVal <= 24) return 45;
  return 60;
};

const Result = ({ label, value, unit="", highlight=false, theme, isShrinkage=false }: any) => (
  <div className={`text-sm ${isShrinkage ? 'text-orange-500 font-bold' : highlight ? 'text-blue-600 font-bold' : theme === 'light' ? 'text-slate-600' : 'text-slate-400'} flex justify-between`}>
    {label} <span className="font-mono font-black">{value}{unit}</span>
  </div>
);

const Slider = ({ label, value, onChange, min, max, step=1, suffix="", settings }: any) => (
  <div className="flex flex-col gap-1 mb-4">
    <div className="flex justify-between items-end px-1 mb-1">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{label}</label>
      <span className="text-sm text-blue-500 font-mono font-bold leading-none">{value}{suffix}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => { vibrate(8); onChange(parseFloat(e.target.value)); }} className={`w-full ${settings?.largeTargets ? 'h-4' : 'h-1.5'} bg-slate-800 rounded-full appearance-none accent-blue-600 cursor-pointer shadow-inner`} />
  </div>
);

const WarningBox = ({ warnings, theme }: any) => { 
  if (!warnings || warnings.length === 0) return null; 
  return (
    <div className={`mt-4 p-3 rounded-xl border ${theme === 'light' ? 'border-red-200 bg-red-50' : 'border-red-500/20 bg-red-500/5'} space-y-2`}>
      {warnings.map((w: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <AlertTriangle size={14} className={w.type === 'error' ? 'text-red-500' : 'text-yellow-500'} /> 
          <span className={`text-[10px] font-bold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>{w.msg}</span>
        </div>
      ))}
    </div>
  ); 
};

const SpringbackAdvisory = ({ angle, type, theme, bendType, n }: any) => { 
  const factor = CONDUIT_TYPES[type]?.springback || 0.05; 
  let targetAngle = parseFloat(String(angle));
  let label = "Springback Target";
  if (bendType === 'segmented') {
    targetAngle /= n;
    label = "Per Shot Target";
  }
  const target = targetAngle * (1 + factor); 
  const accentColor = theme === 'construction' ? 'text-yellow-500' : theme === 'light' ? 'text-blue-600' : 'text-blue-400';
  return (
    <div className="mt-4 p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-3">
      <AlertCircle size={16} className={accentColor} /> 
      <div className="flex-1">
        <h4 className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-60 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{label}</h4> 
        <div className="flex justify-between items-center">
          <span className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Target for {type}</span> 
          <span className={`text-xl font-mono font-bold ${accentColor}`}>{format(target)}°</span>
        </div>
      </div>
    </div>
  ); 
};

const Visualizer = ({ type, data, theme = 'dark' }: any) => { 
  const geometry = useMemo(() => { 
    const getVal = (v: any, def=0) => isNaN(parseFloat(v)) ? def : parseFloat(v); 
    const calcBounds = (pts: any[], pad = 100) => { 
      if (!pts || pts.length === 0) return [0,0,100,100]; 
      let minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x)); 
      let minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y)); 
      return [minX - pad, -maxY - pad, (maxX - minX) + (pad * 2), (maxY - minY) + (pad * 2)]; 
    }; 
    const dimColor = theme === 'light' ? '#64748b' : theme === 'construction' ? '#facc15' : '#94a3b8';
    const Dim = ({x1, y1, x2, y2, label}: any) => (
      <g>
        <line x1={x1} y1={-y1} x2={x2} y2={-y2} stroke={dimColor} strokeWidth="1" strokeDasharray="2" />
        <text x={(x1+x2)/2} y={-(y1+y2)/2 - 12} fill={dimColor} fontSize="10" textAnchor="middle" fontWeight="black">{label}</text>
      </g>
    );
    const pipeColor = theme === 'construction' ? '#facc15' : '#2563eb';
    
    switch (type) {
      case 'offset': {
        const h = getVal(data.h, 10), a = Math.max(1, getVal(data.a, 30));
        const run = h / Math.tan(toRad(a));
        const strokeWidth = 5;
        const buffer = strokeWidth / 2 + 1;
        const pts = [{x:0,y:buffer}, {x:25,y:buffer}, {x:25+run,y:h+buffer}, {x:60+run,y:h+buffer}];
        const obstacle = {x: 25+run-5, y: 0, w: 40, h: h};
        return { pts, marks: [{...pts[1], l:"1"}, {...pts[2], l:"2"}], dims: <Dim x1={25} y1={0} x2={25+run} y2={0} label={`D: ${format(run)}"`} />, obstacle, vb: calcBounds(pts, 90) };
      }
      case 'saddle3': {
        const h = getVal(data.h, 20), a = getVal(data.a, 45);
        const run = h / Math.tan(toRad(a/2));
        const strokeWidth = 5;
        const buffer = strokeWidth / 2 + 1;
        const pts = [{x:-run-35,y:buffer}, {x:-run,y:buffer}, {x:0,y:h+buffer}, {x:run,y:buffer}, {x:run+35,y:buffer}];
        const obstacleWidth = 30;
        const obstacle = {x: -obstacleWidth/2, y: 0, w: obstacleWidth, h: h};
        return { pts, marks: [{...pts[1], l:"S"}, {...pts[2], l:"C"}, {...pts[3], l:"S"}], dims: <Dim x1={-run} y1={0} x2={run} y2={0} label={`Span: ${format(run*2)}"`} />, obstacle, vb: calcBounds(pts, 90) };
      }
      case 'saddle4': {
        const h = getVal(data.h, 20), w = getVal(data.w, 25), a = getVal(data.a, 45);
        const run = h / Math.tan(toRad(a));
        const strokeWidth = 5;
        const buffer = strokeWidth / 2 + 1;
        const pts = [{x:0,y:buffer}, {x:20,y:buffer}, {x:20+run,y:h+buffer}, {x:20+run+w,y:h+buffer}, {x:20+run+w+run,y:buffer}, {x:40+run+w+run,y:buffer}];
        const obstacle = {x: 20+run, y: 0, w: w, h: h};
        return { pts, marks: [{...pts[1], l:"1"},{...pts[2], l:"2"},{...pts[3], l:"3"},{...pts[4], l:"4"}], dims: <Dim x1={20+run} y1={h+15} x2={20+run+w} y2={h+15} label={`W: ${w}"`} />, obstacle, vb: calcBounds(pts, 90) };
      }
      case 'roll': {
        const r = getVal(data.r, 10), o = getVal(data.o, 10);
        const boxW = Math.max(30, o * 1.2);
        const boxH = Math.max(30, r * 1.2);
        const dx = 30, dy = 22;
        const minX = -40, maxX = boxW + dx + 40;
        const minY = -boxH - dy - 40, maxY = 40;
        return { custom: (
          <g>
            <path d={`M 0 0 L ${boxW} 0 L ${boxW+dx} ${-dy} L ${dx} ${-dy} Z`} fill={theme === 'light' ? '#cbd5e1' : '#1e293b'} opacity="0.2" stroke={dimColor} strokeWidth="0.5" strokeDasharray="2" />
            <path d={`M ${boxW} 0 L ${boxW} ${-boxH} L ${boxW+dx} ${-boxH-dy} L ${boxW+dx} ${-dy} Z`} fill={theme === 'light' ? '#94a3b8' : '#334155'} opacity="0.3" stroke={dimColor} strokeWidth="0.5" strokeDasharray="2" />
            <path d={`M ${boxW+dx} ${-dy} L ${boxW+dx} ${-boxH-dy} L ${dx} ${-boxH-dy} L ${dx} ${-dy} Z`} fill={theme === 'light' ? '#cbd5e1' : '#1e293b'} opacity="0.1" stroke={dimColor} strokeWidth="0.5" strokeDasharray="2" />
            <circle cx="0" cy="0" r="2" fill={pipeColor} stroke="white" strokeWidth="1" />
            <circle cx={boxW+dx} cy={-(boxH+dy)} r="2" fill={pipeColor} stroke="white" strokeWidth="1" />
            <text x={boxW/2} y={15} fill={dimColor} fontSize="9" fontWeight="bold" textAnchor="middle">ROLL: {o}"</text>
            <text x={boxW+dx+15} y={-boxH/2-dy} fill={dimColor} fontSize="9" fontWeight="bold" transform={`rotate(-90, ${boxW+dx+15}, ${-boxH/2-dy})`} textAnchor="middle">RISE: {r}"</text>
            <g transform={`translate(${(boxW+dx)/2}, ${-(boxH+dy)/2 - 15})`}>
              <rect x="-30" y="-8" width="60" height="16" rx="4" fill={theme === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'} />
              <text x="0" y="3" fill={pipeColor} fontSize="10" fontWeight="black" textAnchor="middle">TRUE: {format(Math.sqrt(r*r+o*o))}"</text>
            </g>
          </g>
        ), vb: [minX, minY, maxX - minX, maxY - minY] };
      }
      case 'conduitFill': {
        const fill = getVal(data.fill, 40);
        const color = fill > 40 ? '#ef4444' : (theme === 'construction' ? '#facc15' : '#2563eb');
        const isLight = theme === 'light';
        return { custom: (
          <g transform="translate(150,80)">
            <circle r="60" fill={isLight ? '#ffffff' : '#0f172a'} stroke={isLight ? '#cbd5e1' : '#475569'} strokeWidth="3" />
            <circle r={60 * Math.sqrt(fill/100)} fill={color} fillOpacity="0.4" stroke={color} strokeWidth="2" />
            <text y="7" fill={isLight ? '#0f172a' : 'white'} fontSize="16" fontWeight={isLight ? "400" : "300"} textAnchor="middle" fontFamily="sans-serif">{fill.toFixed(1)}%</text>
          </g>
        ), vb: [0,0,300,160] };
      }
      case 'boxFill': {
        const used = getVal(data.used, 15), cap = getVal(data.cap, 21);
        const ratio = Math.min(1, used/cap);
        const isOver = used > cap;
        const color = isOver ? '#ef4444' : (theme === 'construction' ? '#facc15' : '#2563eb');
        const isLight = theme === 'light';
        const textFill = isLight ? (ratio > 0.55 ? 'white' : '#0f172a') : 'white';
        return { custom: (
          <g transform="translate(50,120)">
            <rect x="0" y="-120" width="200" height="120" fill={isLight ? "#f1f5f9" : "#1e293b"} stroke={isLight ? "#cbd5e1" : "#475569"} strokeWidth="4" rx="4" />
            <rect x="4" y={-120 * ratio + 4} width="192" height={120 * ratio - 8} fill={color} fillOpacity="0.6" rx="2" className="transition-all duration-700" />
            <text x="100" y={-60} fill={textFill} fontSize="20" fontWeight="bold" textAnchor="middle" dominantBaseline="central">{((used/cap)*100).toFixed(0)}%</text>
          </g>
        ), vb: [0,0,300,160] };
      }
      default: return { custom: null, vb: [0,0,100,100] };
    }
  }, [type, data, theme]);
  
  if (!geometry) return null;
  const vb = geometry.vb.join(" ");
  const pipeColor = theme === 'construction' ? '#facc15' : '#2563eb';
  const isLight = theme === 'light';
  
  return (
    <div className={`relative w-full h-52 rounded-2xl overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-slate-900/50'} border border-white/5 shadow-inner`}>
      <svg viewBox={vb} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {geometry.custom ? geometry.custom : (
          <g>
            {geometry.obstacle && (
              <rect 
                x={geometry.obstacle.x} 
                y={-geometry.obstacle.h} 
                width={geometry.obstacle.w} 
                height={geometry.obstacle.h} 
                fill={isLight ? '#e2e8f0' : '#334155'} 
                stroke={isLight ? '#cbd5e1' : '#475569'} 
                strokeWidth="2" 
                rx="4"
              />
            )}
            <path d={getRoundedPath(geometry.pts)} fill="none" stroke={pipeColor} strokeWidth="5" strokeLinecap="round" />
            {geometry.marks && geometry.marks.map((m: any, i: number) => (
              <g key={i}>
                <circle cx={m.x} cy={-m.y} r="6" fill={pipeColor} stroke="white" strokeWidth="2" />
                <text x={m.x} y={-m.y - 14} fill={pipeColor} fontSize="10" fontWeight="black" textAnchor="middle">{m.l}</text>
              </g>
            ))}
            {geometry.dims}
          </g>
        )}
      </svg>
    </div>
  );
};

const LevelModal = ({ targetAngle, onClose, themeConfig, theme }: any) => {
  const [gamma, setGamma] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null) {
        setGamma(event.gamma);
      }
    };

    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            setHasPermission(true);
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error('Error requesting device orientation permission:', error);
          }
        }
      } else {
        setHasPermission(true);
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const currentAngle = Math.abs(gamma);
  const diff = Math.abs(currentAngle - targetAngle);
  const isClose = diff < 2;
  const isExact = diff < 0.5;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-5">
      <div className={`${themeConfig.card} border rounded-3xl p-8 w-full max-w-sm shadow-2xl`}>
        <div className="flex justify-between items-center mb-8">
          <h3 className={`text-lg font-black ${themeConfig.text}`}>Digital Level</h3>
          <button onClick={onClose} className={`p-2 ${themeConfig.sub} hover:text-white`}>
            <X size={20} />
          </button>
        </div>
        
        {!hasPermission ? (
          <div className="text-center py-8">
            <Compass size={48} className="mx-auto text-slate-500 mb-4" />
            <p className={`${themeConfig.sub} text-sm`}>Tap to enable motion sensors</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative h-40 flex items-center justify-center">
              <div className={`w-32 h-32 rounded-full border-4 ${isExact ? 'border-green-500' : isClose ? 'border-yellow-500' : 'border-slate-600'} flex items-center justify-center transition-colors duration-300`}>
                <div 
                  className="w-4 h-4 rounded-full bg-blue-500 transition-transform duration-100"
                  style={{ 
                    transform: `translateX(${Math.min(40, Math.max(-40, gamma))}px)` 
                  }}
                />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className={`text-4xl font-mono font-bold ${isExact ? 'text-green-500' : isClose ? 'text-yellow-500' : themeConfig.text}`}>
                {currentAngle.toFixed(1)}°
              </div>
              <div className={`text-sm ${themeConfig.sub}`}>
                Target: {targetAngle.toFixed(1)}°
              </div>
              {isExact && (
                <div className="flex items-center justify-center gap-2 text-green-500">
                  <CheckCircle2 size={16} />
                  <span className="text-sm font-bold">Perfect!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsModal = ({ onClose, onClear, onDelete, settings, setSettings, themeConfig }: any) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-5">
      <div className={`${themeConfig.card} border rounded-3xl p-6 w-full max-w-sm shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-black ${themeConfig.text}`}>Settings</h3>
          <button onClick={onClose} className={`p-2 ${themeConfig.sub} hover:text-white`}>
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <h4 className={`text-[10px] font-black uppercase tracking-widest ${themeConfig.sub}`}>Accessibility</h4>
          
          <button
            onClick={() => setSettings({...settings, voice: !settings.voice})}
            className={`w-full flex items-center justify-between p-4 rounded-2xl ${themeConfig.inset} border transition-all`}
          >
            <div className="flex items-center gap-3">
              <Mic size={18} className={settings.voice ? 'text-blue-500' : themeConfig.sub} />
              <span className={`text-sm font-bold ${themeConfig.text}`}>Voice Readout</span>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors ${settings.voice ? 'bg-blue-600' : 'bg-slate-700'} flex items-center ${settings.voice ? 'justify-end' : 'justify-start'} px-1`}>
              <div className="w-4 h-4 rounded-full bg-white shadow" />
            </div>
          </button>

          <button
            onClick={() => setSettings({...settings, dyslexic: !settings.dyslexic})}
            className={`w-full flex items-center justify-between p-4 rounded-2xl ${themeConfig.inset} border transition-all`}
          >
            <div className="flex items-center gap-3">
              <Type size={18} className={settings.dyslexic ? 'text-blue-500' : themeConfig.sub} />
              <span className={`text-sm font-bold ${themeConfig.text}`}>Dyslexia-Friendly</span>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors ${settings.dyslexic ? 'bg-blue-600' : 'bg-slate-700'} flex items-center ${settings.dyslexic ? 'justify-end' : 'justify-start'} px-1`}>
              <div className="w-4 h-4 rounded-full bg-white shadow" />
            </div>
          </button>

          <button
            onClick={() => setSettings({...settings, largeTargets: !settings.largeTargets})}
            className={`w-full flex items-center justify-between p-4 rounded-2xl ${themeConfig.inset} border transition-all`}
          >
            <div className="flex items-center gap-3">
              <MousePointerClick size={18} className={settings.largeTargets ? 'text-blue-500' : themeConfig.sub} />
              <span className={`text-sm font-bold ${themeConfig.text}`}>Large Touch Targets</span>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors ${settings.largeTargets ? 'bg-blue-600' : 'bg-slate-700'} flex items-center ${settings.largeTargets ? 'justify-end' : 'justify-start'} px-1`}>
              <div className="w-4 h-4 rounded-full bg-white shadow" />
            </div>
          </button>
        </div>

        <div className="mt-8 space-y-3">
          <h4 className={`text-[10px] font-black uppercase tracking-widest ${themeConfig.sub}`}>Data</h4>
          <button
            onClick={onClear}
            className={`w-full p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 text-sm font-bold flex items-center justify-center gap-2`}
          >
            <Trash2 size={16} /> Clear All Data
          </button>
          <button
            onClick={onDelete}
            className={`w-full p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 text-sm font-bold flex items-center justify-center gap-2`}
          >
            <AlertTriangle size={16} /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Index() { 
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('bending'); 
  const [bendType, setBendType] = useState('offset'); 
  const [theme, setTheme] = useState('dark'); 
  const [projs, setProjs] = useState<any[]>([]); 
  const [toast, setToast] = useState({ s: false, m: "" }); 
  const [isExporting, setIsExporting] = useState(false); 
  const [isLevelActive, setIsLevelActive] = useState(false); 
  const [showSettings, setShowSettings] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [renamingProject, setRenamingProject] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const streamRef = useRef<MediaStream | null>(null);
  const [settings, setSettings] = useState({
    voice: false,
    dyslexic: false,
    largeTargets: false
  });
  const [h, setH] = useState(10); 
  const [a, setA] = useState(30); 
  const [mat, setMat] = useState("EMT");
  const [w, setW] = useState(25); 
  const [r, setR] = useState(100); 
  const [n, setN] = useState(15);
  const [offsetR, setOffsetR] = useState(10); 
  const [offsetO, setOffsetO] = useState(10); 
  const [s, setS] = useState(1);
  const [numPipes, setNumPipes] = useState(3);
  const [ct, setCt] = useState("EMT"); 
  const [cs, setCs] = useState("0.75"); 
  const [wires, setWires] = useState([{ s: '12', c: 3 }]);
  const [selBox, setSelBox] = useState(0); 
  const [w14, setW14] = useState(2); 
  const [w12, setW12] = useState(4); 
  const [dev, setDev] = useState(1);
  const [bendSize, setBendSize] = useState("0.75");
  const [autoAngle, setAutoAngle] = useState(true);

  // Load projects from localStorage with user ID (validated)
  useEffect(() => {
    if (user) {
      const savedProjects = localStorage.getItem(`bendiq_projects_${user.uid}`);
      if (savedProjects) {
        try {
          const parsed = JSON.parse(savedProjects);
          const validated = projectsArraySchema.parse(parsed);
          setProjs(validated);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error('Invalid project data in localStorage, clearing:', error);
          }
          localStorage.removeItem(`bendiq_projects_${user.uid}`);
          setProjs([]);
        }
      }
    }
  }, [user]);

  // Save projects to localStorage with user ID
  useEffect(() => {
    if (user && projs.length > 0) {
      localStorage.setItem(`bendiq_projects_${user.uid}`, JSON.stringify(projs));
    }
  }, [projs, user]);

  const themeConfig = useMemo(() => {
    const isLight = theme === 'light';
    const isConst = theme === 'construction';
    return {
      bg: isLight ? 'bg-white' : isConst ? 'bg-black' : 'bg-slate-950',
      card: isLight ? 'bg-slate-50 border-slate-200 shadow-sm' : isConst ? 'bg-zinc-900 border-yellow-500/50 shadow-inner' : 'bg-slate-900 border-white/5 shadow-xl',
      inset: isLight ? 'bg-white border-slate-200 shadow-inner' : isConst ? 'bg-zinc-950 border-yellow-500/20 shadow-inner' : 'bg-slate-950 border-white/5 shadow-inner',
      tabBg: isLight ? 'bg-slate-100' : isConst ? 'bg-zinc-900' : 'bg-slate-900',
      tabActive: isConst ? 'bg-yellow-500 text-black shadow-lg' : 'bg-blue-600 text-white shadow-lg',
      text: isLight ? 'text-slate-900' : 'text-white',
      sub: isLight ? 'text-slate-500' : 'text-slate-400',
      accent: isConst ? 'text-white' : isLight ? 'text-blue-600' : 'text-blue-500',
      accentBg: isConst ? 'bg-yellow-500' : 'bg-blue-600',
    };
  }, [theme]);
  
  const appStyle = settings.dyslexic ? { fontFamily: 'Verdana, Geneva, sans-serif', letterSpacing: '0.05em' } : {};
  
  const toggleFlashlight = async () => {
    if (flashlightOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setFlashlightOn(false);
    } else {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setToast({ s: true, m: "Flashlight Unavailable" });
          setTimeout(() => setToast({ s: false, m: "" }), 2000);
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        const track = stream.getVideoTracks()[0];
        await track.applyConstraints({ advanced: [{ torch: true } as any] });
        streamRef.current = stream;
        setFlashlightOn(true);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error(err);
        }
        setToast({ s: true, m: "Camera/Flash Error" });
        setTimeout(() => setToast({ s: false, m: "" }), 2000);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'bending' && (bendType === 'offset' || bendType === 'saddle3' || bendType === 'saddle4') && autoAngle) {
      setA(getSuggestedAngle(h, bendSize));
    }
  }, [h, bendType, activeTab, bendSize, autoAngle]);

  const handleManualAngle = (val: number) => {
    setA(val);
    setAutoAngle(false);
  };

  const getBendWarnings = useCallback((bendType: string) => {
    const warnings: any[] = [];
    if (!['offset', 'saddle3', 'saddle4'].includes(bendType)) return warnings;
    const travel = h / Math.sin(toRad(a));
    if (travel > 110) {
      warnings.push({ type: 'error', msg: "Error: Offset too long for a single 10ft stick (>110\")."});
    }
    if (h > 22) {
      warnings.push({ type: 'warn', msg: "Warning: May exceed floor bender clearance (>22\")."});
    }
    return warnings;
  }, [h, a]);

  const handleShare = async (title: string, text: string) => {
    const shareData = { title, text, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${title}\n${text}\n${window.location.href}`);
        setToast({ s: true, m: "Copied to Clipboard" });
        setTimeout(() => setToast({ s: false, m: "" }), 2000);
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Share failed:', err);
      }
    }
  };

  const getShareText = () => {
    if (activeTab === 'bending') {
      if (bendType === 'offset') {
        const travel = h / Math.sin(toRad(a));
        return `Offset Bend: Height ${h}", Angle ${a}°, Travel ${format(travel)}"`;
      } else if (bendType === 'saddle3') {
        const s3dist = h / Math.sin(toRad(a/2));
        return `3-Point Saddle: Obstacle ${h}", Angle ${a}°, Center to Side ${format(s3dist)}"`;
      } else if (bendType === 'saddle4') {
        const s4travel = h / Math.sin(toRad(a));
        return `4-Point Saddle: Height ${h}", Width ${w}", Angle ${a}°, Travel ${format(s4travel)}"`;
      } else if (bendType === 'roll') {
        const trueO = Math.sqrt(offsetR*offsetR + offsetO*offsetO);
        return `Rolling Offset: Rise ${offsetR}", Roll ${offsetO}", True Offset ${format(trueO)}"`;
      }
    }
    return 'BendIQ Calculation';
  };

  const resetTab = useCallback(() => {
    if (activeTab === 'bending') {
      if (bendType === 'offset') {
        setH(10); setA(30);
      } else if (bendType === 'saddle3') {
        setH(20); setA(45);
      } else if (bendType === 'saddle4') {
        setH(20); setW(25); setA(45);
      } else if (bendType === 'roll') {
        setOffsetR(10); setOffsetO(10); setA(30);
      }
      setAutoAngle(true);
    } else if (activeTab === 'cFill') {
      setCt("EMT"); setCs("0.75"); setWires([{ s: '12', c: 3 }]);
    } else if (activeTab === 'bFill') {
      setSelBox(0); setW14(2); setW12(4); setDev(1);
    }
  }, [activeTab, bendType]);

  const saveProject = () => {
    const newProj = {
      id: Date.now(),
      t: `${bendType.charAt(0).toUpperCase() + bendType.slice(1)} Project`,
      d: getShareText(),
      dt: new Date().toLocaleDateString(),
      data: { h, a, w, r, n, offsetR, offsetO, s, numPipes, bendType, mat }
    };
    setProjs([...projs, newProj]);
    setToast({ s: true, m: "Project Saved" });
    setTimeout(() => setToast({ s: false, m: "" }), 2000);
  };

  const loadProject = (proj: any) => {
    try {
      // Validate project data before loading
      const validatedProject = projectSchema.parse(proj);
      const d = validatedProject.data;
      if (d.h !== undefined) setH(d.h);
      if (d.a !== undefined) setA(Math.min(90, Math.max(0, d.a))); // Clamp angle
      if (d.w !== undefined) setW(d.w);
      if (d.bendType !== undefined) setBendType(d.bendType);
      if (d.mat !== undefined) setMat(d.mat);
      setActiveTab('bending');
      setToast({ s: true, m: "Project Loaded" });
      setTimeout(() => setToast({ s: false, m: "" }), 2000);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Invalid project data:', error);
      }
      setToast({ s: true, m: "Invalid Project Data" });
      setTimeout(() => setToast({ s: false, m: "" }), 2000);
    }
  };

  const handleClearData = () => {
    if (user) {
      localStorage.removeItem(`bendiq_projects_${user.uid}`);
    }
    setProjs([]);
    setToast({ s: true, m: "All Data Cleared" });
    setTimeout(() => setToast({ s: false, m: "" }), 2000);
  };

  const handleDeleteAccount = () => {
    setToast({ s: true, m: "Account Deletion Requested" });
    setTimeout(() => setToast({ s: false, m: "" }), 2000);
  };

  const handleLogout = async () => {
    vibrate(18);
    try {
      await signOut();
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Logout failed:', err);
      }
    }
  };

  const exportPDF = async (proj: any) => {
    setIsExporting(true);
    setToast({ s: true, m: "PDF Export Started" });
    setIsExporting(false);
    setTimeout(() => setToast({ s: false, m: "" }), 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'bending':
        const warnings = getBendWarnings(bendType);
        return (
          <div className="animate-in fade-in duration-500">
            <div className={`${themeConfig.tabBg} p-1.5 rounded-2xl flex flex-wrap gap-1 mb-6`}>
              {[{id:'offset',l:'Offset'}, {id:'saddle3',l:'3pt'}, {id:'saddle4',l:'4pt'}, {id:'roll',l:'Roll'}].map(t => (
                <button key={t.id} onClick={() => { vibrate(12); setBendType(t.id); }} className={`flex-1 py-2.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${bendType === t.id ? themeConfig.tabActive : (theme === 'light' ? 'text-slate-500' : 'text-slate-400')}`}>{t.l}</button>
              ))}
            </div>
            
            <div className={`${themeConfig.card} border rounded-3xl p-5 mb-6`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-sm font-black ${themeConfig.text} uppercase tracking-tight`}>{bendType === 'offset' ? 'Offset Bend' : bendType === 'saddle3' ? '3-Point Saddle' : bendType === 'saddle4' ? '4-Point Saddle' : 'Rolling Offset'}</h3>
                <div className="flex gap-2">
                  <button onClick={() => { vibrate(18); resetTab(); }} className={`w-8 h-8 ${themeConfig.inset} border rounded-xl flex items-center justify-center shadow active:scale-90 transition-transform`}><RotateCcw size={14} className={themeConfig.sub} /></button>
                  <button onClick={() => { vibrate(18); setIsLevelActive(true); }} className={`w-8 h-8 ${themeConfig.inset} border rounded-xl flex items-center justify-center shadow active:scale-90 transition-transform`}><Compass size={14} className={themeConfig.sub} /></button>
                </div>
              </div>

              {bendType === 'offset' && (
                <>
                  <Slider label="Height (inches)" value={h} onChange={setH} min={1} max={50} suffix='"' settings={settings} />
                  <div className="mb-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none block mb-2 px-1">Angle</label>
                    <div className="flex gap-2 mb-2">
                      {[22.5, 30, 45, 90].map(angle => (
                        <button key={angle} onClick={() => { vibrate(8); handleManualAngle(angle); }}
                          className={`flex-1 py-1.5 px-2 rounded-full text-[10px] font-bold transition-all ${a === angle ? 'bg-blue-600 text-white' : `${themeConfig.inset} border ${themeConfig.sub}`}`}>
                          {angle}°
                        </button>
                      ))}
                    </div>
                  </div>
                  <Slider label="" value={a} onChange={handleManualAngle} min={10} max={90} step={0.5} suffix="°" settings={settings} />
                  <Visualizer type="offset" data={{ h, a }} theme={theme} />
                  <div className="mt-4 space-y-1">
                    <Result label="Travel" value={format(h / Math.sin(toRad(a)))} unit='"' highlight theme={theme} />
                    <Result label="Distance" value={format(h / Math.tan(toRad(a)))} unit='"' theme={theme} />
                    <Result label="Shrinkage" value={format(h / Math.tan(toRad(a)) * (1 / Math.cos(toRad(a)) - 1))} unit='"' isShrinkage theme={theme} />
                  </div>
                  <WarningBox warnings={warnings} theme={theme} />
                  <SpringbackAdvisory angle={a} type={mat} theme={theme} bendType={bendType} n={n} />
                </>
              )}

              {bendType === 'saddle3' && (
                <>
                  <Slider label="Obstacle Height (inches)" value={h} onChange={setH} min={1} max={50} suffix='"' settings={settings} />
                  <div className="mb-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none block mb-2 px-1">Angle</label>
                    <div className="flex gap-2 mb-2">
                      {[22.5, 30, 45, 90].map(angle => (
                        <button key={angle} onClick={() => { vibrate(8); handleManualAngle(angle); }}
                          className={`flex-1 py-1.5 px-2 rounded-full text-[10px] font-bold transition-all ${a === angle ? 'bg-blue-600 text-white' : `${themeConfig.inset} border ${themeConfig.sub}`}`}>
                          {angle}°
                        </button>
                      ))}
                    </div>
                  </div>
                  <Slider label="" value={a} onChange={handleManualAngle} min={10} max={90} step={0.5} suffix="°" settings={settings} />
                  <Visualizer type="saddle3" data={{ h, a }} theme={theme} />
                  <div className="mt-4 space-y-1">
                    <Result label="Center to Side" value={format(h / Math.sin(toRad(a/2)))} unit='"' highlight theme={theme} />
                    <Result label="Shrinkage" value={format(2 * h * (1 - Math.cos(toRad(a/2))) / Math.sin(toRad(a/2)))} unit='"' isShrinkage theme={theme} />
                  </div>
                  <WarningBox warnings={warnings} theme={theme} />
                  <SpringbackAdvisory angle={a} type={mat} theme={theme} bendType={bendType} n={n} />
                </>
              )}

              {bendType === 'saddle4' && (
                <>
                  <Slider label="Height (inches)" value={h} onChange={setH} min={1} max={50} suffix='"' settings={settings} />
                  <Slider label="Width (inches)" value={w} onChange={setW} min={5} max={100} suffix='"' settings={settings} />
                  <div className="mb-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none block mb-2 px-1">Angle</label>
                    <div className="flex gap-2 mb-2">
                      {[22.5, 30, 45, 90].map(angle => (
                        <button key={angle} onClick={() => { vibrate(8); handleManualAngle(angle); }}
                          className={`flex-1 py-1.5 px-2 rounded-full text-[10px] font-bold transition-all ${a === angle ? 'bg-blue-600 text-white' : `${themeConfig.inset} border ${themeConfig.sub}`}`}>
                          {angle}°
                        </button>
                      ))}
                    </div>
                  </div>
                  <Slider label="" value={a} onChange={handleManualAngle} min={10} max={90} step={0.5} suffix="°" settings={settings} />
                  <Visualizer type="saddle4" data={{ h, w, a }} theme={theme} />
                  <div className="mt-4 space-y-1">
                    <Result label="Travel" value={format(h / Math.sin(toRad(a)))} unit='"' highlight theme={theme} />
                    <Result label="Shrinkage" value={format(2 * h / Math.tan(toRad(a)) * (1 / Math.cos(toRad(a)) - 1))} unit='"' isShrinkage theme={theme} />
                  </div>
                  <WarningBox warnings={warnings} theme={theme} />
                  <SpringbackAdvisory angle={a} type={mat} theme={theme} bendType={bendType} n={n} />
                </>
              )}

              {bendType === 'roll' && (
                <>
                  <Slider label="Rise (inches)" value={offsetR} onChange={setOffsetR} min={1} max={50} suffix='"' settings={settings} />
                  <Slider label="Roll (inches)" value={offsetO} onChange={setOffsetO} min={1} max={50} suffix='"' settings={settings} />
                  <Slider label="Angle" value={a} onChange={handleManualAngle} min={10} max={60} step={0.5} suffix="°" settings={settings} />
                  <Visualizer type="roll" data={{ r: offsetR, o: offsetO }} theme={theme} />
                  <div className="mt-4 space-y-1">
                    <Result label="True Offset" value={format(Math.sqrt(offsetR*offsetR + offsetO*offsetO))} unit='"' highlight theme={theme} />
                    <Result label="Travel" value={format(Math.sqrt(offsetR*offsetR + offsetO*offsetO) / Math.sin(toRad(a)))} unit='"' theme={theme} />
                  </div>
                  <SpringbackAdvisory angle={a} type={mat} theme={theme} bendType={bendType} n={n} />
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => { vibrate(18); saveProject(); }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
                <Save size={18} /> Save
              </button>
              <button onClick={() => { vibrate(18); handleShare('BendIQ Calculation', getShareText()); }} className={`w-14 ${themeConfig.card} border rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform`}>
                <Share2 size={18} className={themeConfig.sub} />
              </button>
            </div>
          </div>
        );
      
      case 'cFill':
        const totalArea = wires.reduce((acc, w) => acc + (WIRE_DATA.THHN[w.s]?.area || 0) * w.c, 0);
        const capArea = CONDUIT_DATA[ct]?.[cs]?.area || 1;
        const fillPct = (totalArea / capArea) * 100;
        return (
          <div className="animate-in fade-in duration-500">
            <h2 className={`text-xl font-black ${themeConfig.text} uppercase tracking-tighter mb-6`}>Conduit Fill</h2>
            <div className={`${themeConfig.card} border rounded-3xl p-5 mb-6`}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Type</label>
                  <select value={ct} onChange={(e) => setCt(e.target.value)} className={`w-full ${themeConfig.inset} border rounded-xl p-3 ${themeConfig.text} font-bold`}>
                    {Object.keys(CONDUIT_DATA).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Size</label>
                  <select value={cs} onChange={(e) => setCs(e.target.value)} className={`w-full ${themeConfig.inset} border rounded-xl p-3 ${themeConfig.text} font-bold`}>
                    {Object.keys(CONDUIT_DATA[ct] || {}).map(s => <option key={s} value={s}>{s}"</option>)}
                  </select>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                {wires.map((wire, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <select value={wire.s} onChange={(e) => { const nw = [...wires]; nw[i].s = e.target.value; setWires(nw); }} className={`flex-1 ${themeConfig.inset} border rounded-xl p-3 ${themeConfig.text} font-bold`}>
                      {Object.keys(WIRE_DATA.THHN).map(s => <option key={s} value={s}>#{s} THHN</option>)}
                    </select>
                    <input type="number" min="1" max="100" value={wire.c} onChange={(e) => { const nw = [...wires]; nw[i].c = parseInt(e.target.value) || 1; setWires(nw); }} className={`w-20 ${themeConfig.inset} border rounded-xl p-3 ${themeConfig.text} font-bold text-center`} />
                    {wires.length > 1 && (
                      <button onClick={() => { vibrate(18); setWires(wires.filter((_, idx) => idx !== i)); }} className="p-3 text-red-500"><X size={18} /></button>
                    )}
                  </div>
                ))}
              </div>
              
              <button onClick={() => { vibrate(18); setWires([...wires, { s: '12', c: 1 }]); }} className={`w-full ${themeConfig.inset} border rounded-xl p-3 flex items-center justify-center gap-2 ${themeConfig.sub} font-bold`}>
                <Plus size={16} /> Add Wire Gauge
              </button>
              
              <Visualizer type="conduitFill" data={{ fill: fillPct }} theme={theme} />
              
              <div className="mt-4 space-y-1">
                <Result label="Fill Percentage" value={fillPct.toFixed(1)} unit="%" highlight={fillPct > 40} theme={theme} />
                <Result label="NEC Limit" value={wires.reduce((a, w) => a + w.c, 0) > 2 ? "40" : "31"} unit="%" theme={theme} />
                <Result label="Status" value={fillPct <= (wires.reduce((a, w) => a + w.c, 0) > 2 ? 40 : 31) ? "PASS" : "FAIL"} theme={theme} />
              </div>
            </div>
          </div>
        );
      
      case 'bFill':
        const boxCap = BOX_DATA[selBox].vol;
        const boxUsed = (w14 * 2) + (w12 * 2.25) + (dev * 4.5);
        return (
          <div className="animate-in fade-in duration-500">
            <h2 className={`text-xl font-black ${themeConfig.text} uppercase tracking-tighter mb-6`}>Box Fill</h2>
            <div className={`${themeConfig.card} border rounded-3xl p-5 mb-6`}>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Box Type</label>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {BOX_DATA.map((b, i) => (
                  <button key={i} onClick={() => { vibrate(12); setSelBox(i); }} className={`p-3 rounded-xl text-xs font-bold transition-all ${selBox === i ? themeConfig.tabActive : `${themeConfig.inset} border ${themeConfig.sub}`}`}>{b.label}</button>
                ))}
              </div>
              
              <Slider label="#14 Conductors" value={w14} onChange={setW14} min={0} max={20} settings={settings} />
              <Slider label="#12 Conductors" value={w12} onChange={setW12} min={0} max={20} settings={settings} />
              <Slider label="Devices" value={dev} onChange={setDev} min={0} max={5} settings={settings} />
              
              <Visualizer type="boxFill" data={{ used: boxUsed, cap: boxCap }} theme={theme} />
              
              <div className="mt-4 space-y-1">
                <Result label="Volume Used" value={format(boxUsed)} unit=" in³" highlight={boxUsed > boxCap} theme={theme} />
                <Result label="Box Capacity" value={format(boxCap)} unit=" in³" theme={theme} />
                <Result label="Status" value={boxUsed <= boxCap ? "PASS" : "OVER"} theme={theme} />
              </div>
            </div>
          </div>
        ); 
      case 'projects': 
        const handleRename = (id: number, newName: string) => {
          setProjs(projs.map(p => p.id === id ? { ...p, t: newName } : p));
          setRenamingProject(null);
          setRenameValue('');
          setToast({ s: true, m: "Project Renamed" });
          setTimeout(() => setToast({ s: false, m: "" }), 2000);
        };
        return ( 
          <div className="animate-in fade-in duration-500"> 
            <h2 className={`text-xl font-black ${themeConfig.text} uppercase tracking-tighter mb-6`}>Master Vault</h2> 
            {projs.length === 0 ? <div className="text-center py-20 text-slate-600 font-black uppercase tracking-widest text-[10px] opacity-40">Empty Archive</div> : ( 
              <div className="space-y-4">{projs.map(p => ( 
                <div key={p.id} onClick={() => { if (renamingProject !== p.id) { vibrate(18); loadProject(p); } }} className={`${themeConfig.card} p-5 rounded-3xl flex justify-between items-center group cursor-pointer active:scale-98 shadow-md transition-all border hover:border-blue-500/50`}>
                  <div className="flex-1">
                    {renamingProject === p.id ? (
                      <form onSubmit={(e) => { e.preventDefault(); handleRename(p.id, renameValue); }} className="flex items-center gap-2">
                        <input type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onClick={(e) => e.stopPropagation()} autoFocus
                          className={`text-sm font-black ${themeConfig.text} bg-transparent border-b-2 border-blue-500 outline-none w-full`}/>
                        <button type="submit" onClick={(e) => e.stopPropagation()} className="p-1 text-green-500"><CheckCircle2 size={16}/></button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setRenamingProject(null); setRenameValue(''); }} className="p-1 text-red-500"><X size={16}/></button>
                      </form>
                    ) : (
                      <>
                        <h4 className={`text-sm font-black ${themeConfig.text}`}>{p.t}</h4>
                        <p className={`text-[9px] ${themeConfig.sub} font-bold`}>{p.dt}</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={(e)=>{e.stopPropagation(); vibrate(18); setRenamingProject(p.id); setRenameValue(p.t);}} className={`p-2 ${themeConfig.sub} hover:text-blue-400 rounded`}><Pencil size={16}/></button>
                    <button onClick={(e)=>{e.stopPropagation(); vibrate(18); handleShare(`BendIQ: ${p.t}`, `${p.t} - ${p.d} (${p.dt})`);}} className={`p-2 ${themeConfig.sub} hover:text-blue-400 rounded`}><Share2 size={16}/></button>
                    <button onClick={(e)=>{e.stopPropagation(); vibrate(18); exportPDF(p);}} className={`p-2 ${themeConfig.sub} hover:text-blue-400 rounded ${isExporting ? 'animate-pulse' : ''}`}>{isExporting ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18}/>}</button>
                    <button onClick={(e)=>{e.stopPropagation(); vibrate(18); setProjs(projs.filter(x=>x.id!==p.id));}} className={`p-2 ${themeConfig.sub} hover:text-red-500 rounded`}><Trash2 size={16}/></button>
                  </div>
                </div> 
              ))}</div> 
            )}
          </div> 
        );
      default: return null; 
    } 
  }; 

  return ( 
    <div style={appStyle} className={`min-h-screen ${themeConfig.bg} ${themeConfig.text} overflow-x-hidden p-5 pb-32 flex flex-col items-center transition-colors duration-300`}> 
      <div className="w-full max-w-md mb-8 mt-2 flex items-center justify-between"> 
        <div><h1 className="text-2xl font-black italic">BEND<span className={themeConfig.accent}>IQ</span></h1><div className="flex items-center gap-1.5"><div className={`w-1.5 h-1.5 rounded-full ${themeConfig.accentBg} animate-pulse`}></div><p className={`${themeConfig.sub} text-[9px] font-black uppercase tracking-[0.4em]`}>Beta Version 0.1</p></div></div> 
        <div className="flex items-center gap-2"> 
          <button onClick={() => { vibrate(18); toggleFlashlight(); }} className={`w-9 h-9 ${themeConfig.card} border rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform ${flashlightOn ? 'bg-yellow-400 border-yellow-500 text-white' : ''}`}> 
            <Flashlight size={18} className={flashlightOn ? 'text-white' : themeConfig.text} fill={flashlightOn ? "currentColor" : "none"} /> 
          </button> 
          <button onClick={() => { vibrate(18); setShowSettings(true); }} className={`w-9 h-9 ${themeConfig.card} border rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform`}> 
            <Settings size={18} className={themeConfig.text} /> 
          </button> 
          <button onClick={() => { vibrate(18); setTheme(theme==='dark'?'light':theme==='light'?'construction':'dark'); }} className={`w-9 h-9 ${themeConfig.card} border rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform`}> 
            {theme==='dark' ? <Sun size={18} className="text-yellow-400" /> : theme==='light' ? <HardHat size={18} className="text-yellow-500" /> : <Moon size={18} className="text-blue-400" />} 
          </button> 
        </div>
      </div> 
      <div className="max-w-md w-full relative"> 
        {renderContent()} 
        <div className="w-full mt-8 flex justify-center gap-6 pb-4"> 
          <button className={`text-[10px] font-bold ${themeConfig.sub} hover:${themeConfig.text} transition-colors`}>Imprint</button> 
          <button className={`text-[10px] font-bold ${themeConfig.sub} hover:${themeConfig.text} transition-colors`}>Privacy Policy</button>
          <button onClick={handleLogout} className={`text-[10px] font-bold ${themeConfig.sub} hover:${themeConfig.text} transition-colors flex items-center gap-1`}>
            <LogOut size={12} /> Log Out
          </button> 
        </div>
      </div> 
      {isLevelActive && ( 
        <LevelModal targetAngle={bendType === 'segmented' ? (a / n) : a} onClose={() => setIsLevelActive(false)} themeConfig={themeConfig} theme={theme} /> 
      )} 
      {showSe && ( 
        <SettingsModal onClose={() => setShowSettings(false)} onClear={handleClearData} onDelete={handleDeleteAccount} settings={settings} setSettings={setSettings} themeConfig={themeConfig} /> 
      )} 
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-20 ${theme === 'light' ? 'bg-slate-50 border-slate-200 shadow-xl' : 'bg-slate-900 border-white/5'} backdrop-blur-xl border rounded-[2.5rem] px-6 flex items-center justify-around z-50 shadow-2xl`}> 
        {[{id:'bending',icon:Move,l:'Bends'},{id:'cFill',icon:Download,l:'Conduit Fill'},{id:'bFill',icon:Package,l:'Box Fill'},{id:'projects',icon:FolderInput,l:'Vault'}].map(tab => ( 
          <button key={tab.id} onClick={() => { vibrate(12); setActiveTab(tab.id); }} className={`flex flex-col items-center gap-1.5 transition-all relative ${activeTab === tab.id ? themeConfig.accent : (theme === 'light' ? 'text-slate-400' : 'text-slate-500')}`}> 
            {activeTab === tab.id && <div className={`absolute -top-3 w-8 h-1 ${themeConfig.accentBg} rounded-full`}></div>} 
            <tab.icon size={20} strokeWidth={activeTab === tab.id ? 3 : 2} /> 
            <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight">{tab.l}</span> 
          </button> 
        ))} 
      </div> 
      <div className={`fixed bottom-28 left-1/2 -translate-x-1/2 ${themeConfig.card} border px-6 py-3 rounded-full shadow-2xl transition-all duration-500 z-50 backdrop-blur-md flex items-center gap-3 ${toast.s ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}><ShieldCheck size={16} className={themeConfig.accent}/><span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-black' : 'text-white'}`}>{toast.m}</span></div> 
    </div> 
  ); 
}
