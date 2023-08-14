import './GpaSelector.css'
import { useState } from 'react'


function GpaSelector({setGPABounds}) {
    const [localMinGPA, setLocalMinGPA] = useState(-2.0);
    const [localMaxGPA, setLocalMaxGPA] = useState(-1.0);

    function HandleMinChange(e) {
        const isValid = e.target.value.length !== 0;
        if (isValid) {
            setLocalMinGPA(e.target.value);
        } else {
            setLocalMinGPA(-2);
        }
    }

    function HandleMaxChange(e) {
        const isValid = e.target.value.length !== 0;
        if (isValid) {
            setLocalMaxGPA(e.target.value);
        } else {
            setLocalMaxGPA(5);
        }
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