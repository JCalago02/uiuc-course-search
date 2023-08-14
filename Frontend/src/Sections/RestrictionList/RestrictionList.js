import RestrictionListing from "../../Components/RestrictionListing/RestrictionListing";
import "./RestrictionList.css"
function RestrictionList({restrictionList, setRestrictionList}) {
    const indexToCategory = {
        0: "Cultural Studies",
        1: "US Minority", 
        2: "Western Comparative Culture",
        3: "Non-Western Culture",
        4: "Humanities & the Arts",
        5: "Hist. + Philo. Perspectives",
        6: "Literature & the Arts",
        7: "Soc. & Behavioral Sci.",
        8: "Behavioral Science",
        9: "Social Science",
        10: "Nat. Science & Tech.",
        11: "Physical Sciences",
        12: "Life Sciences",
        13: "Advanced Composition",
        14: "Quantitative Reasoning I",
        15: "Quantitative Reasoning II"
    }

    function DetermineIsHeaderCategory(itemBoxIndex) {
        switch(itemBoxIndex) {
            case 0:
            case 4:
            case 7:
            case 10:
                return true;
        }
        return false;
    }

    const DayListToAbrv = {
        "Monday": "M",
        "Tuesday" : "T",
        "Wednesday" : "W",
        "Thursday" : "R",
        "Friday" : "F"
    }

    function deciTimetoString(deciTime) {
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

    function generateTimeslotText(timeslot) {
        const timeSlotArray = [];
        // abbreviates and pushes all days from the dayList into 
        // the displayList in chronological order (MTWRF)
        for (const key in DayListToAbrv) {
            const keyIsFound = timeslot.dayList.includes(key);
            if (keyIsFound) {
                timeSlotArray.push(DayListToAbrv[key]);
            }
        }

        // calls helper function for time formatting
        timeSlotArray.push(" " + deciTimetoString(timeslot.startTime) + " - " + deciTimetoString(timeslot.endTime));

        // adds online string if necessary
        if (!timeslot.includeOnline) {
            timeSlotArray.push(" (No Online)");
        }

        // combines array into string and returns result
        const timeSlotString = timeSlotArray.join('');
        return timeSlotString;
    }

    return (
        <div className="flex-container-restrictions"> 
            {restrictionList.requirementCategories.map((isSelected, i) => (
                isSelected && !DetermineIsHeaderCategory(i) 
                ? <RestrictionListing id={i}
                                      key={i} 
                                      displayText={indexToCategory[i]} 
                                      restrictionList={restrictionList} 
                                      setRestrictionList={setRestrictionList}
                                      type={"requirement"}/>
                : null
            ))
            }
            {restrictionList.minGPA !== -2 ?
                <RestrictionListing id = {16}
                                    displayText={"GPA: " + restrictionList.minGPA + "-" + restrictionList.maxGPA}
                                    restrictionList={restrictionList}
                                    setRestrictionList={setRestrictionList}
                                    type={"gpa"}/>
                :
                null
            }
            {restrictionList.timeSlots.map((timeSlot, i) => (
                <RestrictionListing id={i + 17}
                                    key={i + 17}
                                    displayText={generateTimeslotText(timeSlot)}
                                    restrictionList={restrictionList}
                                    setRestrictionList={setRestrictionList}
                                    type={"timeslot"}/>
            ))
            }
            
        </div>
    )
}


export default RestrictionList;