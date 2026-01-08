// File: src/App.tsx
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  Compass, Maximize2, Layers, RefreshCw, Info,
  AlertCircle, ShieldCheck, Move, CornerDownRight, Save,
  FolderInput, Trash2, Package, Download, X, Zap, Pencil,
  FileText, Loader2, Sun, Moon, HardHat, Plus, RotateCcw,
  Scale, CheckCircle2, Wand2, AlertTriangle, Settings, Mic, Type, MousePointerClick, Flashlight, Share2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import bendiqLogo from "@/assets/bendiq-logo.png";

// Type declarations for external libraries and APIs
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

declare var DeviceOrientationEvent: {
  new (type: string, eventInitDict?: DeviceOrientationEventInit): DeviceOrientationEvent;
  prototype: DeviceOrientationEvent;
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

const WIRE_DATA = {
  "THHN": { 
    "14": { area: 0.0097, diam: 0.111 }, 
    "12": { area: 0.0133, diam: 0.130 }, 
    "10": { area: 0.0211, diam: 0.164 }, 
    "8": { area: 0.0366, diam: 0.216 }, 
    "6": { area: 0.0507, diam: 0.254 } 
  }
};

const CONDUIT_DATA = {
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

const CONDUIT_TYPES = {
  "EMT": { label: "EMT", springback: 0.05 },
  "IMC": { label: "IMC", springback: 0.03 },
  "RMC": { label: "Rigid", springback: 0.02 }
};

const toRad = (deg) => (deg * Math.PI) / 180;
const format = (n) => parseFloat(n).toFixed(2);
const vibrate = (ms: number) => { if (navigator.vibrate) navigator.vibrate(ms); };
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};
const getRoundedPath = (points, radius = 15) => {
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
const getSuggestedAngle = (h, currentSize) => {
  const hVal = parseFloat(h);
  const sizeVal = parseFloat(currentSize);
  if (sizeVal > 1.25) return 30;
  if (hVal <= 2) return 10;
  if (hVal <= 5) return 22.5;
  if (hVal <= 12) return 30;
  if (hVal <= 24) return 45;
  return 60;
};

const Result = ({ label, value, unit="", highlight=false, theme, settings, isShrinkage=false }) => (
  <div className={`text-sm ${isShrinkage ? 'text-orange-500 font-bold' : highlight ? 'text-blue-600 font-bold' : theme === 'light' ? 'text-slate-600' : 'text-slate-400'} flex justify-between`}>
    {label} <span className="font-mono font-black">{value}{unit}</span>
  </div>
);
const Slider = ({ label, value, onChange, min, max, step=1, suffix="", settings }) => (
  <div className="flex flex-col gap-1 mb-4">
    <div className="flex justify-between items-end px-1 mb-1">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{label}</label>
      <span className="text-sm text-blue-500 font-mono font-bold leading-none">{value}{suffix}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => { vibrate(8); onChange(parseFloat(e.target.value)); }} className={`w-full ${settings.largeTargets ? 'h-4' : 'h-1.5'} bg-slate-800 rounded-full appearance-none accent-blue-600 cursor-pointer shadow-inner`} />
  </div>
);
const WarningBox = ({ warnings, theme }) => { 
  if (!warnings || warnings.length === 0) return null; 
  return (
    <div className={`mt-4 p-3 rounded-xl border ${theme === 'light' ? 'border-red-200 bg-red-50' : 'border-red-500/20 bg-red-500/5'} space-y-2`}>
      {warnings.map((w, i) => (
        <div key={i} className="flex items-center gap-2">
          <AlertTriangle size={14} className={w.type === 'error' ? 'text-red-500' : 'text-yellow-500'} /> 
          <span className={`text-[10px] font-bold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>{w.msg}</span>
        </div>
      ))}
    </div>
  ); 
};
const SpringbackAdvisory = ({ angle, type, theme, bendType, n }) => { 
  const factor = CONDUIT_TYPES[type]?.springback || 0.05; 
  let targetAngle = parseFloat(angle);
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
const Visualizer = ({ type, data, isForExport = false, theme = 'dark' }) => { 
  const geometry = useMemo(() => { 
    const getVal = (v, def=0) => isNaN(parseFloat(v)) ? def : parseFloat(v); 
    const calcBounds = (pts, pad = 100) => { 
      if (!pts || pts.length === 0) return [0,0,100,100]; 
      let minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x)); 
      let minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y)); 
      return [minX - pad, -maxY - pad, (maxX - minX) + (pad * 2), (maxY - minY) + (pad * 2)]; 
    }; 
    const dimColor = theme === 'light' ? '#64748b' : theme === 'construction' ? '#facc15' : '#94a3b8';
    const Dim = ({x1, y1, x2, y2, label}) => (
      <g>
        <line x1={x1} y1={-y1} x2={x2} y2={-y2} stroke={dimColor} strokeWidth="1" strokeDasharray="2" />
        <text x={(x1+x2)/2} y={-(y1+y2)/2 - 12} fill={dimColor} fontSize="10" textAnchor="middle" fontWeight="black">{label}</text>
      </g>
    );
    // Updated pipeColor to match the Save button blue (#2563eb which is blue-600)
    const pipeColor = theme === 'construction' ? '#facc15' : '#2563eb';
    
    switch (type) {
      case 'offset': {
        const h = getVal(data.h, 10), a = Math.max(1, getVal(data.a, 30));
        const run = h / Math.tan(toRad(a));
        const strokeWidth = 5;
        const buffer = strokeWidth / 2 + 1; // Half stroke + 1px buffer for "kissing" effect
        const pts = [{x:0,y:buffer}, {x:25,y:buffer}, {x:25+run,y:h+buffer}, {x:60+run,y:h+buffer}];
        // Obstacle: rectangle under the upper run representing floor/surface difference
        const obstacle = {x: 25+run-5, y: 0, w: 40, h: h};
        return { pts, marks: [{...pts[1], l:"1"}, {...pts[2], l:"2"}], dims: <Dim x1={25} y1={0} x2={25+run} y2={0} label={`D: ${format(run)}"`} />, obstacle, vb: calcBounds(pts, 90) };
      }
      case 'saddle3': {
        const h = getVal(data.h, 20), a = getVal(data.a, 45);
        const run = h / Math.tan(toRad(a/2));
        const strokeWidth = 5;
        const buffer = strokeWidth / 2 + 1;
        // Conduit path: apex at y = h + buffer so pipe bottom kisses top of obstacle
        const pts = [{x:-run-35,y:buffer}, {x:-run,y:buffer}, {x:0,y:h+buffer}, {x:run,y:buffer}, {x:run+35,y:buffer}];
        // Obstacle: centered rectangle, height = obstacle height, fixed width 30px
        const obstacleWidth = 30;
        const obstacle = {x: -obstacleWidth/2, y: 0, w: obstacleWidth, h: h};
        return { pts, marks: [{...pts[1], l:"S"}, {...pts[2], l:"C"}, {...pts[3], l:"S"}], dims: <Dim x1={-run} y1={0} x2={run} y2={0} label={`Span: ${format(run*2)}"`} />, obstacle, vb: calcBounds(pts, 90) };
      }
      case 'saddle4': {
        const h = getVal(data.h, 20), w = getVal(data.w, 25), a = getVal(data.a, 45);
        const run = h / Math.tan(toRad(a));
        const strokeWidth = 5;
        const buffer = strokeWidth / 2 + 1;
        // Conduit path: flat bridge at y = h + buffer so pipe bottom kisses obstacle top
        const pts = [{x:0,y:buffer}, {x:20,y:buffer}, {x:20+run,y:h+buffer}, {x:20+run+w,y:h+buffer}, {x:20+run+w+run,y:buffer}, {x:40+run+w+run,y:buffer}];
        // Obstacle: centered rectangle with height = h and width = w
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
            <circle cx="0" cy="0" r="2" fill={theme === 'construction' ? '#facc15' : '#2563eb'} stroke="white" strokeWidth="1" />
            <circle cx={boxW+dx} cy={-(boxH+dy)} r="2" fill={theme === 'construction' ? '#facc15' : '#2563eb'} stroke="white" strokeWidth="1" />
            <text x={boxW/2} y={15} fill={dimColor} fontSize="9" fontWeight="bold" textAnchor="middle">ROLL: {o}"</text>
            <text x={boxW+dx+15} y={-boxH/2-dy} fill={dimColor} fontSize="9" fontWeight="bold" transform={`rotate(-90, ${boxW+dx+15}, ${-boxH/2-dy})`} textAnchor="middle">RISE: {r}"</text>
            <g transform={`translate(${(boxW+dx)/2}, ${-(boxH+dy)/2 - 15})`}>
              <rect x="-30" y="-8" width="60" height="16" rx="4" fill={theme === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'} />
              <text x="0" y="3" fill={pipeColor} fontSize="10" fontWeight="black" textAnchor="middle">TRUE: {format(Math.sqrt(r*r+o*o))}"</text>
            </g>
          </g>
        ), vb: [minX, minY, maxX - minX, maxY - minY] };
      }
      case 'parallel': {
        const s = getVal(data.s, 2), a = getVal(data.a, 30), numPipes = getVal(data.numPipes, 3);
        const scale = 20;
        const sPx = s * scale;
        const stagger = s * Math.tan(toRad(a/2));
        const staggerPx = stagger * scale;
        const bendRad = 20;
        const runLen = 40;
        const totalHeight = sPx * (numPipes - 1) + 60;
        const totalWidth = runLen + (staggerPx * (numPipes - 1)) + 60;
        const drawPath = (y, startX, key) => {
          const bendStart = startX + runLen;
          const radA = toRad(a);
          const f = bendRad * (4 / 3) * Math.tan(radA / 4);
          const P1x = bendStart + f;
          const P1y = y;
          const bendEndX = bendStart + (bendRad * Math.sin(radA));
          const bendEndY = y + (bendRad * (1 - Math.cos(radA)));
          const P2x = bendEndX - f * Math.cos(radA);
          const P2y = bendEndY - f * Math.sin(radA);
          const tailLen = 30;
          const tailEndX = bendEndX + (tailLen * Math.cos(radA));
          const tailEndY = bendEndY + (tailLen * Math.sin(radA));
          return (
            <path
              key={key}
              d={`M 0 ${y} L ${bendStart} ${y} C ${P1x} ${P1y} ${P2x} ${P2y} ${bendEndX} ${bendEndY} L ${tailEndX} ${tailEndY}`}
              fill="none"
              stroke={pipeColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        };
        const paths = [];
        for (let i = 0; i < numPipes; i++) {
          paths.push(drawPath(-sPx * i, staggerPx * i, i));
        }
        return { custom: (
          <g>
            {paths}
            <line x1={runLen} y1={20} x2={runLen + staggerPx} y2={20} stroke={dimColor} strokeWidth="0.5" />
            <line x1={runLen + staggerPx} y1={15} x2={runLen + staggerPx} y2={25} stroke={dimColor} strokeWidth="0.5" />
            <text x={runLen + staggerPx/2} y={30} fill={dimColor} fontSize="8" fontWeight="bold" textAnchor="middle">Stagger: {format(stagger)}"</text>
            <text x={-12} y={-sPx/2} fill={dimColor} fontSize="8" textAnchor="middle" transform={`rotate(-90, -12, ${-sPx/2})`}>S: {s}"</text>
          </g>
        ), vb: [-20, -totalHeight - 20, totalWidth, totalHeight + 40] };
      }
      case 'segmented': {
        const rVal = getVal(data.r, 24);
        const aVal = getVal(data.a, 90);
        const nVal = getVal(data.n, 5);
        const pts = [];
        const step = toRad(aVal) / nVal;
        for(let i=0; i<=nVal; i++) {
          const theta = i * step;
          pts.push({
            x: rVal * Math.sin(theta),
            y: rVal - (rVal * Math.cos(theta)),
            angle: theta
          });
        }
        const pathData = pts.map((p, i) => (i===0 ? `M ${p.x} ${-p.y}` : `L ${p.x} ${-p.y}`)).join(" ");
        const maxX = pts[pts.length-1].x;
        const minY = -pts[pts.length-1].y;
        const pad = 50;
        const hashLength = 6;
        return {
          custom: (
            <g>
              <path d={pathData} fill="none" stroke={pipeColor} strokeWidth="3" strokeLinecap="round" />
              {pts.map((p,i) => {
                const perpX = Math.cos(p.angle);
                const perpY = Math.sin(p.angle);
                return (
                  <g key={i}>
                    <line 
                      x1={p.x - perpX * hashLength} 
                      y1={-(p.y - perpY * hashLength)} 
                      x2={p.x + perpX * hashLength} 
                      y2={-(p.y + perpY * hashLength)} 
                      stroke={pipeColor} 
                      strokeWidth="2" 
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}
              <g transform={`translate(${maxX/2}, ${minY/2})`}>
                <text x="0" y="0" fill={dimColor} fontSize="10" fontWeight="bold" textAnchor="middle">R: {rVal}"</text>
              </g>
            </g>
          ),
          vb: [-pad, minY - pad, maxX + (pad*2), -minY + (pad*2)]
        };
      }
      case 'conduitFill': {
        const fill = getVal(data.fill, 40);
        // Updated fill color logic to match blue-600 #2563eb
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
            <text x="100" y="-52" fill={textFill} fontSize="20" fontWeight="300" textAnchor="middle" fontFamily="sans-serif" className="transition-all duration-300">{format(ratio * 100)}%</text>
          </g>
        ), vb: [0,0,300,160] };
      }
      default: return { vb: [0,0,100,100] };
    }
  }, [type, data, theme]);
  
  // Updated height to h-80 (large visualizer), set bg-white for all visualization fields in light mode
  // Using preserveAspectRatio to ensure centering
  const bgClass = theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-900/50';
  
  return (
    <svg viewBox={geometry.vb.join(' ')} preserveAspectRatio="xMidYMid meet" className={`w-full h-80 rounded-2xl ${bgClass}`}>
      {geometry.custom || (
        <g>
          {/* Obstacle rendered behind (first) with semi-transparent grey #E5E7EB */}
          {geometry.obstacle && (
            <rect 
              x={geometry.obstacle.x} 
              y={-(geometry.obstacle.y + geometry.obstacle.h)} 
              width={geometry.obstacle.w} 
              height={geometry.obstacle.h} 
              fill="#E5E7EB" 
              fillOpacity="0.6" 
              rx="3" 
            />
          )}
          <path d={getRoundedPath(geometry.pts)} fill="none" stroke={theme === 'construction' ? '#facc15' : '#2563eb'} strokeWidth="5" strokeLinecap="round" />
          {geometry.marks?.map((m,i) => (
            <g key={i}>
              <line 
                x1={m.x - 6} 
                y1={-m.y} 
                x2={m.x + 6} 
                y2={-m.y} 
                stroke={theme === 'construction' ? '#facc15' : '#2563eb'} 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </g>
          ))}
          {geometry.dims}
        </g>
      )}
    </svg>
  ); 
};
const LevelModal = ({ targetAngle, onClose, themeConfig, theme }) => {
  const [currentAngle, setCurrentAngle] = useState(0);
  const [permission, setPermission] = useState('unknown');
  const handleOrientation = (event) => {
    let angle = Math.abs(event.beta);
    setCurrentAngle(angle);
  };
  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setPermission('granted');
          window.addEventListener('deviceorientation', handleOrientation);
        } else {
          setPermission('denied');
        }
      } catch (e) {
        setPermission('denied');
      }
    } else {
      setPermission('granted');
      window.addEventListener('deviceorientation', handleOrientation);
    }
  };
  useEffect(() => {
    if (permission === 'granted') {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [permission]);
  const isMatched = Math.abs(currentAngle - targetAngle) < 1.0;
  const isLight = theme === 'light';
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-6`}>
      <div className={`${themeConfig.card} p-8 rounded-3xl w-full max-w-sm shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-lg font-black uppercase tracking-widest ${themeConfig.text}`}>Digital Protractor</h2>
          <button onClick={onClose} className={`p-2 ${isLight ? 'bg-slate-200 hover:bg-slate-300' : 'bg-white/10 hover:bg-white/20'} rounded-full transition-colors`}><X size={20} className={themeConfig.text} /></button>
        </div>
        {permission !== 'granted' ? (
          <div className="text-center">
            <Scale size={48} className={`mx-auto ${isLight ? 'text-blue-600' : 'text-blue-500'} mb-6 opacity-40`} />
            <h3 className={`font-black text-lg mb-2 ${themeConfig.text}`}>Sensor Access Required</h3> 
            <p className={`${isLight ? 'text-slate-600' : 'text-slate-400'} text-xs mb-8 leading-relaxed`}>Please enable device orientation to use the phone as a digital level on the conduit.</p> 
            <button onClick={requestPermission} className={`w-full py-4 ${themeConfig.accentBg} text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-transform`}>Enable Level</button>
          </div>
        ) : (
          <div className="text-center">
            <span className={`text-6xl font-mono font-black ${themeConfig.accent}`}>{Math.round(currentAngle)}°</span>
            <p className={`text-[10px] uppercase tracking-widest ${themeConfig.sub} mb-1`}>Current Tilt</p>
            <p className={`text-[10px] uppercase tracking-widest ${themeConfig.sub} mb-6`}>Target Angle {targetAngle}°</p>
            {isMatched && <CheckCircle2 className="text-green-500 animate-bounce" size={28} />}
            <p className={`text-xs font-bold ${isMatched ? 'text-green-500' : themeConfig.sub}`}>{isMatched ? "Angle Confirmed - Site Verified" : "Tilt device to match calculation"}</p>
          </div>
        )}
      </div>
    </div>
  ); 
};
const SettingsModal = ({ onClose, onClear, onDelete, settings, setSettings, themeConfig, theme }) => { 
  const isLight = theme === 'light';
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[100] p-6`}>
      <div className={`${themeConfig.card} p-8 rounded-3xl w-full max-w-sm shadow-2xl space-y-8`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-lg font-black uppercase tracking-widest ${themeConfig.text}`}>Settings</h2>
          <button onClick={onClose} className={`p-2 ${isLight ? 'bg-slate-200 hover:bg-slate-300' : 'bg-white/10 hover:bg-white/20'} rounded-full`}><X size={20} className={themeConfig.text} /></button>
        </div>
        <div>
          <h3 className={`text-[11px] font-black uppercase tracking-widest ${themeConfig.sub} mb-4`}>Accessibility & Inclusion</h3>
          <div className="space-y-4">
            {[
              { id: 'voice', label: 'Voice Readout', icon: Mic }, 
              { id: 'dyslexic', label: 'Dyslexic Font', icon: Type }, 
              { id: 'largeTargets', label: 'Large Touch Targets', icon: MousePointerClick } 
            ].map(opt => (
              <div key={opt.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <opt.icon className={`icon ${themeConfig.accent}`} size={16} /> 
                  <span className={`text-sm font-bold ${themeConfig.text}`}>{opt.label}</span>
                </div>
                <button onClick={() => setSettings(s => ({...s, [opt.id]: !s[opt.id]}))} className={`w-10 h-6 rounded-full transition-colors relative ${settings[opt.id] ? (theme === 'construction' ? 'bg-yellow-500' : 'bg-blue-600') : 'bg-slate-600'}`} >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings[opt.id] ? 'translate-x-4' : ''}`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className={`text-[11px] font-black uppercase tracking-widest ${themeConfig.sub} mb-4`}>Data Management</h3>
          <div className="flex justify-center w-full">
            <button onClick={onClear} className="w-full p-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/50 text-xs font-black uppercase hover:bg-red-500 hover:text-white transition-colors">Clear All Data</button>
          </div>
        </div>
        <div>
          <h3 className={`text-[11px] font-black uppercase tracking-widest text-red-500 mb-4`}>Account Management</h3>
          <button onClick={onDelete} className="w-full p-4 rounded-xl bg-red-500 text-white font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-colors"> Delete My Account </button>
          <p className={`text-[10px] ${themeConfig.sub} mt-2 text-center`}>Permanently delete your account and all data.</p>
        </div>
        <div className={`text-[8px] ${themeConfig.sub} text-center opacity-60`}>
          Legal Disclaimer: All calculations provided by this app are for informational purposes only. Use results at your own risk. The developer assumes no liability for any physical damage, personal injury, or consequential losses resulting from the use of this application.
        </div>
      </div>
    </div>
  ); 
};

export default function App() { 
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('bending');
  const [bendType, setBendType] = useState('offset'); 
  const [theme, setTheme] = useState('dark'); 
  const [projs, setProjs] = useState([]); 
  const [toast, setToast] = useState({ s: false, m: "" }); 
  const [isExporting, setIsExporting] = useState(false); 
  const [isLevelActive, setIsLevelActive] = useState(false); 
  const [showSettings, setShowSettings] = useState(false);
  const [showImprint, setShowImprint] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [renamingProject, setRenamingProject] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const streamRef = useRef(null);
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
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
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
        console.error(err);
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
    if (!settings.voice) return;
    const timer = setTimeout(() => {
      let text = "";
      if (activeTab === 'bending') {
        if (bendType === 'offset') text = `Travel: ${format(h / Math.sin(toRad(a)))} inches`;
        else if (bendType === 'saddle3') text = `Center to side: ${format(h / Math.sin(toRad(a/2)))} inches`;
      } else if (activeTab === 'cFill') {
        const totalArea = wires.reduce((acc, w) => acc + (WIRE_DATA.THHN[w.s]?.area || 0) * w.c, 0);
        const capArea = CONDUIT_DATA[ct][cs].area;
        text = `Fill Density: ${(totalArea/capArea*100).toFixed(1)} percent`;
      }
      if (text) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(u);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [h, a, w, r, offsetR, offsetO, s, bendType, activeTab, wires, ct, cs, settings.voice]);
  useEffect(() => {
    if (activeTab === 'bending' && (bendType === 'offset' || bendType === 'saddle3' || bendType === 'saddle4') && autoAngle) {
      setA(getSuggestedAngle(h, bendSize));
    }
  }, [h, bendType, activeTab, bendSize, autoAngle]);
  const handleManualAngle = (val) => {
    setA(val);
    setAutoAngle(false);
  };
  const getBendWarnings = useCallback((bendType) => {
    const warnings = [];
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
  // Native mobile share functionality with Web Share API and clipboard fallback
  const handleShare = async (title: string, text: string) => {
    const shareData = { 
      title, 
      text, 
      url: window.location.href 
    };
    
    try {
      // Check if Web Share API is supported (mobile browsers)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.share) {
        // Some browsers support share but not canShare
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard for desktop browsers
        const shareText = `${title}\n${text}\n${window.location.href}`;
        await navigator.clipboard.writeText(shareText);
        setToast({ s: true, m: "Link copied!" });
        setTimeout(() => setToast({ s: false, m: "" }), 2000);
      }
    } catch (err: any) {
      // If user cancelled share, don't show error
      if (err.name !== 'AbortError') {
        // Fallback to clipboard if share fails
        try {
          const shareText = `${title}\n${text}\n${window.location.href}`;
          await navigator.clipboard.writeText(shareText);
          setToast({ s: true, m: "Link copied!" });
          setTimeout(() => setToast({ s: false, m: "" }), 2000);
        } catch (clipboardErr) {
          console.error('Share and clipboard failed:', clipboardErr);
        }
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
      } else if (bendType === 'parallel') {
        const stagger = s * Math.tan(toRad(a/2));
        return `Concentric: Spacing ${s}", ${numPipes} Pipes, Angle ${a}°, Shrinkage ${format(stagger)}"`;
      } else if (bendType === 'segmented') {
        const sdev = (Math.PI * r * a) / 180;
        return `Segment Bend: ${n} Shots, Radius ${r}", Angle ${a}°, Dev Length ${format(sdev)}"`;
      }
    } else if (activeTab === 'cFill') {
      const totalArea = wires.reduce((acc, w) => acc + (WIRE_DATA.THHN[w.s]?.area || 0) * w.c, 0);
      const capArea = CONDUIT_DATA[ct][cs].area;
      const fillPct = (totalArea / capArea) * 100;
      return `Conduit Fill: ${ct} ${cs}", Fill ${format(fillPct)}%`;
    } else if (activeTab === 'bFill') {
      const boxUsed = (w14 * 2) + (w12 * 2.25) + (dev * 4.5);
      return `Box Fill: ${BOX_DATA[selBox].label}, Used ${format(boxUsed)} in³`;
    }
    return 'BendIQ Calculation';
  };
  const resetTab = useCallback(() => {
    if (activeTab === 'bending') {
      // Reset based on current bend type with specific defaults
      if (bendType === 'offset') {
        setH(10); setA(30);
      } else if (bendType === 'saddle3') {
        setH(20); setA(45);
      } else if (bendType === 'saddle4') {
        setH(20); setW(25); setA(45);
      } else if (bendType === 'roll') {
        setOffsetR(10); setOffsetO(10); setA(30);
      } else if (bendType === 'parallel') {
        setS(1); setNumPipes(3); setA(60);
      } else if (bendType === 'segmented') {
        setN(15); setR(100); setA(90);
      }
      setAutoAngle(true);
    } else if (activeTab === 'cFill') {
      setCt("EMT"); setCs("0.75"); setWires([{ s: '12', c: 3 }]);
    } else if (activeTab === 'bFill') {
      setSelBox(0); setW14(2); setW12(4); setDev(1);
    }
    setToast({ s: true, m: "Inputs Reset" });
    setTimeout(() => setToast({ s: false, m: "" }), 2000);
  }, [activeTab, bendType]);
  const saveProject = (t, d) => {
    const snapshot = { activeTab, bendType, h, a, mat, w, r, n, offsetR, offsetO, s, numPipes, ct, cs, wires, selBox, w14, w12, dev };
    setProjs([{ id: Date.now(), t, d, dt: new Date().toLocaleString(), snapshot }, ...projs]);
    setToast({ s: true, m: "Project Stored" });
    setTimeout(() => setToast({ s: false, m: "" }), 3000);
  };
  const loadProject = (p) => {
    const snap = p.snapshot; if (!snap) return;
    setActiveTab(snap.activeTab); setBendType(snap.bendType); setH(snap.h); setA(snap.a); setMat(snap.mat); setW(snap.w); setR(snap.r); setN(snap.n); setOffsetR(snap.offsetR); setOffsetO(snap.offsetO); setS(snap.s); setNumPipes(snap.numPipes || 3); setCt(snap.ct); setCs(snap.cs); setWires(snap.wires); setSelBox(snap.selBox); setW14(snap.w14); setW12(snap.w12); setDev(snap.dev);
    setToast({ s: true, m: "State Recovered" });
    setTimeout(() => setToast({ s: false, m: "" }), 2000);
  };
  const addGauge = (gauge) => {
    const existing = wires.find(w => w.s === gauge);
    if (existing) {
      setWires(wires.map(w => w.s === gauge ? { ...w, c: w.c + 1 } : w));
    } else {
      setWires([...wires, { s: gauge, c: 1 }]);
    }
    setToast({ s: true, m: `Added #${gauge} Conductor` });
    setTimeout(() => setToast({ s: false, m: "" }), 1500);
  };
  const handleClearData = () => {
    setProjs([]);
    setToast({ s: true, m: "All Data Cleared" });
    setTimeout(() => setToast({ s: false, m: "" }), 2000);
  };
  const handleDeleteAccount = () => {
    setProjs([]);
    setSettings({ voice: false, dyslexic: false, largeTargets: false });
    setToast({ s: true, m: "Account Deleted" });
    setShowSettings(false);
    setTimeout(() => setToast({ s: false, m: "" }), 2000);
  };
  const exportPDF = async (p) => {
    setIsExporting(true);
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      const snap = p.snapshot;
      const exportContainer = document.createElement('div');
      exportContainer.style.position = 'absolute'; exportContainer.style.left = '-9999px'; exportContainer.style.width = '210mm'; exportContainer.style.background = 'white'; exportContainer.style.padding = '20mm';
      document.body.appendChild(exportContainer);
      exportContainer.innerHTML = `<div style="border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;"><h1 style="margin:0; color:#0f172a;">BendIQ</h1><p style="margin:0; font-size:10px; color:#64748b;">PROJECT SPECIFICATION: ${p.t} (${p.dt})</p></div><div id="pdf-vis-anchor" style="margin-bottom: 20px;"></div>`;
      const visId = snap.activeTab === 'bending' ? 'bending-visualizer' : snap.activeTab === 'cFill' ? 'fill-visualizer' : 'box-visualizer';
      const canvas = await window.html2canvas(document.getElementById(visId), { scale: 2 });
      exportContainer.querySelector('#pdf-vis-anchor').innerHTML = `<img src="${canvas.toDataURL('image/png')}" style="width:100%; border-radius:10px;" />`;
      const finalCanvas = await window.html2canvas(exportContainer, { scale: 2 });
      doc.addImage(finalCanvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (finalCanvas.height * 210) / finalCanvas.width);
      doc.save(`Report_${p.t.replace(/\s+/g,'_')}.pdf`);
      document.body.removeChild(exportContainer);
    } catch (e) { console.error(e); } finally { setIsExporting(false); }
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'bending':
        let resultNode = null; let visData = {};
        if (bendType === 'offset') {
          const rad = toRad(a); const travel = h / Math.sin(rad); const shrink = 2 * h * (Math.pow(Math.sin(rad/2), 2) / Math.sin(rad));
          visData = {h, a};
          resultNode = (
            <>
              <Slider label="Height" value={h} onChange={setH} min={1} max={30} suffix='"' settings={settings}/>
              <div className="flex justify-between items-end mb-1.5 px-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Angle</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setAutoAngle(!autoAngle)} className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full transition-colors ${autoAngle ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}> <Wand2 size={10} className="inline mr-1" />{autoAngle ? "Auto" : "Manual"}</button>
                  <span className="text-sm text-blue-400 font-mono font-bold leading-none">{a}°</span>
                </div>
              </div>
              <div className="flex gap-2 flex-nowrap mb-2">
                {[22.5, 30, 45, 90].map(angle => (
                  <button key={angle} onClick={() => { vibrate(8); handleManualAngle(angle); }} className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-full transition-all ${a === angle ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'}`}>{angle}°</button>
                ))}
              </div>
              <input type="range" min={10} max={90} step={1} value={a} onChange={(e) => handleManualAngle(e.target.value)} className={`w-full ${settings.largeTargets ? 'h-4' : 'h-1.5'} bg-slate-800 rounded-full appearance-none accent-blue-600 cursor-pointer shadow-inner mb-4`} />
              <Result label="Travel" value={format(travel)} unit='"' highlight theme={theme} settings={settings}/>
              <Result label="Shrinkage" value={format(shrink)} unit='"' theme={theme} settings={settings} isShrinkage={true}/>
            </>
          ); 
        } else if (bendType === 'saddle3') { 
          const radS = toRad(a/2); const s3dist = h / Math.sin(radS); 
          // Shrinkage for 3-Point Saddle: h * (csc(θ) - cot(θ)) where θ is the side angle (a/2)
          const shrinkage3 = h * (1/Math.sin(radS) - Math.cos(radS)/Math.sin(radS));
          visData = {h, a}; 
          resultNode = ( 
            <> 
              <Slider label="Obstacle" value={h} onChange={setH} min={1} max={30} suffix='"' settings={settings}/> 
              <div className="flex justify-between items-end mb-1.5 px-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Angle</label> 
                <div className="flex items-center gap-2"> 
                  <button onClick={() => setAutoAngle(!autoAngle)} className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full transition-colors ${autoAngle ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}> <Wand2 size={10} className="inline mr-1" />{autoAngle ? "Auto" : "Manual"}</button> 
                  <span className="text-sm text-blue-400 font-mono font-bold leading-none">{a}°</span> 
                </div> 
              </div>
              <div className="flex gap-2 flex-nowrap mb-2">
                {[22.5, 30, 45, 90].map(angle => (
                  <button key={angle} onClick={() => { vibrate(8); handleManualAngle(angle); }} className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-full transition-all ${a === angle ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'}`}>{angle}°</button>
                ))}
              </div>
              <input type="range" min={10} max={90} step={1} value={a} onChange={(e) => handleManualAngle(e.target.value)} className={`w-full ${settings.largeTargets ? 'h-4' : 'h-1.5'} bg-slate-800 rounded-full appearance-none accent-blue-600 cursor-pointer shadow-inner mb-4`} />
              <Result label="Center to Side" value={format(s3dist)} unit='"' highlight theme={theme} settings={settings}/>
              <Result label="Shrinkage" value={format(shrinkage3)} unit='"' theme={theme} settings={settings} isShrinkage={true}/>
            </> 
          );
        } else if (bendType === 'saddle4') { 
          const s4rad = toRad(a); const s4travel = h / Math.sin(s4rad); 
          // Shrinkage for 4-Point Saddle: 2 * [h * (csc(θ) - cot(θ))]
          const shrinkage4 = 2 * h * (1/Math.sin(s4rad) - Math.cos(s4rad)/Math.sin(s4rad));
          visData = {h, w, a}; 
          resultNode = ( 
            <> 
              <Slider label="Height" value={h} onChange={setH} min={1} max={30} suffix='"' settings={settings}/> 
              <Slider label="Width" value={w} onChange={setW} min={1} max={48} suffix='"' settings={settings}/> 
              <div className="flex justify-between items-end mb-1.5 px-1"> 
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Angle</label> 
                <div className="flex items-center gap-2"> 
                  <button onClick={() => setAutoAngle(!autoAngle)} className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full transition-colors ${autoAngle ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}> <Wand2 size={10} className="inline mr-1" />{autoAngle ? "Auto" : "Manual"}</button> 
                  <span className="text-sm text-blue-400 font-mono font-bold leading-none">{a}°</span> 
                </div> 
              </div>
              <div className="flex gap-2 flex-nowrap mb-2">
                {[22.5, 30, 45, 60].map(angle => (
                  <button key={angle} onClick={() => { vibrate(8); handleManualAngle(angle); }} className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-full transition-all ${a === angle ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'}`}>{angle}°</button>
                ))}
              </div>
              <input type="range" min={5} max={60} step={1} value={a} onChange={(e) => handleManualAngle(e.target.value)} className={`w-full ${settings.largeTargets ? 'h-4' : 'h-1.5'} bg-slate-800 rounded-full appearance-none accent-blue-600 cursor-pointer shadow-inner mb-4`} />
              <Result label="Travel" value={format(s4travel)} unit='"' highlight theme={theme} settings={settings}/>
              <Result label="Shrinkage" value={format(shrinkage4)} unit='"' theme={theme} settings={settings} isShrinkage={true}/>
            </> 
          );
        } else if (bendType === 'roll') { 
          const trueO = Math.sqrt(offsetR*offsetR + offsetO*offsetO); const rollTravel = trueO / Math.sin(toRad(a)); 
          // Shrinkage for Rolling Offset: H * (csc(θ) - cot(θ)) where H = true offset
          const radRoll = toRad(a);
          const shrinkageRoll = trueO * (1/Math.sin(radRoll) - Math.cos(radRoll)/Math.sin(radRoll));
          visData = {r: offsetR, o: offsetO, a}; 
          resultNode = (<><Slider label="Rise" value={offsetR} onChange={setOffsetR} min={1} max={48} suffix='"' settings={settings}/><Slider label="Roll" value={offsetO} onChange={setOffsetO} min={1} max={48} suffix='"' settings={settings}/><Slider label="Angle" value={a} onChange={setA} min={5} max={90} suffix="°" settings={settings}/><Result label="Travel" value={format(rollTravel)} unit='"' highlight theme={theme} settings={settings}/><Result label="Shrinkage" value={format(shrinkageRoll)} unit='"' theme={theme} settings={settings} isShrinkage={true}/></>);
        } else if (bendType === 'parallel') { 
          const stagger = s * Math.tan(toRad(a/2)); 
          // Shrinkage for Concentric: S * tan(θ/2) - same as stagger formula
          visData = {s, a, numPipes}; 
          resultNode = (<><Slider label="Space" value={s} onChange={setS} min={0.5} max={4} step={0.5} suffix='"' settings={settings}/><Slider label="Pipes" value={numPipes} onChange={setNumPipes} min={2} max={8} settings={settings}/><Slider label="Angle" value={a} onChange={setA} min={5} max={90} suffix="°" settings={settings}/><Result label="Shrinkage" value={format(stagger)} unit='"' theme={theme} settings={settings} isShrinkage={true}/></>);
        } else if (bendType === 'segmented') { 
          const sdev = (Math.PI * r * a) / 180; 
          // Shrinkage for Segment: Arc - Chord where Arc = (π * R * θ) / 180 and Chord = 2 * R * sin(θ/2)
          const arcLength = (Math.PI * r * a) / 180;
          const chordLength = 2 * r * Math.sin(toRad(a) / 2);
          const shrinkageSeg = arcLength - chordLength;
          visData = {r, a, n}; 
          resultNode = (<><Slider label={`Shots (à ${format(a / n)}°)`} value={n} onChange={setN} min={2} max={40} settings={settings}/><Slider label="Radius" value={r} onChange={setR} min={10} max={120} suffix='"' settings={settings}/><Slider label="Angle" value={a} onChange={setA} min={1} max={180} suffix="°" settings={settings}/><Result label="Developed Length" value={format(sdev)} unit='"' highlight theme={theme} settings={settings}/><Result label="Shot Detail" value={`${n} shots à ${format(a / n)}°`} theme={theme} settings={settings}/><Result label="Shrinkage" value={format(shrinkageSeg)} unit='"' theme={theme} settings={settings} isShrinkage={true}/></>);
        } 
        const warnings = getBendWarnings(bendType); 
        return ( 
          <div className="animate-in fade-in duration-500"> 
            <div className="flex items-center justify-between mb-4"> 
              <div className="flex items-center gap-3"> 
                <h2 className={`text-[11px] font-black uppercase tracking-widest ${themeConfig.accent}`}>Bending Lab</h2> 
              </div> 
              <div className="flex items-center gap-2"> 
              <button onClick={() => { vibrate(18); resetTab(); }} className={`p-2.5 ${themeConfig.card} rounded-full active:rotate-180 transition-transform duration-500 shadow-sm`}><RotateCcw size={16}/></button>
                <button onClick={() => { vibrate(18); setIsLevelActive(true); }} className={`p-2.5 ${themeConfig.card} rounded-full active:scale-90 shadow-sm`}><Scale size={16}/></button> 
                <button onClick={() => { vibrate(18); saveProject(bendType.toUpperCase(), `H:${h}" A:${a}°`); }} className={`p-2.5 ${themeConfig.accentBg} text-white rounded-full active:scale-90 transition-transform shadow-lg`}><Save size={16}/></button>
              </div> 
            </div> 
            <div className="relative mb-4"> 
              <div className="flex justify-center mb-2"> 
                <div className={`flex ${themeConfig.tabBg} backdrop-blur-md p-1 rounded-full border border-white/20 overflow-x-auto max-w-full no-scrollbar shadow-xl`}> 
                  {[{id:'offset',icon:Compass,l:'Offset'},{id:'saddle3',icon:Move,l:'3pt'},{id:'saddle4',icon:Maximize2,l:'4pt'},{id:'roll',icon:RefreshCw,l:'Roll'},{id:'parallel',icon:Layers,l:'Conc.'},{id:'segmented',icon:CornerDownRight,l:'Seg.'}].map(item => ( 
                    <button key={item.id} onClick={() => { vibrate(12); setBendType(item.id); }} className={`flex items-center gap-1.5 ${settings.largeTargets ? 'px-5 py-3' : 'px-3 py-1.5'} rounded-full transition-all whitespace-nowrap ${bendType === item.id ? themeConfig.tabActive : 'text-slate-400'}`}><item.icon size={12}/><span className="text-[10px] font-black uppercase tracking-tight">{item.l}</span></button> 
                  ))} 
                </div> 
              </div> 
              <div id="bending-visualizer"><Visualizer type={bendType} data={visData} theme={theme}/></div> 
            </div> 
            <div className="grid grid-cols-2 gap-2 mb-4 items-end"> 
              <div className={`grid grid-cols-3 gap-1 ${themeConfig.tabBg} p-1 rounded-xl`}> 
                {['EMT','IMC','RMC'].map(k=>(<button key={k} onClick={() => setMat(k)} className={`py-1.5 text-[10px] font-black rounded-xl transition-all ${mat===k ? themeConfig.tabActive : 'text-slate-500'}`}>{k}</button>))} 
              </div> 
              <div className="flex flex-col gap-1"> 
                <label className={`text-[8px] font-black uppercase tracking-widest ${themeConfig.sub} text-center`}>Select conduit size</label> 
                <select className={`${themeConfig.inset} text-[10px] font-black p-1.5 rounded-xl outline-none appearance-none border-none text-center ${themeConfig.text}`} value={bendSize} onChange={(e)=>setBendSize(e.target.value)}>{['0.5','0.75','1','1.25','1.5','2','2.5','3'].map(s=><option key={s} value={s}>{s}"</option>)}</select> 
              </div> 
            </div> 
            <div className={`${themeConfig.card} p-6 rounded-3xl shadow-lg`}> 
              {resultNode} 
              <WarningBox warnings={warnings} theme={theme}/> 
              <SpringbackAdvisory angle={a} type={mat} theme={theme} bendType={bendType} n={n}/> 
            </div> 
            <div className={`mt-6 p-4 ${themeConfig.card} rounded-2xl flex flex-col gap-3 shadow-inner`}> 
              <h3 className={`text-[9px] font-black ${themeConfig.sub} uppercase tracking-widest flex items-center gap-2 px-1`}><Info size={12}/> Multiplier Reference</h3> 
              <div className="grid grid-cols-4 gap-2"> 
                {[{d:"10°", m:6}, {d:"22.5°", m:2.6}, {d:"30°", m:2}, {d:"45°", m:1.4}].map((x,i)=>( 
                  <div key={i} className={`p-2 rounded-xl text-center border ${themeConfig.inset}`}><div className={`text-[9px] ${themeConfig.sub} font-bold mb-1`}>{x.d}</div><div className={`text-xs ${themeConfig.accent} font-black`}>{x.m}</div></div> 
                ))} 
              </div> 
            </div>
            <div className="mt-4 flex justify-center">
              <button onClick={() => { vibrate(18); handleShare('BendIQ Calculation', getShareText()); }} className={`flex items-center gap-2 px-4 py-2 ${themeConfig.card} rounded-full shadow-md active:scale-95 transition-transform`}>
                <Share2 size={14} className={themeConfig.accent} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${themeConfig.sub}`}>Share</span>
              </button>
            </div>
          </div> 
        ); 
      case 'cFill': 
        const totalArea = wires.reduce((acc, w) => acc + (WIRE_DATA.THHN[w.s]?.area || 0) * w.c, 0); 
        const capArea = CONDUIT_DATA[ct][cs].area; 
        const fillPct = (totalArea / capArea) * 100; 
        return ( 
          <div className="animate-in fade-in duration-500"> 
            <div className="flex items-center justify-between mb-4"> 
              <div className="flex items-center gap-3"> 
                <h2 className={`text-[11px] font-black uppercase tracking-widest ${themeConfig.accent}`}>Conduit Load</h2> 
              </div> 
              <div className="flex items-center gap-2"> 
              <button onClick={() => { vibrate(18); resetTab(); }} className={`p-2.5 ${themeConfig.card} rounded-full active:rotate-180 transition-transform duration-500 shadow-sm`}><RotateCcw size={16}/></button> 
                <button onClick={() => { vibrate(18); setIsLevelActive(true); }} className={`p-2.5 ${themeConfig.card} rounded-full active:scale-90 shadow-sm`}><Scale size={16}/></button> 
                <button onClick={() => { vibrate(18); saveProject("FILL", `${ct} ${cs}"`); }} className={`p-2.5 ${themeConfig.accentBg} text-white rounded-full active:scale-90 transition-transform shadow-lg`}><Save size={16}/></button>
              </div> 
            </div> 
            <div id="fill-visualizer"><Visualizer type="conduitFill" data={{ fill: fillPct }} theme={theme}/></div> 
            <div className="mt-4 grid grid-cols-4 gap-2 mb-4"> 
              {['14', '12', '10', '8'].map(g => ( 
                <button key={g} onClick={() => { vibrate(18); addGauge(g); }} className={`flex flex-col items-center justify-center p-3 rounded-2xl border ${themeConfig.card} hover:border-blue-500 transition-all active:scale-95 group shadow-sm`}> 
                  <Plus size={14} className={`${themeConfig.sub} group-hover:text-blue-500 mb-1`} /> 
                  <span className={`text-xs font-black ${themeConfig.text}`}>#{g}</span> 
                </button> 
              ))} 
            </div> 
            <div className={`${themeConfig.card} p-5 rounded-3xl mb-4 shadow-lg`}> 
              <div className="flex gap-2 mb-6"> 
                <select className={`${themeConfig.inset} text-xs flex-1 p-3 rounded-xl outline-none appearance-none border-none ${themeConfig.text}`} value={ct} onChange={(e)=>setCt(e.target.value)}>{Object.keys(CONDUIT_DATA).map(k=><option key={k} value={k}>{k}</option>)}</select> 
                <select className={`${themeConfig.inset} text-xs flex-1 p-3 rounded-xl outline-none appearance-none border-none ${themeConfig.text}`} value={cs} onChange={(e)=>setCs(e.target.value)}>{Object.keys(CONDUIT_DATA[ct]).map(k=><option key={k} value={k}>{k}"</option>)}</select> 
              </div> 
              <div className="space-y-3"> 
                {wires.map((w,i)=>( 
                  <div key={i} className={`flex gap-3 items-center p-3 rounded-2xl border ${themeConfig.inset} animate-in slide-in-from-left-2 duration-200`}> 
                    <div className={`text-[10px] font-black ${themeConfig.sub} flex-1`}>#{w.s} AWG THHN</div> 
                    <input type="number" className={`bg-transparent p-1 rounded-lg text-sm w-16 text-center font-bold outline-none ${themeConfig.text}`} value={w.c} onChange={(e)=>{const n=[...wires]; n[i].c=parseInt(e.target.value)||0; setWires(n);}} /> 
                    <button onClick={() => setWires(wires.filter((_,j)=>i!==j))} className="p-1 text-red-500 opacity-60 hover:opacity-100"><X size={16}/></button> 
                  </div> 
                ))} 
              </div> 
            </div> 
            <div className={`${themeConfig.card} p-6 rounded-3xl shadow-xl`}>
              <Result label="Fill Density" value={format(fillPct)} unit="%" highlight={fillPct > 40} theme={theme} settings={settings}/>
              <Result label="Max Code Area" value={format(capArea * 0.4)} unit="in²" theme={theme} settings={settings}/>
              <div className={`mt-3 text-center text-[10px] font-black uppercase tracking-widest ${fillPct > 40 ? 'text-red-500 animate-pulse' : 'text-green-500 opacity-60'}`}>{fillPct > 40 ? 'Violation - Undersized' : 'COMPLIANT'}</div>
            </div>
            <div className="mt-4 flex justify-center">
              <button onClick={() => { vibrate(18); handleShare('BendIQ Calculation', getShareText()); }} className={`flex items-center gap-2 px-4 py-2 ${themeConfig.card} rounded-full shadow-md active:scale-95 transition-transform`}>
                <Share2 size={14} className={themeConfig.accent} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${themeConfig.sub}`}>Share</span>
              </button>
            </div>
          </div> 
        ); 
      case 'bFill': 
        const boxUsed = (w14 * 2) + (w12 * 2.25) + (dev * 4.5); 
        const boxCapValue = BOX_DATA[selBox].vol; 
        return ( 
          <div className="animate-in fade-in duration-500"> 
            <div className="flex items-center justify-between mb-4"> 
              <div className="flex items-center gap-3"> 
                <h2 className={`text-[11px] font-black uppercase tracking-widest ${themeConfig.accent}`}>Box Volume</h2> 
              </div> 
              <div className="flex items-center gap-2"> 
              <button onClick={() => { vibrate(18); resetTab(); }} className={`p-2.5 ${themeConfig.card} rounded-full active:rotate-180 transition-transform duration-500 shadow-sm`}><RotateCcw size={16}/></button>
                <button onClick={() => { vibrate(18); setIsLevelActive(true); }} className={`p-2.5 ${themeConfig.card} rounded-full active:scale-90 shadow-sm`}><Scale size={16}/></button> 
                <button onClick={() => { vibrate(18); saveProject("BOX", BOX_DATA[selBox].label); }} className={`p-2.5 ${themeConfig.accentBg} text-white rounded-full active:scale-90 transition-transform shadow-lg`}><Save size={16}/></button>
              </div> 
            </div> 
            <div id="box-visualizer"><Visualizer type="boxFill" data={{ used: boxUsed, cap: boxCapValue }} theme={theme}/></div> 
            <div className={`${themeConfig.card} p-6 rounded-3xl mb-4 space-y-6 shadow-lg`}> 
              <select className={`${themeConfig.inset} w-full p-4 rounded-xl text-sm font-bold outline-none appearance-none border-none ${themeConfig.text}`} value={selBox} onChange={(e)=>setSelBox(parseInt(e.target.value))}>{BOX_DATA.map((b,i)=><option key={i} value={i}>{b.label}</option>)}</select> 
              <Slider label="#14 Gauge (2.0)" value={w14} onChange={setW14} min={0} max={12} settings={settings}/> 
              <Slider label="#12 Gauge (2.25)" value={w12} onChange={setW12} min={0} max={12} settings={settings}/> 
              <Slider label="Devices / Yokes" value={dev} onChange={setDev} min={0} max={4} settings={settings}/> 
            </div> 
            <div className={`${themeConfig.card} p-6 rounded-3xl shadow-xl`}>
              <Result label="Calculated" value={format(boxUsed)} unit="in³" highlight={boxUsed > boxCapValue} theme={theme} settings={settings}/>
              <Result label="Capacity" value={boxCapValue} unit="in³" theme={theme} settings={settings}/>
              <div className={`mt-3 text-center text-[10px] font-black uppercase tracking-widest ${boxUsed > boxCapValue ? 'text-red-500 animate-pulse' : 'text-green-500 opacity-60'}`}>{boxUsed > boxCapValue ? 'Violation - Undersized' : 'COMPLIANT'}</div>
            </div>
            <div className="mt-4 flex justify-center">
              <button onClick={() => { vibrate(18); handleShare('BendIQ Calculation', getShareText()); }} className={`flex items-center gap-2 px-4 py-2 ${themeConfig.card} rounded-full shadow-md active:scale-95 transition-transform`}>
                <Share2 size={14} className={themeConfig.accent} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${themeConfig.sub}`}>Share</span>
              </button>
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
                        <input 
                          type="text" 
                          value={renameValue} 
                          onChange={(e) => setRenameValue(e.target.value)} 
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                          className={`text-sm font-black ${themeConfig.text} bg-transparent border-b-2 border-blue-500 outline-none w-full`}
                        />
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
        <div className="flex items-center gap-3"><img src={bendiqLogo} alt="BendIQ Logo" className="w-12 h-12 object-contain" /><div><h1 className="text-2xl font-black font-sans">BEND<span style={{ color: '#3C83F6' }}>IQ</span></h1><div className="flex items-center gap-1.5"><div className={`w-1.5 h-1.5 rounded-full ${themeConfig.accentBg} animate-pulse`}></div><p className={`${themeConfig.sub} text-[9px] font-black uppercase tracking-[0.4em]`}>Beta Version 0.1</p></div></div></div> 
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
          <button onClick={() => setShowImprint(true)} className={`text-[10px] font-bold ${themeConfig.sub} hover:${themeConfig.text} transition-colors`}>Imprint</button> 
          <button onClick={() => setShowPrivacy(true)} className={`text-[10px] font-bold ${themeConfig.sub} hover:${themeConfig.text} transition-colors`}>Privacy Policy</button>
          <button onClick={() => handleLogout()} className={`text-[10px] font-bold ${themeConfig.sub} hover:${themeConfig.text} transition-colors`}>Log Out</button> 
        </div>
        
        <Dialog open={showImprint} onOpenChange={setShowImprint}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-sans">Imprint</DialogTitle>
            </DialogHeader>
            <div className="text-sm font-sans space-y-1">
              <p>Julian Lohwasser</p>
              <p>c/o Block Services</p>
              <p>Stuttgarter Str. 106</p>
              <p>70736 Fellbach</p>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
          <DialogContent className="max-w-lg max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="font-sans">Privacy Policy</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="text-sm font-sans space-y-4 text-left">
                <p>We are very pleased about your interest in our company. Data protection is of a particularly high priority for the management of NivoTools. Use of the NivoTools website is generally possible without providing any personal data. However, if a data subject wishes to use special services of our company via our website, the processing of personal data may become necessary. If the processing of personal data is necessary and there is no legal basis for such processing, we generally obtain the consent of the data subject.</p>
                <p>The processing of personal data, such as the name, address, e-mail address, or telephone number of a data subject, is always carried out in accordance with the General Data Protection Regulation (GDPR) and in accordance with the country-specific data protection regulations applicable to NivoTools. By means of this privacy policy, our company wishes to inform the public about the type, scope, and purpose of the personal data we collect, use, and process. Furthermore, data subjects are informed of their rights by means of this privacy policy.</p>
                <p>As the controller, NivoTools has implemented numerous technical and organizational measures to ensure the most complete protection of personal data processed through this website. However, internet-based data transmissions can fundamentally have security gaps, so absolute protection cannot be guaranteed. For this reason, every data subject is free to transmit personal data to us via alternative means, for example by telephone.</p>
                
                <h3 className="font-bold mt-4">Definitions</h3>
                <p>The privacy policy of NivoTools is based on the terminology used by the European legislator for the adoption of the General Data Protection Regulation (GDPR). Our privacy policy should be easy to read and understand for the public as well as for our customers and business partners. To ensure this, we would like to explain the terminology used in advance.</p>
                <p>In this privacy policy, we use, among others, the following terms:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>a) Personal data:</strong> Personal data means any information relating to an identified or identifiable natural person (hereinafter "data subject"). An identifiable natural person is one who can be identified, directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data, an online identifier, or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural, or social identity of that natural person.</li>
                  <li><strong>b) Data subject:</strong> A data subject is any identified or identifiable natural person whose personal data is processed by the controller.</li>
                  <li><strong>c) Processing:</strong> Processing is any operation or set of operations which is performed on personal data or on sets of personal data, whether or not by automated means, such as collection, recording, organization, structuring, storage, adaptation or alteration, retrieval, consultation, use, disclosure by transmission, dissemination or otherwise making available, alignment or combination, restriction, erasure or destruction.</li>
                  <li><strong>d) Restriction of processing:</strong> Restriction of processing is the marking of stored personal data with the aim of limiting their processing in the future.</li>
                  <li><strong>e) Profiling:</strong> Profiling means any form of automated processing of personal data consisting of the use of personal data to evaluate certain personal aspects relating to a natural person, in particular to analyze or predict aspects concerning that natural person's performance at work, economic situation, health, personal preferences, interests, reliability, behavior, location or movements.</li>
                  <li><strong>f) Pseudonymization:</strong> Pseudonymization is the processing of personal data in such a manner that the personal data can no longer be attributed to a specific data subject without the use of additional information, provided that such additional information is kept separately and is subject to technical and organizational measures to ensure that the personal data are not attributed to an identified or identifiable natural person.</li>
                  <li><strong>g) Controller or person responsible for processing:</strong> Controller or person responsible for processing is the natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data.</li>
                  <li><strong>h) Processor:</strong> Processor is a natural or legal person, public authority, agency or other body which processes personal data on behalf of the controller.</li>
                  <li><strong>i) Recipient:</strong> Recipient is a natural or legal person, public authority, agency or another body, to which the personal data are disclosed, whether a third party or not.</li>
                  <li><strong>j) Third party:</strong> Third party is a natural or legal person, public authority, agency or body other than the data subject, controller, processor and persons who, under the direct authority of the controller or processor, are authorized to process personal data.</li>
                  <li><strong>k) Consent:</strong> Consent of the data subject is any freely given, specific, informed and unambiguous indication of the data subject's wishes by which he or she, by a statement or by a clear affirmative action, signifies agreement to the processing of personal data relating to him or her.</li>
                </ul>
                
                <h3 className="font-bold mt-4">Name and Address of the Controller</h3>
                <p>The controller for the purposes of the General Data Protection Regulation, other data protection laws applicable in the Member States of the European Union, and other provisions related to data protection is:</p>
                <p>Julian Lohwasser c/o Block Services Stuttgarter Str. 106 70736 Fellbach Germany Tel.: 015679758515 Email: nivotools@gmail.com Website: bendiq.lovable.app</p>
                
                <h3 className="font-bold mt-4">Cookies</h3>
                <p>The website of NivoTools uses cookies. Cookies are text files that are placed and stored on a computer system via an internet browser. Through the use of cookies, NivoTools can provide the users of this website with more user-friendly services that would not be possible without the setting of cookies.</p>
                
                <h3 className="font-bold mt-4">Collection of General Data and Information</h3>
                <p>The website of NivoTools collects a series of general data and information when a data subject or automated system calls up the website. This general data and information are stored in the server log files.</p>
                
                <h3 className="font-bold mt-4">Registration on Our Website</h3>
                <p>The data subject has the possibility to register on the website of the controller with the indication of personal data. The personal data entered by the data subject are collected and stored exclusively for internal use by the controller and for its own purposes.</p>
                
                <h3 className="font-bold mt-4">Rights of the Data Subject</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Right of confirmation:</strong> Each data subject shall have the right to obtain from the controller the confirmation as to whether or not personal data concerning him or her are being processed.</li>
                  <li><strong>Right of access:</strong> Each data subject shall have the right to obtain from the controller free information about his or her personal data stored at any time and a copy of this information.</li>
                  <li><strong>Right to rectification:</strong> Each data subject shall have the right to obtain from the controller without undue delay the rectification of inaccurate personal data concerning him or her.</li>
                  <li><strong>Right to erasure:</strong> Each data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay.</li>
                  <li><strong>Right to data portability:</strong> Each data subject shall have the right to receive the personal data concerning him or her in a structured, commonly used and machine-readable format.</li>
                  <li><strong>Right to object:</strong> Each data subject shall have the right to object, on grounds relating to his or her particular situation, at any time, to processing of personal data concerning him or her.</li>
                  <li><strong>Right to withdraw data protection consent:</strong> Each data subject shall have the right to withdraw his or her consent to processing of his or her personal data at any time.</li>
                </ul>
                
                <h3 className="font-bold mt-4">Data Protection Provisions for Google Firebase</h3>
                <p>The controller has integrated components of Google Firebase on this website. Firebase is a platform from Google for developing web and mobile applications.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Authentication:</strong> We use Firebase Authentication to identify and manage user accounts. Personal data such as email addresses and user IDs are processed for the purpose of authentication.</li>
                  <li><strong>Firestore:</strong> We use Firestore for cloud-based storage and synchronization of project data (bending values and app-specific settings). Project data is stored on Google servers.</li>
                  <li><strong>Third-country transfer:</strong> The use of Google Firebase involves the transfer of data to the United States of America. Google uses standard contractual clauses approved by the European Commission for this purpose.</li>
                </ul>
                
                <h3 className="font-bold mt-4">Use of Device Sensors</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Gyroscope:</strong> Angle measurement is performed via the motion sensors built into the end device. The processing of this sensor data takes place exclusively locally on your end device. No storage or transmission of this movement data to external servers takes place.</li>
                  <li><strong>Camera/Light:</strong> Activating the flashlight requires access to the camera unit. The app exclusively uses the flash/light element; no image data is captured, stored, or transmitted.</li>
                </ul>
                
                <h3 className="font-bold mt-4">Use of Local Storage</h3>
                <p>In addition to cookies, this website uses the browser's "Local Storage" to store functional app data on the user's end device, including language settings, units of measurement, design mode, and progress data.</p>
                
                <h3 className="font-bold mt-4">Data Security</h3>
                <p>To secure the transmitted information, this website uses SSL or TLS encryption (HTTPS). This encryption protects the data transmission between the app interface and the Google Firebase database from unauthorized access by third parties.</p>
                
                <p className="text-xs text-muted-foreground mt-6">This privacy policy was created by the Privacy Policy Generator of the DGD Deutsche Gesellschaft für Datenschutz GmbH, acting as External Data Protection Officer Munich, in cooperation with the Cologne IT and data protection lawyer Christian Solmecke.</p>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div> 
      {isLevelActive && ( 
        <LevelModal targetAngle={bendType === 'segmented' ? (a / n) : a} onClose={() => setIsLevelActive(false)} themeConfig={themeConfig} theme={theme} /> 
      )} 
      {showSettings && ( 
        <SettingsModal onClose={() => setShowSettings(false)} onClear={handleClearData} onDelete={handleDeleteAccount} settings={settings} setSettings={setSettings} themeConfig={themeConfig} theme={theme} /> 
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
