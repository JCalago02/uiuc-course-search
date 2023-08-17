import SearchFilter from "../../Components/SearchFilter/SearchFilter";
import './SearchFilterRow.css'
import { useState } from "react";
import CategorySelector from "../../Components/CategorySelector/CategorySelector";
import GpaSelector from "../../Components/GpaSelector/GpaSelector";
import TimeSelectorSection from "../TimeSelectorSection/TimeSelectorSection";


function SearchFilterRow({restrictionList, setRestrictionList, FetchClassSearch}) {
    const [showId, setShowId] = useState(-1); // state that handles which search filter menu is open

    // code for GPA useState handling within search filter section
    // validates input GPA, handles alert boxes if it isn't
    function ValidateGPAChange(newMinGPA, newMaxGPA) {
        if (newMinGPA === undefined || newMaxGPA === undefined) {
            alert('Cannot submit an empty GPA');
            return false;
        }
        if (newMinGPA > newMaxGPA) {
            alert('Min GPA is greater than max GPA!');
            return false;
        }
        if (newMinGPA < 0.0) {
            alert('GPA cannot be negative');
            return false;
        }
        if (newMaxGPA > 4.0) {
            alert('GPA cannot be higher than 4.0');
            return false;
        }
        return true;
    }

    // updates GPA usestate
    function HandleGPAChange(newGPABounds) {
        const newMinGPA = newGPABounds[0];
        const newMaxGPA = newGPABounds[1];

        if (ValidateGPAChange(newMinGPA, newMaxGPA)) {
            setRestrictionList ({
                ...restrictionList,
                minGPA: newMinGPA,
                maxGPA: newMaxGPA,
            })
        }
        
    }

    function HandleCategoryChange(newRequirementCategories) {
        setRestrictionList ({
            ...restrictionList,
            requirementCategories: newRequirementCategories
        })
    }

    function ValidateTimeslotChange(newTimeslot) {
        if (newTimeslot.dayList.length === 0) {
            alert('Please select available days');
            return false;
        }
        if (newTimeslot.startTime === -1.0) {
            alert('Please select a valid start time');
            return false;
        }
        if (newTimeslot.endTime === -1.0) {
            alert('Please select a valid end time');
            return false;
        }
        if (newTimeslot.endTime < newTimeslot.startTime) {
            alert('Please double check that the end time is AFTER the start time');
            return false;
        }
        return true;
    }

    function HandleTimeslotChange(newTimeslot) {
        if (ValidateTimeslotChange(newTimeslot)) {
            const newTimeslotList = restrictionList.timeSlots;
            newTimeslotList.push(newTimeslot);
            setRestrictionList({
                ...restrictionList,
                timeSlots: newTimeslotList
            })
        }
        
    }
    return (
        <div className="filter-container">
            <div className="flex-container-filter">
                Filters: 
                <SearchFilter 
                    FilterText={"Requirement Category"}
                    id = {1}
                    showId = {showId}
                    changeIdFunction = {setShowId}/>
                <SearchFilter 
                    FilterText={"GPA Range"}
                    id = {2}
                    showId = {showId}
                    changeIdFunction = {setShowId}/>
                <SearchFilter 
                    FilterText={"Timeslot"} 
                    id = {3}
                    showId = {showId}
                    changeIdFunction = {setShowId}/>
                <button className="filter-submit-button" onClick={FetchClassSearch}>Submit</button>
            </div>

            {showId === 1 ? (<CategorySelector selectedCategories={restrictionList.requirementCategories} submitSelectedCategories={HandleCategoryChange}></CategorySelector>) : null }
            {showId === 2 ? (<GpaSelector setGPABounds={HandleGPAChange}/>) : null}
            {showId === 3 ? (<TimeSelectorSection setTimeList={HandleTimeslotChange}/>) : null}

        </div>
        
    )
}

export default SearchFilterRow