import {Routes, Route} from "react-router-dom";
import Home from "./home";
import Res from "./reservations";
import Rest from "./res";
function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/reservations" element={<Res/>}/>
      <Route path='/restaurant/:id' element={<Rest/>}/>
    </Routes>
    </>
  )
}

export default App
