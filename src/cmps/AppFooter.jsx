import { useSelector } from 'react-redux'
import { SvgIcon } from './SvgIcon'


export function AppFooter() {

	return (
		<footer className="app-footer full">
			<div className="footer-left">
				<p>AYS Nest &copy; </p>
				<span>·</span>
				<a href='https://he.airbnb.com/help/article/2855'>Privacy</a>
				<span>·</span>
				<a href='https://he.airbnb.com/help/article/2908'>Terms</a>
			</div>
			
		

            <div className="footer-right">
				<ul>
					<li> ₪ ILS </li>
					<li> <SvgIcon iconName="globe" /> English </li>
					<li> <a href='https://www.instagram.com/airbnb/'><SvgIcon iconName="instagram" /></a> </li>
					<li> <a href="https://github.com/shanybaruch/frontend-react.git "><SvgIcon iconName="git" /></a> </li>
				</ul>
			</div>
		</footer>
	)
}