import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export function StayFilter() {
    // const [filterToEdit, setFilterToEdit] = useState(() => {
    //     const copy = structuredClone(filterBy)
    //     if (copy.minCapacity === '') copy.minCapacity = 0
    //     return copy
    // })
    // console.log("filterToEdit: ", filterToEdit);

    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)
    const dispatch = useDispatch()


    // useEffect(() => {
    //     setFilterBy(filterToEdit)
    // }, [filterToEdit])

    // function handleChange(ev) {
    //     const { name: field, type, value: val } = ev.target
    //     let value = val

    //     switch (type) {
    //         case 'text':
    //         case 'radio':
    //             value = field === 'sortDir' ? +value : value
    //             if (!filterToEdit.sortDir) filterToEdit.sortDir = 1
    //             break
    //         case 'number':
    //             value = val !== '' ? +val : 0
    //             break
    //     }
    //     setFilterToEdit({ ...filterToEdit, [field]: value })
    // }
    function handleChange({ target }) {
        const { name: field, type, value: val } = target
        const value = type === 'number' ? +val : val
        
        dispatch({ type: 'SET_FILTER_BY', filterBy: { [field]: value } })
    }

    function clearFilter() {
        setFilterToEdit({ ...filterToEdit, txt: '', minCapacity: 0, maxPrice: '' })
    }

    function clearSort() {
        setFilterToEdit({ ...filterToEdit, sortField: '', sortDir: '' })
    }

    function handleSearch() {
        setFilterBy(filterToEdit)
    }

    return <section className="stay-filter">
        <h3>Filter:</h3>
        <input
            type="text"
            name="txt"
            value={filterBy.txt}
            placeholder="Free text"
            onChange={handleChange}
        // required
        />
        <input
            type="number"
            min="0"
            name="minCapacity"
            value={filterBy.minCapacity || ''}
            placeholder="min capacity"
            onChange={handleChange}
        // required
        />
        <button
            className="btn-clear"
            onClick={clearFilter}>Clear</button>
        <h3>Sort:</h3>
        <div className="sort-field">
            <label>
                <span>Capacity</span>
                <input
                    type="radio"
                    name="sortField"
                    value="capacity"
                    checked={filterToEdit.sortField === 'capacity'}
                    onChange={handleChange}
                />
            </label>
            <label>
                <span>Type</span>
                <input
                    type="radio"
                    name="sortField"
                    value="type"
                    checked={filterToEdit.sortField === 'type'}
                    onChange={handleChange}
                />
            </label>
        </div>
        <div className="sort-dir">
            <label>
                <span>Asce</span>
                <input
                    type="radio"
                    name="sortDir"
                    value="1"
                    checked={filterToEdit.sortDir === 1}
                    onChange={handleChange}
                />
            </label>
            <label>
                <span>Desc</span>
                <input
                    type="radio"
                    name="sortDir"
                    value="-1"
                    onChange={handleChange}
                    checked={filterToEdit.sortDir === -1}
                />
            </label>
        </div>
        <button
            className="btn-clear"
            onClick={clearSort}>Clear</button>
    </section>
}