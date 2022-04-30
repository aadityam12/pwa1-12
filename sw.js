var cacheName = 'geeks-cache-v1';
    var cacheAssets = [
        '/',
        '/cart.html',
    ];
    
    // Call install Event
    self.addEventListener('load', e => {
        // Wait until promise is finished
        e.waitUntil(
            caches.open(cacheName)
            .then(cache => {
                console.log(`Service Worker: Caching Files: ${cache}`);
                cache.addAll(cacheAssets)
                    // When everything is set
                    .then(() => self.skipWaiting())
            })
        );
    })

    // Call Activate Event
    self.addEventListener('activate', e => {
        console.log('Service Worker: Activated');
        // Clean up old caches by looping through all of the
        // caches and deleting any old caches or caches that
        // are not defined in the list
        e.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(
                        cache => {
                            if (cache !== cacheName) {
                                console.log('Service Worker: Clearing Old Cache');
                                return caches.delete(cache);
                            }
                        }
                    )
                )
            })
        );
        }
    )


        var filesToCache = [
            '/',
            'index.html',
            '/cart.html',
        ];
        
        var preLoad = function () {
            return caches.open("offline").then(function (cache) {
                // caching index and important routes
                return cache.addAll(filesToCache);
            });
        };
        
        var checkResponse = function (request) {
            return new Promise(function (fulfill, reject) {
                fetch(request).then(function (response) {
                    if (response.status !== 404) {
                        fulfill(response);
                    } else {
                        reject();
                    }
                }, reject);
            });
        };
        
        var addToCache = function (request) {
            return caches.open("offline").then(function (cache) {
                return fetch(request).then(function (response) {
                    return cache.put(request, response);
                });
            });
        };

        self.addEventListener("install", function (event) {
            event.waitUntil(preLoad());
            });
            self.addEventListener("fetch", function (event) {
            // event.respondWith(checkResponse(event.request).catch(function () {
            // console.log("Fetch from cache successful!")
            // return returnFromCache(event.request);
            // }));
            console.log("Fetch successful!")
            event.waitUntil(addToCache(event.request));
            });
            
    
            
        self.addEventListener('sync', event => {
            if (event.tag === 'syncMessage') {
            console.log("Sync successful!")
            }
            });
            self.addEventListener('push', function (event) {
            if (event && event.data) {
            var data = event.data.json();
            if (data.method == "pushMessage") {
            console.log("Push notification sent");
            event.waitUntil(self.registration.showNotification("FabChowk", {
            body: data.message
            }))
            }
            }
            })