const { DEV, VITE_LOCAL } = import.meta.env

import { makeId } from '../util.service'
import { userService as local } from './user.service.local'
import { userService as remote } from './user.service.remote'

function getEmptyUser() {
    return {
        _id: makeId(),
        imgUrl: '',
        fullname: '',
        phone: '',
        birthDate: '',
        email: '',
        isHost: false,
        reviews: [],
    }
}

const service = (VITE_LOCAL === 'true')? local : remote
export const userService = { ...service, getEmptyUser }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if(DEV) window.userService = userService