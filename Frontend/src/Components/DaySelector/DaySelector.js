import './DaySelector.css'
function DaySelector({id, dayText, dayListValue, HandleChangeDayList}) {
    function HandleClick() {
        HandleChangeDayList(id);
    }
    return (
        <div className={"day-wrapper" + (dayListValue ? " orange-day" : "")} onClick={HandleClick}>
            <div className="day-text">{dayText}</div>
        </div>
    )
    
}

export default DaySelector