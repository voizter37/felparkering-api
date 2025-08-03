import { router, usePathname } from "expo-router";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";

export default function AuthRedirector() {
    const { user, loading } = useUser();
	const pathname = usePathname();

	useEffect(() => {
		if (loading) return;

		if (user) {
			const expectedRoute = {
				ADMIN: "/admin",
				ATTENDANT: "/attendant",
				CUSTOMER: "/home",
			}[user.role];
            
			if (expectedRoute && !pathname.startsWith(expectedRoute)) {
				router.replace(expectedRoute);
			} 
            
            } else {
				if (pathname !== "/") {
				    router.replace("/");
			    }
          	}
      	}, [user, pathname, loading]);

    return null;
}