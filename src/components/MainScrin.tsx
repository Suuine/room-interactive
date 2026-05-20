import React, { useEffect, useRef, useState } from 'react';
import pcData from '../data/pc.json';
import { WifiIcon } from './SystemIcons';
import '../style/MainScrin.css';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

type Props = {
    username: string;
    onAuthenticated: () => void;
};

const correctPassword = pcData.MainScreen.password;

export const MainScrin = ({ username, onAuthenticated }: Props) => {
    const [password, setPassword] = useState("");
    const [bootDone, setBootDone] = useState(false);

    const monitorRef = useRef<HTMLDivElement | null>(null);
    const loginRef = useRef<HTMLDivElement | null>(null);
    const mainScreenRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!monitorRef.current || !loginRef.current) return;

        const h1 = monitorRef.current.querySelector("h1");
        const h2 = monitorRef.current.querySelector("h2");
        if (!h1 || !h2) return;

        gsap.set(loginRef.current, { opacity: 0, pointerEvents: "none" });

        const split1 = new SplitText(h1, { type: "chars" });
        const split2 = new SplitText(h2, { type: "chars" });

        const tl = gsap.timeline({
            onComplete: () => setBootDone(true),
        });

        tl.from(split1.chars, {
            opacity: 0,
            display: "none",
            stagger: 0.03,
            duration: 0.01,
            ease: "none",
            delay: 0.5
        })
            .from(split2.chars, {
                opacity: 0,
                display: "none",
                stagger: 0.03,
                duration: 0.01,
                ease: "none"
            }, "+=0.5")
            .to(monitorRef.current, {
                opacity: 0,
                duration: 0.6,
                delay: 0.5,
            })
            .to(loginRef.current, {
                opacity: 1,
                pointerEvents: "auto",
                duration: 0.6,
            });

        return () => {
            tl.kill();
            split1.revert();
            split2.revert();
        };
    }, []);

    useEffect(() => {
        if (password === correctPassword) {
            const timer = setTimeout(() => {
                if (!mainScreenRef.current) return;

                gsap.to(mainScreenRef.current, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        onAuthenticated();
                    }
                });
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [password, onAuthenticated]);

    const isCorrect = password === correctPassword;

    return (
        <div style={{ zIndex: 10 }} ref={mainScreenRef} className="main-screen">
            <div ref={monitorRef} className="monitor" style={{ position: 'absolute' }}>
                <h1>Initializing system…</h1>
                <h2>Verifying credentials…</h2>
            </div>

            <div ref={loginRef} className="login-wrapper">
                <div className="login">
                    <div className='login-icon'></div>
                    <h1>{username}</h1>
                    <input
                        autoFocus
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {bootDone && password.length > 0 && (
                        <div className="status-msg">
                            {isCorrect ?
                                <p className="success">Access Granted</p> :
                                <p className="error">Invalid Credentials</p>
                            }
                        </div>
                    )}
                </div>

                <div className='another-users'>
                    <div className='user-container'>
                        <div className='user-icon'></div>
                        <p>Admin</p>
                    </div>
                    <div className='user-container'>
                        <div className='user-icon'></div>
                        <p>Workspace</p>
                    </div>
                </div>

                <div className='navigation'>
                    <div className='settings-icon'></div>
                    <div className='wifi-icon'><WifiIcon size={24} /></div>
                    <div className='turn-off'></div>
                </div>
            </div>
        </div>
    );
};

export default MainScrin;