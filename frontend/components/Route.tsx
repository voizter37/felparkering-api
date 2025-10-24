
import { useEffect, useMemo, useRef, useState } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import L, { LatLngBoundsExpression } from "leaflet";
import { useApi } from "../services/api";

type FC = {
    type: "FeatureCollection";
    features: Array<{
        type: "Feature";
        geometry: { type: "LineString" | "MultiLineString"; coordinates: number[][] | number[][][] };
        properties?: Record<string, any>;
        bbox?: [number, number, number, number];
    }>;
    bbox?: [number, number, number, number];
};

export default function Route({
    start,
    end,
    weight = 5,
    dashArray,
    onReady
}: {
    start: [number, number];
    end: [number, number];
    weight?: number;
    dashArray?: string;
    onReady?: (fc: FC) => void;
}) {
    const { getRoute } = useApi();
    const map = useMap();
    const [fc, setFc] = useState<FC | null>(null);

    const routeKey = useMemo(() => `${start[0]},${start[1]}|${end[0]},${end[1]}`, [start, end]);

    const prevKeyRef = useRef<string | null>(null);
    const inFlightRef = useRef<boolean>(false);
    const abortRef = useRef<AbortController | null>(null);

    const style = useMemo(() => ({ weight, ...(dashArray ? { dashArray } : {}) }), [weight, dashArray]);

    useEffect(() => {
        if (prevKeyRef.current === routeKey) return;
        prevKeyRef.current = routeKey;

        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;

        if (inFlightRef.current) return;
        inFlightRef.current = true;

        (async () => {
            try {
                const res = await getRoute({ start, end }, { signal: ac.signal });;
                if (ac.signal.aborted) return;

                const data = res?.data as FC;
                if (data?.type !== "FeatureCollection") {
                    console.error("StableRouteGeoJSON: ogiltigt GeoJSON-svar", data);
                    setFc(null);
                    return;
                }
                setFc(data);
                onReady?.(data);
            } catch (e: any) {
                if (!ac.signal.aborted) console.error("StableRouteGeoJSON getRoute error:", e);
                setFc(null);
            } finally {
                inFlightRef.current = false;
            }
        })();

        return () => {
            ac.abort();
        };
    }, [routeKey, start, end, onReady]);

    useEffect(() => {
        if (!fc) return;
        const rb = fc.bbox ?? fc.features.find((f) => f.bbox)?.bbox;
        if (rb && rb.length === 4) {
            const [minLng, minLat, maxLng, maxLat] = rb;
            const bounds: LatLngBoundsExpression = [[minLat, minLng], [maxLat, maxLng]];
            map.fitBounds(bounds, { padding: [24, 24] });
            return;
        }
        const b = new L.LatLngBounds([]);
        fc.features.forEach((f) => {
            const g = f.geometry;
            if (g?.type === "LineString") {
                (g.coordinates as number[][]).forEach(([lng, lat]) => b.extend([lat, lng]));
            } else if (g?.type === "MultiLineString") {
                (g.coordinates as number[][][]).forEach((seg) => seg.forEach(([lng, lat]) => b.extend([lat, lng])));
            }
        });
        if (b.isValid()) map.fitBounds(b, { padding: [24, 24] });
    }, [fc, map]);

    if (!fc) return null;

    const key = `${fc.features.length}:${fc.bbox?.join(",") ?? ""}`;
    return <GeoJSON key={key} data={fc as any} style={style as any} />;
}
