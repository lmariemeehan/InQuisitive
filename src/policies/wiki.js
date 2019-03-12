const ApplicationPolicy = require("./application");


module.exports = class WikiPolicy extends ApplicationPolicy {

 new() {
   return this._isAdmin() || this._isOwner() || this._isPremium();
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
   return this._isAdmin() || this._isOwner() || this._isPremium();
 }

}
