import { timelineText } from "../content";
import "./Timeline.css";

export function Timeline() {
	return (
		<div className="tl-wrapper">
			{/* <div className="tl-header">Timeline</div> */}
			<table className="tl-row-wrapper">
				{timelineText.map(({ percent, title, description }) => (
					<tr className="tl-row">
						<td className="tl-percent">{percent}%</td>
						<td className="tl-title">{title}</td>
						<td className="tl-description">{description}</td>
					</tr>
				))}
			</table>
		</div>
	);
}
