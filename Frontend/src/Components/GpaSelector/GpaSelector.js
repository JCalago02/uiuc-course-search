import './GpaSelector.css'
import { useState } from 'react'


function GpaSelector({setGPABounds}) {
    const [localMinGPA, setLocalMinGPA] = useState();
    const [localMaxGPA, setLocalMaxGPA] = useState();
    
    function HandleMinChange(e) {
        setLocalMinGPA(e.target.value);
    }

    function HandleMaxChange(e) {
        setLocalMaxGPA(e.target.value);
    }

    function HandleGPASubmit() {
        const returnGPABounds = [localMinGPA, localMaxGPA];
        setGPABounds(returnGPABounds);
    }


    return (
        <div className="flex-wrapper-gpa">
            <input type="number" className="deci-input" step={0.1} placeholder='Min' onChange={HandleMinChange} ></input>
            <input type="number" className="deci-input" step={0.1} placeholder='Max' onChange={HandleMaxChange}></input>
            <button className="gpa-submit-button" onClick={HandleGPASubmit}>Submit</button>
        </div>
    )
}

export default GpaSelector