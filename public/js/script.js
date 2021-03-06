console.log("you are sane...");

(function () {
    var filter = function (created_at) {
        console.log("created_at", created_at);
        var year = created_at.slice(2, 4);
        console.log("year", year);
        var month = created_at.slice(5, 7);
        console.log("month", month);
        var day = created_at.slice(8, 10);
        console.log("day", day);
        var time = created_at.slice(11, 16);
        console.log("time", time);
        var date = day + "." + month + "." + year + " " + time;
        console.log("date", date);
        return date;
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

    //Vue.filter("truncate", filter);

    //new fancy component
    Vue.component("modal", {
        template: "#modal-box",
        props: ["imageId"], // this will become a custom attribute! (vue-html-code)
        watch: {
            imageId: function () {
                console.log("the prop changed!!!", this.imageId);
                // if we get nothing backfro mserver we should close the modal
                // e.g. this.id of 300000

                //update variables in data!!
                this.loadPictureData(this.imageId);
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
            console.log("# # # component.('modal').mounted running");
            var self = this;

            addEventListener("hashchange", function () {
                console.log(
                    "@ @ @ evt. hashchange in modal.mounted - change detected"
                );
                console.log("new hash", location.hash.slice(1));

                // self.imageId = location.hash.slice(1);
                // self.closeModal(location.hash.slice(1));
                //self.closeModal();
                //self.id = location.hash.slice(1);

                // das hier geht wenn man in der url tippt!
                // self.imageId = null;
                // self.closeModal(location.hash.slice(1));

                //self.nullImageId();
                self.imageId = location.hash.slice(1);

                //self.imageId = location.hash.slice(1);
                //self.loadPictureData(location.hash.slice(1));
                // console.log("self.imageId in hashchange-mounted", self.imageId);
                // removed from html @click="openModal(each.id)"
            });
            // this.loadPictureData(this.imageId);
            console.log("props [imageId]", this.imageId);
            var requestUrl = "/image/" + this.imageId;
            axios
                .get(requestUrl)
                .then(function (res) {
                    console.log(
                        "modal.mounted -  axios for single image done!"
                    );
                    console.log("RES ", res);
                    console.log(
                        "ÄÄÄÄÄ result from db for single image res.data[0].nextId",
                        res.data[0].nextId
                    );
                    self.id = res.data[0].id;
                    self.username = res.data[0].username;
                    self.title = res.data[0].title;
                    self.description = res.data[0].description;
                    self.url = res.data[0].url;
                    self.comments = res.data[1];
                    self.nextId = res.data[0].nextId;
                    self.prevId = res.data[0].prevId;
                    console.log("this.nextId", self.nextId);
                    console.log("this.prevId", self.prevId);
                    console.log("res.data[1]: ", res.data[1]);
                    console.log("self.comments: ", self.comments);

                    console.log("res.data", res.data);
                    console.log("res.data.id", res.data.id);
                    //self.Imageid = self.id;
                })
                .catch(function (err) {
                    console.log(err);
                    console.log("axios für single image failed");
                    self.closeModal();
                });
        },
        methods: {
            // modular approach - testing
            loadPictureData: function (imageId) {
                console.log("mehtod loadPictureData");
                var requestUrl = "/image/" + imageId;
                axios
                    .get(requestUrl)
                    .then(function (res) {
                        console.log("1 axios for single image done!");
                        console.log("RES ", res);
                        console.log(
                            "ÄÄÄÄÄ result from db res.data[0].nextId",
                            res.data[0].nextId
                        );
                        self.username = res.data[0].username;
                        self.title = res.data[0].nextId; //res.data[0].title;
                        self.description = res.data[0].description;
                        self.url = res.data[0].url;
                        self.comments = res.data[1];
                        self.nextId = res.data[0].nextId;
                        self.prevId = res.data[0].prevId;
                        console.log("this.nextId", self.nextId);
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
            closeModal: function (hash) {
                console.log("closeMOdal running");
                // change the parent data
                console.log("about to emit an event from the component");
                // emit something to the parent (send info)
                this.$emit("close");
                console.log("self.imageId: ", self.imageId);
                console.log("self.id: ", self.id);
                // if (hash == self.imageId) {
                //     //self.imageId = hash;
                //     location.hash = "";
                // }
            },
            nextId: function () {
                console.log();
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
            admin: null,
            confirmDelete: null,
            current: null,
            // default: true;
        }, // data ends

        // this runs when our VUE instance renders - cycles
        mounted: function () {
            // check for hash# in url
            //console.log("location.hash", this.location.hash);
            // if (location.hash) {
            // } else {
            //     //nuhfin'
            // }

            console.log(
                "# # # component('main').mounted function is runnnnning" // possibly wrong way to address main comp
            );
            var self = this;
            // check hash for number
            if (this.imageId == "admin") {
                console.log("admin granted");
                self.admin = true;
            }
            addEventListener("hashchange", function () {
                console.log("@ @ @ main.-hashchange");
                if (location.hash.slice(1) == "admin") {
                    console.log("admin logged in...");
                    self.admin = true;
                } else {
                    console.log("nullImage no delete");
                    // no admin detected
                    //self.imageId = null;
                    //self.nullImageId();
                    //var parkedHash = location.hash.slice(1);
                    self.imageId = location.hash.slice(1);
                    //self.closeModal();
                    //location.hash = "";
                    //location.hash = parkedHash;
                    console.log("self.imageId (evthandlr hash)", self.imageId);
                }
                console.log("@@@ end");
            });

            // element selection for scroll stuff
            //var main = document.querySelector("#main");

            // db query here for images
            //properties of DATA get added to this
            console.log("this: ", this);
            var self = this;
            axios
                .get("/images")
                .then(function (res) {
                    console.log("resonse from /images", res.data);
                    // THIS in here this will be the window object
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
        }, // #main.mounted ends

        // functions have to be written here in methods to be available for VUE
        methods: {
            // can NOT use ES 6 features with VUE

            toggleConfirmDelete: function (current) {
                console.log("fn main.toggleConfirmDelete running");
                console.log("current", this.current, current);
                // this.current = this.each;
                this.style;
                self.confirmDelete = !self.confirmDelete;
                console.log(self.confirmDelete);
                if (current) {
                    this.deleteImage(current);
                    self.confirmDelete = !self.confirmDelete;
                } else {
                    //this.current = null;
                }
            },
            deleteImage: function (current) {
                console.log("fn main.delete image - current", this.current);
                console.log("this.images", this.images);
                //var index = this.images.indexOf({ id: current });

                // var index = this.images.findIndex(function (image) {
                //     return image.id == current;
                // });
                // for (var i = 0; i < this.images.length; i++) {
                //     if (this.images[i].id == this.current) {
                //         console.log("index found");
                //         var index = i;
                //     }
                // }
                var self = this;

                console.log("axios starting");
                axios
                    .post("/delete", current)
                    .then((result) => {
                        console.log("delte successful - about to remove elme");
                        console.log("result", result);
                        console.log("res");
                        console.log("self.images before filter", self.images);
                        console.log("current", current);

                        var parkedImages = self.images;
                        self.images = parkedImages.filter(function (image) {
                            console.log("current.id", current.id);
                            console.log("images.id: ", image.id);
                            return current.id != image.id;
                        });
                        console.log("self.images after filter", self.images);
                        //self.images = updatedImages;
                    })
                    .catch((err) => {
                        console.log("error in delete route", err);
                    });
            },
            loadMore: function (e) {
                // e.preventDefaults();
                console.log("fn main.loadMore running...");
                console.log(e);
                var self = this;
                var lastLoadedIdObj = {
                    id: this.lastLoadedId,
                };
                console.log("lastLoadedIdObj", lastLoadedIdObj);
                axios
                    .get("/more-images", lastLoadedIdObj)
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
                        console.log("db request for moreImages failed", err)
                    );
            },
            nullImageId: function () {
                console.log("fn main.nullImageId running");
                console.log("ImageId", this.imageId);
                console.log(".hash", location.hash);
                this.imageId = null;
                location.hash = "";
                // empty the url here and now!
                console.log(".hash after", location.hash);
                console.log("ImageId ", this.imageId);
                console.log(".hash after", location.hash);
                //this.imageId = location.hash.slice(1);
            },
            nullHash: function () {
                console.log("fn main.nullImageId running");
                console.log("u_id", this.imageId);
                location.hash = "";
                // empty the url here and now!
                console.log("u_id after", this.imageId);
            },
            handleClick: function (e) {
                console.log("fn main.handleClick running");
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
                console.log("fn main.handleChange is running!!");
                console.log("file:", e.target.files[0]);
                this.file = e.target.files[0];
            },
            openModal: function (id) {
                console.log("fn main.open Modal running");
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

// call function from another component: #
// component('component1').c1method_name()
