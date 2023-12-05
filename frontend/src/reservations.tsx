import axios from "axios";
import { useState } from "react";

const Res = () => {
    const [data, setdata] = useState([]);
    const [number, setnumber] = useState("");
    const [accessed, setccessed] = useState(true);
    const handleinputChange = (e) => {
        setnumber(e.target.value);
    }
    const handlebuttonclick = () => {
        const fetchdata = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/res/reservation/${number}`);
                setdata(res.data.mes);
                console.log(res.data.mes);
                setccessed(!accessed);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchdata();
    }
    return (
        <div className="hero-container">
            <div className="flex justify-center items-center h-screen">
                <div className="bg-white w-3/4 p-6 rounded items-center justify-center flex">
                    {accessed ? (<><input
                        type="text"
                        placeholder="Enter Phone Number"
                        className="border border-gray-300  px-4 py-2 outline-none w-1/4 rounded mr-5 text-black"
                        onChange={handleinputChange}
                        value={number}

                    />
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handlebuttonclick}>
                            Submit
                        </button></>) : (
                        data.map((item, index) =>{
                            return <div key={index} className="reservation-item text-black flex-col flex">
                                <div className="flex">
                                <p>Name: {item.name} </p>
                                <p>Date: {new Date(item.date).toISOString().split('T')[0]}</p>
                                <p> Time: {item.time}</p>
                                <p> Size: {item.size} </p>
                                </div>
                            </div>}
                        ))
                    }
                </div>
            </div>


        </div>)
}
export default Res;