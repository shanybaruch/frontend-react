const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

import { stayService as local } from './stay.service.local'
import { stayService as remote } from './stay.service.remote'

function getEmptyStay() {
    return {
        _id: '',
        type: makeId(),
        capacity: getRandomIntInclusive(1, 20),
        msgs: [],
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        minCapacity: '',
        sortField: '',
        sortDir: '',
    }
}

function getRandomStay() {
    return {
        name: 'Ribeira Charming Duplex',
        type: 'House',
        imgUrl: '',
        price: _getRandomIntInclusive(100, 900),
        capacity: _getRandomIntInclusive(1, 10),
        description: makeLorem(),
        rate: Math.random() * (5 - 3) + 3,
        loc: {
            country: 'Portugal',
            countryCode: 'PT',
            city: 'Lisbon',
            address: '17 Kombo st',
            lat: -8.61308,
            lng: 41.1413,
        },
        amenities: ['TV', 'Wifi', 'Kitchen', 'Smoking allowed', 'Pets allowed', 'Cooking basics'],
        reviews: []
    }
}

export function getEilatApartments() {
    const apartments = [
        { name: 'Red Sea Luxury Suite', address: '6 HaTmarim Blvd',imgUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
        { name: 'Eilat Bay View Apartment', address: '12 Argaman St', imgUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
        { name: 'Coral Beach Studio', address: '24 Mishol Shoshan', imgUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800' },
        { name: 'The Penthouse Eilat', address: '9 Sheshet HaYamim St', imgUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
        { name: 'Desert Oasis Flat', address: '18 HaShachmon', imgUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800' }
    ]

    return apartments.map(apt => ({
        _id:makeId(),
        name: apt.name,
        type: 'Apartment', 
        imgUrl: apt.imgUrl, 
        price: _getRandomIntInclusive(350, 1200),
        capacity: _getRandomIntInclusive(2, 6),
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
}

function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function _getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const stayService = { getEmptyStay, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.stayService = stayService
