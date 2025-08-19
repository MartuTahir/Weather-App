import sunny from "../assets/images/sunny.png"
import cloudy from "../assets/images/cloudy.png"
import rainy from "../assets/images/rainy.png"
import snowy from "../assets/images/snowy.png"
import loadingGif from "../assets/images/loading.gif"
import { useEffect, useState } from "react"

export const WeatherApp = () => {

    const [data, setData] = useState({});
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);

    const api_key = 'a4728c560e4d46f66173ff95c35fea7f';

    useEffect(() => {
        const fetchDefaultWeather = async () => {
            setLoading(true)
            const defaultLocation = 'Buenos Aires'
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&lang=es&appid=${api_key}`
            const response = await fetch(url)
            const defaultData = await response.json()
            setData(defaultData)
            setLoading(false)
        }

        fetchDefaultWeather()
    }, [])

    

    const firstLetterUpper = (texto) => {
        if (!texto) return '';
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    };

    const handleInputChange = (event) => {
        setLocation(event.target.value);
    }
    const search = async () => {
        if(location.trim() !== '') {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&lang=es&appid=${api_key}`
            const response = await fetch(url)
            const searchData = await response.json()
            if(searchData.cod !== 200) {
                setData({notFound: true})
            } else {
                setData(searchData)
                setLocation('')
            }
            setLoading(false)
            
        }
        
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            search()
        }
    }

    const weatherImages = {
        Clear: sunny,
        Clouds: cloudy,
        Rain: rainy,
        Snow: snowy,
        Haze: cloudy,
        Mist: cloudy,
        Thunderstorm: rainy
    }

    const weatherImage = data.weather ? weatherImages[data.weather[0].main] : null;

    const backgroundImages = {
        Clear: 'linear-gradient(to right, #f3b07c, #fcd283)',
        Clouds: 'linear-gradient(to right, #57d6d4, #71eeec)',
        Rain: 'linear-gradient(to right, #5bc8fb, #80eaff)',
        Snow: 'linear-gradient(to right, #aff2ff, #fff)',
        Haze: 'linear-gradient(to right, #57d6d4, #71eeec)',
        Mist: 'linear-gradient(to right, #57d6d4, #71eeec)',
        Thunderstorm: 'linear-gradient(to right, #5bc8fb, #80eaff)'
    }

    const backgroundImage = data.weather ? backgroundImages[data.weather[0].main] : 'linear-gradient(to right, #f3b07c, #fcd283)';

    const currentDate = new Date();

    const daysOfWeek = ['Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab', 'Dom'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const day = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const formattedDate = `${dayOfWeek}, ${day} ${month}`;

    return (
        <div className="container" style={{backgroundImage}}>
            <div className="weather-app" style={{backgroundImage: backgroundImage && backgroundImage.replace? backgroundImage.replace('to right', 'to top') : null}}>
                <div className="search">
                    <div className="search-top">
                        <i className="fa-solid fa-location-dot"></i>
                        <div className="location">{data.name}</div>
                    </div>
                    <div className="search-bar">
                        <input type="text" 
                                placeholder="Escriba una ubicación" 
                                value={location} 
                                onChange={handleInputChange} 
                                onKeyDown={handleKeyDown}/>
                        <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
                    </div>
                </div>
                {loading ? (<img src={loadingGif} alt="loading" className="loader"/>) : 
                    data.notFound ? (<div className="not-found">Ciudad no encontrada </div>) : (
                    <> 
                    <div className="weather">
                        <img src={weatherImage} alt="soleado" />
                        <div className="weather-type">{data.weather ? firstLetterUpper(data.weather[0].description) : ''}</div>
                        <div className="temp">{data.main ? `${Math.floor(data.main.temp)}°` : ''}</div>
                    </div>
                    <div className="weather-date">
                        <p>{formattedDate}</p>
                    </div>
                    <div className="weather-data">
                        <div className="humidity">
                            <div className="data-name">Humedad</div>
                            <i className="fa-solid fa-droplet"></i>
                            <div className="data">{data.main ? data.main.humidity : null}%</div>
                        </div>
                        <div className="wind">
                            <div className="data-name">Viento</div>
                            <i className="fa-solid fa-wind"></i>
                            <div className="data">{data.wind ? data.wind.speed : null}km/h</div>
                        </div>
                    </div>
                    </>)}
            </div> 

        </div>
    )
}
