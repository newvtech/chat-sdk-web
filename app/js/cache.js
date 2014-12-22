/**
 * Created by benjaminsmiley-andrews on 01/12/14.
 */
var myApp = angular.module('myApp.cache', []);

myApp.factory('Cache', ['$rootScope', '$timeout', '$window', 'CookieTin', function ($rootScope, $timeout, $window, CookieTin) {
    var Cache = {

        // Dict
        users: {},
        onlineUsers: {},
        friends: {},
        blockedUsers: {},
        rooms: {},

        init: function () {

            var beforeUnloadHandler = (function (e) {

                CookieTin.storeUsers(this.users);

            }).bind(this);

            if ($window.addEventListener) {
                $window.addEventListener('beforeunload', beforeUnloadHandler);
            } else {
                $window.onbeforeunload = beforeUnloadHandler;
            }

            return this;
        },

        // A cache of all users
        addUser: function (user) {
            if(user && user.meta && user.meta.uid) {
                this.users[user.meta.uid] = user;
            }
        },

        removeUser: function (user) {
            if(user && user.meta && user.meta.uid) {
                this.removeUserWithID(user.meta.uid);
            }
        },

        removeUserWithID: function (uid) {
            if(uid) {
                delete this.users[uid];
                this.digest();
            }
        },

        addFriend: function (user) {
            if(user && user.meta && user.meta.uid) {
                this.friends[user.meta.uid] = user;
                user.friend = true;
            }
        },

        isFriend: function (user) {
            if(user) {
                return !unORNull(Cache.friends[user.meta.uid]);
            }
            return false;
        },

        removeFriend: function (user) {
            if(user && user.meta && user.meta.uid) {
                this.removeFriendWithID(user.meta.uid);
            }
        },

        removeFriendWithID: function (uid) {
            if(uid) {
                var user = this.friends[uid];
                if(user) {
                    user.friend = false;
                    delete this.friends[uid];
                    this.digest();
                }
            }
        },

        isFriend: function(uid) {
            return !unORNull(this.friends[uid]);
        },

        addBlockedUser: function (user) {
            if(user && user.meta && user.meta.uid) {
                this.blockedUsers[user.meta.uid] = user;
                user.blocked = true;
            }
        },

        isBlockedUser: function(uid) {
            return !unORNull(this.blockedUsers[uid]);
        },

        removeBlockedUserWithID: function (uid) {
            if(uid) {
                var user = this.blockedUsers[uid];
                if(user) {
                    user.blocked = false;
                    delete this.blockedUsers[uid];
                    this.digest();
                }
            }
        },

        addOnlineUser: function (user) {
            if(user && user.meta && user.meta.uid && user.meta.uid != $rootScope.user.meta.uid) {
                user.online = true;
                this.onlineUsers[user.meta.uid] = user;
                this.digest();
            }
        },

        getUserWithID: function (uid) {
            var user = this.users[uid];
            if(!user) {
                user = this.onlineUsers[uid];
            }
            if(!user) {
                user = this.friends[uid];
            }
            if(!user) {
                user = this.blockedUsers[uid];
            }
            return user;
        },

        removeOnlineUser: function (user) {
            if(user && user.meta && user.meta.uid) {
                this.removeOnlineUserWithID(user.meta.uid);
            }
        },

        removeOnlineUserWithID: function (uid) {
            if(uid) {
                var user = this.onlineUsers[uid];
                if(user) {
                    user.online = false;
                    delete this.onlineUsers[uid];
                    this.digest();
                }
            }
        },

        digest: function () {
            $timeout(function() {
                $rootScope.$digest();
            });
        },

        clear: function () {
            this.users = {};
            this.onlineUsers = {};
            this.digest();
        },

        addRoom: function (room) {
            if(room && room.meta && room.meta.rid) {
                this.rooms[room.meta.rid] = room;
            }
        },

        removeRoom: function (room) {
            if(room && room.meta && room.meta.rid) {
                delete this.rooms[room.meta.rid];
            }
        },

        getRoomWithID: function (rid) {
            return this.rooms[rid];
        }
    };

    return Cache.init();
}]);