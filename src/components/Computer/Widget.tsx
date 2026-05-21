import React, { useEffect, useState, useRef } from 'react';
// @ts-ignore: CSS import without type declarations
import '../../style/Widget.css';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

type Props = {
    position: { x: number; y: number };
    size: { width: number; height: number };
    title: string;
    content: string | null;
    style: React.CSSProperties | undefined;
};

function Widget({ position, size, title, content, style }: Props) {
    const widgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (widgetRef.current) {
            Draggable.create(widgetRef.current, {
                type: 'x,y',
                edgeResistance: 0.65,
                bounds: window,
                inertia: true
            });
        }
    }, []);

    return (
        <div
            ref={widgetRef}
            className="widget"
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height
            }}
        >
            <div className="widget-header">
                <h2>{title}</h2>
            </div>
            <div style={style} className="widget-content">
                <p>{content}</p>
            </div>
        </div>
    );
}

export default Widget;

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function CalendarWidget({ position, size, title }: Props) {
    const widgetRef = useRef<HTMLDivElement>(null);
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    useEffect(() => {
        if (widgetRef.current) {
            Draggable.create(widgetRef.current, {
                type: 'x,y',
                edgeResistance: 0.65,
                bounds: window,
                inertia: true
            });
        }
    }, []);

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayIndex = ((new Date(viewYear, viewMonth, 1).getDay() + 6) % 7);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
        setSelectedDay(null);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
        setSelectedDay(null);
    };

    const isToday = (day: number) =>
        day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

    const blanks = Array.from({ length: firstDayIndex }, (_, i) => (
        <span key={`b-${i}`} className="cal-cell cal-blank" />
    ));

    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const classes = [
            'cal-cell',
            isToday(day) ? 'cal-today' : '',
            selectedDay === day ? 'cal-selected' : ''
        ].filter(Boolean).join(' ');

        return (
            <span key={day} className={classes} onClick={() => setSelectedDay(day)}>
                {day}
            </span>
        );
    });

    return (
        <div
            ref={widgetRef}
            className="widget calendar-widget"
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height,
            }}
        >
            <div className="cal-header">
                <button className="cal-nav" onClick={prevMonth}>‹</button>
                <h2>{MONTH_NAMES[viewMonth]} {viewYear}</h2>
                <button className="cal-nav" onClick={nextMonth}>›</button>
            </div>

            <div className="cal-grid cal-weekdays">
                {DAYS_OF_WEEK.map(d => <span key={d} className="cal-cell cal-day-label">{d}</span>)}
            </div>

            <div className="cal-grid cal-days">
                {blanks}
                {days}
            </div>
        </div>
    );
}

export { CalendarWidget };

type WidgetBaseProps = {
    position: { x: number; y: number };
    size: { width: number; height: number };
};

function ClockWidget({ position, size }: WidgetBaseProps) {
    const widgetRef = useRef<HTMLDivElement>(null);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        if (widgetRef.current) {
            Draggable.create(widgetRef.current, {
                type: 'x,y', edgeResistance: 0.65, bounds: window, inertia: true
            });
        }
    }, []);

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long', month: 'short', day: 'numeric'
    });

    return (
        <div ref={widgetRef} className="widget clock-widget" style={{
            position: 'absolute', left: position.x, top: position.y,
            width: size.width, height: size.height,
        }}>
            <div className="clock-time">
                <span className="clock-h">{hours}</span>
                <span className="clock-sep">:</span>
                <span className="clock-m">{minutes}</span>
                <span className="clock-sep clock-sep-sec">:</span>
                <span className="clock-s">{seconds}</span>
            </div>
            <div className="clock-date">{dateStr}</div>
        </div>
    );
}

export { ClockWidget };

function useAnimatedValue(target: number, speed = 0.05) {
    const [val, setVal] = useState(target);
    useEffect(() => {
        let raf: number;
        const tick = () => {
            setVal(v => {
                const diff = target - v;
                return Math.abs(diff) < 0.5 ? target : v + diff * speed;
            });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, speed]);
    return val;
}

function SystemMonitorWidget({ position, size }: WidgetBaseProps) {
    const widgetRef = useRef<HTMLDivElement>(null);
    const [cpu, setCpu] = useState(34);
    const [ram, setRam] = useState(58);
    const [disk, setDisk] = useState(72);

    useEffect(() => {
        const t = setInterval(() => {
            setCpu(Math.round(20 + Math.random() * 60));
            setRam(Math.round(40 + Math.random() * 35));
        }, 2500);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        if (widgetRef.current) {
            Draggable.create(widgetRef.current, {
                type: 'x,y', edgeResistance: 0.65, bounds: window, inertia: true
            });
        }
    }, []);

    const aCpu = useAnimatedValue(cpu);
    const aRam = useAnimatedValue(ram);
    const aDisk = useAnimatedValue(disk);

    const barColor = (v: number) =>
        v > 80 ? '#ff5555' : v > 50 ? '#ffaa33' : '#44dd88';

    const bars = [
        { label: 'CPU', value: aCpu },
        { label: 'RAM', value: aRam },
        { label: 'Disk', value: aDisk },
    ];

    return (
        <div ref={widgetRef} className="widget sysmon-widget" style={{
            position: 'absolute', left: position.x, top: position.y,
            width: size.width, height: size.height,
        }}>
            <h2>System</h2>
            <div className="sysmon-bars">
                {bars.map(b => (
                    <div key={b.label} className="sysmon-row">
                        <span className="sysmon-label">{b.label}</span>
                        <div className="sysmon-track">
                            <div className="sysmon-fill" style={{
                                width: `${b.value}%`,
                                background: barColor(b.value),
                            }} />
                        </div>
                        <span className="sysmon-pct">{Math.round(b.value)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { SystemMonitorWidget };