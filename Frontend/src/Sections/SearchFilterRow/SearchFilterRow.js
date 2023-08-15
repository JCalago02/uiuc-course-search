import SearchFilter from "../../Components/SearchFilter/SearchFilter";
import './SearchFilterRow.css'
import { useState } from "react";
import CategorySelector from "../../Components/CategorySelector/CategorySelector";
import GpaSelector from "../../Components/GpaSelector/GpaSelector";
import TimeSelectorSection from "../TimeSelectorSection/TimeSelectorSection";


function SearchFilterRow({restrictionList, setRestrictionList, FetchClassSearch}) {
    const [showId, setShowId] = useState(-1); // state that handles which search filter menu is open
    
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

    function HandleTimeslotChange(newTimeslot) {
        const newTimeslotList = restrictionList.timeSlots;
        newTimeslotList.push(newTimeslot);
        setRestrictionList({
            ...restrictionList,
            timeSlots: newTimeslotList
        })
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