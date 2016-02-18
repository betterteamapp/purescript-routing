// module Routing

exports.hashChanged = function(handler) {
    return function() {
        var getHash = function() {
            return document.location.href.split('#').splice(1).join('#');
        };
        var oldHash = '';
        handler('')(getHash())();
        window.addEventListener('hashchange', function(ev) {
            var newHash = getHash();
            handler(oldHash)(newHash)();
            oldHash = newHash;
        });
    };
};

exports.popstateChanged = function(handler) {
    return function () {
        var getLocation = function() {
            var loc = document.location;
            return (loc.pathname.substr(1) + loc.search);
        };

        var oldLoc = '';
        handler('')(getLocation())();

        // Catch clicks on the root-level element.
        document.getElementById('app').addEventListener('click', function(event) {
            var tag = event.target;
            if (tag.tagName == 'A' && tag.href && event.button == 0) {
                // It's a left click on an <a href=...>.
                if (tag.origin == document.location.origin) {
                    // It's a same-origin navigation: a link within the site.

                    // Now check that the the app is capable of doing a
                    // within-page update.  (You might also take .query into
                    // account.)
                    oldLoc = getLocation();
                    var newPath = tag.href.substr(1);
                    // todo
                    if (true /* || app.capableOfRendering(newPath) */) {
                        // Prevent the browser from doing the navigation.
                        e.preventDefault();
                        // Let the app handle it.
                        handler(oldLoc)(newLoc)();
                        history.pushState(null, '', newPath);
                    }
                }
            }
        });

        window.addEventListener('onpopstate', function(ev) {
            var newLoc = getLocation();
            handler(oldLoc)(newLoc)();
            oldLoc = newLoc;
        });
    };
};

exports.decodeURIComponent = function(str) {
    if (typeof window !== "undefined") {
        return window.decodeURIComponent(str);
    } else {
        return global.decodeURIComponent(str);
    }
};
