export default function FlagButton({isActive}) {
    return (
        <svg width="120" height="120" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="2" width="1" height="20" fill="#8B8B8B" opacity={isActive? 1 : 0.5} />
            <path d="M9 3 L22 8 L9 13 Z" fill="#FF0000" opacity={isActive? 1 : 0.5} />
        </svg>
    );
}