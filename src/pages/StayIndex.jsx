import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import { loadStays, addStay, updateStay, removeStay, addStayMsg } from '../store/actions/stay.actions'
import { SET_FILTER_BY } from '../store/reducers/stay.reducer'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { stayService } from '../services/stay'

import { StayList } from '../cmps/StayList'
import { Loader } from '../cmps/Loader'

export function StayIndex() {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()

    const stays = useSelector(storeState => storeState.stayModule.stays)
    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)
    console.log('stays: ', stays)

    useEffect(() => {
        if (searchParams.size === 0) return

        const filterFromUrl = {
            txt: searchParams.get('txt') || '',
            from: searchParams.get('from') || '',
            to: searchParams.get('to') || '',
            minCapacity: +searchParams.get('minCapacity') || 0,
            guests: {
                adults: +searchParams.get('adults') || 0,
                children: +searchParams.get('children') || 0,
                infants: +searchParams.get('infants') || 0,
                pets: +searchParams.get('pets') || 0,
            }
        }
        dispatch({ type: SET_FILTER_BY, filterBy: filterFromUrl })

    }, [])

    useEffect(() => {
        loadStays(filterBy)
    }, [filterBy])

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

    if (!stays) return <Loader />

    return (
        <section className="stay-index">
            <header>
                {/* {userService.getLoggedinUser() && <button onClick={onAddStay}>Add a Stay</button>} */}
            </header>
            <StayList
                stays={stays}
                onRemoveStay={onRemoveStay}
                onUpdateStay={onUpdateStay}
            />
        </section>
    )
}