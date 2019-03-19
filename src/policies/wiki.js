const ApplicationPolicy = require("./application");


module.exports = class WikiPolicy extends ApplicationPolicy {

 new() {
   return this.user != null;
 }

 create() {
   return this.new();
 }

 edit() {
   return true;
 }

 update() {
   return this.edit();
 }

 destroy() {
   return this.record && (this._isOwner() || this._isAdmin());
 }

}
