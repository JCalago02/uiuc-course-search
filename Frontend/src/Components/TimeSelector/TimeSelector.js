import './TimeSelector.css'

function TimeSelector({labelText, HandleChangeTimeState}) {
    function HandleTimeChange(e) {
        const unformattedTime = e.target.value;
        const isValidTime = unformattedTime.length === 5;
          
        if (isValidTime) {
            const hour = parseInt(unformattedTime.substr(0,2));
            const minute = parseInt(unformattedTime.substr(3,5)) / 100;
            const timeDeci = hour + minute;
            console.log(timeDeci);
            HandleChangeTimeState(timeDeci);
        } else {
            HandleChangeTimeState(-1.0);
        }
    }
    return (
        <div className="grid-wrapper-time">
            <label>{labelText}</label>
            <input onChange={HandleTimeChange} className='time-input' type='time'/>
        </div>
    )
}

export default TimeSelector