import './CheckAndLabel.css'
import { FaRegSquare } from 'react-icons/fa'
import { FaRegCheckSquare } from 'react-icons/fa'

function CheckAndLabel({id, checkedValue, label, updateFunction}) {
    function handleClickObject() {
        updateFunction(id);
    }
    const isBold = (id === 0 || id === 4 || id === 7 || id === 10 || id === 13  || id === 14 || id === 15)
    return (
        <div className={isBold ? 'flex-wrapper bold-wrapper' : 'flex-wrapper'} onClick={handleClickObject}>
            {!checkedValue ? (<FaRegSquare/>) : (<FaRegCheckSquare/>) }
            {isBold ?(<label className='label bold' for={label}>{label}</label>) : (<label className='label' for={label}>{label}</label>)}
        </div>
    )
}
export default CheckAndLabel;