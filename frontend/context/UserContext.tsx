import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "../types/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeJwt } from "../utils/decodeJwt";

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (token) {
                    const decoded = decodeJwt<{ email: string; role: string }>(token);
                    if (decoded) {
                        setUser({ email: decoded.sub, role: decoded.role })
                    }
                }
            } catch (error) {
                console.error("Failed to load user from token", error);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    if (loading) {
        return null;
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}