import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore: CSS import without type declarations
import '../../style/Screen.css';
// @ts-ignore: CSS import without type declarations
import '../../style/AdditionForScreen.css';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import FolderInside from './FolderInside';

gsap.registerPlugin(Draggable);

type Props = {
    id: string;
    name: string;
    position: { top: number; left: number };
    files?: any[];
    onDelete?: () => void;
    onRename?: (newName: string) => void;
};

function Folder({ id, name, position, files = [], onDelete, onRename }: Props) {
    const folderRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);
    const [isRenaming, setIsRenaming] = useState(false);
    const [editName, setEditName] = useState(name);
    const renameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const el = folderRef.current;
        if (!el) return;

        gsap.fromTo(el,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
        );

        Draggable.create(el, {
            bounds: ".screen",
            allowContextMenu: true,
            onPress: function() {
                gsap.set(".icons", { zIndex: 1 });
                gsap.set(this.target, { zIndex: 10 });
            }
        });

        const handleCtx = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setCtxMenu({ x: e.pageX, y: e.pageY });
        };
        el.addEventListener("contextmenu", handleCtx);

        return () => {
            el.removeEventListener("contextmenu", handleCtx);
        };
    }, []);

    useEffect(() => {
        if (!ctxMenu) return;
        const close = () => setCtxMenu(null);
        window.addEventListener('click', close);
        window.addEventListener('contextmenu', close);
        return () => {
            window.removeEventListener('click', close);
            window.removeEventListener('contextmenu', close);
        };
    }, [ctxMenu]);

    useEffect(() => {
        if (isRenaming && renameRef.current) {
            renameRef.current.focus();
            renameRef.current.select();
        }
    }, [isRenaming]);

    const handleDelete = () => {
        setCtxMenu(null);
        onDelete?.();
    };

    const handleRenameStart = () => {
        setCtxMenu(null);
        setEditName(name);
        setIsRenaming(true);
    };

    const handleRenameConfirm = () => {
        const trimmed = editName.trim();
        if (trimmed && trimmed !== name) {
            onRename?.(trimmed);
        }
        setIsRenaming(false);
    };

    const handleRenameKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleRenameConfirm();
        if (e.key === 'Escape') setIsRenaming(false);
    };

    return (
        <>
            <div
                ref={folderRef}
                id={id}
                className='icons folder'
                style={{
                    top: typeof position.top === 'number' ? `${position.top}px` : position.top,
                    left: typeof position.left === 'number' ? `${position.left}px` : position.left,
                    position: 'absolute',
                    zIndex: 1
                }}
                onDoubleClick={() => setIsOpen(true)}
            >
                <img src="/folder.png" alt="Folder Icon" />
                {isRenaming ? (
                    <input
                        ref={renameRef}
                        className="rename-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleRenameConfirm}
                        onKeyDown={handleRenameKey}
                        onContextMenu={(e) => e.stopPropagation()}
                    />
                ) : (
                    <p>{name}</p>
                )}
            </div>

            {ctxMenu && (
                <div
                    onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="right-click-feald"
                    style={{ left: ctxMenu.x, top: ctxMenu.y }}
                >
                    <span onClick={handleRenameStart}>✏️ Rename</span>
                    <span onClick={handleDelete}>🗑️ Delete</span>
                </div>
            )}

            {isOpen && (
                <FolderInside
                    id={id}
                    name={name}
                    files={files}
                    onClose={() => setIsOpen(false)}
                    onDelete={onDelete}
                />
            )}
        </>
    );
}

export default Folder;