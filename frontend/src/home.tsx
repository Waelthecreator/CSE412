import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function convertTimeTo24HourFormat(time12h, period) {
   
    let [hour, minute] = time12h.split(':');
    hour = parseInt(hour);
    minute = parseInt(minute);

    if (period.toLowerCase() === 'pm' && hour < 12) {
        hour += 12;
    }

    if (hour === 12 && period.toLowerCase() === 'am') {
        hour = 0;
    }

    // Format the hour and minute to ensure leading zeros if needed
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');

    return `${formattedHour}:${formattedMinute}`;
}
const Home = () => {
    const navigate = useNavigate();
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const times = [
        "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30",
        "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30",
        "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30"
    ];
    const amorpm = ["am", "pm"];
    const [data, setdata] = useState([]);
    const [day, setday] = useState("Monday");
    const [time, settime] = useState("12:00");
    const [ampm, setampm] = useState("am");
    const [promo,setpromo] = useState(false);
    useEffect(() => {
        const fetchdata = async () => {
            try {
                const res = await axios.get("http://localhost:5000/res");
                setdata(res.data.mes1);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchdata();
    }, [])
    const handleDaySelect = (e) => {
        setday(e.target.value);
    }
    const handleTimeSelect = (e) => {
        settime(e.target.value);
    }
    const handleAmPmSelect = (e) => {
        setampm(e.target.value)
    }
    const handleTimeButtonclick = () => {
        if (!day || !time) {
            return;
        }
        const fetchdata = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/res/time/${day}/${convertTimeTo24HourFormat(time, ampm)}`);
                setdata(res.data.mes1);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchdata();

    }
    const handleclick = (phone_number) =>{
        console.log(phone_number);
        navigate(`/restaurant/${phone_number}`);
    }
    const handlepromoButtonClick = () =>{
        if (promo){
            setpromo(!promo);
            const fetchdata = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/res/promo`);
                    setdata(res.data.mes1);
                }
                catch (err) {
                    console.log(err);
                }
            }
            fetchdata();
        }
        else {
            setpromo(!promo);
            const fetchdata = async () => {
                try {
                    const res = await axios.get("http://localhost:5000/res");
                    setdata(res.data.mes1);
                }
                catch (err) {
                    console.log(err);
                }
            }
            fetchdata();
        }
        
        
    }
    return (
        <div className="hero-container">
            <div className="justify-between flex">
                <div className="py-4 flex">
                    <label className=" block text-white font-bold mb-2 px-5">
                        Select a day:
                    </label>
                    <select
                        className="block appearance-none bg-white border border-gray-300 rounded text-black py-1 px-1 focus:outline-none focus:border-blue-500 w-20"
                        value={day}
                        onChange={handleDaySelect}

                    >
                        {daysOfWeek.map((day, index) => (
                            <option key={index} value={day} className="text-gray-800">
                                {day}
                            </option>
                        ))}
                    </select>
                    <label className=" block text-white font-bold mb-2 px-5">
                        Select a time:
                    </label>
                    <select
                        className="block appearance-none bg-white border border-gray-300 rounded text-black py-1 px-1 focus:outline-none focus:border-blue-500 w-20"
                        value={time}
                        onChange={handleTimeSelect}

                    >
                        {times.map((day, index) => (
                            <option key={index} value={day} className="text-gray-800">
                                {day}
                            </option>
                        ))}
                    </select>
                    <select
                        className="block appearance-none  bg-white border border-gray-300 rounded text-black py-1 mx-3 px-3 focus:outline-none focus:border-blue-500 w-20 "
                        value={ampm}
                        onChange={handleAmPmSelect}

                    >
                        {amorpm.map((day, index) => (
                            <option key={index} value={day} className="text-gray-800">
                                {day}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleTimeButtonclick} className="bg-black hover:bg-gray-800 active:bg-opacity-50 text-white font-bold py-2 px-4 rounded">
                        Fetch Open Restaurants
                    </button>
                </div>
                <button onClick={handlepromoButtonClick} className="bg-black hover:bg-gray-800 active:bg-opacity-50 text-white font-bold py-2 px-4 rounded my-4 mr-10">Promotion</button>
            </div>
            <div className="flex flex-wrap justify-center">
                {data.length  >=1? (data.map((item, index) => {
                    return <div key={item.name} className="rounded-md w-1/4 px-5 py-10 mx-5 my-20 bg-white cursor-pointer transition duration-300 ease-in-out transform hover:shadow-lg active:scale-95"
                    onClick={() => handleclick(item.name)}
                    >
                        <h1 className="text-black px-5 font-bold py-3">{item.name}</h1>
                        <h1 className="text-black px-5">{item.address}</h1>
                        <h1 className="text-black px-5">{item.phone_number}</h1>
                        <h1 className="text-black px-5">{Number.isInteger(parseFloat(item.avg)) ? Math.floor(parseFloat(item.avg)) : parseFloat(item.avg).toFixed(2)} out of 5</h1>



                    </div>
                })) : (<h1 className="bg-white text-black p-20 my-50 rounded font-bold">No Results Found</h1>)}
            </div>
        </div>)
}

export default Home;