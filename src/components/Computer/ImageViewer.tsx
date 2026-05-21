import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
// @ts-ignore: CSS import without type declarations
import '../../style/ImageViewer.css';

gsap.registerPlugin(Draggable);

let highestZIndex = 3500;

type Props = {
    id: string;
    name: string;
    src: string;
    onClose: () => void;
};

function ImageViewer({ id, name, src, onClose }: Props) {
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
                trigger: windowRef.current.querySelector(".image-header"),
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

    return (
        <div
            className="image-viewer" 
            ref={windowRef} 
            id={`image-${id}`}
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
            <div className="image-header">
                <h2>{name}</h2>
                <span className="close-btn" onClick={handleCloseAction}>X</span>
            </div>
            <div className="image-content">
                <img src={src} alt={name} />
            </div>
        </div>
    );
}

export default ImageViewer;