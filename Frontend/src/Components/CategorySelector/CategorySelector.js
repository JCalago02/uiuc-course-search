import CheckAndLabel from '../CheckAndLabel/CheckAndLabel'
import './CategorySelector.css'

function CategorySelector({selectedCategories, submitSelectedCategories}) {
    const headerList = ["Cultural Studies", "US Minority",  "Western Compar. Culture", "Non-Western Culture",
                        "Humanities & the Arts", "Hist. + Philo. Perspectives", "Literature & the Arts", "Soc. & Behavioral Sci.", "Behavioral Science", "Social Science", 
                        "Nat. Science & Tech.", "Physical Sciences", "Life Sciences", "Advanced Composition", "Quantitative Reasoning I", "Quantitative Reasoning II"];
    
    function handleComplexSwitches(id) {
        const newCheckValue = !selectedCategories[id];
        let subheaderIndexList = [];
        let headerId = -1;
        switch(id) {
            case 1:
            case 2:
            case 3:
                headerId = 0;
                subheaderIndexList = [1, 2, 3];
                break;
            case 5:
            case 6:
                headerId = 4;
                subheaderIndexList = [5, 6];
                break;
            case 8:
            case 9:
                headerId = 7;
                subheaderIndexList = [8, 9];
                break;
            case 11:
            case 12:
                headerId = 10;
                subheaderIndexList = [11, 12];
                break;
            case 0:
                editCheckedArr(newCheckValue, [0,1,2,3]);
                break;
            case 4:
                editCheckedArr(newCheckValue, [4,5,6]);
                break;
            case 7:
                editCheckedArr(newCheckValue, [7,8,9]);
                break;
            case 10:
                editCheckedArr(newCheckValue, [10,11,12]);
                break;
            default:
                editCheckedArr(newCheckValue, [id]);
                break;
            }
            if (headerId == -1)
                return;
            const headerIsOff = !selectedCategories[headerId];
            if (newCheckValue) {
                let flipHeader= true;
                for (let subheaderIndexListIndex = 0; subheaderIndexListIndex < subheaderIndexList.length; subheaderIndexListIndex++) {
                    const subheaderIndex = subheaderIndexList[subheaderIndexListIndex];
                    const subheaderIsOff = subheaderIndex != id && !selectedCategories[subheaderIndex];
                    if (subheaderIsOff) {
                        flipHeader = false;
                    }
                }
                if (flipHeader) {
                    editCheckedArr(newCheckValue, [id, headerId]);
                } else {
                    editCheckedArr(newCheckValue, [id]);
                }
            } else {
                if (!headerIsOff) {
                    editCheckedArr(newCheckValue, [id, headerId]);
                } else {
                    editCheckedArr(newCheckValue, [id]);
                }   
            }
    }
    function editCheckedArr(value, idArr) {
        console.log("Called with idArr" + idArr)
        const newList = (selectedCategories.map((listValue, listId) => {
            if (idArr.includes(listId)) {
                return value;
            } else {
                return listValue;
            }
        }));
        submitSelectedCategories(newList);

    }    

    return (
        <div className='grid-wrapper'>
            {headerList.map((header, i) => (
                <CheckAndLabel id={i} checkedValue={selectedCategories[i]} label={header} updateFunction={handleComplexSwitches}/>
            ))}
        </div>
    )
}

export default CategorySelector