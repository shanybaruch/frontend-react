import { useSelector } from 'react-redux'
import { SvgIcon } from './SvgIcon'


export function AppFooter() {
	const count = useSelector(storeState => storeState.userModule.count)

	return (
		<footer className="app-footer full">
			<div className="footer-left">
				<p>AYS Nest &copy; </p>
				<span>·</span>
				<a href='https://he.airbnb.com/help/article/2855'>Privacy</a>
				<span>·</span>
				<a href='https://he.airbnb.com/help/article/2908'>Terms</a>
				<span>·</span>
			</div>
			
			{count}
			
            {import.meta.env.VITE_LOCAL ? 
                <span className="local-services">Local Services</span> : 
                <span className="remote-services">Remote Services</span>
			}

            <div className="footer-right">
				<p> ₪ ILS </p>
				<span>·</span>
				<p> <SvgIcon iconName="globe" /> English</p>
				<span>·</span>
		        <a href='https://www.instagram.com/airbnb/'><SvgIcon iconName="instagram" /></a>
				<span>·</span>
		        <a href="https://github.com/shanybaruch/frontend-react.git "><SvgIcon iconName="git" /></a>
				<span>·</span>
			</div>
		</footer>
	)
}