console.log("you are sane...");

(function () {
    var filter = function (text, length, clamp) {
        clamp = clamp || "...";
        var node = document.createElement("div");
        node.innerHTML = text;
        var content = node.textContent;
        return content.length > length
            ? content.slice(0, length) + clamp
            : content;
    };
    Vue.filter("truncate", filter);

    var formatIt = function (created_at) {
        var year = created_at.slice(2, 4);
        var month = created_at.slice(start, end);
        var day = created_at.slice(5, 6);
        var time = created_at.slice(10, 14);
        console.log(created_at);
        var date = day + "." + month + "." + year;
        console.log(date);
        return date;
    };

    Vue.filter("format", formatIt);

    //new fancy component
    Vue.component("modal", {
        template: "#modal-box",
        props: ["imageId"], // this will become a custom attribute! (vue-html-code)
        watch: {
            imageId: function () {
                console.log("the pro p changed!!!", this.imageId);
                // if we get nothing backfro mserver we should close the modal
                // e.g. this.id of 300000
            },
        },
        // data for components expects a function that retruns an object (not obj directly)
        data: function () {
            return {
                title: "",
                description: "",
                url: "",
                username: "",
                id: "",
                comments: [],
                newComment: {
                    username: "",
                    text: "",
                },
            };
        },
        mounted: function (image_id) {
            // pasted from below - exchange with function
            var self = this;
            addEventListener("hashchange", function () {
                console.log("hash has changed...");
                //self.imageId = null;
                self.imageId = location.hash.slice(1);
                console.log("self.imageId in hashchange-mounted", self.imageId);
                // removed from html @click="openModal(each.id)"
            });

            console.log("props ", this.imageId);
            var requestUrl = "/image/" + this.imageId;
            axios
                .get(requestUrl)
                .then(function (res) {
                    console.log("axios for single image done!");
                    console.log("RES ", res);
                    console.log(
                        "ÄÄÄÄÄ result from db res.data[0].nextId",
                        res.data[1].nextId
                    );
                    self.username = res.data[0].username;
                    self.title = res.data[0].title;
                    self.description = res.data[0].description;
                    self.url = res.data[0].url;
                    self.comments = res.data[1];
                    console.log("res.data[1]: ", res.data[1]);
                    console.log("self.comments: ", self.comments);

                    console.log("res.data", res.data);
                    console.log("res.data.id", res.data.id);
                })
                .catch(function (err) {
                    console.log(err);
                    console.log("axios für single image failed");
                    self.closeModal();
                });
        },
        methods: {
            handleCommentClick: function (e) {
                e.preventDefault(); // so it DOES NOT send a post request
                console.log("you clicked the comment submit button");
                console.log(this.newComment.username);
                console.log(this.newComment.text);
                console.log(this.imageId);
                var newCommentObj = {
                    username: this.newComment.username,
                    text: this.newComment.text,
                    imageId: this.imageId,
                };
                this.newComment = newCommentObj;
                console.log("newComment Object", this.newComment);
                console.log(newCommentObj);
                var self = this;
                axios
                    .post("/comment", newCommentObj)
                    .then((result) => {
                        console.log("RES", result.data);
                        console.log("before push", self.comments);
                        self.comments.unshift(result.data);
                        var commentsParked = self.comments.slice;
                        console.log("AFTER push", self.comments);
                        self.newComment.username = "";
                        self.newComment.text = "";
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                //     .catch((err) => console.log(err));
            },
            closeModal: function () {
                console.log("closeMOdal running");
                // change the parent data
                console.log("about to emit an event from the component");
                // emit something to the parent (send info)
                this.$emit("close");
            },
        },
    });
    // ################################### MAIN ################
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    new Vue({
        // el is the element in our html with access to our vue code
        el: "#main",
        data: {
            // just use "" or [] or {}
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            checkForSomething: 1, // image id?
            imageId: location.hash.slice(1), //Location.hash.slice(1),
            comments: [],
            moreButton: true,
            lastLoadedId: null,
            lastImageTotal: null,
        }, // data ends

        // this runs when our VUE instance renders - cycles
        mounted: function () {
            // check for hash# in url
            //console.log("location.hash", this.location.hash);
            // if (location.hash) {
            // } else {
            //     //nuhfin'
            // }
            var self = this;
            addEventListener("hashchange", function () {
                console.log("hash has changed...");
                //self.imageId = null;
                self.imageId = location.hash.slice(1);
                console.log(self.imageId);
            });

            // element selection for scroll stuff
            var main = document.querySelector("#main");

            // db query here for images
            console.log("mounted function is runnnnning");
            //properties of DATA get added to this
            console.log("this: ", this);
            var self = this;
            axios
                .get("/images")
                .then(function (res) {
                    console.log("resonse from /images", res.data);
                    // THIS in here this will be the window object (useless for us)
                    // use self in here instead of this!
                    console.log("THIS inside axios, aka self", self);
                    self.images = res.data;
                    console.log(
                        "!!! res.data[res.data.length - 1]",
                        res.data[res.data.length - 1].id
                    );
                    self.lastLoadedId = res.data[res.data.length - 1].id;
                    console.log("####", self.lastLoadedId);
                })
                .catch(function (err) {
                    console.log("err in /images", err);
                });

            console.log("should start checkScrollPosition now");
            this.checkScrollPosition();
        }, // mounted ends

        // functions have to be written here in methods to be available for VUE
        methods: {
            // can NOT use ES 6 features with VUE
            // checkScrollPosition: function (e) {
            //     var self = this;
            //     setInterval(function () {
            //         console.log("check scroll position");
            //         main.addEventListener("scroll", function () {
            //             if (
            //                 main.scrollTop + main.clientHeight >=
            //                 main.scrollHeight
            //             ) {
            //                 console.log("you are scrolling, are you not?");
            //                 //loadMore();
            //             }
            //         });
            //         // document.documentElement.offsetHeight
            //         // console.log("window height: ", window.screen.height);
            //         // console.log(
            //         //     "document height: ",
            //         //     $document.documentElement.offsetHeight
            //         // );
            //         // console.log(
            //         //     "document scroll top: ",
            //         //     $(document).scrollTop()
            //         // );
            //         // if (
            //         //     $(window).height() + $(document).scrollTop() ===
            //         //     $(document).height()
            //         // ) {
            //         //     // adjust this if block, so that it checks if the user is NEAR the bottom
            //         //     // maybe check to see if the user is 200px away from the bottom? (you can choose any number, doesn't have to be 200px!)
            //         //     console.log("at the bottom!!!");
            //         //     // make the second ajax request, get the results, append to DOM, all that good stuff :)
            //         // } else {
            //         //     self.checkScrollPosition();
            //         // }
            //     }, 1000);
            // },
            loadMore: function (e) {
                // e.preventDefaults();
                console.log("loadMore running...");
                console.log(e);
                var self = this;
                var lastLoadedIdObj = {
                    id: this.lastLoadedId,
                };
                axios("/more-images", lastLoadedIdObj)
                    .then((res) => {
                        console.log(
                            " res.data[res.data.length - 1].id",
                            res.data[res.data.length - 1].id
                        );
                        console.log(
                            "res.data[res.data.length - 1].lowerstId: ",
                            res.data[res.data.length - 1].lowestId
                        );
                        if (
                            res.data[res.data.length - 1].id ==
                            res.data[res.data.length - 1].lowestId
                        ) {
                            console.log(
                                "letztes geladenes element ist das letzte element in der db!",
                                "get rid of button now!"
                            );
                            self.moreButton = null;
                        }
                        console.log("database request result", res);
                        // last element of res lastId == lastImageTotal ?? no more BUTTON!
                        // ansonsten: push neue images auf images.array
                        for (var i = 0; i < res.data.length; i++) {
                            console.log(res.data[i]);
                            self.images.push(res.data[i]);
                        }
                    })
                    .catch((err) =>
                        console.log("could not get moreImages from db", err)
                    );
            },
            nullImageId: function () {
                console.log("nullImageId running");
                console.log("u_id", this.imageId);
                location.hash = "";
                //this.imageId = null;
                // empty the url here and now!
                console.log("u_id after", this.imageId);
            },
            handleClick: function (e) {
                e.preventDefault();
                //console.log(this);
                var formData = new FormData(); // constructor where from?
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                // empty fields:
                this.title = "";
                this.description = "";
                this.username = "";
                this.file = "";

                var self = this;
                axios
                    .post("/upload", formData)
                    .then(function (res) {
                        console.log("resp from /POST upload", res);
                        console.log("are we getting here?");
                        console.log(res.data);
                        self.images.unshift(res.data);
                    })
                    .catch(function (err) {
                        console.log("err in post/upload", err);
                    });
            },
            handleChange: function (e) {
                console.log / "handleChange is running!!";
                console.log("file:", e.target.files[0]);
                this.file = e.target.files[0];
            },
            openModal: function (id) {
                console.log("open Modal running");
                console.log(id);
                this.imageId = id;
            },
        }, // methods ends here
    });
})();

// mounted method

// parent -> child : using props

// child -> partent : using emit

// if checking for smth want to pass smth to function that will give you the id...
// in the vue instance want to know which id clicked on

// in mounted fn of component 2 axios req. id (from parent) request for image stuff - with same id get comments

// req.body middleware needed - same route - insert of infromation into comments table - RETURNING on db

// render and hide the more button

// sub querry business - find lowest id - don't hardcode

// run subquery with first load - know how much I can still more - logic
// from more button awnser: is lowest id part of payload from last querry? yes? - hiiiide the button

// location.hash im browser hat hash info aus addresszeile
// aka url.com/#abschnitt

// v-bind: or : is to connect smth to the variables
