import { View, Text, Pressable } from "react-native";
import WebMap from "./WebMap";
import { cities } from "../constants/cities";
import { useCallback, useState } from "react";
import Chip from "./Chip";



interface AttendantLargeReportWrapperProps {
    address: string;
    hq: string;
    licensePlate: string;
    violation: string;
    timeStamp: string;
    coords: [number, number];
}

export default function AttendantLargeReportWrapper({ address, hq, licensePlate, violation, timeStamp, coords }: AttendantLargeReportWrapperProps) {

    const [routeSummary, setRouteSummary] = useState<{distance: number; duration: number} | null>(null);

    const handleRouteReady = useCallback((summary?: {distance: number; duration: number}) => {
        if (!summary) return;
        setRouteSummary({
            distance: summary.distance ?? 0,
            duration: summary.duration ?? 0,
        });
    }, []);

    function prettyDistance(distance: number) {
        if (distance < 1000) {
            return Math.round(distance) + " meter";
        } else if (distance < 100000) {
            return Math.round(distance / 100) / 10 + " km"
        } else {
            return Math.round(distance / 1000) / 100 + " miles"
        }
    }

    function prettyDuration(duration: number) {
        if (duration < 60) {
            return Math.round(duration) + " seconds";
        } else if (duration < 3600) {
            return Math.round(duration / 6) / 10 + " min"
        } else {
            return Math.round(duration / 360) / 10 + " h"
        }
    }

    function prettyDate(ts?: string) {
        if (!ts) return "";
        const d = new Date(ts);
        return `${d.getFullYear()}-${(d.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}, ${d
            .getHours()
            .toString()
            .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    }

    function getCityCoordinates(cityName: string) {
        const match = cities.find(c => c.city.toLowerCase() === cityName.toLowerCase());
        return match?.position || null;
    }
    
    const hqPosition = getCityCoordinates(hq);

    return (
        <View className="w-full">
            <View className="">
                <View className="relative rounded-2xl p-4 m-4 mb-4 shadow-md border shadow-gray-200 border-gray-200 bg-white overflow-hidden divide-y divide-slate-100">
                    <View className="px-5 py-4">
                        <Text className="text-2xl font-semibold text-slate-900">{address}</Text>
                    </View>  

                    <View className="border-t border-slate-100" />

                    <View className="h-80">
                        <WebMap adressPosition={coords} hqPosition={[hqPosition.latitude, hqPosition.longitude]} onRouteReady={handleRouteReady}/>
                    </View>

                    <View className="border-t border-slate-100" />

                    <View className="px-5 py-4 gap-3">
                        <View className="flex-row flex-wrap items-center gap-2">
                            {routeSummary && (
                                <>
                                    <Chip label={licensePlate} iconName="car-outline"/>
                                    <Chip label={prettyDistance(routeSummary.distance)} iconName="speedometer-outline"/>
                                    <Chip label={prettyDuration(routeSummary.duration)} iconName="time-outline"/>
                                </>
                            )}
                        </View>
                        <Text className="text-base text-slate-900">{violation}</Text>
                        <Text className="text-sm text-slate-500">{prettyDate(timeStamp)}</Text>
                    </View>

                    <View className="border-t border-slate-100" />

                    <View className="px-5 py-4 flex-row items-center justify-between gap-3">
                        <Pressable className="rounded-xl px-5 py-3 bg-emerald-600">
                            <Text className="text-white text-base font-medium text-center">Accept</Text>
                        </Pressable>
                        <Pressable className="rounded-xl px-5 py-3 border border-slate-200"> 
                            <Text className="text-slate-700 text-base font-medium text-center">Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}
