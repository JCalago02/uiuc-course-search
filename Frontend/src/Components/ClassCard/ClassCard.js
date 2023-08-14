import './ClassCard.css'
import { FaUser, FaGraduationCap, FaBookReader, FaClock } from "react-icons/fa";

function DeciTimetoString(deciTime) {
    let unformattedHour = deciTime - (deciTime % 1);
    const minute = (deciTime - unformattedHour) * 100;

    const isPM = unformattedHour > 11;
    const AMPMString = isPM ? 'PM' : 'AM';
    // swaps hour back if necessary to not use military time
    unformattedHour = unformattedHour > 12 ? unformattedHour - 12 : unformattedHour;

    // formats minute into string, truncating floating point error and handling single digits
    let formattedMinute = minute.toFixed();
    if (minute < 10) {
        formattedMinute = "0" + formattedMinute;
    }

    // formats hour into string, handling midnight and single digit hours
    let formattedHour = unformattedHour.toString();
    if (unformattedHour === 0) {
        formattedHour = "12"
    } else if (unformattedHour < 10) {
        formattedHour = "0" + formattedHour;
    }

    return formattedHour + ':' + formattedMinute + ' ' + AMPMString;
}

function ClassCard({classInfo}) {
    return (
        <div className="class-card-wrapper">
            <label className="card-text-bold">{classInfo.class_title} - {classInfo.class_name}</label>
            <hr className="header-bold"></hr>
            <FaClock className="card-icon"/>
            <label className="card-text">{DeciTimetoString(classInfo.section_start) + '-' + DeciTimetoString(classInfo.section_end)} | {classInfo.section_days}</label>
            <FaGraduationCap className="card-icon"/>
            <label className="card-text">Prof: {classInfo.section_gpa} | Overall: {classInfo.class_gpa}</label>
            <FaBookReader className="card-icon"/>
            <label className="card-text">{classInfo.section_type}</label>
            <FaUser className="card-icon"/>
            <label className="card-text">{classInfo.section_instructor}</label>
            <a className="course-link-button" href={classInfo.class_link}>Course Explorer</a>
                
            
        </div>
    )
}

export default ClassCard;

/*
    class info parameters:
        title
        name
        instructor
        instructor GPA
        overall GPA
        category
        Meeting Time
        Meeting Days
        Course Explorer Link
*/