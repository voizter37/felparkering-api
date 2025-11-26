import { FlatList, Pressable, View, Text, ScrollView, TextInput } from "react-native";
import Icon from '@expo/vector-icons/Ionicons';
import { prettyAddress, prettyDate } from "../utils/prettyPrinter";
import { ReactElement, useState } from "react";
import { Report } from "../types/report";
import { parkingCategories } from "../constants/parkingCategories";

type TableProps = {
    columns: string[];
    data: Report[];
    selected: Report | null;
    onSelect: (r: Report | null) => void;
};

const getPagesToShow = (currentPage: number, totalPages: number) => {
    if (totalPages <= 3) {
        return [...Array(totalPages)].map((_, i) => i + 1);
    }

    if (currentPage <= 2) {
        return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 1) {
        return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage, "...", totalPages];
};

export default function ReportTable({ columns = [], data = [], selected, onSelect }: TableProps) {
    const COLUMN_FLEX = [1, 2, 2, 1, 1]; 
    const firstEntry = 0;
    const lastEntry = 5;
    const totalEntry = 45;
    const numPages = 3;
    const [page, setPage] = useState(1);
    const pages = getPagesToShow(page, numPages);

    const [searchFocused, setSearchFocused] = useState(false);

    const TableHeader = (): ReactElement => (
        <View className="flex-row flex-1 min-w-full">
            {columns.map((c : string, index: number) => (
                <Pressable
                    key={index}
                    style={{ flex: COLUMN_FLEX[index] }}
                    className={"p-4 border-b border-slate-200 bg-slate-50 flex-row items-center gap-1"}
                >
                    <Text 
                        className="text-sm uppercase font-normal leading-none text-slate-500" 
                        numberOfLines={1} 
                        ellipsizeMode="tail"
                        selectable={false}
                    >
                        {c}
                    </Text>
                    <Icon name={"chevron-expand-outline"} size={14} className="text-slate-500" />                
                </Pressable>
            ))}
        </View>
    );

    const TableRow = ({ item, isSelected }: { item: Report; isSelected: boolean; }) => {
        const values = [
            item.id,
            prettyAddress(item.address),
            parkingCategories.find(violation => violation.value === item.category).label,
            item.status,
            prettyDate(item.createdOn),
        ];

        const rowBg = isSelected ? "bg-gray-200" : "bg-white";

        return (
            <Pressable 
                className={`${rowBg} flex-row hover:bg-slate-50 border-b border-slate-200`}
                onPress={() => onSelect(isSelected ? null : item)}
            >
                {values.map((value, index) => (
                    <View
                        key={index}
                        style={{ flex: COLUMN_FLEX[index] }}
                        className={"p-4 py-5"}
                    >
                        <Text 
                            className="block font-semibold text-sm text-slate-800" 
                            numberOfLines={1} 
                            ellipsizeMode="tail"
                        >
                            {value}
                        </Text>
                    </View>
                ))}
            </Pressable>
        );
        
    };

    

    const TableFooter = () => {
        return (
            <View className="flex-row justify-between items-center px-4 py-3">
                <Text className="text-sm text-slate-500">
                    Viewing {firstEntry}-{lastEntry} of {totalEntry}
                </Text>
                <View className="flex-row space-x-1">
                    <Pressable 
                        className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
                        disabled={page===1}
                        onPress={() => setPage(page - 1)}
                    >
                        <Text selectable={false}>Prev</Text>
                    </Pressable>
                    {[...Array(numPages)].map((_, index) => (
                        <Pressable
                            key={index}
                            className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
                            onPress={() => console.log("Page", index + 1)}
                        >
                            <Text>{index + 1}</Text>
                        </Pressable>
                    ))}
                    <Pressable 
                        className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
                        disabled={page===numPages}
                        onPress={() => setPage(page + 1)}
                    >
                        <Text selectable={false}>Next</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View className="w-full flex mb-3 mt-1 pl-3">
            <View className="flex-row items-center mb-2">
                <View className="flex-1 items-center">
                    <Text className="text-lg font-semibold text-slate-800">Active Reports</Text>
                </View>
                
                
                <View className="flex-[2] ml-3">
                    <View className="w-full ">
                        <View className={`flex-row items-center rounded px-3 h-10 border ${searchFocused ? "border-slate-400 shadow-sm" : "border-slate-200"}`}>
                            <Icon name={"search-outline"} size={20} />
                            <TextInput 
                                className="flex-1 ml-2 text-sm text-slate-700 focus:outline-none"
                                placeholder="Search"
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                            
                        </View>
                    </View>
                </View>
            </View>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                className="relative w-full h-full overflow-scroll text-gray-700 bg-white rounded-lg shadow-md border shadow-gray-200 border-gray-200 bg-clip-border"
            >
                    <View className="flex-1 min-w-full">
                        <FlatList 
                            data={data} 
                            ListHeaderComponent={<TableHeader/>}
                            ListFooterComponent={<TableFooter/>}
                            ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200" />}
                            keyExtractor={({ id }) => String(id)}
                            renderItem={({ item }) => <TableRow item={item} isSelected={selected?.id === item.id}/>}
                        />
                    </View>
            </ScrollView>
        </View>
    );
}