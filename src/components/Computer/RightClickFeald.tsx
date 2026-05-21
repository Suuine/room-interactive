import { useRef } from "react";
// @ts-ignore: CSS import without type declarations
import "../../style/AdditionForScreen.css";

type Props = {
    position: { x: number; y: number };
    onCreateFile: (position: { x: number; y: number }) => void;
    onCreateFolder: (position: { x: number; y: number }) => void;
    onRefresh: () => void;
};

function RightClickFeald({ position, onCreateFile, onCreateFolder, onRefresh }: Props) {
    const fealdRef = useRef<HTMLDivElement>(null);

    return (
        <div 
            ref={fealdRef} 
            className="right-click-feald" 
            style={{ left: position.x, top: position.y }}
        >
            <span onClick={() => onCreateFile(position)}>Create File</span>
            <span onClick={() => onCreateFolder(position)}>Create Folder</span>
            <span onClick={onRefresh}>Refresh</span>
        </div>
    );
}

export default RightClickFeald;