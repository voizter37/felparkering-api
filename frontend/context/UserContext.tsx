import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "../types/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeJwt } from "../utils/decodeJwt";

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    logout: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        await AsyncStorage.removeItem("token");
        setUser(null);
    }

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (token) {
                    const decoded = decodeJwt<{ email: string; role: string; exp: number }>(token);
                    if (decoded && decoded.exp * 1000 > Date.now()) {
                        setUser({ email: decoded.sub, role: decoded.role })
                    } else {
                        await AsyncStorage.removeItem("token");
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error("Failed to load user from token", error);
            } finally {
                setLoading(false);
            }
        }

        loadUser();

        const interval = setInterval(loadUser, 5 * 60 * 1000); // Checks token every fifth minute.

        return () => clearInterval(interval);
    }, []);

    

    if (loading) {
        return null;
    }

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}