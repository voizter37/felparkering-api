import { useMap } from "react-leaflet";

interface MapMoverProps {
    position: [number, number]
}

export default function MapMover({ position }: MapMoverProps) {
    const map = useMap();
    map.panTo(position);

    return null;
}