import './TimeSelectorSection.css'
import { useState } from 'react'
import DaySelector from '../../Components/DaySelector/DaySelector'
import TimeSelector from '../../Components/TimeSelector/TimeSelector'
import { FaRegCheckSquare, FaRegSquare } from 'react-icons/fa'

function TimeSelectorSection({setTimeList}) {
    const kDayList = ["M", "T", "W", "R", "F"]

    const AbrvToDayText = {
        "M" : "Monday",
        "T" : "Tuesday",
        "W" : "Wednesday", 
        "R" : "Thursday",
        "F" : "Friday"
    }

    const [dayRestriction, setDayRestriction] = useState({
        dayList: [],
        startTime: -1.0,
        endTime: -1.0,
        includeOnline: false
    });    


    function HandleChangeDayList(id) {
        var newDayList = dayRestriction.dayList;
        if (newDayList.includes(kDayList[id])) {
            const index = newDayList.indexOf(kDayList[id])
            newDayList.splice(index, 1)
        } else {
            newDayList.push(kDayList[id])
        }
        setDayRestriction({
            ...dayRestriction,
            dayList: newDayList
        });
    }

    function HandleChangeOnline() {
        setDayRestriction({
            ...dayRestriction,
            includeOnline: !dayRestriction.includeOnline
        });
    }

    function HandleChangeStartTime(newTime) {
        setDayRestriction({
            ...dayRestriction,
            startTime: newTime
        });
    }

    function HandleChangeEndTime(newTime) {
        setDayRestriction({
            ...dayRestriction,
            endTime: newTime
        });
    }

    function HandleSubmitTimeRestriction() {
        setTimeList(dayRestriction);
    }
    
    return (
        <div className='grid-container'>
            <div className='left-col'>
                <TimeSelector labelText="Earliest Start Time: " HandleChangeTimeState={HandleChangeStartTime}></TimeSelector>
            </div>
            <div className='left-col'>
                <TimeSelector labelText="Latest End Time: " HandleChangeTimeState={HandleChangeEndTime}></TimeSelector>
            </div>
            <div className='left-col grid-wrapper-online'>
                    <label className='async-toggle-label'>Include online/async <br/> classes?</label>
                    {dayRestriction.includeOnline ? (<FaRegCheckSquare className='check-button'onClick={HandleChangeOnline}/>) : (<FaRegSquare className='check-button' onClick={HandleChangeOnline}/>)}
            </div>
            <div className='right-col'>
                {kDayList.map((day, index) => (
                    <DaySelector key={index} id={index} dayText={AbrvToDayText[day]} dayListValue={dayRestriction.dayList.includes(kDayList[index])} HandleChangeDayList={HandleChangeDayList}/>
                ))}
            </div>
            <button className='bottom-span' onClick={HandleSubmitTimeRestriction}>Submit</button>
        </div>
    )
}

export default TimeSelectorSection


