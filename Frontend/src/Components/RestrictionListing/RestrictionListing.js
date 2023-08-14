import"./RestrictionListing.css"
import { FaTimes } from "react-icons/fa"

function RestrictionListing({id, displayText, restrictionList, setRestrictionList, type}) {

    function HandleComplexSwitches(newRequirementCategories) {
        if (newRequirementCategories[id] === false)
            return;
        switch(id) {
            case 1:
            case 2:
            case 3:
                newRequirementCategories[0] = false;
                break;
            case 5:
            case 6:
                newRequirementCategories[4] = false;
                break;
            case 8:
            case 9:
                newRequirementCategories[7] = false;
                break;
            case 11:
            case 12:
                newRequirementCategories[10] = false;
                break;
        }
    }

    function HandleExitClickRequirement() {
        let newRequirementCategories = restrictionList.requirementCategories;
        HandleComplexSwitches(newRequirementCategories);
        newRequirementCategories[id] = !newRequirementCategories[id];
        setRestrictionList ({
            ...restrictionList,
            requirementCategories: newRequirementCategories
        })
    }

    function HandleExitClickGPA() {
        setRestrictionList ({
            ...restrictionList,
            minGPA: -2.0,
            maxGPA: -1.0
        })
        
    }
    function HandleExitClickTimeslot() {
        const newTimeslotList = restrictionList.timeSlots;
        newTimeslotList.splice(id - 17, 1);
        setRestrictionList ({
            ...restrictionList,
            timeSlots: newTimeslotList
        })
    }
    
    function HandleExitClick() {
        switch(type) {
            case "requirement":
                HandleExitClickRequirement()
                break;
            case "gpa":
                HandleExitClickGPA()
                break;
            case "timeslot":
                HandleExitClickTimeslot()
                break;
        }
    }

    return (
        <div className="restriction-display">
            <label>{displayText}</label>
            <FaTimes className="x-button" onClick={HandleExitClick}></FaTimes>
        </div>
    )
}


export default RestrictionListing