import './FindClasses.css';
import axios from 'axios';
import SearchFilterRow from '../../Sections/SearchFilterRow/SearchFilterRow';
import RestrictionList from '../../Sections/RestrictionList/RestrictionList';
import { useState } from 'react';
import ClassCard from '../../Components/ClassCard/ClassCard';



const defaultRestrictionList = {
    requirementCategories: Array(16).fill(false),
    minGPA: -2.0,
    maxGPA: 5.0,
    timeSlots: []
}


function FindClasses() {
    const [restrictionList, setRestrictionList] = useState(defaultRestrictionList);
    const [classList, setClassList] = useState([]);

    function FetchClassSearch() {
        
        const restrictionListJSON = JSON.stringify(restrictionList);
        console.log(restrictionListJSON);
        const url = 'http://localhost:8080/courses/' + restrictionListJSON;

        axios.get(url).then((resp) => {
            console.log(resp.data.sectionList);
            setClassList(resp.data.sectionList);
        })

        
    }
    return (
        <div className="find-classes-page-content">
            <div className="find-classes-header-container">
                <label className="find-classes-header find-classes-bold">Advanced Gen-Ed Search Tool</label>
                <label className="find-classes-header">Input your search filters and hit search to see what Gen-Eds fit best for you!</label>
            </div>
            <SearchFilterRow restrictionList={restrictionList} setRestrictionList={setRestrictionList} FetchClassSearch={FetchClassSearch}/>
            <RestrictionList restrictionList={restrictionList} setRestrictionList={setRestrictionList}/>
            <div className='find-classes-results-container'>
                {classList.map((classItem, index) => (
                    <ClassCard key={index} classInfo={classItem}/>
                ))}
            </div>
            
        </div>
    )
}

export default FindClasses;