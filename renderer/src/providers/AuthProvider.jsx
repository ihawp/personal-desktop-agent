import { useState, createContext } from 'react';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
    
    const [authenticated, setAuthenticated] = useState(false);
    

    const makeFetch = async () => {
        try {
            const response = await fetch(process.meta.env.VITE_SERVER_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) return false;

            const data = await response.json();

            if (!data) return false;

            return true;
        } catch (error) {
            return false;
        }
    }

    const doFetch = async () => {
        const response = await makeFetch();
        setAuthenticated(response);
    }

    useEffect(() => {

        doFetch();

    });

    return <AuthContext.provider value={{ authenticated }}>
        { children }
    </AuthContext.provider>
}

export default AuthProvider;