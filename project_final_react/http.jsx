import React, { useEffect, useState } from 'react'
import axios from 'axios';




function HTTP() {
    const [data, setData] = useState(null);
    useEffect(() => {
        // fetch('https://restcountries.com/v3.1/name/Romania')
        //     .then(response => response.json()).then(data => {
        //         console.log(data[0])
        //         setData(data[0]);

        axios.get('https://restcountries.com/v3.1/name/Romania')
            .then(response => {
                setData(response.data[0]);
            })
            .catch(error => { console.log(error) });
    }


        , [])


    return (
        <div>
            {data ? data.capital[0] : "data nu este incarcat"}
        </div>
    )
};

export default HTTP
