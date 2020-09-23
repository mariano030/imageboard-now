console.log("you are sane...");

(function () {
    //all this only runs for the component
    Vue.component("my-component", {
        template: "#luca",
        props: ["sayGreeting"], // this will become a custom attribute! (vue-html-code)
        // data for components expects a function that retruns an object (not obj directly)
        data: function () {
            return {
                name: "Layla",
            };
        },
        mounted: function () {
            console.log("props ", this.sayGreeting);
        },
        methods: {
            changeName: function () {
                this.name = "Masala";
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

    //new fancy component
    Vue.component("modal", {
        template: "#modal-box",
        props: ["imageId"], // this will become a custom attribute! (vue-html-code)
        // data for components expects a function that retruns an object (not obj directly)
        data: function () {
            return {
                title: "",
                description: "",
                url: "",
                username: "",
                id: "",
            };
        },
        mounted: function (image_id) {
            console.log("props ", this.imageId);
            var self = this;
            var requestUrl = "/image/" + this.imageId;
            axios
                .get(requestUrl)
                .then(function (res) {
                    console.log("axios for single image done!");
                    self.username = res.data.username;
                    self.title = res.data.title;
                    self.description = res.data.description;
                    self.url = res.data.url;

                    console.log("res.data", res.data);
                    console.log("res.data.id", res.data.id);
                })
                .catch(function (err) {
                    console.log(err);
                    console.log("axios für single image failed");
                });
        },
        methods: {
            changeName: function () {
                this.name = "Masala";
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
            imageId: "",
            comments: [],
        }, // data ends

        // this runs when our VUE instance renders - cycles
        mounted: function () {
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
                    console.log("####", res.data);
                })
                .catch(function (err) {
                    console.log("err in /images", err);
                });
        }, // mounted ends

        // functions have to be written here in methods to be available for VUE
        methods: {
            // can not use ES 6 features with VUE
            nullImageId: function () {
                console.log("nullImageId running");
                console.log("u_id", this.imageId);
                this.imageId = null;
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
            // here this is still this UNLESS you have an axios in there then it's windows obj again
            myFunction: function (arg) {
                console.log("myFunction is running!!!", arg);
            },
            closeMe: function () {
                console.log("close me in the parent");
                //zzz imageId = null;
            },
            openModal: function (id) {
                console.log("open Modal running");
                console.log(id);
                this.imageId = id;
            },
        }, // mehtods ends here
    });
})();

// mounted method

// parent -> child : using props

// child -> partent : using emit

// if checking for smth want to pass smth to function that will give you the id...
// in the vue instance want to know which id clicked on

// in mounted fn of component 2 axios req. id (from parent) request for image stuff - with same id get comments

// req.body middleware needed - same route - insert of infromation into comments table - RETURNING on db
