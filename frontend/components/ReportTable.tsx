import { FlatList, Pressable, View, Text, ScrollView } from "react-native";
import { prettyAddress, prettyDate } from "../utils/prettyPrinter";
import { Dispatch, ReactElement, SetStateAction, useMemo, useState } from "react";
import { Report } from "../types/report";

type TableProps = {
    columns: string[];
    data: Report[];
    onRowPress: React.Dispatch<React.SetStateAction<Report>>;
};

export default function ReportTable({ columns = [], data = [], onRowPress }: TableProps) {
    const [selected, setSelected] = useState<Report | null>(null);

    const [containerWidth, setContainerWidth] = useState<number>(0);
    const flexWeights = [1, 2, 2, 1, 2];
    const maxWidths = [80, 300, 300, 80, 300]; 
    const FILL_INDEX = 1;

    const colWidths = useMemo(() => {
        const total = flexWeights.reduce((a, b) => a + b, 0);
        const raw   = flexWeights.map(w => (containerWidth * w) / total);
        const clamped = raw.map((w, i) => Math.min(w, maxWidths[i]));
        const used = clamped.reduce((a, b) => a + b, 0);
        const diff = containerWidth - used;
        if (diff > 0 && Number.isFinite(diff)) {
            clamped[FILL_INDEX] = clamped[FILL_INDEX] + diff;
        }
        return clamped;
    }, [containerWidth]);

    const TableHeader = (): ReactElement => (
        <View className="flex-row bg-gray-300 border-b border-gray-300">
            {columns.map((c : string, index: number) => (
                <View
                    key={index}
                    style={{ width: colWidths[index], padding: 8 }}
                    className={`p-3 items-center ${index < columns.length - 1 ? 'border-r border-gray-300' : ''}`}
                >
                    <Text className="font-semibold text-gray-800" numberOfLines={1} ellipsizeMode="tail">{c}</Text>
                </View>
            ))}
        </View>
    );

    const TableRow = ({ item, onPress, isSelected }: { item: Report; onPress: Dispatch<SetStateAction<Report>>; isSelected: boolean; }) => {
        const values = [
            item.id,
            prettyAddress(item.address),
            item.category,
            item.status,
            prettyDate(item.createdOn),
        ];

        const rowBg = isSelected ? "bg-gray-200" : "bg-white";

        return (
            <Pressable 
                className={`flex-row items-center ${rowBg} active:bg-gray-50 hover:bg-gray-100 transition-colors duration-50`}
                onPress={() => {
                    onRowPress?.(item);
                    onPress(item);
                }}
            >
                {values.map((value, index) => (
                    <View
                        key={index}
                        style={{ width: colWidths[index] }}
                        className={`p-3 items-center justify-center ${index < values.length - 1 ? "border-r border-gray-300" : ""}`}
                    >
                        <Text numberOfLines={1} ellipsizeMode="tail">{value}</Text>
                    </View>
                ))}
            </Pressable>
        );
        
    };

    return (
        <View className="m-4 rounded-2xl shadow-sm" onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="rounded-2xl overflow-hidden bg-white">
                        <FlatList 
                            data={data} 
                            ListHeaderComponent={<TableHeader/>}
                            ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200" />}
                            keyExtractor={({ id }) => String(id)}
                            renderItem={({ item }) => <TableRow item={item} onPress={setSelected} isSelected={selected?.id == item.id}/>}
                        />
                    </View>
            </ScrollView>
        </View>
    );
}