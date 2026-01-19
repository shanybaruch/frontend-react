import { httpService } from './http.service'

export const orderService = {
    query,
    getById,
    save,
    remove,
    addOrder
}

async function query(filterBy = {}) {
    return httpService.get('order', filterBy)
}

async function getById(orderId) {
    return httpService.get(`order/${orderId}`)
}

async function remove(orderId) {
    return httpService.delete(`order/${orderId}`)
}

async function save(order) {
    if (order._id) {
        return httpService.put(`order/${order._id}`, order)
    } else {
        return httpService.post('order', order)
    }
}

async function addOrder(order) {
    return save(order)
}