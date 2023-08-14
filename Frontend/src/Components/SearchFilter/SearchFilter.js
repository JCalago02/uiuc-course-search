import './SearchFilter.css'
import { FaChevronDown } from 'react-icons/fa';
import { FaChevronUp } from 'react-icons/fa';


function SearchFilter({FilterText, id, showId, changeIdFunction}) {

    function SwapShowDropdown() {
        if (id === showId) {
            changeIdFunction(-1)
        } else {
            changeIdFunction(id)
        }      
    }
    return (
        <div className={'selector' + (id === showId ? " orange" : "")} onClick={SwapShowDropdown}>
            <label className={'category-display' + (id === showId ? " orange" : "")}>
                {FilterText}
                {(id === showId) ? <FaChevronDown className='arrow-icon'/> : <FaChevronUp className='arrow-icon'/>} 
            </label>
        </div>
    )
}

export default SearchFilter
