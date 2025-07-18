import { useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import FormTextField from "./FormTextField";

interface DropdownItem {
    label: string;
    value: string;
}

interface FormDropdownProps {
    items: DropdownItem[];
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    iconName: any;
    error?: string;
}

export default function FormDropdown({ items, placeholder, value, onChange, iconName, error }: FormDropdownProps) {
    const [dropdown, toggleDropdown] = useState(false);
    const [inputText, setInputText] = useState("");
    const [focused, setFocused] = useState(false);
    const [filteredItems, setFilteredItems] = useState<DropdownItem[]>([]);
    const wasSelected = useRef(false);

    useEffect(() => {
        const selected = items.find((item) => item.value === value);
        setInputText(selected?.label || "");
    }, [value])



    useEffect(() => {
        if (wasSelected.current) {
            wasSelected.current = false;
            return;
        }

        const anyMatch = items.filter((item) =>
            item.label.toLowerCase().includes(inputText.toLowerCase())
        );

        setFilteredItems(anyMatch);
        toggleDropdown(anyMatch.length > 0);

    }, [inputText]);

    const handleSelect = (item: DropdownItem) => {
        wasSelected.current = true;
        setInputText(item.label);
        toggleDropdown(false);
        onChange?.(item.value);
    };

    return (
        <View>
            <FormTextField
                placeholder={placeholder}
                value={inputText}
                onChangeText={(text) => setInputText(text)}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                    setTimeout(() => setFocused(false), 150);
                }}
                iconName={iconName}
                error={error}
            />

            {focused && dropdown && (
                <View className="mx-2 border border-gray-300 rounded-b bg-white shadow-md max-h-60">
                    <FlatList 
                        data={filteredItems} 
                        keyExtractor={(item) => item.value}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => 
                            <TouchableOpacity
                                className="px-4 py-2 border-t border-gray-100 hover:bg-gray-100"
                                onPress={() => handleSelect(item)}
                            >
                                <Text className="text-gray-800">{item.label}</Text>
                            </TouchableOpacity> 
                        }
                    />
                </View>
                )}
        </View>
    );
}