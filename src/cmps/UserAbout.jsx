import { useSelector } from "react-redux"
import { ImgUploader } from "./ImgUploader"
import { updateUser } from '../store/actions/user.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function UserAbout() {
    const user = useSelector(storeState => storeState.userModule.watchedUser)

    async function onUploaded(imgUrl) {
        const userToUpdate = { ...user, imgUrl }
        try {
            await updateUser(userToUpdate)
            showSuccessMsg('Profile updated and saved!')
        } catch (err) {
            showErrorMsg('Could not save image to database')
        }
    }

    return (
        <section className='user-about'>
            <section className='top'>
                <h1 className='title'>About me</h1>
                <ImgUploader onUploaded={onUploaded} />
            </section>
            <section className='main'>
                <img src={user?.imgUrl} alt="img-profile" className='img-profile' />
                <h1 className='name'>{user?.firstName}</h1>
            </section>
        </section>
    )
}