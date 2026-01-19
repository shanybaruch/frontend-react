import { storageService } from './async-storage.service'
import { httpService } from './http.service'

const STORAGE_KEY = 'order'

export const orderService = {
    query,
    getById,
    save,
    remove,
    addOrder
}

async function query(filterBy = {}) {
    return storageService.query(STORAGE_KEY)
    // return httpService.get('order', filterBy)
}

async function getById(orderId) {
    return storageService.get(STORAGE_KEY, orderId)
    // return httpService.get(`order/${orderId}`)
}

async function remove(orderId) {
    return storageService.remove(STORAGE_KEY, orderId)
    // return httpService.delete(`order/${orderId}`)
}

async function save(order) {
    if (order._id) {
        return storageService.put(STORAGE_KEY, order)
        // return httpService.put(`order/${order._id}`, order)
    } else {
        return storageService.post(STORAGE_KEY, order)
        // return httpService.post('order', order)
    }
}

async function addOrder(order) {
    return save(order)
}