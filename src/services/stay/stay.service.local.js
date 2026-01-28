
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


async function query(filterBy = getDefaultFilter()) {
    var stays = await storageService.query(STORAGE_KEY)
    const { txt, minCapacity, sortField, sortDir, to, from } = filterBy

    if (txt) {
        const searchWord = txt.split(',')[0].trim()
        const regex = new RegExp(searchWord, 'i')

        stays = stays.filter(stay =>
            regex.test(stay.name) ||
            regex.test(stay.type) ||
            regex.test(stay.loc?.city) ||
            regex.test(stay.loc?.address) ||
            regex.test(stay.loc?.country)
        )
    }

    if (minCapacity) {
        stays = stays.filter(stay => stay.capacity >= +minCapacity)
    }

    if (from && to) {
        stays = stays.filter(stay => {
            return _isStayAvailable(stay, from, to)
        })
    }

    // if (sortField) {
    //     stays.sort((a, b) => {
    //         const dir = +sortDir || 1
    //         if (sortField === 'capacity') return (a.capacity - b.capacity) * dir
    //         const valA = a[sortField] || ''
    //         const valB = b[sortField] || ''
    //         return valA.localeCompare(valB) * dir
    //     })
    // }
    return stays
}

function _isStayAvailable(stay, filterFrom, filterTo) {
    if (!stay.availableDates || !stay.availableDates.length) return false

    const reqFrom = new Date(filterFrom).getTime()
    const reqTo = new Date(filterTo).getTime()

    return stay.availableDates.some(range => {
        return reqFrom >= range.from && reqTo <= range.to
    })
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
        from: null,
        to: null,
        guests: {
            adults: 0,
            children: 0,
            infants: 0,
            pets: 0
        },
        minCapacity: 0
    }
}

function createStays() {
    let stays = loadFromStorage(STORAGE_KEY)
    if (stays && stays.length > 0) return

    const allAmenities = [
        //Scenic Views
        "BayView" , "GardenView" ,
        //Bathroom 
        "HotWater" , "Bathtub" , "Essentials" , "Shampoo" , "ShowerGel" , "HairDryer" ,
        //Bedroom and laundry
        "Washer" , "Dryer" , "Hangers" , "Iron" , "ExtraPillowsAndBlankets" ,
        //Entertainment
        "TV" , "SoundSystem" , "PoolTable" , 
        //Family
        "Crib" , "BoardGames" , 
        //Heating and cooling
        "AirConditioning" , "Heating" , "HotTub",
        //Home safety
        "SmokeDetector" , "CarbonMonoxideDetector" , "FirstAidKit" , "FireExtinguisher" , "SafetyCard" , "SecurityCameras" ,
        //Internet and office
        "Wifi" , "Internet" , "Workspace" , 
        //Kitchen and dining
        "Kitchen" , "Refrigerator" , "Microwave" , "Toaster" , "Blender" , "DiningTable" ,
        //Location features
        "PrivateEntrance",
        //Outdoor
        "Pool" , "BBQGrill" , "SunLoungers" ,
        //Parking and facilities
        "parking" , "Gym" , "Elevator" , 
        //Services
        "SelfCheckIn" , "RoomDarkeningShades", "LongTermStaysAllowed" ,
    ]

    // const allAmenities = [
    //     "TV", "Cable TV", "Internet", "Wifi", "Air conditioning", "Wheelchair accessible", "Pool", "Kitchen",
    //     "Free parking on premises", "Doorman", "Gym", "Elevator", "Hot tub", "Heating", "Family/kid friendly",
    //     "Suitable for events", "Washer", "Dryer", "Smoke detector", "Carbon monoxide detector", "First aid kit",
    //     "Safety card", "Fire extinguisher", "Essentials", "Shampoo", "24-hour check-in", "Hangers", "Hair dryer",
    //     "Iron", "Laptop friendly workspace", "Self check-in", "Building staff", "Private entrance",
    //     "Room-darkening shades", "Hot water", "Bed linens", "Extra pillows and blankets", "Ethernet connection",
    //     "Luggage dropoff allowed", "Long term stays allowed", "Ground floor access", "Wide hallway clearance",
    //     "Step-free access", "Wide doorway", "Flat path to front door", "Well-lit path to entrance",
    //     "Disabled parking spot", "Wide clearance to bed", "Wide entryway", "Waterfront", "Beachfront"
    // ]

    const locations = [
        { city: 'Eilat', country: 'Israel', countryCode: 'IL', lat: 29.5577, lng: 34.9519 },
        { city: 'New York', country: 'United States', countryCode: 'US', lat: 40.7128, lng: -74.0060 },
        { city: 'Paris', country: 'France', countryCode: 'FR', lat: 48.8566, lng: 2.3522 },
        { city: 'Tokyo', country: 'Japan', countryCode: 'JP', lat: 35.6762, lng: 139.6503 },
        { city: 'Rome', country: 'Italy', countryCode: 'IT', lat: 41.9028, lng: 12.4964 },
        { city: 'London', country: 'United Kingdom', countryCode: 'GB', lat: 51.5074, lng: -0.1278 }
    ]

    const hosts = [
        { _id: 'u101', fullname: 'Dudi Ganz', imgUrl: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg' },
        { _id: 'u102', fullname: 'Michal Ohayon', imgUrl: 'https://xsgames.co/randomusers/assets/avatars/female/2.jpg' },
        { _id: 'u103', fullname: 'Jonathan Levi', imgUrl: 'https://xsgames.co/randomusers/assets/avatars/male/3.jpg' },
        { _id: 'u104', fullname: 'Sarah Cohen', imgUrl: 'https://xsgames.co/randomusers/assets/avatars/female/4.jpg' }
    ]

    const apartments = [
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1740&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://plus.unsplash.com/premium_photo-1670360414903-19e5832f8bc4?q=80&w=1740&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1740&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://plus.unsplash.com/premium_photo-1675745329954-9639d3b74bbf?q=80&w=687&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=928&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1740&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1740&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?q=80&w=870&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1562790351-d273a961e0e9?q=80&w=930&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?q=80&w=928&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1740&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?q=80&w=1359&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1623718649591-311775a30c43?q=80&w=1740&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1598605272254-16f0c0ecdfa5?q=80&w=1742&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1650967123062-3de70b7bf331?q=80&w=928&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1606402179428-a57976d71fa4?q=80&w=1374&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1740&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1748&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1740&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1740&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1325&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://plus.unsplash.com/premium_photo-1700140420241-9e21b75cb0ce?q=80&w=2532&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://plus.unsplash.com/premium_photo-1692217764140-4f8db35b9f76?q=80&w=1144&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1615762289422-4e4bc422a784?q=80&w=870&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1584105784619-f22e75957d4b?q=80&w=627&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1689668158402-35beeaf9167d?q=80&w=870&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1604348825621-22800b6ed16d?q=80&w=687&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=1374&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://images.unsplash.com/photo-1563493653502-9e270be23596?q=80&w=1740&auto=format&fit=crop' },
        { name: '', address: '', imgUrl: 'https://plus.unsplash.com/premium_photo-1675745329634-4dc1f4247e48?q=80&w=687&auto=format&fit=crop' },
    ]

    stays = apartments.map((apt, idx) => {
        const locationInfo = locations[Math.floor(idx / 6) % locations.length]
        
        const shuffledAmenities = [...allAmenities].sort(() => 0.5 - Math.random())
        const selectedAmenities = shuffledAmenities.slice(0, getRandomIntInclusive(4, 19))

        const reviews = Array.from({ length: getRandomIntInclusive(2, 8) }).map(() => ({
            at: new Date(Date.now() - getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 365)).getTime(),
            txt: makeLorem(10),
            rate: getRandomIntInclusive(3, 5),
            by: {
                fullname: ['Avi', 'John', 'Marta', 'Noa', 'Chris'][getRandomIntInclusive(0, 4)],
                imgUrl: `https://xsgames.co/randomusers/assets/avatars/male/${getRandomIntInclusive(1, 50)}.jpg`
            }
        }))

        const totalRating = reviews.reduce((acc, review) => acc + review.rate, 0)
        const avgRate = reviews.length ? (totalRating / reviews.length).toFixed(1) : 0

        return {
            _id: makeId(),
            name: apt.name || `${locationInfo.city} Comfort Stay`,
            type: 'Apartment',
            imgUrl: apt.imgUrl,
            price: getRandomIntInclusive(100, 1000),
            capacity: getRandomIntInclusive(1, 10),
            description: makeLorem(40),
            rate: Number(avgRate),
            loc: {
                country: locationInfo.country,
                countryCode: locationInfo.countryCode,
                city: locationInfo.city,
                address: apt.address || `${getRandomIntInclusive(1, 100)} ${locationInfo.city} St`,
                lat: locationInfo.lat + (Math.random() - 0.5) * 0.01,
                lng: locationInfo.lng + (Math.random() - 0.5) * 0.01,
            },
            amenities: selectedAmenities,
            host: hosts[idx % hosts.length],
            availableDates: [
                {
                    from: new Date().getTime(),
                    to: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).getTime() 
                }
            ],
            reviews: reviews
        }
    })
    saveToStorage(STORAGE_KEY, stays)
}