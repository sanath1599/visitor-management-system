/* eslint-disable linebreak-style */
exports.new_visitor_mail = function(visitor, phone, description) {
	let html =
    "<img width=100 src='https://upload.wikimedia.org/wikipedia/commons/4/40/T-Hub_Logo-PNG.png' /><br/> <p>You have received a new request from  " +
    visitor +
    "<br/> phone number: " +
    phone +
    "<br/>for: " +
    description +
    "<br/> open the portal to approve or reject</p>";
	return html;
};
