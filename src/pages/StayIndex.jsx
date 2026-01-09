import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { loadStays, addStay, updateStay, removeStay, addStayMsg } from '../store/actions/stay.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { stayService } from '../services/stay'
import { userService } from '../services/user'

import { StayList } from '../cmps/StayList'
import { StayFilter } from '../cmps/StayFilter'
import { Calendar } from '../cmps/Calendar'

export function StayIndex() {
    const stays = useSelector(storeState => storeState.stayModule.stays)
    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)    
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [range, setRange] = useState()
    console.log('stays: ', stays);
    // const isFirstRender = useRef(true)


    useEffect(() => {
        loadStays(filterBy)
    }, [filterBy])
    // useEffect(() => {
    // if (isFirstRender.current) {
    //         isFirstRender.current = false
    //         return
    //     }
    //     loadStays(filterBy)
    // }, [filterBy])

    async function onRemoveStay(stayId) {
        try {
            await removeStay(stayId)
            showSuccessMsg('Stay removed')
        } catch (err) {
            showErrorMsg('Cannot remove stay')
        }
    }

    async function onAddStay() {
        const stay = stayService.getEmptyStay()
        stay.type = prompt('Type?', 'Some Type')
        try {
            const savedStay = await addStay(stay)
            showSuccessMsg(`Stay added (id: ${savedStay._id})`)
        } catch (err) {
            showErrorMsg('Cannot add stay')
        }
    }

    async function onUpdateStay(stay) {
        const capacity = +prompt('New capacity?', stay.capacity) || 0
        if (capacity === 0 || capacity === stay.capacity) return

        const stayToSave = { ...stay, capacity }
        try {
            const savedStay = await updateStay(stayToSave)
            showSuccessMsg(`Stay updated, new capacity: ${savedStay.capacity}`)
        } catch (err) {
            showErrorMsg('Cannot update stay')
        }
    }

    return (
        <section className="stay-index">
            <header>
                <h2 className='title'>Popular homes in Eilat</h2>
                {/* <h2 className='title'>Stays</h2> */}
                {/* {userService.getLoggedinUser() && <button onClick={onAddStay}>Add a Stay</button>} */}
            </header>
            {/* <StayFilter filterBy={filterBy} setFilterBy={setFilterBy} /> */}
            <StayList
                stays={stays}
                onRemoveStay={onRemoveStay}
                onUpdateStay={onUpdateStay}
            />
        </section>
    )
}