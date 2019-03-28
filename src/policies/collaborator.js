const ApplicationPolicy = require("./application");

module.exports = class CollaboratorPolicy extends ApplicationPolicy {

 new() {
   return this.user != null;
 }

 create() {
   return this.record && (this._isPremium() || this._isAdmin());
 }

 show() {
   return this.record && (this._isOwner() || this._isCollaborator() || this._isAdmin());
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
