import { Routes, Route, Navigate } from 'react-router'

import { StayIndex } from './pages/StayIndex.jsx'
import { ReviewIndex } from './pages/ReviewIndex.jsx'
import { ChatApp } from './pages/Chat.jsx'
import { AdminIndex } from './pages/AdminIndex.jsx'

import { StayDetails } from './pages/StayDetails'
import { StayDetailsPhotos } from './pages/StayDetailsPhotos.jsx'
import { UserDetails } from './pages/UserDetails'

import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx'
import { UserAbout } from './cmps/UserAbout.jsx'
import { UserTrips } from './cmps/UserTrips.jsx'

import "@fontsource/inter/200.css"; //thin
import "@fontsource/inter/300.css";
import "@fontsource/inter"; //400
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css"; //bold

import { useInView } from 'react-intersection-observer'
import { OrderPage } from './pages/OrderPage.jsx'

export function RootCmp() {
    const { ref, inView } = useInView({
        threshold: 0,
        initialInView: true,
    })

    return (
        <div className="main-container">
            <div ref={ref} className="scroll-sentinel"></div>
            <AppHeader isAtTop={inView} />
            <UserMsg />

            <main>
                <Routes>
                    <Route path="/" element={<StayIndex />} />
                    <Route path="/stay" element={<StayIndex />} />
                    <Route path="stay/:stayId" element={<StayDetails />} />
                    
                    <Route path="order/:orderId" element={<OrderPage />} />
                    <Route path="stay/:stayId/order" element={<OrderPage />} />
                    
                    <Route path="stay/:stayId/photos" element={<StayDetailsPhotos />} />
                    <Route path="user/:id" element={<UserDetails />} >
                        <Route index element={<Navigate to="about" replace />} />
                        <Route path="about" element={<UserAbout />} />
                        <Route path="trips" element={<UserTrips />} />
                    </Route>
                    <Route path="review" element={<ReviewIndex />} />
                    <Route path="chat" element={<ChatApp />} />
                    <Route path="admin" element={<AdminIndex />} />
                    <Route path="auth" element={<LoginSignup />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                </Routes>
            </main>
            <AppFooter />
        </div>
    )
}
