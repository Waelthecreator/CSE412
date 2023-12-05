import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const Rest = () => {
    const {id} = useParams();
    const [info, setInfo] = useState([]);
    const [menu, setMenu] = useState([]);
    const [hours, setHours] = useState([]);
    useEffect(() =>{
        const fetchdata = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/res/${id}`);
                setInfo(res.data.info);
                setMenu(res.data.menu);
                setHours(res.data.hours);
                console.log(id)
                console.log(res.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchdata();
    },[]);


    return <div className="hero-container text-black">
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white shadow-md rounded-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-black">Restaurant Information</h2>
                {info.map((item, index) => (
                    <div key={index}>
                        <p className="mb-2 text-black"><strong>Name:</strong> {item.name}</p>
                        <p className="mb-2 text-black"><strong>Address:</strong> {item.address}</p>
                        <p className="mb-2 text-black"><strong>Phone Number:</strong> {item.phone_number}</p>
                    </div>
                ))}
            </div>
            <div className="bg-white shadow-md rounded-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-black">Menu</h2>
                <ul>
                    {menu.map((item, index) => (
                        <li key={index} className="mb-4">
                            <h3 className="text-lg font-semibold text-black">{item.name}</h3>
                            <p className="mb-2 text-black">{item.description}</p>
                            <p className="text-black"><strong>Cost:</strong> ${item.cost}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Hours */}
            <div className="bg-white shadow-md rounded-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4text-black">Hours</h2>
                <ul>
                    {hours.map((item, index) => (
                        <li key={index} className="mb-2 text-black">{item.day}: {item.open_time} - {item.close_time}</li>
                    ))}
                </ul>
            </div>

        </div>
    </div>

}
export default Rest;