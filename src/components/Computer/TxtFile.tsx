import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

let highestZIndex = 3000;

type Props = {
    id: string;
    name: string;
    content: string;
    onClose: () => void;
    onDelete?: () => void;
    onSave?: (newContent: string) => void;
};

function TxtFile({ id, name, content: initialContent, onClose, onDelete, onSave }: Props) {
    const [text, setText] = useState(initialContent);
    const windowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (windowRef.current) {
            gsap.fromTo(windowRef.current, 
                { opacity: 0, scale: 0.8 }, 
                { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
            );

            highestZIndex++;
            gsap.set(windowRef.current, { zIndex: highestZIndex });

            Draggable.create(windowRef.current, {
                bounds: ".screen",
                trigger: windowRef.current.querySelector(".txt-header"),
                onPress: function() {
                    highestZIndex++;
                    gsap.set(this.target, { zIndex: highestZIndex });
                }
            });
        }
    }, []);

    const handleCloseAction = () => {
        if (windowRef.current) {
            gsap.to(windowRef.current, {
                opacity: 0,
                scale: 0.8,
                duration: 0.2,
                onComplete: onClose 
            });
        } else {
            onClose();
        }
    };

    const handleSave = () => {
        if (onSave) {
            onSave(text);
        }
    };

    return (
        <div
            className="txt-file" 
            ref={windowRef} 
            id={`window-${id}`}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
            onMouseDown={() => {
                highestZIndex++;
                if (windowRef.current) {
                    gsap.set(windowRef.current, { zIndex: highestZIndex });
                }
            }}
        >
            <div className="txt-header">
                <h2>{name}</h2>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button className="save-btn" onClick={handleSave}>💾</button>
                    <span className="close-btn" onClick={handleCloseAction}>X</span>
                </div>
            </div>
            <div className="txt-content">
                <textarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    spellCheck="false"
                />
            </div>
        </div>
    );
}

export default TxtFile;