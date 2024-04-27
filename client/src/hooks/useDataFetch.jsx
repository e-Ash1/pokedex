import { useState, useEffect } from 'react';
import axios from 'axios';

const useDataFetch = (endpoint) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const baseURL = import.meta.env.VITE_PROD_URL;

    useEffect(() => {
        const apiUrl = `${baseURL}${endpoint}`;
        setLoading(true); 

        axios.get(apiUrl)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });

    }, [endpoint]); 

    return { data, loading, error };
};

export default useDataFetch;
