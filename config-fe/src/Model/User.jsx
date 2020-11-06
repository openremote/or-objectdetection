var User = (function () {
    var userID = "";

    var getID = function () {
        return userID;    // Or pull this from cookie/localStorage
    };

    var setID = function (id) {
        userID = id;
        // Also set this in cookie/localStorage
    };

    return {
        getID: getID,
        setID: setID
    }

})();

export default User;