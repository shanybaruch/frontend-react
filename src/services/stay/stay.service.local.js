
import { storageService } from '../async-storage.service'
import { getRandomIntInclusive, loadFromStorage, makeId, makeLorem, saveToStorage } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'stay'

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayMsg,
    getDefaultFilter,
    createStays
}
window.cs = stayService

createStays()


async function query(filterBy = { txt: '', minCapacity: 0 }) {
    var stays = await storageService.query(STORAGE_KEY)
    const { txt, minCapacity, sortField, sortDir } = filterBy

    if (txt) {
        const regex = new RegExp(txt, 'i')
        stays = stays.filter(stay =>
            regex.test(stay.name) ||
            regex.test(stay.type) ||
            regex.test(stay.description) ||
            regex.test(stay.loc?.city) ||
            regex.test(stay.loc?.address)
        )
    }

    if (minCapacity) {
        stays = stays.filter(stay => stay.capacity >= +minCapacity)
    }

    if (sortField) {
        stays.sort((a, b) => {
            const dir = +sortDir || 1
            if (sortField === 'capacity') return (a.capacity - b.capacity) * dir
            const valA = a[sortField] || ''
            const valB = b[sortField] || ''
            return valA.localeCompare(valB) * dir
        })
    }
    return stays
}

function getById(stayId) {
    return storageService.get(STORAGE_KEY, stayId)
}

async function remove(stayId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, stayId)
}

async function save(stay) {
    if (stay._id) {
        return storageService.put(STORAGE_KEY, stay)
    } else {
        const stayToSave = {
            ...stay,
            owner: userService.getLoggedinUser(),
            msgs: []
        }
        return storageService.post(STORAGE_KEY, stayToSave)
    }
}

async function addStayMsg(stayId, txt) {
    // Later, this is all done by the backend
    const stay = await getById(stayId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    stay.msgs.push(msg)
    await storageService.put(STORAGE_KEY, stay)

    return msg
}

function getDefaultFilter() {
    return {
        txt: '',
        minCapacity: 0,
        sortField: '',
        sortDir: '',
    }
}

function createStays() {
    let stays = loadFromStorage(STORAGE_KEY)
    if (stays) return
    // stays = createStays()
    
    const apartments = [
        { name: 'Red Sea Luxury Suite', address: '6 HaTmarim Blvd', imgUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
        { name: 'Eilat Bay View Apartment', address: '12 Argaman St', imgUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
        { name: 'Coral Beach Studio', address: '24 Mishol Shoshan', imgUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800' },
        { name: 'The Penthouse Eilat', address: '9 Sheshet HaYamim St', imgUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
        { name: 'Desert Oasis Flat', address: '18 HaShachmon', imgUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800' },
        { name: 'Modern Marina Loft', address: '15 Kaman St, Eilat', imgUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800' }
    ]
    
    stays = apartments.map(apt => ({
        _id: makeId(),
        name: apt.name,
        type: 'Apartment',
        imgUrl: apt.imgUrl,
        price: getRandomIntInclusive(250, 1200),
        capacity: getRandomIntInclusive(1, 10),
        description: makeLorem(),
        rate: Number((Math.random() * (5 - 3) + 3).toFixed(1)),
        loc: {
            country: 'Israel',
            countryCode: 'IL',
            city: 'Eilat',
            address: apt.address,
            lat: 29.5577,
            lng: 34.9519,
        },
        amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'TV', 'Balcony'],
        reviews: []
    }))
    saveToStorage(STORAGE_KEY, JSON.stringify(stays))
}