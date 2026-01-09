const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

import { stayService as local } from './stay.service.local'
import { stayService as remote } from './stay.service.remote'

function getEmptyStay() {
    return {
        _id: '',
        type: '',
        capacity: getRandomIntInclusive(1, 10),
        msgs: [],
    }
}

export function getDefaultFilter() {
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

const service = (VITE_LOCAL === 'true') ? local : remote
export const stayService = { getEmptyStay, getDefaultFilter, ...service }
// export const stayService = { ...local, getEmptyStay, getDefaultFilter }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.stayService = stayService
